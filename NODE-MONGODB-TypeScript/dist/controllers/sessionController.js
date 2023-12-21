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
exports.createSessionHandler = void 0;
const sessionService_1 = require("../service/sessionService");
const userService_1 = require("../service/userService");
const createSessionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the request body is present
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).send({
            status: "400 Bad Request",
            message: "Request body is not appropriate"
        });
    }
    // If present validate the email and password
    const { email, password } = req.body;
    let user = yield (0, userService_1.validatePassword)(email, password);
    if (!user) {
        return res.status(400).send({
            status: "400 Bad Request",
            message: "Invalid username or password"
        });
    }
    // If valid email and password create the session.
    const session = yield (0, sessionService_1.createSession)(user._id, req.get("user-agent") || "");
    // Create access token 
    const accessToken = yield (0, sessionService_1.createAccessToken)({ user, session });
    // Create Refresh Token
    const refreshToken = yield (0, sessionService_1.creatRefreshToken)(session);
    return res.status(200).send({
        accessToken,
        refreshToken
    });
});
exports.createSessionHandler = createSessionHandler;
