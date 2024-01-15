"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const decode = (token, secretkey) => {
    try {
        // Here verify function synchronously verify the token
        const decoded = jsonwebtoken_1.default.verify(token, secretkey);
        return { valid: true, expired: false, decoded };
    }
    catch (err) {
        return {
            valid: false,
            expired: err.message === "jwt expired",
            decoded: null
        };
    }
};
exports.decode = decode;
