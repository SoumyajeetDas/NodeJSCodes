import { NextFunction, Request, Response } from "express"

// Module Augmentation
declare module 'express-serve-static-core' {
    interface Request {
        user: {
            userId:string,
            session:string
        }
    }
    
}


export const requireUser = async(req:Request, res:Response, next:NextFunction)=>{

    const userId = req.user.userId;

    if(!userId){
        return res.status(403).send({
            status:"403 Forbidden",
            message:"You are not unauthorized"
        })
    }

    return next();
}