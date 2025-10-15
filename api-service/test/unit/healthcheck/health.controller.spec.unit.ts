import { HealthCheckService } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';

import { HealthController } from '../../../src/health/health.controller';

describe('Health Controller Unit', () => {
  let controller: HealthController;
  let mockService: Partial<HealthCheckService>;

  beforeEach(async () => {
    mockService = {
      check: jest
        .fn()
        .mockResolvedValue({ status: 'ok', info: {}, error: {}, details: {} }),
    };

    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthCheckService, useValue: mockService }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the correct object', async () => {
    const result = await controller.check();
    expect(result).toEqual({ status: 'ok', info: {}, error: {}, details: {} });
  });

  it('should be called correctly', async () => {
    await controller.check();

    expect(mockService.check).toHaveBeenCalled();
    expect(mockService.check).toHaveBeenCalledTimes(1);
    expect(mockService.check).toHaveBeenCalledWith([]);
  });

  it('should throw when service fail', async () => {
    (mockService.check as jest.Mock).mockRejectedValueOnce(
      new Error('Service failed'),
    );

    await expect(controller.check()).rejects.toThrow('Service failed');
  });
});
