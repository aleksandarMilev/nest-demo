import { GetTaskDto } from '../dtos/getTask.dto';
import { TaskEntity } from '../entities/task.entity';
import { UpdateTaskDto } from '../dtos/updateTask.dto';
import { CreateTaskDto } from '../dtos/createTask.dto';

export const entityToGetDto = (entity: TaskEntity): GetTaskDto => {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
  };
};

export const createDtoToEntity = (
  id: string,
  dto: CreateTaskDto,
): TaskEntity => {
  return {
    id,
    title: dto.title,
    description: dto.description,
  };
};

export const updateDtoToEntity = (dto: UpdateTaskDto, entity: TaskEntity) => {
  if (dto.title) {
    entity.title = dto.title;
  }

  if (dto.description) {
    entity.description = dto.description;
  }
};
