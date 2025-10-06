import * as Joi from 'joi';
import * as nodeEnvironments from './constants';

export default Joi.object({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string().valid(nodeEnvironments).required(),
});
