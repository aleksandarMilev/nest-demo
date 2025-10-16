import type { ArgumentsHost } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces/index.js';
import type { Request, Response } from 'express';

import { ProblemDetailsFilter } from '../../../../src/common/filters/problemDetails.filter.js';

describe('Problem Details Filter Unit', () => {
  let filter: ProblemDetailsFilter;
  let request: Partial<Request>;
  let response: Partial<Response>;
  let host: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new ProblemDetailsFilter();

    request = { url: '/test' };
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    host = {
      switchToHttp: () =>
        ({
          getResponse: () => response,
          getRequest: () => request,
        }) as unknown as HttpArgumentsHost,
    };
  });

  it('should handle generic Error', () => {
    const error = new Error('Foo');

    filter.catch(error, host as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 500,
        message: 'Foo',
        error: 'Internal Server Error',
        path: '/test',
      }),
    );
  });

  it('should handle HttpException with string response', () => {
    const exception = new HttpException(
      'Bad Request Exc',
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, host as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: 'Bad Request Exc',
        error: 'BAD_REQUEST',
        path: '/test',
      }),
    );
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException(
      { message: 'Validation failed', error: 'Bad Request' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, host as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: 'Validation failed',
        error: 'Bad Request',
        path: '/test',
      }),
    );
  });

  it('should handle HttpException with array message', () => {
    const exception = new HttpException(
      { message: ['Field A is required', 'Field B is invalid'] },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, host as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Field A is required; Field B is invalid',
        error: 'BAD_REQUEST',
      }),
    );
  });

  it('should handle unknown exception type', () => {
    const exception = 42;

    filter.catch(exception as any, host as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Internal server error',
        status: 500,
        error: 'Internal Server Error',
      }),
    );
  });
});
