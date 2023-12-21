import jwt from 'jsonwebtoken';
import { ISessionDocument } from 'src/models/sessionModel';

export const decode = (token:string, secretkey:string)=>{
    try{

        // Here verify function synchronously verify the token
        const decoded  = jwt.verify(token,secretkey) as ({userId:string, session:string});

        return {valid:true, expired:false, decoded}
    }
    catch(err:any){
        return {
            valid:false, 
            expired:err.message === "jwt expired", 
            decoded:null
        }
    }
}