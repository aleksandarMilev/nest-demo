import { isNonEmptyString } from '../../../common/functions/utils';
import { CreateTaskDto } from '../dtos/createTask.dto';
import { GetTaskDto } from '../dtos/getTask.dto';
import { UpdateTaskDto } from '../dtos/updateTask.dto';
import { TaskEntity } from '../entities/task.entity';

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

export const updateDtoToEntity = (
  dto: UpdateTaskDto,
  entity: TaskEntity,
): TaskEntity => ({
  ...entity,
  ...(isNonEmptyString(dto.title) ? { title: dto.title.trim() } : null),
  ...(isNonEmptyString(dto.description)
    ? { description: dto.description.trim() }
    : null),
});
