import express, { Application } from 'express';
import router from './userService/router';

const app: Application = express();

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => console.log('App is running'));

app.use(express.json());

app.use('/users', router);
