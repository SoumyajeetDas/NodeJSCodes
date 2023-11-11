const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')




exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    if(reviews.length == 0) {
        return next(new AppError('No reviews found',400));
    }
    else{
        res.status(200).send({
            status:"200 OK",
            data:{
                reviews
            }
        })
    }
});


// createReview is used by two controller : reviewController & tourController.
exports.createReview = catchAsync(async (req, res, next) => {

    // For reviewController post request the body.tour will be present in the request so the control will not enter this if block.
    // For tourController post request there will be nothing in the body so the control will automatically enter the the if block
    
    if(!req.body.tour){
        

        req.body.tour =  req.params.tourId;

    }

    // When we login we have the user in the request so we can access the id of the user directly.
    if(!req.body.user){
        req.body.user = req.user._id;
    }

    // The request body will now match with the Review Schema :
    // {
    //     review: req.body.review,
    //     rating: req.body.rating,
    //     tour:req.body.tour,
    //     user: req.user.id
    // }
    const newReview = await Review.create(req.body);

    res.status(201).send({
        status:"201 Created",
        data:{
            review:newReview
        }
    })
})