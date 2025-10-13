import type { Type } from '@nestjs/common';

import type { ClassConstructor } from './classConstructor.type.js';

export type ApiSchemaType = Type<unknown> | ClassConstructor | string;
