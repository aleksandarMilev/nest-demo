import { PORT_MIN_VALUE } from '../../../src/validation/constants.js';
import schema from '../../../src/validation/schema.js';

describe('Validation Schema Unit', () => {
  it('should not return error when schema is valid', () => {
    const result = schema.validate({
      PORT: 3_000,
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      NODE_ENV: 'development',
      CLIENT_ENDPOINT: 'http://localhost:5173',
    });

    expect(result.error).toBeUndefined();
  });

  it('should return error when a variable is missing', () => {
    const result = schema.validate({
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      NODE_ENV: 'development',
      CLIENT_ENDPOINT: 'http://localhost:5173',
    });

    expect(result.error).toBeDefined();
  });

  it('should return error when PORT is invalid', () => {
    const result = schema.validate({
      PORT: PORT_MIN_VALUE - 1,
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      NODE_ENV: 'development',
      CLIENT_ENDPOINT: 'http://localhost:5173',
    });

    expect(result.error).toBeDefined();
  });

  it('should return error when DATABASE_URL is invalid', () => {
    const result = schema.validate({
      PORT: 3_000,
      DATABASE_URL: 'foo',
      NODE_ENV: 'development',
      CLIENT_ENDPOINT: 'http://localhost:5173',
    });

    expect(result.error).toBeDefined();
  });

  it('should return error when NODE_ENV is invalid', () => {
    const result = schema.validate({
      PORT: 3_000,
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      NODE_ENV: 'foo',
      CLIENT_ENDPOINT: 'http://localhost:5173',
    });

    expect(result.error).toBeDefined();
  });

  it('should return error when CLIENT_ENDPOINT is invalid', () => {
    const result = schema.validate({
      PORT: 3_000,
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      NODE_ENV: 'development',
      CLIENT_ENDPOINT: 'foo',
    });

    expect(result.error).toBeDefined();
  });
});
