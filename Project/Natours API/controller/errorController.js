const AppError = require('./../utils/appError')


const sendErrorDev = (err, res) => {
    res.status(err.statusCode).send({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}


const sendErrorProd = (err, res) => {


    // Operational Error which should be shown to the client
    if (err.isOperational) {
        res.status(err.statusCode).send({
            status: err.status,
            message: err.message
        })
    }

    // Non Operational Error which cannot be shown to the client like programming error or other unknown error
    else {
        res.status(500).send({
            status: "Error",
            message: "Something went very wrong"
        })
    }

}


const handleCastErrorDb = err => {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

const handleDuplicateFieldsDB = err => {
    return new AppError(`Duplicate name please use another value`, 400);
}

const handleValidationDb = err => {
    let error = Object.values(err.errors).map(val => val.message)
    return new AppError(`Invalid Input Data for ${error.join(', ')}`, 400);
}

const handleJWTError = err => {
    return new AppError(`Invalid Token please login`, 401);
}

const handleJWTExpiredError = err => {
    return new AppError(`Your token has expired please login again`, 401);
}


module.exports = (err, req, res, next) => {   // On seeing the paramter(err,req,res,next) express will automatically understand it is a 
    // Global Error Handler



    err.status = err.status || "500 Internal Server Error";

    err.statusCode = err.statusCode || 500;


    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res)
    }
    else if (process.env.NODE_ENV === "production") {

        let error = { ...err, message: err.message, name: err.name};

        //Handling Invalid DB Id
        if (error.name === "CastError") {
            error = handleCastErrorDb(error)
        }

        //Duplicate DB Fields
        if (error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }

        // Mongoose Validation Errors
        if (error.name === "ValidationError") {

            error = handleValidationDb(error);
        }

        if (error.name === "JsonWebTokenError") {
            error = handleJWTError(error)
        }

        if (error.name === "TokenExpiredError") {
            error = handleJWTExpiredError(error)
        }


        sendErrorProd(error, res)
    }

}