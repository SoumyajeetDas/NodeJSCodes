import { Request, Response } from 'express';
import { IAuthUser } from 'src/models/userModel';
import { createUser } from '../service/userService';



export const signup = async (req: Request, res: Response) => {

    try {
        if (!req.body) {
            return res.status(400).send({
                status: "400 Bad Request",
                message: "User credentials not present"
            })
        }


        const newUser: IAuthUser = await createUser(req.body);

        newUser.password = "";


        // const token = jwtToken(newUser._id);


        res.status(201).send({
            status: "201 Created successfully",
            // token,
            data: {
                user: newUser
            }
        })
    }

    catch(error:any){
        return res.status(500).send({
            status: "500 Internal Server Error",
            message:error.message
        })
    }
    
}