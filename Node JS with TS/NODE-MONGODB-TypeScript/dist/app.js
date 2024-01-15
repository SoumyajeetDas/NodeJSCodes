"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const app = (0, express_1.default)();
app.use('/api/v1/users', userRouter_1.default);
app.get('/api/v1/healthcheck', (req, res) => {
    res.status(200).send({
        status: "200 OK"
    });
});
app.use("*", (req, res) => {
    res.status(404).send({
        status: "404 Not found",
        message: "No Routes found"
    });
});
exports.default = app;
