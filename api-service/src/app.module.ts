import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AuthGuard } from './common/guards/auth/auth.guard.js';
import { RolesGuard } from './common/guards/roles/roles.guard.js';
import { LocationHeaderInterceptor } from './common/interceptors/locationHeader.interceptor.js';
import { LoggingMiddleware } from './common/middlewares/logging.middleware.js';
import { TasksModule } from './features/tasks/tasks.module.js';
import { HealthModule } from './health/health.module.js';
import { KafkaModule } from './infrastructure/kafka/kafka.module.js';
import validationSchema from './validation/schema.js';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LocationHeaderInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
      validationSchema,
    }),
    TasksModule,
    HealthModule,
    KafkaModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
