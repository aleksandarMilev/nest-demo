import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  createEntityNotFoundErrorMessage as entityNotFoundErrorMessage,
  entityWriteOperationLogMessage as entityWroteErrorMessage,
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
  private readonly tasks: TaskEntity[] = [];

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
    const id = uuidv4();
    const entity = createDtoToEntity(id, dto);

    this.tasks.push(entity);
    this.logger.log(entityWroteErrorMessage(TASK_NAME, id, 'created'));

    return entityToGetDto(entity);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<void> {
    const entity = this.tasks.find((t) => t.id === id);
    if (!entity) {
      this.#logAndThrowNotFound(id);
    }

    updateDtoToEntity(dto, entity);
    this.logger.log(entityWroteErrorMessage(TASK_NAME, id, 'updated'));
  }

  async remove(id: string): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index < 0) {
      this.#logAndThrowNotFound(id);
    }

    this.tasks.splice(index, 1);
    this.logger.log(entityWroteErrorMessage(TASK_NAME, id, 'deleted'));
  }

  #logAndThrowNotFound(id: string): never {
    const message = entityNotFoundErrorMessage(id, TASK_NAME);
    this.logger.warn(message);

    throw new NotFoundException(message);
  }
}
