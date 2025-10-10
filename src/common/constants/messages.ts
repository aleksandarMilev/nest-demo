import { OperationType } from '../types/types';

export const entityNotFoundErrorMessage = <T extends string | number | bigint>(
  id: T,
  resourceName: string,
): string => `${resourceName} with Id: ${String(id)} not found!`;

export const entityWriteOperationLogMessage = <
  T extends string | number | bigint,
>(
  id: T,
  resourceName: string,
  operationType: OperationType,
): string => `${resourceName} with Id: ${String(id)} was ${operationType}.`;
