import { type DataSource } from 'typeorm';
import { Seeder, type SeederFactoryManager } from 'typeorm-extension';

import { Project } from '../entities/project.entity';
import { User } from '../../user/entities/user.entity';

export class ProjectSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const projectFactory = factoryManager.get(Project);
    const john = await userRepository.findOneOrFail({ where: { email: 'john@doe.me' } });
    const jane = await userRepository.findOneOrFail({ where: { email: 'jane@doe.me' } });

    await projectFactory.save({
      id: 1,
      name: 'Flutter Project',
      isArchived: false,
      owner: john,
    });
    await projectFactory.save({
      id: 2,
      name: 'Nestjs Project',
      isArchived: false,
      owner: jane,
    });
    await projectFactory.saveMany(2, { owner: john });
    await projectFactory.saveMany(1, { owner: jane });
  }
}
