export const buildLocation = (
  protocol: string,
  host: string | undefined,
  prefix: string,
  resourceName: string,
  id: string,
) => {
  return `${protocol}://${host}/${prefix}/${resourceName}/${id}`;
};

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
