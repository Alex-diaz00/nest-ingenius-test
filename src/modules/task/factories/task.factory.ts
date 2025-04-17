import { setSeederFactory } from 'typeorm-extension';

import { Task } from '../entities/task.entity';
import { TaskPriority } from '../enums/task-priority.enum';

export const taskFactory = setSeederFactory(Task, faker => {
  const task = new Task();
  task.name = faker.lorem.sentence();
  task.priority = TaskPriority.LOW;

  return task;
});
