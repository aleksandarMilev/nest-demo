import type { INestApplication } from '@nestjs/common';
import { Logger, ValidationPipe } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';

import { AppModule } from '../../app.module.js';
import { ProblemDetails } from '../classes/problemDetails.class.js';
import { GLOBAL_PREFIX, LOG_LEVELS } from '../constants/constants.js';
import { ProblemDetailsFilter } from '../filters/problemDetails.filter.js';

const useGlobalPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
};

const useGlobalFilters = (app: INestApplication) => {
  app.useGlobalFilters(new ProblemDetailsFilter());
};

const useCors = (app: INestApplication) => {
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
};

const useLogger = (app: INestApplication) => {
  app.useLogger(LOG_LEVELS);
};

const useSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Nest Demo API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ProblemDetails],
    deepScanRoutes: false,
  });

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
  });
};

export default async function createNestApplication() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(express()),
  );

  app.setGlobalPrefix(GLOBAL_PREFIX);

  const config = app.get(ConfigService);

  const builder = {
    withLogger: () => {
      useLogger(app);
      return builder;
    },
    withPipes: () => {
      useGlobalPipes(app);
      return builder;
    },
    withFilters: () => {
      useGlobalFilters(app);
      return builder;
    },
    withCors: () => {
      useCors(app);
      return builder;
    },
    withSwagger: () => {
      useSwagger(app);
      return builder;
    },
    run: async (logger: Logger = new Logger('Bootstrap')) => {
      const port = config.getOrThrow<string>('PORT');
      await app.listen(port, () =>
        logger.log(`Nest service is listening on port ${port}...`),
      );
    },
  };

  return builder;
}
