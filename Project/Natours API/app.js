// The application configuration is present in one stand alone file.


const express = require('express');

const app = express();

const tourRouter = require('./routes/tourRouter')

const userRouter = require('./routes/userRouter')

const reviewRouter = require('./routes/reviewRouter')

const AppError = require('./utils/appError')

const globalErrorHandler = require('./controller/errorController')

const ratelimit = require('express-rate-limit')




// Global Middleware

// This limits after no. of requests gets exceeded from the same IP. It basically used to prevent from DDOS attack
const limiter = ratelimit({
    max:100, // There can be max 3 count form the same IP in 1hr mentioned in windowMs
    windowMs:60*60*1000, // The windowMs gives the time range in ms
    message : "Too many requests from this IP in 1hr. Please try 1hr later"
})




app.use("/api",limiter);



// Route Methods which is also a Middleware

// app
// .route("/api/v1/tours")
// .get(getAllTours)
// .post(addTour)



// app
// .route("/api/v1/tours/:id")
// .get(getTour)
// .patch(updateTour)


// app
// .route("/api/v1/users")
// .get(getAllUsers)
// .post(addUser)


// app
// .route("/api/v1/users/:id")
// .get(getUser)
// .patch(updateUser)
// .delete(deleteUser)








// Mounting the Route Handlers


app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);


// app.all takes all kind of requests like get, post, patch, delete and no need to mention specifically any Route Methods. It is generally used for 404 Error

app.all("*", (req, res, next) => {
    // res.status(404).send({
    //     status: '404 Not Found',
    //     message: `Cannot find ${req.originalUrl}`
    // });


    const err = new AppError(`Cannot find ${req.originalUrl}`, 404); // AppError is the custom Error class present in utils.



    next(err) // As next() contains paramter so it will go the Global Error Handler.

});


app.use(globalErrorHandler) // globalErrorHandler is present in errorController





module.exports = app;
