import * as Joi from 'joi';
import { PORT_MIN_VALUE, PORT_MAX_VALUE, NODE_ENVIRONMENTS } from './constants';

export default Joi.object({
  PORT: Joi.number()
    .integer()
    .min(PORT_MIN_VALUE)
    .max(PORT_MAX_VALUE)
    .required(),
  DATABASE_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string()
    .valid(...NODE_ENVIRONMENTS)
    .required(),
});
