import { Secret } from 'jsonwebtoken';

export const PORT = process.env.PORT;

export const SECRET: Secret =
  process.env.SECRET || 'secret_for_nodejs_mentoring';
export const REFRESH_SECRET: Secret =
  process.env.REFRESH_SECRET || 'secret_for_nodejs_mentoring';
export const AUTH_HEADER: string = process.env.AUTH_HEADER || 'x-access-token';
export const REFRESH_AUTH_HEADER: string =
  process.env.REFRESH_AUTH_HEADER || 'x-refresh-token';
export const AUTH_TOKEN_EXPIRATION = process.env.AUTH_TOKEN_EXPIRATION;
export const AUTH_REFRESH_EXPIRATION = process.env.AUTH_REFRESH_EXPIRATION;
