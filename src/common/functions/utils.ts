export const buildLocation = (
  prefix: string,
  resourceName: string,
  id: string,
) => {
  return `/${prefix}/${resourceName}/${id}`;
};

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
