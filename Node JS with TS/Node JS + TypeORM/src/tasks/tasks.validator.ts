import { ValidationChain, body } from 'express-validator';
import { Priority } from '../enums/Priority';
import { Status } from '../enums/Status';

export const createValidator: ValidationChain[] = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isString()
    .withMessage('Title must be a string'),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isString()
    .withMessage('Date must be a string'),

  body('description')
    .trim()
    .isString()
    .withMessage('Description must be a string'),

  body('priority')
    .trim()
    .isIn([Priority.LOW, Priority.NORMAL, Priority.HIGH])
    .withMessage('Priority must be one of [LOW, NORMAL, HIGH]'),

  body('status')
    .trim()
    .isIn([Status.TODO, Status.IN_PROGRESS, Status.COMPLETED])
    .withMessage('Status must be one of [TODO, IN_PROGRESS, COMPLETED]'),
];

export const updateValidator = [
  body('id')
    .notEmpty()
    .withMessage('Id is required')
    .isNumeric()
    .withMessage('Id must be a number'),
  body('status')
    .trim()
    .isIn([Status.TODO, Status.IN_PROGRESS, Status.COMPLETED])
    .withMessage('Status must be one of [TODO, IN_PROGRESS, COMPLETED]'),
];
