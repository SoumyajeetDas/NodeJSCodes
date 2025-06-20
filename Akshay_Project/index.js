const express = require('express');
const dotenv = require('dotenv');
const app = require('./src/app');

dotenv.config({ path: '../.env' });

const dbConnection = require('./config/database');


dbConnection()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  }).catch(err => {
  console.error('Database connection failed:', err);
});