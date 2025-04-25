import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JWTAuthGuard } from '../../../common/modules/auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../../common/modules/auth/guards/session-auth.guard';
import { AuthUser } from '../../user/decorators/user.decorator';
import { User } from '../../user/entities/user.entity';
import { ProjectCreate } from '../dtos/project-create.dto';
import { ProjectUpdate } from '../dtos/project-update.dto';
import { Project } from '../entities/project.entity';
import { ProjectFilter } from '../filters/project.filter';
import { IsOwnerInterceptor } from '../interceptors/is-owner.interceptor';
import { PaginationInterceptor } from '../../../common/pagination/interceptors/pagination.interceptor';
import { ParseProjectPipe } from '../pipes/parse-project.pipe';
import { ProjectService } from '../services/project.service';
import { PaginationQuery } from 'src/common/pagination/dtos/pagination-query.dto';
import { UpdateProjectMembersDto } from '../dtos/update-project-members.dto';
import { IsProjectOwnerGuard } from '../guards/is-owner.guard';
import { Task } from 'src/modules/task/entities/task.entity';

@Controller('project')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@UseFilters(ProjectFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Post()
  createProject(
    @Body() newProject: ProjectCreate,
    @AuthUser() user: User,
  ): Promise<Project> {
    newProject.owner = user;
    return this.service.createProject(newProject);
  }

  @Get('member')
  @UseInterceptors(PaginationInterceptor)
  listProjectsWhereUserIsMember(
    @Query() pagination: PaginationQuery,
    @AuthUser() user: User,
  ): Promise<[Project[], number]> {
    return this.service.listProjectsWhereMember(pagination, user);
  }

  @Get('owner')
  @UseInterceptors(PaginationInterceptor)
  listProjectsWhereUserIsOwner(
    @Query() pagination: PaginationQuery,
    @AuthUser() user: User,
  ): Promise<[Project[], number]> {
    return this.service.listProjectsWhereOwner(pagination, user);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  listProject(
    @Query() pagination: PaginationQuery,
  ): Promise<[Project[], number]> {
    return this.service.listProject(pagination);
  }

  @Get(':id')
  getProject(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.service.getProject(id);
  }

  @Get(':projectId/tasks')
  @UseInterceptors(PaginationInterceptor)
  getProjectTasks(
    @Param('projectId', ParseIntPipe, ParseProjectPipe) project: Project,
    @Query() pagination: PaginationQuery,
  ): Promise<[Task[], number]> {
    return this.service.getProjectTasks(project, pagination);
  }

  @Put(':id')
  @UseGuards(IsProjectOwnerGuard)
  updateProject(
    @Param('id', ParseIntPipe, ParseProjectPipe) project: Project,
    @Body() updates: ProjectUpdate,
  ): Promise<Project> {
    return this.service.updateProject(project, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(IsProjectOwnerGuard)
  removeProject(
    @Param('id', ParseIntPipe, ParseProjectPipe) project: Project,
  ): Promise<Project> {
    return this.service.removeProject(project);
  }

  @Patch(':id/members')
  @UseGuards(IsProjectOwnerGuard)
  async updateProjectMembers(
    @Param('id', ParseIntPipe, ParseProjectPipe) project: Project,
    @Body() dto: UpdateProjectMembersDto,
  ): Promise<Project> {
    return this.service.updateMembers(project, dto);
  }
}
