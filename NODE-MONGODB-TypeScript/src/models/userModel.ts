import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs'

export interface IAuthUser extends Document {
    email: string;
    name: string;
    password: string;
    confirmPassword?: string | undefined; // As after hashing confirmPassword will be made undefined
}


export interface IUserDocument extends IAuthUser {
    createdAt: Date;
    updatedAt: Date;
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>
}

const userSchema = new Schema<IUserDocument>({
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "Please enter your confirm password"],
        select: false,
        validate:{
            // The validator function works only for save() or create() as "this" works only when we create a new document.
            // We should not use arrow function for validator otherwise we cannot use "this to access the values"

            validator:function(val: string):boolean{
                // return val===(this as IUserDocument).password 

                return val===(<IUserDocument>this).password 
            },
            message:"Password and Confirm Password does not match"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});


userSchema.pre('save', async function (next) {

    let user = this as IUserDocument

    if (!user.isModified()) return next();

    user.password = await bcrypt.hash(user.password, 12);


    user.confirmPassword = undefined; // Making it undefined and hence will not be saved in MongoDB.

    next();
})



userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return bcrypt.compare(candidatePassword, userPassword);
}

let Users = mongoose.model<IUserDocument>("Users", userSchema);

export default Users