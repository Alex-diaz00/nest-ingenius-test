import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './common/modules/auth/auth.module';
import { dataSourceOptions } from './common/modules/database/data-source';
import { HealthController } from './health.controller';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    TerminusModule,
    UserModule,
    AuthModule,
    TaskModule,
    ProjectModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
