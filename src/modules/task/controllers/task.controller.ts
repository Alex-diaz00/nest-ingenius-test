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
import { TaskCreateDto } from '../dtos/task-create.dto';
import { TaskUpdateDto } from '../dtos/task-update.dto';
import { Task } from '../entities/task.entity';
import { TaskFilter } from '../filters/task.filter';
import { PaginationInterceptor } from '../../../common/pagination/interceptors/pagination.interceptor';
import { ParseTaskPipe } from '../pipes/parse-task.pipe';
import { TaskService } from '../services/task.service';
import { PaginationQuery } from 'src/common/pagination/dtos/pagination-query.dto';
import { IsTaskAssigneeGuard } from '../guards/is-task-assignee.guard';

@Controller('task')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@UseFilters(TaskFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
  createTask(@Body() dto: TaskCreateDto): Promise<Task> {
    return this.service.createTask(dto);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  listTask(@Query() pagination: PaginationQuery): Promise<[Task[], number]> {
    return this.service.listTask(pagination);
  }

  @Get(':id')
  getTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.service.getTask(id);
  }

  @Put(':id')
  @UseGuards(IsTaskAssigneeGuard)
  updateTask(
    @Param('id', ParseIntPipe, ParseTaskPipe) task: Task,
    @Body() updates: TaskUpdateDto,
  ): Promise<Task> {
    return this.service.updateTask(task, updates);
  }

  @Delete(':id')
  @UseGuards(IsTaskAssigneeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTask(
    @Param('id', ParseIntPipe, ParseTaskPipe) task: Task,
  ): Promise<Task> {
    return this.service.removeTask(task);
  }

  @Get('/user/:userId')
  @UseInterceptors(PaginationInterceptor)
  listTasksByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationQuery,
  ): Promise<[Task[], number]> {
    return this.service.listTasksByUser(userId, pagination);
  }
}
