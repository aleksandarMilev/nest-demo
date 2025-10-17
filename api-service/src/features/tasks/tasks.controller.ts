import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';

import { ProblemDetails } from '../../common/classes/problemDetails.class.js';
import { GLOBAL_PREFIX } from '../../common/constants/constants.js';
import { Public } from '../../common/decorators/roles/public.decorator.js';
import { Roles } from '../../common/decorators/roles/roles.decorator.js';
import {
  ApiCreatedWithLocation,
  ApiErrorsNotFoundBadRequest,
  ApiNoContent,
  ApiOk,
  ApiOkArray,
  ApiTag,
  ApiUuidParam,
} from '../../common/decorators/swagger/swagger.decorator.js';
import { buildLocation } from '../../common/functions/utils.js';
import { PostResponse } from '../../common/interfaces/postResponse.interface.js';
import { TASK_NAME } from './constants/constants.js';
import { CreateTaskDto } from './dtos/createTask.dto.js';
import { GetTaskDto } from './dtos/getTask.dto.js';
import { UpdateTaskDto } from './dtos/updateTask.dto.js';
import { TasksService } from './tasks.service.js';

@ApiTag('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Public()
  @ApiOkArray(GetTaskDto, 'List all tasks')
  @Get()
  all() {
    return this.service.all();
  }

  @Public()
  @ApiOk(GetTaskDto, 'Get a task by id')
  @ApiUuidParam('id', 'Task ID')
  @ApiErrorsNotFoundBadRequest(ProblemDetails)
  @Get(':id')
  byId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.byId(id);
  }

  @Roles('user', 'admin')
  @ApiCreatedWithLocation(GetTaskDto, 'Create a new task')
  @ApiErrorsNotFoundBadRequest(ProblemDetails)
  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<PostResponse<GetTaskDto>> {
    const task = await this.service.create(dto);
    const location = buildLocation(GLOBAL_PREFIX, TASK_NAME, task.id);

    return { data: task, location };
  }

  @Roles('admin')
  @ApiNoContent('Task updated', 'Replace a task (full update)')
  @ApiUuidParam('id', 'Task ID')
  @ApiErrorsNotFoundBadRequest(ProblemDetails)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @ApiNoContent('Task removed', 'Delete a task')
  @ApiUuidParam('id', 'Task ID')
  @ApiErrorsNotFoundBadRequest(ProblemDetails)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
