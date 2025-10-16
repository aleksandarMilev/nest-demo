import { PORT_MIN_VALUE } from '../../../src/validation/constants.js';
import schema from '../../../src/validation/schema.js';

describe('Validation Schema Unit', () => {
  it('should not return error when schema is valid', () => {
    const result = schema.validate({
      PORT: 3_000,
      NODE_ENV: 'development',
    });

    expect(result.error).toBeUndefined();
  });

  it('should return error when a variable is missing', () => {
    const result = schema.validate({
      PORT: 3_000,
    });

    expect(result.error).toBeDefined();
  });

  it('should return error when PORT is invalid', () => {
    const result = schema.validate({
      PORT: PORT_MIN_VALUE - 1,
      NODE_ENV: 'development',
    });

    expect(result.error).toBeDefined();
  });

  it('should return error when NODE_ENV is invalid', () => {
    const result = schema.validate({
      PORT: 3_000,
      NODE_ENV: 'foo',
    });

    expect(result.error).toBeDefined();
  });
});
