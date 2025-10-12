import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TasksModule } from './features/tasks/tasks.module';
import { HealthModule } from './health/health.module';
import validationSchema from './validation/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),
    TasksModule,
    HealthModule,
  ],
})
export class AppModule {}
