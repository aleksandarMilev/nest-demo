import { randomUUID } from 'node:crypto';

import type { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Express } from 'express';
import request from 'supertest';

import { AppModule } from '../../../../src/app.module';
import type { GetTaskDto } from '../../../../src/features/tasks/dtos/getTask.dto';

describe('TaskController', () => {
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

  const postDummyTask = async (server: Express) => {
    return await request(server)
      .post('/tasks')
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
      const createdTaskId = (postResponse.body as GetTaskDto).id;
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

      const task = response.body as GetTaskDto;
      expect(task.title).toBe('Title');
      expect(task.description).toBe('Description');
    });
  });

  describe('update', () => {
    it('should return 204', async () => {
      const postResponse = await postDummyTask(server);

      const createdTaskId = (postResponse.body as GetTaskDto).id;
      await request(server)
        .put(`/tasks/${createdTaskId}`)
        .send({ title: 'updated t', description: 'updated d' })
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 404 when task is not found and Id passed is UUID', async () => {
      await postDummyTask(server);

      await request(server)
        .put(`/tasks/${randomUUID()}`)
        .send({ title: 'updated t', description: 'updated d' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 400 when task is not found and Id passed is not an UUID', async () => {
      await postDummyTask(server);

      await request(server)
        .put('/tasks/foo')
        .send({ title: 'updated t', description: 'updated d' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('delete', () => {
    it('should return 204', async () => {
      const postResponse = await postDummyTask(server);

      const createdTaskId = (postResponse.body as GetTaskDto).id;
      await request(server)
        .delete(`/tasks/${createdTaskId}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 404 when task is not found and Id passed is UUID', async () => {
      await postDummyTask(server);

      await request(server)
        .delete(`/tasks/${randomUUID()}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 400 when task is not found and Id passed is not an UUID', async () => {
      await postDummyTask(server);

      await request(server).delete('/tasks/foo').expect(HttpStatus.BAD_REQUEST);
    });
  });
});
