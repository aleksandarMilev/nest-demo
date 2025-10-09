import { ApiProperty } from '@nestjs/swagger';

export class GetTaskDto {
  @ApiProperty({ example: 'f9719cdf-895a-470a-be2a-c5bc686cfce6' })
  id: string;

  @ApiProperty({ example: 'Learn NestJS' })
  title: string;

  @ApiProperty({
    example: 'Finish building the CRUD example and test with Postman.',
  })
  description: string;
}
