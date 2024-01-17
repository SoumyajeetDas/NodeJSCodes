"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const express_validator_1 = require("express-validator");
const ormconfig_1 = require("../../ormconfig");
const task_entity_1 = require("./task.entity");
class TasksController {
    // Thos will be used when we will use Dependency Injection into the controller
    //   constructor(
    //     private taskRepository: Repository<Task> = AppDataSource.getRepository(
    //       Task,
    //     ),
    //   ) {}
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let allTasks;
            try {
                // Querying data from DB
                // This will not work as taskRepository is not instantiated. We have to use Dependency Injection pattern to get this running.
                //   allTasks = await this.taskRepository.find({
                //     order: {
                //       date: 'ASC',
                //     },
                //   });
                allTasks = yield ormconfig_1.AppDataSource.getRepository(task_entity_1.Task).find({
                    order: {
                        date: 'ASC',
                    },
                });
                // Returning the data
                return res.status(200).send({
                    status: 'success',
                    data: allTasks,
                });
            }
            catch (err) {
                return res.status(500).send({
                    status: 'error',
                    message: err,
                });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({
                    status: 'error',
                    message: errors.array(),
                });
            }
            const newTask = new task_entity_1.Task();
            newTask.title = req.body.title;
            newTask.date = req.body.date;
            newTask.description = req.body.description;
            newTask.priority = req.body.priority;
            newTask.status = req.body.status;
            let createdTask;
            try {
                // Creating a new task and save to DB
                createdTask = yield ormconfig_1.AppDataSource.getRepository(task_entity_1.Task).save(newTask);
                // Returning the data
                return res.status(201).send({
                    status: 'success',
                    data: createdTask,
                });
            }
            catch (err) {
                return res.status(500).send({
                    status: 'error',
                    message: err,
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({
                    status: 'error',
                    message: errors.array(),
                });
            }
            let task;
            try {
                // Updating the task and save to DB
                task = yield ormconfig_1.AppDataSource.getRepository(task_entity_1.Task).findOne({
                    where: { id: req.body.id },
                });
                // If the id is not found then task will be null
                if (!task) {
                    return res.status(400).send({
                        status: 'error',
                        message: 'Task not found',
                    });
                }
                let updatedTask;
                // @ts-ignore
                updatedTask = yield ormconfig_1.AppDataSource.getRepository(task_entity_1.Task).update(req.body.id, { status: req.body.status });
                return res.status(200).send({
                    status: 'success',
                    data: updatedTask,
                });
            }
            catch (err) {
                return res.status(500).send({
                    status: 'error',
                    message: err,
                });
            }
        });
    }
}
exports.taskController = new TasksController();
