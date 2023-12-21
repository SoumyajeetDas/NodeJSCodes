import { Request, Response, NextFunction } from "express"
import { refreshAccessToken } from "../service/sessionService";
import { decode } from "../utils/jwtUtils";

// Module Augmentation
declare module 'express-serve-static-core' {
    interface  Request {
        user: {
            userId: string,
            session: string
        }
    }
}


export const deserailzeUser = async (req: Request, res: Response, next: NextFunction) => {

    let accessToken: string | undefined = undefined;
    let refreshToken: string | undefined = undefined;


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

    const { expired, decoded } = decode(accessToken, process.env.JWT_AccessToken as string);

    if (decoded) {
        req.user = decoded;

        return next();
    }


    if (expired && refreshToken) {

        const newAccessToken = await refreshAccessToken({ refreshToken });

        if (newAccessToken) {

            // Add the new access token to the response header
            res.setHeader("x-access-token", newAccessToken);

            const { decoded } = decode(newAccessToken, process.env.JWT_AccessToken as string);

            if (decoded) {
                req.user = decoded;
            }
        }

        return next();
    }

    return next();
}