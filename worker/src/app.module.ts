import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './validation/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
      validationSchema,
    }),
  ],
})
export class AppModule {}
