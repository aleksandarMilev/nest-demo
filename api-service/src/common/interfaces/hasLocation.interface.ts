export interface HasLocation<T = unknown> {
  location?: string;
  data?: T;
  [key: string]: unknown;
}
