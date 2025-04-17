import { Injectable, PipeTransform } from '@nestjs/common';

import { TaskService } from '../services/task.service';

@Injectable()
export class ParseTaskPipe implements PipeTransform {
  constructor(private readonly taskService: TaskService) {}

  transform(value: number) {
    return this.taskService.getTask(value);
  }
}
