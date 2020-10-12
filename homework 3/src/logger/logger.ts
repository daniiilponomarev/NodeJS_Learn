import * as winston from 'winston';
import { INTERNAL_SERVER_ERROR } from '../constants/statuses';

export const customLoggerMiddleware = (
  req: any,
  res: any,
  next: () => void
) => {
  const currentDateTime = new Date();
  const startDateTime = currentDateTime.getTime();
  const formatted_date = `${currentDateTime.getFullYear()}-${
    currentDateTime.getMonth() + 1
  }-${currentDateTime.getDate()} ${currentDateTime.getHours()}:${currentDateTime.getMinutes()}:${currentDateTime.getSeconds()}`;

  const [oldWrite, oldEnd] = [res.write, res.end];

  (res.write as unknown) = function (chunk: any) {
    (oldWrite as Function).apply(res, arguments);
  };

  res.once('finish', () => {
    const endDateTime = new Date().getTime();
    const time = endDateTime - startDateTime;

    const log = `[${formatted_date}] ${req.method}:${req.url}
response status: ${res.statusCode}
time: ${time}ms`;

    console.log(log);
  });

  if (next) {
    next();
  }
};

export const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: false }),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

export const winstonErrorLoggerMiddleware = (
  err: any,
  req: any,
  res: any,
  next: () => void
) => {
  if (err) {
    logger.error(err);
    res.status(INTERNAL_SERVER_ERROR).json(err);
  }

  process.on('uncaughtException', (error: Error) => {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR + 1).json(error);
  });

  if (next) {
    next();
  }
};
