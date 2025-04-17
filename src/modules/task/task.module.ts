import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskController } from './controllers/task.controller';
import { Task } from './entities/task.entity';
import { TaskService } from './services/task.service';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, User])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
