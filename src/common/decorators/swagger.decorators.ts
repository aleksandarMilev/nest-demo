import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

type ClassConstructor<T = unknown> = abstract new (...args: unknown[]) => T;

type ApiSchemaType = Type<unknown> | ClassConstructor | string;

const noopOperation: MethodDecorator = (_t, _k, d) => d;

export const ApiTag = (name: string): ClassDecorator =>
  applyDecorators(ApiTags(name)) as ClassDecorator;

export const ApiUuidParam = (
  name: string = 'id',
  description: string = 'Resource ID',
): MethodDecorator =>
  applyDecorators(
    ApiParam({
      name,
      description,
      schema: { type: 'string', format: 'uuid' as const },
    }),
  ) as MethodDecorator;

export const ApiOk = (type: ApiSchemaType, summary?: string): MethodDecorator =>
  applyDecorators(
    summary ? ApiOperation({ summary }) : noopOperation,
    ApiOkResponse({ type }),
  ) as MethodDecorator;

export const ApiOkArray = (
  type: ApiSchemaType,
  summary?: string,
): MethodDecorator =>
  applyDecorators(
    summary ? ApiOperation({ summary }) : noopOperation,
    ApiOkResponse({ type, isArray: true }),
  ) as MethodDecorator;

export const ApiCreatedWithLocation = (
  type: ApiSchemaType,
  summary?: string,
): MethodDecorator =>
  applyDecorators(
    summary ? ApiOperation({ summary }) : noopOperation,
    ApiCreatedResponse({
      description: 'Created',
      type,
      headers: {
        Location: {
          description: 'Absolute URL of the new resource',
          schema: { type: 'string', format: 'uri' as const },
        },
      },
    }),
  ) as MethodDecorator;

export const ApiNoContent = (
  description: string = 'No Content',
  summary?: string,
): MethodDecorator =>
  applyDecorators(
    summary ? ApiOperation({ summary }) : noopOperation,
    ApiNoContentResponse({ description }),
  ) as MethodDecorator;

export const ApiErrorsNotFoundBadRequest = (
  problemType: ApiSchemaType,
): MethodDecorator =>
  applyDecorators(
    ApiBadRequestResponse({
      description: 'Validation error',
      type: problemType,
    }),
    ApiNotFoundResponse({
      description: 'Not found',
      type: problemType,
    }),
  ) as MethodDecorator;
