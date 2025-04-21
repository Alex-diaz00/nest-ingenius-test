import { setSeederFactory } from 'typeorm-extension';
import { fakerEN as faker } from '@faker-js/faker';
import { Task } from '../entities/task.entity';
import { TaskPriority } from '../enums/task-priority.enum';

export const taskFactory = setSeederFactory(Task, () => {
  const task = new Task();
  task.name = faker.lorem.sentence();
  task.priority = TaskPriority.LOW;

  return task;
});
