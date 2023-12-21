"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sessionController_1 = require("../controllers/sessionController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.post('/signUp', userController_1.signup);
router.post('/sessionRouter', sessionController_1.createSessionHandler);
exports.default = router;
