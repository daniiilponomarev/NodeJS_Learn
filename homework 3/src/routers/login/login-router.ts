import express, { Router, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import 'joi-extract-type';
import asyncHandler from 'express-async-handler';
import { userLoginSchema, usersLoginRequestSchema } from './login-schemas';
import { UserLoginRequestDTO } from '../../models/user-model';
import { getUserByCreds } from '../../services/user-service';
import { LoginMapper } from './login-mapper';
import { CONFLICT, OK } from '../../constants/statuses';
import { logger } from '../../logger/logger';
import {
  checkRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from './tokens';

const userRouter: Router = express.Router();
const validator = createValidator();

userRouter.post(
  '/login',
  validator.body(userLoginSchema),
  asyncHandler(
    async (req: ValidatedRequest<usersLoginRequestSchema>, res: Response) => {
      try {
        const creds: UserLoginRequestDTO = req.body;
        const user = await getUserByCreds(creds);
        const userDTO = LoginMapper.mapUserToLoginDTO(user);
        if (userDTO) {
          res.status(OK).json({
            'access-token': generateAccessToken({
              id: +userDTO.id,
              login: userDTO.login,
            }),
            'refresh-token': generateRefreshToken({
              id: +userDTO.id,
              login: userDTO.login,
            }),
          });
        }
      } catch (error) {
        logger.error({
          message: error.errorMessage,
          method: 'loginUser',
          body: JSON.stringify(req.body),
        });
        res.status(CONFLICT).json(error);
      }
    }
  )
);

userRouter.post(
  '/refresh-token',
  checkRefreshToken,
  asyncHandler(
    async (req: ValidatedRequest<usersLoginRequestSchema>, res: Response) => {
      const user = res.locals.payload;
      res.status(OK).json({
        'access-token': generateAccessToken({ id: user.id, login: user.login }),
        'refresh-token': generateRefreshToken({
          id: user.id,
          login: user.login,
        }),
      });
    }
  )
);

export default userRouter;
