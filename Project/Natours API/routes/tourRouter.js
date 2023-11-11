const express = require('express');

const tourController = require('./../controller/tourController')

const router = express.Router();

const authController = require('./../controller/authController')

// const reviewController = require('./../controller/reviewController')

const reviewRouter = require('./reviewRouter')

const mongoSanitize = require('express-mongo-sanitize');





/************Middleware*************/
router.use(express.json()) 


// Nested Routing
// As tourRouter is calling the reviewRoute Middleware so this is called Nested Routing.
// mergeParams:true plays very imp role which u will be able to see in the reviewRouter express.Router()

// Eg of Nested Routing looks like:
// Post /:tourId/reviews
// Get /:tourId/reviews
// Get /:tourId/reviews/:reviewId
router.use("/:tourId/reviews",reviewRouter)

router.use(mongoSanitize()); // Always use mongoSanitize() after express.json() or body pareser, bcoz after post method, the 
                            // user has completed sending the data and then form the field value the $ and . need to removed.




// Route Methods which is also a Middleware

router
.route("/")
.get(tourController.getAllTours)
// .post(tourController.bodyCheck ,tourController.addTour) We don't need the bodyCheck after we have the mongoose installed
.post(authController.protect, authController.restrictTo("admin","guide-lead"),tourController.addTour)



router
.route("/:id")
.get(tourController.getTour)
// .patch(tourController.bodyCheck, tourController.updateTour) We don't need the bodyCheck after we have the mongoose installed
.patch(authController.protect, authController.restrictTo('admin','guide-lead'),tourController.patchUpdateTour)
.put(authController.protect, authController.restrictTo('admin','guide-lead'),tourController.putUpdateTour)
.delete(authController.protect, authController.restrictTo('admin','guide-lead'), tourController.deleteTour)
// authController.protect checks if the user is logged in and authController.restrictTo() checks if user belongs to the particular
// role or not.



/*************************Geospatial Routes*******************************/

// /tours-within/233/center/-118.470440,33.997499/unit/mi
router
.route("/tours-within/:distance/center/:latlng/unit/:unit")
.get(tourController.getTourWithin)


// /distances/33.997499,-118.470440/unit/km
router
.route("/distances/:latlng/unit/:unit")
.get(tourController.getDistances)

// aliasTours will be called first which changes the query part of the request and after thet the request goes to the playWithFilter Middleware
// This concept is called Chaining of Middleware
router.route("/cheap-5-tours").get(tourController.aliasTours,tourController.playWithFilter)





// Checking the Filtering Concepts
router
.route("/play")
.get(tourController.playWithFilter)

// http://localhost:3000/api/v1/tours/play?fields=name,duration,difficulty,price&difficulty=easy&sort=duration,ratingAverage&duration[gte]=5

// http://localhost:3000/api/v1/tours/play?page=1&limit=3



router
.route("/getTourStats")
.get(tourController.getTourStats);



router
.route("/getmonthlyplans/:year")
.get(tourController.getMonthlyPlan);






// This approach of nesting is not good as there will be two post method for the same review and that results in redundant data.
// So we use advanced express. 

// router
// .route("/:tourId/reviews")
// .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
// authController.protect checks if the user is logged in and authController.restrictTo() checks if user belongs to the particular
// role or not.


module.exports=router;
