import type { INestApplication } from '@nestjs/common';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Module,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Express } from 'express';
import request from 'supertest';

import { ProblemDetails } from '../../../../src/common/classes/problemDetails.class';
import { ProblemDetailsFilter } from '../../../../src/common/filters/problemDetails.filter';

@Controller('errors')
class ErrorController {
  @Get('http')
  throwHttp() {
    throw new HttpException('Bad Request Error', HttpStatus.BAD_REQUEST);
  }

  @Get('generic')
  throwGeneric() {
    throw new Error('Unexpected failure');
  }

  @Get('object')
  throwObject() {
    throw new HttpException(
      {
        message: ['Field A is required', 'Field B invalid'],
        error: 'ValidationError',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

@Module({
  controllers: [ErrorController],
})
class TestModule {}

describe('ProblemDetailsFilter (integration)', () => {
  let app: INestApplication;
  let server: Express;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ProblemDetailsFilter());

    await app.init();

    server = app.getHttpServer() as Express;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return ProblemDetails for HttpException', async () => {
    const response = await request(server).get('/errors/http').expect(400);

    expect(response.body).toMatchObject({
      status: 400,
      message: 'Bad Request Error',
      error: 'BAD_REQUEST',
      path: '/errors/http',
    });

    expect(typeof (response.body as ProblemDetails).timestamp).toBe('string');
  });

  it('should return ProblemDetails for generic Error', async () => {
    const response = await request(server)
      .get('/errors/generic')
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(response.body).toMatchObject({
      status: 500,
      message: 'Unexpected failure',
      error: 'Internal Server Error',
      path: '/errors/generic',
    });
  });

  it('should handle object response with array message', async () => {
    const response = await request(server)
      .get('/errors/object')
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      status: 400,
      message: 'Field A is required; Field B invalid',
      error: 'ValidationError',
      path: '/errors/object',
    });
  });
});
