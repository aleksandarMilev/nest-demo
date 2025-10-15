import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_DESCRIPTION_MIN_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH,
} from '../constants/constants';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Learn NestJS',
    description: 'Short title for the task',
    minLength: TASK_TITLE_MIN_LENGTH,
    maxLength: TASK_TITLE_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(TASK_TITLE_MIN_LENGTH)
  @MaxLength(TASK_TITLE_MAX_LENGTH)
  title: string;

  @ApiProperty({
    example: 'Finish building the CRUD example and test with Postman.',
    description: 'Detailed description of what needs to be done',
    minLength: TASK_DESCRIPTION_MIN_LENGTH,
    maxLength: TASK_DESCRIPTION_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(TASK_DESCRIPTION_MIN_LENGTH)
  @MaxLength(TASK_DESCRIPTION_MAX_LENGTH)
  description: string;
}
