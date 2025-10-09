import { OperationType } from '../types/types';

export const createEntityNotFoundErrorMessage = <
  T extends string | number | bigint,
>(
  id: T,
  resourceName: string,
): string => `${resourceName} with Id: ${String(id)} not found!`;

export const entityWriteOperationLogMessage = <
  T extends string | number | bigint,
>(
  id: T,
  resourceName: string,
  oprationType: OperationType,
): string => `${resourceName} with Id: ${String(id)} was ${oprationType}`;
