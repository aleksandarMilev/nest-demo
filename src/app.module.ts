import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AuthGuard } from './common/guards/auth/auth.guard';
import { RolesGuard } from './common/guards/roles/roles.guard';
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
