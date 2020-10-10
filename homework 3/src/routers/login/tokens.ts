import jwt, { VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {
  AUTH_HEADER,
  AUTH_REFRESH_EXPIRATION,
  AUTH_TOKEN_EXPIRATION,
  REFRESH_AUTH_HEADER,
  REFRESH_SECRET,
  SECRET,
} from '../../configs/config';
import { FORBIDDEN, UNAUTHORIZED } from '../../constants/statuses';
import { ServiceError } from '../../services/service-errors';

interface UserTokenPayload {
  id: number;
  login: string;
}

export const generateAccessToken = (payload: UserTokenPayload) => {
  return jwt.sign(payload, SECRET, { expiresIn: AUTH_TOKEN_EXPIRATION });
};
export const generateRefreshToken = (payload: UserTokenPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: AUTH_REFRESH_EXPIRATION,
  });
};

export const checkAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.headers[AUTH_HEADER];

  if (token) {
    jwt.verify(token, SECRET, (err: VerifyErrors | null) => {
      if (err) {
        const error = new ServiceError('Failed to authenticate token');
        res.status(FORBIDDEN).json(error);
      } else {
        next();
      }
    });
  } else {
    const error = new ServiceError('No token provided');
    res.status(UNAUTHORIZED).json(error);
    res.send();
  }
};

export const checkRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.headers[REFRESH_AUTH_HEADER];

  if (token) {
    jwt.verify(
      token,
      REFRESH_SECRET,
      (err: VerifyErrors | null, payload: any) => {
        if (err) {
          const error = new ServiceError('Failed to authenticate token');
          res.status(FORBIDDEN).json(error);
        } else {
          res.locals.payload = payload;
          next();
        }
      }
    );
  } else {
    const error = new ServiceError('No token provided');
    res.status(UNAUTHORIZED).json(error);
    res.send();
  }
};
