import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

void (async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  app.useLogger(['error', 'warn', 'log', 'debug']);

  const port = config.getOrThrow<string>('PORT');
  await app.listen(port, () => {
    logger.log(`Nest Worker is listening on port ${port}...`);
  });
})();
