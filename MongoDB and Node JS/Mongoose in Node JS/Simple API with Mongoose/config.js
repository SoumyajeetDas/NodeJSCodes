const mongoose = require('mongoose');


const database = "CWHBlog";
const url = "mongodb://localhost:27017/"+database;


module.exports = url;


mongoose.connect(url)