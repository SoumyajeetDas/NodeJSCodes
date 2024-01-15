import { Request, Response } from "express"
import Session from "../models/sessionModel";
import { createAccessToken, createSession, creatRefreshToken } from "../service/sessionService"
import { validatePassword } from "../service/userService";


interface IGetUserAuthInfoRequest extends Request {
    user: {
        userId:string,
        session:string
    }
}

export const createSessionHandler = async (req: Request,res: Response)=>{

    // Check if the request body is present
    if(!req.body || !req.body.email || !req.body.password){
        return res.status(400).send({
            status:"400 Bad Request",
            message: "Request body is not appropriate"
        })
    }


    // If present validate the email and password

    const {email, password} = req.body

    let user = await validatePassword(email,password);

    if(!user) {
        return res.status(400).send({
            status:"400 Bad Request",
            message: "Invalid username or password"
        })
    }



    // If valid email and password create the session.

    const session = await createSession(user._id, req.get("user-agent") || "");


    // Create access token 

    const accessToken = await createAccessToken({userId:user._id, session});


    // Create Refresh Token

    const refreshToken = await creatRefreshToken(session);

    return res.status(200).send({
        accessToken,
        refreshToken
    })

}



export const inValidSessionHandler = async(req:IGetUserAuthInfoRequest, res:Response)=>{

    if(!req || !req.user){
        return res.status(400).send({
            status:"400 Bad Request",
            message: "Request body is not appropriate"
        })
    }

    const sessionId = req.user.session;


    const newSession = await Session.findByIdAndUpdate(sessionId, {$set:{valid:false}},{
        new:true,
        runValidators:true
    });


    res.status(200).send({
        status:"200 OK",
        updatedSession:newSession
    });
    
}