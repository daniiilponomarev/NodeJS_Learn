import * as Joi from '@hapi/joi';
import 'joi-extract-type';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export const userLoginSchema = Joi.object({
  login: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_.-]+$/)
    .required(),
  password: Joi.string().required(),
});

export interface usersLoginRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Joi.extractType<typeof userLoginSchema>;
}
