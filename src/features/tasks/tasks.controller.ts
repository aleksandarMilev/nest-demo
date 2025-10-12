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

import { ProblemDetails } from '../../common/classes/problemDetails';
import { GLOBAL_PREFIX } from '../../common/constants/constants';
import {
  ApiCreatedWithLocation,
  ApiErrorsNotFoundBadRequest,
  ApiNoContent,
  ApiOk,
  ApiOkArray,
  ApiTag,
  ApiUuidParam,
} from '../../common/decorators/swagger.decorators';
import { buildLocation } from '../../common/functions/utils';
import { PostResponse } from '../../common/interfaces/postResponse.interface';
import { TASK_NAME } from './constants/constants';
import { CreateTaskDto } from './dtos/createTask.dto';
import { GetTaskDto } from './dtos/getTask.dto';
import { UpdateTaskDto } from './dtos/updateTask.dto';
import { TasksService } from './tasks.service';

@ApiTag('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @ApiOkArray(GetTaskDto, 'List all tasks')
  @Get()
  all() {
    return this.service.all();
  }

  @ApiOk(GetTaskDto, 'Get a task by id')
  @ApiUuidParam('id', 'Task ID')
  @ApiErrorsNotFoundBadRequest(ProblemDetails)
  @Get(':id')
  byId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.byId(id);
  }

  @ApiCreatedWithLocation(GetTaskDto, 'Create a new task')
  @ApiErrorsNotFoundBadRequest(ProblemDetails)
  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<PostResponse<GetTaskDto>> {
    const task = await this.service.create(dto);
    const location = buildLocation(GLOBAL_PREFIX, TASK_NAME, task.id);

    return { data: task, location };
  }

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

  @ApiNoContent('Task removed', 'Delete a task')
  @ApiUuidParam('id', 'Task ID')
  @ApiErrorsNotFoundBadRequest(ProblemDetails)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
