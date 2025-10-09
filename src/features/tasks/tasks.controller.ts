import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { GLOBAL_PREFIX } from '../../common/constants/constants';
import { buildLocation } from '../../common/functions/utils';
import { TASK_NAME } from './constants/constants';
import { CreateTaskDto } from './dtos/createTask.dto';
import { GetTaskDto } from './dtos/getTask.dto';
import { UpdateTaskDto } from './dtos/updateTask.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @ApiResponse({ status: HttpStatus.OK, type: GetTaskDto })
  @Get()
  all() {
    return this.service.all();
  }

  @ApiResponse({ status: HttpStatus.OK, type: GetTaskDto })
  @Get(':id')
  byId(@Param('id') id: string) {
    return this.service.byId(id);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: GetTaskDto })
  @Post()
  async create(
    @Body() dto: CreateTaskDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<GetTaskDto> {
    const task = await this.service.create(dto);
    const location = buildLocation(
      request.protocol,
      request.get('host'),
      GLOBAL_PREFIX,
      TASK_NAME,
      task.id,
    );

    response.setHeader('Location', location);

    return task;
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
