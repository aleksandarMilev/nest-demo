import 'reflect-metadata';

import {
  Roles,
  ROLES_KEY,
} from '../../../../../src/common/decorators/roles/roles.decorator.js';

describe('Roles Decorator Unit', () => {
  it('should set metadata "roles" with given roles', () => {
    class MyController {
      @Roles('admin', 'user')
      foo(this: void) {
        return 'foo';
      }
    }

    const metadata = Reflect.getMetadata(
      ROLES_KEY,
      MyController.prototype.foo,
    ) as string[];

    expect(metadata).toEqual(['admin', 'user']);
  });
});
