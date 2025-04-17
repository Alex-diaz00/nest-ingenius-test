import { Test } from '@nestjs/testing';
import { createMock } from 'ts-auto-mock';

import { TaskService } from '../services/task.service';
import { ParseTaskPipe } from './parse-task.pipe';

describe('ParseTaskPipe', () => {
  let pipe: ParseTaskPipe;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TaskService,
          useValue: createMock<TaskService>(),
        },
        ParseTaskPipe,
      ],
    }).compile();

    pipe = module.get(ParseTaskPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
