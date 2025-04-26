import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Task } from '../entities/task.entity';
import { TaskCreateDto } from '../dtos/task-create.dto';
import { TaskUpdateDto } from '../dtos/task-update.dto';
import { PaginationQuery } from 'src/common/pagination/dtos/pagination-query.dto';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createTask(dto: TaskCreateDto): Promise<Task> {
    const project = await this.projectRepo.findOneByOrFail({ id: dto.projectId });

    const assignees = await this.userRepo.findBy({ id: In(dto.assigneeIds) });

    const task = this.repo.create({
      name: dto.name,
      status: dto.status,
      priority: dto.priority,
      assignees,
      project,
    });

    return this.repo.save(task);
  }

  async listTask(pagination: PaginationQuery): Promise<[Task[], number]> {
    return this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: pagination.offset,
      take: pagination.limit,
      relations: ['assignees', 'project'],
    });
  }

  async getTask(id: number): Promise<Task> {
    return this.repo.findOneOrFail({
      where: { id },
      relations: ['assignees', 'project'],
    });
  }

  async updateTask(task: Task, updates: TaskUpdateDto): Promise<Task> {
    if (updates.assigneeIds) {
      task.assignees = await this.userRepo.findBy({ id: In(updates.assigneeIds) });
    }

    this.repo.merge(task, updates);

    return this.repo.save(task);
  }

  async removeTask(task: Task): Promise<Task> {
    return this.repo.softRemove(task);
  }

  async listTasksByUser(
    userId: number,
    pagination: PaginationQuery,
  ): Promise<[Task[], number]> {
    return this.repo.findAndCount({
      where: {
        assignees: { id: userId },
      },
      relations: ['assignees', 'project'],
      skip: pagination.offset,
      take: pagination.limit,
      order: { createdAt: 'DESC' },
    });
  }
  
}
