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
exports.signup = void 0;
const userService_1 = require("../service/userService");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.status(400).send({
                status: "400 Bad Request",
                message: "User credentials not present"
            });
        }
        const newUser = yield (0, userService_1.createUser)(req.body);
        newUser.password = "";
        // const token = jwtToken(newUser._id);
        res.status(201).send({
            status: "201 Created successfully",
            // token,
            data: {
                user: newUser
            }
        });
    }
    catch (error) {
        return res.status(500).send({
            status: "500 Internal Server Error",
            message: error.message
        });
    }
});
exports.signup = signup;
