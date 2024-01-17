import { validationResult } from 'express-validator';
import { AppDataSource } from '../../ormconfig';
import { Task } from './task.entity';
import { Request, Response } from 'express';
import { UpdateResult } from 'typeorm/driver/mongodb/typings';

class TasksController {
  // Thos will be used when we will use Dependency Injection into the controller
  //   constructor(
  //     private taskRepository: Repository<Task> = AppDataSource.getRepository(
  //       Task,
  //     ),
  //   ) {}
  public async getAll(req: Request, res: Response): Promise<Response> {
    let allTasks: Task[];

    try {
      // Querying data from DB

      // This will not work as taskRepository is not instantiated. We have to use Dependency Injection pattern to get this running.
      //   allTasks = await this.taskRepository.find({
      //     order: {
      //       date: 'ASC',
      //     },
      //   });

      allTasks = await AppDataSource.getRepository(Task).find({
        order: {
          date: 'ASC',
        },
      });

      // Returning the data
      return res.status(200).send({
        status: 'success',
        data: allTasks,
      });
    } catch (err: any) {
      return res.status(500).send({
        status: 'error',
        message: err,
      });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        status: 'error',
        message: errors.array(),
      });
    }

    const newTask = new Task();

    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    let createdTask: Task;

    try {
      // Creating a new task and save to DB
      createdTask = await AppDataSource.getRepository(Task).save(newTask);

      // Returning the data
      return res.status(201).send({
        status: 'success',
        data: createdTask,
      });
    } catch (err: any) {
      return res.status(500).send({
        status: 'error',
        message: err,
      });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        status: 'error',
        message: errors.array(),
      });
    }

    let task: Task | null;

    try {
      // Updating the task and save to DB
      task = await AppDataSource.getRepository(Task).findOne({
        where: { id: req.body.id },
      });

      // If the id is not found then task will be null
      if (!task) {
        return res.status(400).send({
          status: 'error',
          message: 'Task not found',
        });
      }

      let updatedTask: UpdateResult;

      // @ts-ignore
      updatedTask = await AppDataSource.getRepository(Task).update(
        req.body.id,
        { status: req.body.status },
      );

      return res.status(200).send({
        status: 'success',
        data: updatedTask,
      });
    } catch (err: any) {
      return res.status(500).send({
        status: 'error',
        message: err,
      });
    }
  }
}

export const taskController = new TasksController();
