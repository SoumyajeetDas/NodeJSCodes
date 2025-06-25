const express = require('express');
const profileRouter = require('./routes/profileRouter');
const authRouter = require('./routes/authRouter');
const requestRouter = require('./routes/requestRouter');
const userRouter = require('./routes/userRouter'); // Assuming you have a userRouter
const cookieParser = require('cookie-parser');


const app = express();

app.use(express.json()); // Body parser middleware to parse JSON request bodies
app.use(cookieParser()); // Cookie parser middleware to parse cookies

app.use('/api/v1/auth', authRouter); // Authentication routes
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/request', requestRouter);
app.use('/api/v1/user', userRouter); // User-related routes

app.all(/(.*)/, (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;