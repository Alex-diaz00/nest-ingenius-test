import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectController } from './controllers/project.controller';
import { Project } from './entities/project.entity';
import { ProjectService } from './services/project.service';
import { Task } from '../task/entities/task.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, User])],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
