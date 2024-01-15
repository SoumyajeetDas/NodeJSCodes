import express, { Express } from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

dotenv.config({ path: './.env.development' });

const app: Express = express();

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'LAPTOP-AD63JEEU\\SOUMYA',
  port: 1433,
  username: 'sqlserver',
  password: 'Soumya@123',
  database: 'todo', // The DB should be created manually first in the SSMS. The owner of the database should be the same as the username
  options: {
    trustServerCertificate: true, // This is a must!!
  },
  synchronize: true,
});

const port = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
