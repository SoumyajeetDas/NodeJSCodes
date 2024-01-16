"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const task_entity_1 = require("./src/tasks/task.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mssql',
    host: 'LAPTOP-AD63JEEU\\SOUMYA', // Server Name in MMSQL Server
    port: 1433,
    username: 'sqlserver',
    password: 'Soumya@123',
    database: 'todo', // The DB should be created manually first in the SSMS. The owner of the database should be the same as the username
    entities: [task_entity_1.Task], //entity must be registered in your data source options
    options: {
        trustServerCertificate: true, // This is a must!!
    },
    synchronize: true,
});
