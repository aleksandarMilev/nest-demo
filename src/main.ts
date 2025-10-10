import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ProblemDetails } from './common/classes/classes';
import { GLOBAL_PREFIX, LOG_LEVELS } from './common/constants/constants';

void (async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    .useLogger(LOG_LEVELS);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Demo API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [ProblemDetails],
    deepScanRoutes: true,
  });

  SwaggerModule.setup('docs', app, swaggerDocument, { useGlobalPrefix: true });

  const port = config.getOrThrow<string>('PORT');
  await app.listen(port, () => {
    logger.log(`Nest service is listening on port ${port}...`);
  });
})();
