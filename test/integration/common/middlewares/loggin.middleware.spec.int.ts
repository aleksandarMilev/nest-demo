import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Express } from 'express';
import request from 'supertest';

import { AppModule } from '../../../../src/app.module';

describe('Logging Middleware Integration', () => {
  let app: INestApplication;
  let server: Express;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Express;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add x-request-id header to response', async () => {
    const response = await request(server).get('/');
    expect(response.headers['x-request-id']).toBeDefined();
  });

  it('should preserve existing x-request-id from request', async () => {
    const response = await request(server)
      .get('/')
      .set('x-request-id', 'existing');

    expect(response.headers['x-request-id']).toBe('existing');
  });
});
