import mongoose, {Document, Schema} from "mongoose";
import { IUserDocument } from "./userModel";

export interface ISessionDocument extends Document {
    user : IUserDocument["_id"]; // We could have also written string but it will help developers to understand that we will be storing 
                                //the id
    valid:boolean,
    userAgent:string,
    createdAt:Date,
    updatedDate:Date
}

const sessionSchema = new Schema<ISessionDocument>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:[true,"Session must belong to an user"]
    },
    valid:{
        type:Boolean,
        default:true
    },
    userAgent:String,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedDate:{
        type:Date,
        default:Date.now()
    }
});

const Session = mongoose.model<ISessionDocument>("Sessions",sessionSchema);


export default Session;