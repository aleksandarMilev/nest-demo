import type { Request } from 'express';

import type { User } from '../types/user.type.js';

export interface RequestWithUser extends Request {
  user: User;
}
