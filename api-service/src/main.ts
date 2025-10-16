import { LOG_LEVELS, Logger, ValidationPipe } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.ts';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { GLOBAL_PREFIX } from './common/constants/constants.js';
import { ProblemDetailsFilter } from './common/filters/problemDetails.filter.js';

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
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    .useGlobalFilters(new ProblemDetailsFilter());

  app.useLogger(LOG_LEVELS);

  const allowed = new Set(['http://localhost:5173', 'http://127.0.0.1:5173']);
  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || allowed.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  };

  app.enableCors(corsOptions);

  //   const swaggerConfig = new DocumentBuilder()
  //     .setTitle('Nest Demo API')
  //     .setDescription('API documentation')
  //     .setVersion('1.0')
  //     .build();

  //   const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
  //     extraModels: [ProblemDetails],
  //     deepScanRoutes: true,
  //   });

  //   SwaggerModule.setup('docs', app, swaggerDocument, {
  //     useGlobalPrefix: true,
  //   });

  const port = config.getOrThrow<string>('PORT');
  await app.listen(port, '0.0.0.0', () => {
    logger.log(`Nest service is listening on port ${port}...`);
  });
})();
