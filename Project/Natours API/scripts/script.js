const mongoose = require('mongoose');
const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv');



//Configuring the required environment into Node JS which is present in config.env file.
dotenv.config({path:'./config.env'})


//Connecting DB
const db = process.env.DATABASE.replace("<Password>",process.env.DATABASE_PASSWORD);


mongoose.connect(db).then(()=>{
    console.log("Database connection established!!")
})



const tours = JSON.parse(fs.readFileSync(path.join(__dirname, '../dev-data', 'data', 'tours.json'))) // JSON.parse converts a JSON to JS Object

const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../dev-data', 'data', 'users.json')))

const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../dev-data', 'data', 'reviews.json')))

const importData = async()=>{
    try{
        await Tour.create(tours)
        await Review.create(reviews)
        await User.create(users, {validateBeforeSave:false}) // validaytionBeforeSave is used to skip confirmPassword part

        console.log("Documents Added")
    }
    catch(err){
        console.log(err.message)
    }
    process.exit()
}



const deleteData = async()=>{
    try{
        await Tour.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();

        console.log("Documents Deleted");
    }
    catch(err){
        console.log(err.message)
    }
    process.exit();
}



if(process.argv[2]=="--import"){
    importData();
}
else if(process.argv[2]=="--delete"){
    deleteData();
}



// console.log(process.argv)