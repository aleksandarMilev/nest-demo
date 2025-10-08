import request from 'supertest';
import { Express } from 'express';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';

describe('Healthcheck integration tests', () => {
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
    const response = await request((await app.getHttpServer()) as Express)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
  });
});
