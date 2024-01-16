import { DataSource } from 'typeorm';
import { Task } from './src/tasks/task.entity';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.development' });

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST, // Server Name in MMSQL Server
  port: parseInt(process.env.DB_PORT ?? '1433'), // Server Port in MMSQL Server with default value
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // The DB should be created manually first in the SSMS. The owner of the database should be the same as the username
  entities: [Task], //entity must be registered in your data source options
  options: {
    trustServerCertificate: true, // This is a must!!
  },
  synchronize: true,
});
