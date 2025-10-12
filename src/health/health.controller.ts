import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { HealthReportDto } from './classes/classes';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private service: HealthCheckService) {}

  @ApiOkResponse({ description: 'Healthy', type: HealthReportDto })
  @ApiServiceUnavailableResponse({
    description: 'Unhealthy',
    type: HealthReportDto,
  })
  @Get()
  @HealthCheck()
  check() {
    return this.service.check([]);
  }
}
