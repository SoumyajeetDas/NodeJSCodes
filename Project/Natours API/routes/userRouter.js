const express = require('express');

const userController = require('./../controller/userController')

const authController = require('./../controller/authController')

const router = express.Router();

const mongoSanitize = require('express-mongo-sanitize');



// Middleware

router.use(express.json()) 


// Prevents from No Sql Injections
router.use(mongoSanitize());



/*************Route Methods which is also a Middleware***************/



//Authentication Router
router
.post("/signup",authController.signup)
.post("/login",authController.login)
.post("/forgotPassword",authController.forgotPassword)
.post("/resetPassword/:token",authController.resetPassword) // This will update password when the user is not logged in
.patch("/updatePassword",authController.protect,authController.updatePassword) // This wil update Password when the user is logged in
// authController.protect checks if the user is logged in 



// User Router 

// Middelware runs in sequence. As all the router down will use authController.protect and restrctTo() so written here. 
// So the router above this will not get this authController.protect and restrictTo() but all the routers below this will use 
// authController.protect and restrictTo() then the designated middleware will be executed.
// First authController.protect will run and then restrictTo() will be executed as it is Middleware Chaining
router.use(authController.protect,authController.restrictTo('admin'))



router
.route("/")
.get(userController.getAllUsers) // The first middleware checks if the user is authorized or not with JWT




router
.patch("/updateUser",userController.updateUser)
.delete("/deleteUser",userController.deleteUser)
// authController.protect checks if the user is logged in 



module.exports=router;