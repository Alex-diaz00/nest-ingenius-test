import {
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  IsArray,
  IsInt,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class TaskUpdateDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly name?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  readonly status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  readonly priority?: TaskPriority;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  readonly assigneeIds?: number[];
}
