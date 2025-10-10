import { ApiProperty } from '@nestjs/swagger';

export class ProblemDetails {
  @ApiProperty({ example: 400 })
  status: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({
    example: 'title must be longer than or equal to 2 characters',
  })
  message: string;

  @ApiProperty({ example: '/api/v1/tasks' })
  path?: string;

  @ApiProperty({ example: '2025-10-10T09:00:00.000Z', format: 'date-time' })
  timestamp: string;
}
