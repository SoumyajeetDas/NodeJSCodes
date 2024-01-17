"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidator = exports.createValidator = void 0;
const express_validator_1 = require("express-validator");
const Priority_1 = require("../enums/Priority");
const Status_1 = require("../enums/Status");
exports.createValidator = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isString()
        .withMessage('Title must be a string'),
    (0, express_validator_1.body)('date')
        .notEmpty()
        .withMessage('Date is required')
        .isString()
        .withMessage('Date must be a string'),
    (0, express_validator_1.body)('description')
        .trim()
        .isString()
        .withMessage('Description must be a string'),
    (0, express_validator_1.body)('priority')
        .trim()
        .isIn([Priority_1.Priority.LOW, Priority_1.Priority.NORMAL, Priority_1.Priority.HIGH])
        .withMessage('Priority must be one of [LOW, NORMAL, HIGH]'),
    (0, express_validator_1.body)('status')
        .trim()
        .isIn([Status_1.Status.TODO, Status_1.Status.IN_PROGRESS, Status_1.Status.COMPLETED])
        .withMessage('Status must be one of [TODO, IN_PROGRESS, COMPLETED]'),
];
exports.updateValidator = [
    (0, express_validator_1.body)('id')
        .notEmpty()
        .withMessage('Id is required')
        .isNumeric()
        .withMessage('Id must be a number'),
    (0, express_validator_1.body)('status')
        .trim()
        .isIn([Status_1.Status.TODO, Status_1.Status.IN_PROGRESS, Status_1.Status.COMPLETED])
        .withMessage('Status must be one of [TODO, IN_PROGRESS, COMPLETED]'),
];
