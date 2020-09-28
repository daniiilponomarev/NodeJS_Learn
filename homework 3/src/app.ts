import express, { Application, Request, Response } from 'express';
import groupRouter from './routers/group/group-router';
import userRouter from './routers/user/user-router';
import { sequelize } from './data-access/connection';
import { init } from './init/init';

const app: Application = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use('/users', userRouter);

app.use('/groups', groupRouter);

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

sequelize
  .authenticate()
  .then(async () => {
    // await init(); // for first initialization

    app.listen(PORT, () =>
      console.log(
        'Connection has been established successfully\nApp is running'
      )
    );
  })
  .catch((err) => console.log('Unable to connect to the database:', err));
