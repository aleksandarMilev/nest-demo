import { Logger } from '@nestjs/common';
import type { NextFunction, Response } from 'express';

import { LoggingMiddleware } from '../../../../src/common/middlewares/logging.middleware';
import type { RequestWithId } from '../../../../src/common/types/requestWithId';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'foo'),
}));

describe('Logging Middleware Unit', () => {
  let middleware: LoggingMiddleware;
  let request: Partial<RequestWithId>;
  let response: Partial<Response>;
  let next: jest.Mock;
  let loggerLogSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new LoggingMiddleware();

    request = {
      headers: {},
      method: 'GET',
      originalUrl: '/test',
    };

    response = {
      setHeader: jest.fn(),
    };

    next = jest.fn();

    loggerLogSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => 'logged');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a new request ID if none provided', () => {
    middleware.use(
      request as RequestWithId,
      response as Response,
      next as NextFunction,
    );

    expect(request.headers!['x-request-id']).toBe('foo');
    expect(response.setHeader).toHaveBeenCalledWith('x-request-id', 'foo');
    expect(request.requestId).toBe('foo');
    expect(loggerLogSpy).toHaveBeenCalledWith('[foo] GET /test');
    expect(next).toHaveBeenCalled();
  });

  it('should reuse existing x-request-id if provided', () => {
    request.headers!['x-request-id'] = 'existing';

    middleware.use(
      request as RequestWithId,
      response as Response,
      next as NextFunction,
    );

    expect(request.headers!['x-request-id']).toBe('existing');
    expect(response.setHeader).toHaveBeenCalledWith('x-request-id', 'existing');
    expect(request.requestId).toBe('existing');
  });
});
