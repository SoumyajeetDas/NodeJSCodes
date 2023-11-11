// const fs = require('fs');

// const path = require('path');

const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')


// Handler Function or Route Handlers

exports.getAllUsers = catchAsync(async(req, res,next) => {

    const users = await User.find()

    if(users.length==0){
        return next(new AppError("No User information",400))
    }

    else{
        res.status(200).send({
            status: "Success 200Ok",
            data:{
                users
            }
        })
    }
    
})


exports.getUser = (req, res) => {
    res.status(200).send({
        status: "Success 200 Created",
        data:{

        }
    })
}

exports.updateUser = catchAsync(async(req, res,next) => {


    // To prevent update of password 
    if(req.body.password || req.body.confirmpassword){
        return next(new AppError("This route is not for Password Updates",400));
    }

    // To filter out only name and email. If users sends role the data will not get updated.
    const filteredObj = {
        name:req.body.name,
        email:req.body.email
    }

    // Find the user and update it
    const user = await User.findByIdAndUpdate(req.user.id, filteredObj , {
        new:true,
        runValidators:true
    });



    res.status(200).send({
        status: "Success 200 Ok",
        data:{
            user
        }
    })
});

exports.deleteUser = catchAsync(async(req, res, next) => {

    await User.findByIdAndDelete(req.user.id);

    res.status(200).send({
        status: "Success 200 Ok",
        message: "Data got deleted"
    })
});



