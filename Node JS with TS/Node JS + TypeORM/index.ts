import express, { Express } from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { AppDataSource } from './ormconfig';
import { tasksRouter } from './src/tasks/tasks.router';
import cors from 'cors';

dotenv.config({ path: './.env.development' });

const app: Express = express();

const port = process.env.PORT || 3000;

// DB Connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err);
  });

// App Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(cors());

app.use('/', tasksRouter);
