import { PartialType } from '@nestjs/swagger';

import { CreateTaskDto } from './createTask.dto.js';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
