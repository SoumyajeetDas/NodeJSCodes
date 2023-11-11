const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')
const { promisify } = require('util')
const crypto = require('crypto')


// Creating JWT Token and returning back
const jwtToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIn
    });
}




exports.signup = catchAsync(async (req, res, next) => {


    const newUser = await User.create(req.body)
    // We should not pass req.body as it will be a security breach. Whatever parameters we need should be specified separately. 
    // For eg: We have user model where role is default to user. If in the body user adds the role as Admin then create will take 
    // that req.body and will make user as Admin which is a security. But if we specify the field one by one within create then role
    // cannot be updated by the user.

    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     confirmpassword: req.body.confirmpassword,

    // });


    newUser.password = ""; // Password should not be shown to the client



    const token = jwtToken(newUser._id)     //Creating Token



    // Creating Cookie

    // Creating Cookie Options
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRESIn * 24 * 60 * 60 * 1000),

        // secure:true, // Sends cookies only when the request is encrypted like https

        httpOnly: true // This prevents any script in the browser like JS to access and modify the cookie from the Browser. 
        // The cookie can only be accessed by the server like the Express Server here when request is happening from he server.
    }

    if (process.env.NODE_ENV === 'production') {
        cookie.secure = true; // For production making the secure as true
    }

    res.cookie('jwt', token, cookieOptions)


    // Sending the token
    res.status(201).send({
        status: "201 Created successfully",
        token,
        data: {
            user: newUser
        }
    })
});



exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

  

    if (!email || !password)
        return next(new AppError("Please provide the email and password", 400))


    const user = await User.findOne({ email }).select("+password")


    // user returns a document and on that Instance Method is executed.
    if (user && await user.correctPassword(password, user.password)) { // Checking for either user exists or not or password is incorrect

        // Creating Token
        const token = jwtToken(user._id)

        // Creating Cookie

        // Creating Cookie Options
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRESIn * 24 * 60 * 60 * 1000),

            // secure:true, // Sends cookies only when the request is encrypted like https

            httpOnly: true // This prevents any script in the browser like JS to access and modify the cookie from the Browser. 
            // The cookie can only be accessed by the server like the Express Server here when request is happening from he server.
        }

        if (process.env.NODE_ENV === 'production') {
            cookie.secure = true; // For production making the secure as true
        }

        res.cookie('jwt', token, cookieOptions)


        // Sending the token
        res.status(200).send({
            status: "200 OK",
            token
        })
    }
    else {
        return next(new AppError("Please provide correct email and password", 401))
    }

})


// Checks whether the user is logged in or not
exports.protect = catchAsync(async (req, res, next) => {

    let token;

    console.log(req.headers.authorization);


    // Check if the token is present or not or is been passed in the header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        token = req.headers.authorization.split(' ')[1];

        
    }

    if (!token)
        return next(new AppError("You are not logged in !", 401))


    // Verification of Token if somebody manipulated or not or already expired
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);


    // After logging if the user gets deleted but the JWT Token does not get expired then can access the whole application untill 
    // and unless JWT gets expired and is a security Breach.
    // So check whether user is present in the DB or not.
    const currentUser = await User.findById(decoded.id);


    if (!currentUser)
        return next(new AppError("The user belonging to this token no longer exists", 401));


    req.user = currentUser; // This will be used by other middleware

    next();
})



// Checks for the user role.
exports.restrictTo = (...roles) => {


    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You are not authorized anough to access", 403))
        }
        next();
    }
}


exports.forgotPassword = catchAsync(async (req, res, next) => {

    // Get user based on the email address
    const user = await User.findOne({ email: req.body.email });

    if (!user)
        return next(new AppError("There is no user with that email address", 404))

    const resetToken = user.createPasswordResetToken(); // We get an unencrypted long string from instance method explained in model


    // The the passwordResetToken and passwordResetExpires instance Method in the userModel is not saved only instantiated so
    // with save() we are saving in the Mongo DB

    await user.save({ validateBeforeSave: false }); // Before save validation occurs, so to prevent that we use validateBeforeSave.
    // If not done will throw error as Password field is required.


    // Send Email 


    //req.protocol tells http/https  req.get('host')tells like localhost:4000
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;


    const message = `Forgot your Password? Please change the email in ${resetUrl}. \n If you didn't forgot your password, please 
    ignore this email`;



    // We have to use try catch here otherwise we will not able to set the user.passwordResetToken & user.passwordResetExpires
    // when any error will happen.
    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token will be valid for 10mins",
            message
        })

        res.status(200).send({
            status: "200 OK",
            message: "Token sent to email!"
        })
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new AppError("There was an error sending the email. Try again later!"), 500);
    }

})

// This is reset Password who are not logged in
exports.resetPassword = catchAsync(async (req, res, next) => {

    // Encrypting the token coming from the id in the paramter
    const hashToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')


    // After encrypting need to find whether the encrypted Token is present in passwordResetToken or not and whether the 
    // passwordResetExpires is greater than the current date or not.
    const user = await User.findOne({
        passwordResetToken: hashToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Token has been expired', 401))
    }

    user.password = req.body.password;
    user.confirmpassword = req.body.confirmpassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save(); // The password will automaticaaly get hashed when it see the save() by the pre middleware in the userModel.js


    // Send JWT Token for login
    const token = jwtToken(user._id)

    // Creating Cookie

    // Creating Cookie Options
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRESIn * 24 * 60 * 60 * 1000),

        // secure:true, // Sends cookies only when the request is encrypted like https

        httpOnly: true // This prevents any script in the browser like JS to access and modify the cookie from the Browser. 
        // The cookie can only be accessed by the server like the Express Server here when request is happening from he server.
    }

    if (process.env.NODE_ENV === 'production') {
        cookie.secure = true; // For production making the secure as true
    }

    res.cookie('jwt', token, cookieOptions)


    // Returning the token
    res.status(200).send({
        status: "200 OK",
        token
    })
})


// Update Password for login
exports.updatePassword = catchAsync(async (req, res, next) => {

    // Find for the user is present or not in the debugger


    // req.user.id we are getting from .protect() : req.user = currentUser;
    const user = await User.findById(req.user.id).select("+password");

    // Checking for the corrct password

    console.log(await user.correctPassword(req.body.passwordCurrent, user.password))
    if (await user.correctPassword(req.body.passwordCurrent, user.password)) {
        user.password = req.body.password;
        user.confirmpassword = req.body.confirmpassword


        // We could have used findByIdAndUpdate() rather than save(). But if we used that custom validation and pre middleware
        // wouldn't have worked
        await user.save();

        const token = jwtToken(user._id);

        // Creating Cookie

        // Creating Cookie Options
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRESIn * 24 * 60 * 60 * 1000),

            // secure:true, // Sends cookies only when the request is encrypted like https

            httpOnly: true // This prevents any script in the browser like JS to access and modify the cookie from the Browser. 
            // The cookie can only be accessed by the server like the Express Server here when request is happening from he server.
        }

        if (process.env.NODE_ENV === 'production') {
            cookie.secure = true; // For production making the secure as true
        }

        res.cookie('jwt', token, cookieOptions)


        // Sending the cookie
        res.status(200).send({
            status: "200 OK",
            token
        })
    }
    else {
        return next(new AppError("Please provide the correct current password", 400))
    }
})