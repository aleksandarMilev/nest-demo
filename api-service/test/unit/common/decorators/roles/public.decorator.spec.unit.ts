import 'reflect-metadata';

import {
  IS_PUBLIC_KEY,
  Public,
} from '../../../../../src/common/decorators/roles/public.decorator';

describe('Public Decorator Unit', () => {
  it('should set metadata "roles" with given roles', () => {
    class MyController {
      @Public()
      foo(this: void) {
        return 'foo';
      }
    }

    const metadata = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      MyController.prototype.foo,
    ) as string[];

    expect(metadata).toBe(true);
  });
});
