import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Express } from 'express';
import request from 'supertest';

import { AppModule } from '../../../src/app.module';

describe('HealthCheck integration tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with status:ok on GET /health', async () => {
    const response = await request(app.getHttpServer() as Express)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
  });
});
