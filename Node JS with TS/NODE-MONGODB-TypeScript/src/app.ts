import express,{Request, Response} from 'express';
import userRouter from './routes/userRouter'

const app = express();


app.use('/api/v1/users',userRouter);


app.get('/api/v1/healthcheck',(req:Request, res:Response)=>{
    res.status(200).send({
        status:"200 OK"
    })
})

app.use("*", (req:Request,res:Response)=>{
    res.status(404).send({
        status:"404 Not found",
        message:"No Routes found"
    })
})


export default app;