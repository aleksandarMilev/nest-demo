import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  entityNotFoundErrorMessage,
  entityWriteOperationLogMessage,
} from '../../common/constants/messages';
import { TASK_NAME } from './constants/constants';
import { CreateTaskDto } from './dtos/createTask.dto';
import { GetTaskDto } from './dtos/getTask.dto';
import { UpdateTaskDto } from './dtos/updateTask.dto';
import { TaskEntity } from './entities/task.entity';
import {
  createDtoToEntity,
  entityToGetDto,
  updateDtoToEntity,
} from './mapping/mapper';

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
    const entity = this.tasks.find((t) => t.id === id);
    if (!entity) {
      this.#logAndThrowNotFound(id);
    }

    updateDtoToEntity(dto, entity);
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
