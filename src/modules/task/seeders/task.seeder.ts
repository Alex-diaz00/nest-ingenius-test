import { type DataSource } from 'typeorm';
import { Seeder, type SeederFactoryManager } from 'typeorm-extension';

import { Task } from '../entities/task.entity';
import { TaskPriority } from '../enums/task-priority.enum';
import { Project } from 'src/modules/project/entities/project.entity';

export class TaskSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const projectRepository = dataSource.getRepository(Project);
    const taskFactory = factoryManager.get(Task);
    const flutterProject = await projectRepository.findOneOrFail({ where: { name: 'Flutter Project' } });
    const nestjsProject = await projectRepository.findOneOrFail({ where: { name: 'Nestjs Project' } });

    await taskFactory.save({
      id: 1,
      name: 'Finish app',
      priority: TaskPriority.HIGH,
      project: flutterProject,
    });
    await taskFactory.save({
      id: 2,
      name: 'Finish backend',
      priority: TaskPriority.LOW,
      project: nestjsProject
    });
    await taskFactory.saveMany(3, { project: flutterProject });
    await taskFactory.saveMany(2, { project: nestjsProject });
  }
}
