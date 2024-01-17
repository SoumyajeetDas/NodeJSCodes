import express, { Router } from 'express';
import { taskController } from './tasks.controller';
import { createValidator, updateValidator } from './tasks.validator';

export const tasksRouter: Router = Router();

tasksRouter.use(express.json());

tasksRouter
  .route('/tasks')
  .get(taskController.getAll)
  .post(createValidator, taskController.create)
  .put(updateValidator, taskController.update);
