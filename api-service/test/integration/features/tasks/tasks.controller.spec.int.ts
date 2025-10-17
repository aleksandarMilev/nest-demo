import { randomUUID } from 'node:crypto';

import type { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Express } from 'express';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';

import { AppModule } from '../../../../src/app.module.js';
import type { PostResponse } from '../../../../src/common/interfaces/postResponse.interface.js';
import type { GetTaskDto } from '../../../../src/features/tasks/dtos/getTask.dto.js';

describe('Tasks Controller Integration', () => {
  let app: INestApplication;
  let server: Express;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Express;
  });

  afterEach(async () => {
    await app.close();
  });

  const createJwt = (roles: string[]) => {
    const payload = {
      id: 'test-user-id',
      roles,
    };

    return jwt.sign(payload, process.env.JWT_SECRET ?? 'secret', {
      expiresIn: '1h',
    });
  };

  const userToken = createJwt(['user']);
  const adminToken = createJwt(['admin']);

  const postDummyTask = async (server: Express) => {
    return await request(server)
      .post('/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Title', description: 'Description' })
      .expect(HttpStatus.CREATED);
  };

  describe('all', () => {
    it('should return 200 with empty array when no tasks yet', async () => {
      const response = await request(server)
        .get('/tasks')
        .expect(HttpStatus.OK);

      const tasks = response.body as GetTaskDto[];
      expect(tasks).toEqual([]);
    });

    it('should return 200 with all tasks', async () => {
      for (let i = 0; i < 3; i++) {
        await postDummyTask(server);
      }

      const response = await request(server)
        .get('/tasks')
        .expect(HttpStatus.OK);

      const tasks = response.body as GetTaskDto[];
      expect(tasks).toHaveLength(3);
      expect(tasks[0].title).toBe('Title');
      expect(tasks[0].description).toBe('Description');
    });
  });

  describe('byId', () => {
    it('should return 200 with the correct task', async () => {
      const postResponse = await postDummyTask(server);
      const createdTaskId = (postResponse.body as PostResponse<GetTaskDto>).data
        .id;

      const getResponse = await request(server)
        .get(`/tasks/${createdTaskId}`)
        .expect(HttpStatus.OK);

      const task = getResponse.body as GetTaskDto;
      expect(task.id).toBe(createdTaskId);
      expect(task.title).toBe('Title');
      expect(task.description).toBe('Description');
    });

    it('should return 404 when task is not found and Id passed is UUID', async () => {
      await postDummyTask(server);

      await request(server)
        .get(`/tasks/${randomUUID()}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 400 when task is not found and Id passed is not an UUID', async () => {
      await postDummyTask(server);

      await request(server).get('/tasks/foo').expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('create', () => {
    it('should return 201 and a Location header', async () => {
      const response = await postDummyTask(server);

      expect(response.headers.location).toContain('task');
    });

    it('should return 201 and the the task created', async () => {
      const response = await postDummyTask(server);

      const task = (response.body as PostResponse<GetTaskDto>).data;
      expect(task.title).toBe('Title');
      expect(task.description).toBe('Description');
    });

    it('should return 401 when no auth header', async () => {
      await request(server)
        .post('/tasks')
        .send({ title: 'Title', description: 'Description' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 when invalid jwt as auth header', async () => {
      await request(server)
        .post('/tasks')
        .set('Authorization', 'Bearer foo')
        .send({ title: 'Title', description: 'Description' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('update', () => {
    it('should return 204', async () => {
      const postResponse = await postDummyTask(server);

      const createdTaskId = (postResponse.body as PostResponse<GetTaskDto>).data
        .id;

      await request(server)
        .put(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'updated t', description: 'updated d' })
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 404 when task is not found and Id passed is UUID', async () => {
      await postDummyTask(server);

      await request(server)
        .put(`/tasks/${randomUUID()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'updated t', description: 'updated d' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 400 when task is not found and Id passed is not an UUID', async () => {
      await postDummyTask(server);

      await request(server)
        .put('/tasks/foo')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'updated t', description: 'updated d' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 401 with no auth header in the request', async () => {
      await postDummyTask(server);

      await request(server)
        .put('/tasks/foo')
        .send({ title: 'updated t', description: 'updated d' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 with invalid jwt as auth header in the request', async () => {
      await postDummyTask(server);

      await request(server)
        .put('/tasks/foo')
        .set('Authorization', 'Bearer foo')
        .send({ title: 'updated t', description: 'updated d' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 403 with auth header without admin rights', async () => {
      await postDummyTask(server);

      await request(server)
        .put('/tasks/foo')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'updated t', description: 'updated d' })
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('delete', () => {
    it('should return 204', async () => {
      const postResponse = await postDummyTask(server);

      const createdTaskId = (postResponse.body as PostResponse<GetTaskDto>).data
        .id;

      await request(server)
        .delete(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 404 when task is not found and Id passed is UUID', async () => {
      await postDummyTask(server);

      await request(server)
        .delete(`/tasks/${randomUUID()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 400 when task is not found and Id passed is not an UUID', async () => {
      await postDummyTask(server);

      await request(server)
        .delete('/tasks/foo')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 401 with no auth header in the request', async () => {
      const postResponse = await postDummyTask(server);

      const createdTaskId = (postResponse.body as PostResponse<GetTaskDto>).data
        .id;

      await request(server)
        .delete(`/tasks/${createdTaskId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 with invalid jwt as auth header in the request', async () => {
      const postResponse = await postDummyTask(server);

      const createdTaskId = (postResponse.body as PostResponse<GetTaskDto>).data
        .id;

      await request(server)
        .delete(`/tasks/${createdTaskId}`)
        .set('Authorization', 'Bearer foo')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 403 with auth header without admin rights', async () => {
      const postResponse = await postDummyTask(server);

      const createdTaskId = (postResponse.body as PostResponse<GetTaskDto>).data
        .id;

      await request(server)
        .delete(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
