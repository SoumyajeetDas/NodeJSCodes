const express = require('express');
const dotenv = require('dotenv');
const app = require('./src/app');

const dbConnection = require('./config/database');


dbConnection()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  }).catch(err => {
  console.error('Database connection failed:', err);
});