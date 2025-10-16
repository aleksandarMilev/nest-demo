import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Response } from 'express';

import { RequestWithId } from '../types/requestWithId.js';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: RequestWithId, response: Response, next: NextFunction) {
    const requestId =
      request.headers['x-request-id']?.toString() ?? randomUUID();

    request.headers['x-request-id'] = requestId;

    const { method, originalUrl } = request;
    this.logger.log(`[${requestId}] ${method} ${originalUrl}`);

    response.setHeader('x-request-id', requestId);
    request.requestId = requestId;

    next();
  }
}
