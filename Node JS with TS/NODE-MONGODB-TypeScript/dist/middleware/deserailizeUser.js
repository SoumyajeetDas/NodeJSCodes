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
exports.deserailzeUser = void 0;
const jwtUtils_1 = require("src/utils/jwtUtils");
const deserailzeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let accessToken = undefined;
    let refreshToken = undefined;
    // Check for the access token in the Authorization Hedaer in the bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        accessToken = req.headers.authorization.split(' ')[1];
    }
    // Check for the refresh token in the header with name "x-refresh"
    if (req.headers["x-refresh"]) {
        refreshToken = req.headers["x-refresh"].toString();
    }
    if (!accessToken) {
        return next();
    }
    const { expired, decoded } = (0, jwtUtils_1.decode)(accessToken, process.env.JWT_AccessToken);
    if (decoded) {
        req.user = decoded;
        return next();
    }
    // if (expired && refreshToken) {
    //     const newAccessToken = await refreshAccessToken({ refreshToken });
    //     if (newAccessToken) {
    //         // Add the new access token to the response header
    //         res.setHeader("x-access-token", newAccessToken);
    //         const { decoded } = decode(newAccessToken, process.env.JWT_AccessToken as string);
    //         if(decoded){
    //             req.user = decoded;
    //         }
    //     }
    //     return next();
    // }
    return next();
});
exports.deserailzeUser = deserailzeUser;
