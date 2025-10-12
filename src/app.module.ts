import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LocationHeaderInterceptor } from './common/interceptors/locationHeader.interceptor';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';
import { TasksModule } from './features/tasks/tasks.module';
import { HealthModule } from './health/health.module';
import validationSchema from './validation/schema';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LocationHeaderInterceptor,
    },
  ],
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
