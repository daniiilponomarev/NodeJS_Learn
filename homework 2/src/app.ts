import express, { Application, Request, Response } from 'express';
import router from './userService/router';

const app: Application = express();

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => console.log('App is running'));

app.use(express.json());

app.use('/users', router);

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
