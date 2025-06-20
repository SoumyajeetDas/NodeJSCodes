const express = require('express');
const userRouter = require('./routes/userRouter');


const app = express();

app.use('/api/v1/user', userRouter);

app.all(/(.*)/, (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;