import * as Joi from '@hapi/joi';
import 'joi-extract-type';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export const groupCreateUpdateSchema = Joi.object({
  name: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_.-]+$/)
    .required(),
  permissions: Joi.array()
    .items(
      Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')
    )
    .required(),
});

export interface groupCreateUpdateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Joi.extractType<typeof groupCreateUpdateSchema>;
}
