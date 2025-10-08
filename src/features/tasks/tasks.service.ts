import { v4 as uuidv4 } from 'uuid';
import { Mapper } from './mapping/mapper';
import { Injectable } from '@nestjs/common';
import { GetTaskDto } from './dtos/getTask.dto';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './dtos/createTask.dto';
import { UpdateTaskDto } from './dtos/updateTask.dto';

@Injectable()
export class TasksService {
  private readonly tasks: TaskEntity[];

  constructor(private readonly mapper: Mapper) {
    this.tasks = [];
  }

  all(): GetTaskDto[] {
    return this.tasks.map((t) => this.mapper.entityToGetDto(t));
  }

  byId(id: string): GetTaskDto | null {
    const entity = this.tasks.find((t) => t.id == id);
    if (!entity) {
      return null;
    }

    return this.mapper.entityToGetDto(entity);
  }

  create(dto: CreateTaskDto): string {
    const id = uuidv4();
    const entity = this.mapper.createDtoToEntity(id, dto);

    this.tasks.push(entity);

    return id;
  }

  update(id: string, dto: UpdateTaskDto): null | void {
    const entity = this.tasks.find((t) => t.id == id);
    if (!entity) {
      return null;
    }

    this.mapper.updateDtoToEntity(dto, entity);
  }

  remove(id: string): null | void {
    const index = this.tasks.findIndex((t) => t.id == id);
    if (index < 0) {
      return null;
    }

    this.tasks.splice(index, 1);
  }
}
