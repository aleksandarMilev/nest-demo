import { Module } from '@nestjs/common';
import { Mapper } from './mapping/mapper';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController],
  providers: [TasksService, Mapper],
})
export class TasksModule {}
