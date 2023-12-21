import Users, {IUserDocument} from '../models/userModel';
import jwt from 'jsonwebtoken';


export const createUser = async(input:IUserDocument)=>{
    try{
        return await Users.create(input);
    }
    catch(err:any){
        throw new Error(err);
    }
}



export const validatePassword = async(email:IUserDocument["email"], password:IUserDocument["password"])=>{
    const user  = await Users.findOne({email}).select("+password");

    if(!user) return false;

    const isValid = await user.correctPassword(password,user.password);

    if(!isValid) return false;

    user.password = "";

    return user;
}


