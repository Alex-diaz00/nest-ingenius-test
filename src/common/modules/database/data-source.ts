import { DataSource, type DataSourceOptions } from 'typeorm';
import { type SeederOptions } from 'typeorm-extension';
import { taskFactory } from '../../../modules/task/factories/task.factory';
import { TaskSeeder } from '../../../modules/task/seeders/task.seeder';
import { profileFactory } from '../../../modules/user/factories/profile.factory';
import { userFactory } from '../../../modules/user/factories/user.factory';
import { ProfileSeeder } from '../../../modules/user/seeders/profile.seeder';
import { UserSeeder } from '../../../modules/user/seeders/user.seeder';
import * as path from 'path';
import { ProjectSeeder } from 'src/modules/project/seeders/project.seeder';
import { projectFactory } from 'src/modules/project/factories/project.factory';


export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [path.resolve(__dirname, '../../../modules/**/entities/*.ts')],
  migrations: [path.resolve(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
  extra: {
    ssl:
      process.env.SSL_MODE === 'require'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
  factories: [userFactory, profileFactory, projectFactory,taskFactory],
  seeds: [UserSeeder, ProfileSeeder, ProjectSeeder, TaskSeeder],
};

export const appDataSource = new DataSource(dataSourceOptions);
