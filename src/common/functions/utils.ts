export const buildLocation = (
  protocol: string,
  host: string | undefined,
  prefix: string,
  resourceName: string,
  id: string,
) => {
  return `${protocol}://${host}/${prefix}/${resourceName}/${id}`;
};
