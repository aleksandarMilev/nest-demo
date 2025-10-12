import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HasLocation } from '../interfaces/hasLocation.interface';

@Injectable()
export class LocationHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((body: HasLocation) => {
        if (
          body &&
          typeof body === 'object' &&
          typeof body.location === 'string'
        ) {
          response.setHeader('Location', body.location);

          const { location: _location, ...rest } = body;

          return rest;
        }

        return body;
      }),
    );
  }
}
