import { Injectable } from '@nestjs/common';
import { GetTaskDto } from '../dtos/getTask.dto';
import { TaskEntity } from '../entities/task.entity';
import { CreateTaskDto } from '../dtos/createTask.dto';
import { UpdateTaskDto } from '../dtos/updateTask.dto';

@Injectable()
export class Mapper {
  entityToGetDto(entity: TaskEntity): GetTaskDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
    };
  }

  createDtoToEntity(id: string, dto: CreateTaskDto): TaskEntity {
    return {
      id,
      title: dto.title,
      description: dto.description,
    };
  }

  updateDtoToEntity(dto: UpdateTaskDto, entity: TaskEntity) {
    if (dto.title) {
      entity.title = dto.title;
    }

    if (dto.description) {
      entity.description = dto.description;
    }
  }
}
