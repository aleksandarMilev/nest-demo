import * as Joi from 'joi';

import { NODE_ENVIRONMENTS, PORT_MAX_VALUE, PORT_MIN_VALUE } from './constants';

export default Joi.object({
  PORT: Joi.number()
    .integer()
    .min(PORT_MIN_VALUE)
    .max(PORT_MAX_VALUE)
    .required(),
  NODE_ENV: Joi.string()
    .valid(...NODE_ENVIRONMENTS)
    .required(),
});
