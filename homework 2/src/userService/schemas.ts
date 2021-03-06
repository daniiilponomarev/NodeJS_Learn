import * as Joi from '@hapi/joi';
import 'joi-extract-type';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export const userCreateUpdateSchema = Joi.object({
  login: Joi.string()
    .regex(/^[a-zA-Z0-9_.-]+$/)
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .required(),
  age: Joi.number().integer().min(4).max(130).required(),
});

export interface userCreateUpdateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Joi.extractType<typeof userCreateUpdateSchema>;
}
