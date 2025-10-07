import schema from '../../../src/validation/schema';
import { PORT_MIN_VALUE } from '../../../src/validation/constants';

describe('Schema unit tests', () => {
  it('should not return error when schema is valid', () => {
    const result = schema.validate({
      PORT: 3_000,
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      NODE_ENV: 'development',
    });

    expect(result.error).toBeUndefined();
  });

  it('should return error when a varaible is missing', () => {
    const result = schema.validate({
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      NODE_ENV: 'development',
    });

    expect(result.error).toBeDefined();
  });

  it('should return error when PORT is invalid', () => {
    const result = schema.validate({
      PORT: PORT_MIN_VALUE - 1,
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      NODE_ENV: 'development',
    });

    expect(result.error).toBeDefined();
  });

  it('should return error when DATABASE_URL is invalid', () => {
    const result = schema.validate({
      PORT: 3_000,
      DATABASE_URL: 'foo',
      NODE_ENV: 'development',
    });

    expect(result.error).toBeDefined();
  });

  it('should return error when NODE_ENV is invalid', () => {
    const result = schema.validate({
      PORT: 3_000,
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      NODE_ENV: 'foo',
    });

    expect(result.error).toBeDefined();
  });
});
