/* eslint-disable @typescript-eslint/require-await */
import { randomUUID } from 'node:crypto';

import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  entityNotFoundErrorMessage,
  entityWriteOperationLogMessage,
} from '../../common/constants/messages.js';
import { TASK_NAME } from './constants/constants.js';
import { CreateTaskDto } from './dtos/createTask.dto.js';
import { GetTaskDto } from './dtos/getTask.dto.js';
import { UpdateTaskDto } from './dtos/updateTask.dto.js';
import { TaskEntity } from './entities/task.entity.js';
import {
  createDtoToEntity,
  entityToGetDto,
  updateDtoToEntity,
} from './mapping/mapper.js';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private tasks: TaskEntity[] = [];

  async all(): Promise<GetTaskDto[]> {
    return this.tasks.map(entityToGetDto);
  }

  async byId(id: string): Promise<GetTaskDto> {
    const entity = this.tasks.find((t) => t.id === id);
    if (!entity) {
      this.#logAndThrowNotFound(id);
    }

    return entityToGetDto(entity);
  }

  async create(dto: CreateTaskDto): Promise<GetTaskDto> {
    const id = randomUUID();
    const entity = createDtoToEntity(id, dto);

    this.tasks.push(entity);
    this.logger.log(entityWriteOperationLogMessage(id, TASK_NAME, 'created'));

    return entityToGetDto(entity);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      this.#logAndThrowNotFound(id);
    }

    const entity = this.tasks[index];
    const updated: TaskEntity = updateDtoToEntity(dto, entity);
    this.tasks[index] = updated;

    this.logger.log(entityWriteOperationLogMessage(id, TASK_NAME, 'updated'));
  }

  async remove(id: string): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index < 0) {
      this.#logAndThrowNotFound(id);
    }

    this.tasks.splice(index, 1);
    this.logger.log(entityWriteOperationLogMessage(id, TASK_NAME, 'deleted'));
  }

  #logAndThrowNotFound(id: string): never {
    const message = entityNotFoundErrorMessage(id, TASK_NAME);
    this.logger.warn(message);

    throw new NotFoundException(message);
  }
}
