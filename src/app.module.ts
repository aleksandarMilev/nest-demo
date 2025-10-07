import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './validation/schema';
import { HealthModule } from './health/health.module';
import { TasksModule } from './features/tasks/tasks.module';

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
