const express = require('express');


// mergeParams:true is used for Nested Routing. Here tourController is sending some params and for accessing the params the mergeParams
// is used. By default any router will have the access to their specefic routes. But here route from reviewRoute is been called from 
// tourRoute and if we have not mentioned that it could not access the params.
const router = express.Router({mergeParams: true});

const reviewController = require('./../controller/reviewController');

const authController = require('./../controller/authController')


router.use(express.json())


router
.route("/")
.get(reviewController.getAllReviews)
.post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
// authController.protect checks if the user is logged in and authController.restrictTo() checks if user belongs to the particular
// role or not.


module.exports = router;