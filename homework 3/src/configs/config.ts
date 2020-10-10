import {Secret} from "jsonwebtoken";

export const PORT = 3001;

export const SECRET:Secret = 'secret_for_nodejs_mentoring';
export const REFRESH_SECRET:Secret = 'secret_for_nodejs_mentoring';
export const AUTH_HEADER = 'x-access-token';
export const REFRESH_AUTH_HEADER = 'x-refresh-token';
export const AUTH_TOKEN_EXPIRATION = '30s';
export const AUTH_REFRESH_EXPIRATION = '1h';
