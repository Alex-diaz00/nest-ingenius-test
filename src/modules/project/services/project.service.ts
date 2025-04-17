import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { ProjectCreate } from '../dtos/project-create.dto';
import { ProjectUpdate } from '../dtos/project-update.dto';
import { Project } from '../entities/project.entity';
import { PaginationQuery } from 'src/common/pagination/dtos/pagination-query.dto';
import { Task } from 'src/modules/task/entities/task.entity';
import { UpdateProjectMembersDto } from '../dtos/update-project-members.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,
  ) {}

  async createProject(data: ProjectCreate): Promise<Project> {
    const { owner, members: memberIds, ...rest } = data;
  
    const members = await this.userRepo.findBy({ id: In(memberIds) });
  
    const project = this.repo.create({
      ...rest,
      owner,
      members,
    });
  
    return this.repo.save(project);
  }

  async listProject(
    pagination: PaginationQuery,
    owner: User,
  ): Promise<[Project[], number]> {
    return this.repo.findAndCount({
      where: { owner: { id: owner.id } },
      order: { createdAt: 'DESC' },
      skip: pagination.offset,
      take: pagination.limit,
      loadRelationIds: true,
    });
  }

  async getProject(id: number): Promise<Project> {
    return this.repo.findOneOrFail({
      where: { id },
      loadRelationIds: true,
    });
  }

  async updateProject(project: Project, updates: ProjectUpdate): Promise<Project> {
    this.repo.merge(project, updates);
    return this.repo.save(project);
  }

  async removeProject(project: Project): Promise<Project> {
    return this.repo.softRemove(project);
  }

  async updateMembers(project: Project, dto: UpdateProjectMembersDto): Promise<Project> {
    const { memberIds } = dto;
  
    const currentMembers = project.members.map(user => user.id);
    const membersToRemove = currentMembers.filter(id => !memberIds.includes(id));
  
    const newMembers = await this.userRepo.findBy({ id: In(memberIds) });
    project.members = newMembers;
    await this.repo.save(project);
  
    if (membersToRemove.length) {
      await this.taskRepo
        .createQueryBuilder()
        .update('task_assignees')
        .set({ userId: project.owner.id })
        .where('taskId IN (:...taskIds)', {
          taskIds: await this.getTasksByRemovedUsers(project.id, membersToRemove),
        })
        .andWhere('userId IN (:...removed)', { removed: membersToRemove })
        .execute();
    }
  
    return project;
  }
  
  private async getTasksByRemovedUsers(projectId: number, userIds: number[]): Promise<number[]> {
    const results = await this.taskRepo
      .createQueryBuilder('task')
      .innerJoin('task.assignees', 'assignee')
      .where('task.projectId = :projectId', { projectId })
      .andWhere('assignee.id IN (:...userIds)', { userIds })
      .select('task.id')
      .getMany();
  
    return results.map(t => t.id);
  }

  async listProjectsWhereMember(user: User): Promise<Project[]> {
    return this.repo
      .createQueryBuilder('project')
      .leftJoin('project.members', 'member')
      .where('member.id = :userId', { userId: user.id })
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .orderBy('project.createdAt', 'DESC')
      .getMany();
  }
  
  async listProjectsWhereOwner(user: User): Promise<Project[]> {
    return this.repo.find({
      where: { owner: { id: user.id } },
      relations: ['members', 'owner'],
      order: { createdAt: 'DESC' },
    });
  }
  
}
