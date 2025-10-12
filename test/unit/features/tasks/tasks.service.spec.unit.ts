import { Logger, NotFoundException } from '@nestjs/common';

import { TasksService } from '../../../../src/features/tasks/tasks.service';

describe('Tasks Service', () => {
  let service: TasksService;
  let loggerLogSpy: jest.SpyInstance;
  let loggerWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new TasksService();
    loggerLogSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => 'logged');

    loggerWarnSpy = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => 'warn');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('all', () => {
    it('should return empty array when there is not any tasks yet', async () => {
      await expect(service.all()).resolves.toEqual([]);
    });

    it('should return the correct tasks', async () => {
      await service.create({ title: 't', description: 'd' });

      const tasks = await service.all();

      expect(tasks[0].id).toBeDefined();
      expect(tasks[0].title).toBe('t');
      expect(tasks[0].description).toBe('d');
    });
  });

  describe('byId', () => {
    it('should return the correct task', async () => {
      const dto = await service.create({ title: 't', description: 'd' });
      const task = await service.byId(dto.id);

      expect(task.id).toBe(dto.id);
      expect(task.title).toBe('t');
      expect(task.description).toBe('d');
    });

    it('should log and throw error when task not found', async () => {
      await service.create({ title: 't', description: 'd' });
      await expect(service.byId('foo')).rejects.toThrow(
        new NotFoundException('task with Id: foo not found!'),
      );

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'task with Id: foo not found!',
      );
    });
  });

  describe('create', () => {
    it('should create the correct task', async () => {
      const result = await service.create({ title: 't', description: 'd' });

      expect(result.id).toBeDefined();
      expect(result.title).toBe('t');
      expect(result.description).toBe('d');
    });

    it('should push the task at the array', async () => {
      const result = await service.create({ title: 't', description: 'd' });
      const all = await service.all();
      const task = all.find((t) => t.id === result.id);

      expect(task!.id).toBeDefined();
      expect(task!.title).toBe('t');
      expect(task!.description).toBe('d');
    });

    it('should log the correct message', async () => {
      const result = await service.create({
        title: 't',
        description: 'd',
      });

      expect(loggerLogSpy).toHaveBeenCalledWith(
        `task with Id: ${result.id} was created.`,
      );
    });
  });

  describe('update', () => {
    it('should update the correct task and log message', async () => {
      const toBeUpdated = await service.create({
        title: 't',
        description: 'd',
      });

      const toNotBeUpdated = await service.create({
        title: 'do not touch',
        description: 'do not touch',
      });

      await service.update(toBeUpdated.id, {
        title: 'upd t',
        description: 'upd d',
      });

      const updated = await service.byId(toBeUpdated.id);

      expect(updated.id).toBe(toBeUpdated.id);
      expect(updated.title).toBe('upd t');
      expect(updated.description).toBe('upd d');

      expect(toNotBeUpdated.id).toBe(toNotBeUpdated.id);
      expect(toNotBeUpdated.title).toBe(toNotBeUpdated.title);
      expect(toNotBeUpdated.description).toBe(toNotBeUpdated.description);

      expect(loggerLogSpy).toHaveBeenCalledWith(
        `task with Id: ${updated.id} was updated.`,
      );
    });

    it('should throw and log error when Id provided is invalid', async () => {
      await service.create({
        title: 't',
        description: 'd',
      });

      const errorMessage = 'task with Id: foo not found!';

      await expect(
        service.update('foo', {
          title: 'upd t',
          description: 'upd d',
        }),
      ).rejects.toThrow(new NotFoundException(errorMessage));

      expect(loggerWarnSpy).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('remove', () => {
    it('should delete the correct task and log message', async () => {
      const toBeDeleted = await service.create({
        title: 't',
        description: 'd',
      });

      const toNotBeDeleted = await service.create({
        title: 'do not touch',
        description: 'do not touch',
      });

      await service.remove(toBeDeleted.id);

      const errorMessage = `task with Id: ${toBeDeleted.id} not found!`;

      await expect(service.byId(toBeDeleted.id)).rejects.toThrow(
        new NotFoundException(errorMessage),
      );

      expect(loggerWarnSpy).toHaveBeenCalledWith(errorMessage);

      const notDeletedTask = await service.byId(toNotBeDeleted.id);
      expect(notDeletedTask).toBeDefined();
    });

    it('should throw and log error when Id provided is invalid', async () => {
      await service.create({
        title: 't',
        description: 'd',
      });

      const errorMessage = 'task with Id: foo not found!';

      await expect(service.remove('foo')).rejects.toThrow(
        new NotFoundException(errorMessage),
      );

      expect(loggerWarnSpy).toHaveBeenCalledWith(errorMessage);
    });
  });
});
