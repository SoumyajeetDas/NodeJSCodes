"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const ormconfig_1 = require("./ormconfig");
const tasks_router_1 = require("./src/tasks/tasks.router");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({ path: './.env.development' });
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// DB Connection
ormconfig_1.AppDataSource.initialize()
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
app.use((0, cors_1.default)());
app.use('/', tasks_router_1.tasksRouter);
