import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ProblemDetails } from '../classes/problemDetails';

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const request = httpContext.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
        error = HttpStatus[status];
      } else if (response && typeof response === 'object') {
        const responseAsRecord = response as Record<string, any>;

        message = this.#normalizeMsg(responseAsRecord.message);
        error = String(responseAsRecord.error ?? HttpStatus[status]);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const problem: ProblemDetails = {
      status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(problem);
  }

  #normalizeMsg = (message: unknown): string => {
    if (Array.isArray(message)) {
      return message.join('; ');
    }

    if (message && typeof message === 'object') {
      try {
        return JSON.stringify(message);
      } catch {
        return 'Internal server error';
      }
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'Internal server error';
  };
}
