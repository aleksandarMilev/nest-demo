import type { LogLevel } from '@nestjs/common';

export const GLOBAL_PREFIX = 'api/v1';

export const LOG_LEVELS: LogLevel[] = ['error', 'warn', 'log', 'debug'];
