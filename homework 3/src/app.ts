import express, { Application, Request, Response } from 'express';
import loginRouter from './routers/login/login-router';
import userRouter from './routers/user/user-router';
import groupRouter from './routers/group/group-router';
import { sequelize } from './data-access/connection';
import { init } from './init/init';
import {
  customLoggerMiddleware,
  winstonErrorLoggerMiddleware,
} from './logger/logger';
import { PORT as APP_PORT } from './configs/config';
import { checkAccessToken } from './routers/login/tokens';

const app: Application = express();

app.use(express.json());

app.use(customLoggerMiddleware);

app.use('', loginRouter);

app.use('/users', checkAccessToken, userRouter);

app.use('/groups', checkAccessToken, groupRouter);

app.use((err: any, req: Request, res: Response) => {
  if (err && err.error && err.error.isJoi) {
    // return json response with status 400 if there is a joi error,
    res.status(400).json({
      type: err.type,
      message: err.error.toString(),
    });
  }
  res.status(500).send(err);
});

app.use(winstonErrorLoggerMiddleware);

const PORT = Number(process.env.PORT) || APP_PORT;

sequelize
  .authenticate()
  .then(async () => {
    await init(); // for first initialization

    app.listen(PORT, () =>
      console.log(
        'Connection has been established successfully\nApp is running'
      )
    );
  })
  .catch((err) => console.log('Unable to connect to the database:', err));
