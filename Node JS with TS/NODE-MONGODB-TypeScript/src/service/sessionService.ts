import Session, { ISessionDocument } from '../models/sessionModel';
import jwt from 'jsonwebtoken';
import Users, { IAuthUser } from '../models/userModel';
import { decode } from '../utils/jwtUtils';


export const createSession = async (userId: ISessionDocument["user"], userAgent: ISessionDocument["userAgent"]) => {
    const session = await Session.create({ user: userId, userAgent });

    return session;
}



export const createAccessToken = ({ userId, session }: { userId: ISessionDocument["user"], session: ISessionDocument }) => {

    return jwt.sign({ userId, session: session._id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_AccessToken
    });
}



export const creatRefreshToken = (session: ISessionDocument) => {

    return jwt.sign({ session }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_RefreshToken
    });
}




export const refreshAccessToken = async ({ refreshToken }: { refreshToken: string }) => {
    const { decoded } = decode(refreshToken, process.env.JWT_AccessToken as string)

    if(!decoded || !decoded.session) return false;


    // Get the session
    const session = await Session.findById(decoded.session);


    // Make sure that the sessio is still valid
    if(!session || !session.valid) return false;


    const user = await Users.findById(decoded.userId);

    if(!user) return false;

    const accessToken = createAccessToken({userId:user._id, session});


    return accessToken;
}