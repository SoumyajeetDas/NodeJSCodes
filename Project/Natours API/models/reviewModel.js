const mongoose = require('mongoose')
// const Tour = require('./../models/tourModel')



const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review cannot be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    // Parent Referencing 

    // Here it will store only 1 tour.
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tours', // Model Name : module.exports = Tours;
        required: [true, "Review must belong to a Tour"]
    },

    // Parent Referencing 

    // Here it will store only 1 user.
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users', // Model Name : module.exports = Users;
        required: [true, "Review must belong to a User"]
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


reviewSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'user',
        select: 'name photo' // Will select only name and photo
    })

    next(); // You can add or not add next() here as there is only one middleware
});



/**********************Tried to create number of Ratings and Average Rating but failed !!******************************/


// Static method can able to access the whole model with 'this' keyword

// reviewSchema.statics.calcAverageRatings = async function (tourId) { 
//     const stats = await this.aggregate([
//         {
//             $match: { tour: tourId }
//         },
//         {
//             $group: {
//                 _id: '$tour',
//                 nRating: { $sum: 1 },
//                 avgRating: { $avg: '$rating' }
//             }
//         }
//     ]);




//     try {

//         await Tour.findByIdAndUpdate(tourId, {
//             ratingsQuality: stats[0].nRating,
//             ratingsAverage: stats[0].avgRating
//         })
//     }

//     catch (err) {
//         console.log(err);
//     }

// }


// reviewSchema.post('save', function () {
//     this.constructor.calcAverageRatings(this.tour._id)  // constructor gets the access on the Reviews Model over which the 
//                                                     //   static function will be called
// })

let Reviews = mongoose.model("reviews", reviewSchema);

module.exports = Reviews;