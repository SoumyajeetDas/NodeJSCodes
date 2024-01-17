"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const task_entity_1 = require("./src/tasks/task.entity");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env.development' });
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mssql',
    host: process.env.DB_HOST, // Server Name in MMSQL Server
    port: parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : '1433'), // Server Port in MMSQL Server with default value
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, // The DB should be created manually first in the SSMS. The owner of the database should be the same as the username
    entities: [task_entity_1.Task], //entity must be registered in your data source options
    options: {
        trustServerCertificate: true, // This is a must!!
    },
    synchronize: true,
});
