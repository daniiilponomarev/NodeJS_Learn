import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import loginRouter from './routers/login/login-router';
import userRouter from './routers/user/user-router';
import groupRouter from './routers/group/group-router';
import { sequelize } from './data-access/connection';
import { init } from './init/init';
import {
  customLoggerMiddleware,
  winstonErrorLoggerMiddleware,
} from './utils/logger';
import { PORT as APP_PORT } from './configs/config';
import { checkAccessTokenMiddleware } from './routers/login/tokens';
import { validatorError } from './utils/validator';

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || APP_PORT;
const app: Application = express();

app.use(express.json());

app.use(customLoggerMiddleware);

app.use(
  cors({
    origin: `http://localhost:${PORT}`,
  })
);

app.use('', loginRouter);

app.use('', checkAccessTokenMiddleware);

app.use('/users', userRouter);

app.use('/groups', groupRouter);

app.use(validatorError);

app.use(winstonErrorLoggerMiddleware);

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
