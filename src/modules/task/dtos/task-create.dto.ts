import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskCreateDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  readonly name: string;

  @IsEnum(TaskStatus)
  readonly status: TaskStatus = TaskStatus.PENDING;

  @IsEnum(TaskPriority)
  readonly priority: TaskPriority = TaskPriority.MEDIUM;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  readonly assigneeIds: number[];

  @IsInt()
  readonly projectId: number;
}
