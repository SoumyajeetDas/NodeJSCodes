class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        console.log(message)
        this.statusCode = statusCode;
        this.status = `${statusCode}`==="404"?"404 Not Found":`${statusCode}`==="400"?"400 Bad Request":`${statusCode}`==="401"?"401 Unauthorized":"500 Internal Server Error";

        this.isOperational = true;
        

        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports = AppError;