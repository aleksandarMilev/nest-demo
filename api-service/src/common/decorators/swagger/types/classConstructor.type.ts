export type ClassConstructor<T = unknown> = abstract new (
  ...args: unknown[]
) => T;
