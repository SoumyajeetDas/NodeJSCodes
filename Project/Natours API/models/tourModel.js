
const mongoose = require('mongoose');
const Reviews = require('./reviewModel')


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the tour name"],
        unique: true,
        trim: true,
        maxlength: [40, "Tour name must not exceed 40 characters"],
        minlength: [10, "Tour Name should be more than 10 characters"]
    },
    duration: {
        type: Number,
        required: [true, "Please enter the duration of the tour"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "Please enter the Group Size"]
    },
    difficulty: {
        type: String,
        required: [true, "Please enter the difficulty of the tour"],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: "Difficulty should be between easy, medium, difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1.0, "Rating must be 1.0 or above"],
        max: [5.0, "Rating must not exceed 5.0"]
    },
    ratingsQuality: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "Please enter the tour price"],
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, "Please enter the tour summary"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "Please provide the cover image of tour"]
    },
    image: [String],
    createdAt: {
        type: Date,
        default: Date.now // It will return the time in milliseconds and Mongo will automatically convert to today's date
    },
    startDates: [Date], // Here we will pass the date as say "2022-06-19" and Mongo will automatically parse that into date.

    // Geospatial Data
    startLocation: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number], // [Longitude, Latitude]
        address: String,
        description: String
    },

    locations: [{
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinate: [Number], // [Longitude, Latitude]
        address: String,
        description: String,
        day: Number
    }],


    // Child Referencing

    // Inside guides thare can be many User ids as {type: ... , ref : ...} it is kept in [].
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users' // This Users coming from user model which we exported : module.exports = Users
    }]

}, {
    // Virtual Properties


    // Any time toJSON is called on the Model you create from this Schema, it will include an 'id' field that matches the
    // _id field Mongo generates. SO in the o/p u will able to see id as well as _id
    toJSON: { virtuals: true },  // Each time data is outputted as JSON we want virtuals to be part of that output.
    toObject: { virtuals: true } // Each time data is outputted as Object we want virtuals to be part of that output.
});


// Geospatial Indexing
tourSchema.index({startLocation:'2dsphere'}) // For geospatial data if we have real points on the sphere we have to give index as 2dsphere


// Virtual Properties
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;  // this here points to the currently saved documents
});


// Virtual Populate
tourSchema.virtual('reviews',{
    ref: Reviews,  // For this model to be attached to ref we need to export require('./reviewModel'), otherwise not working
    foreignField:'tour', // Add the field name from the refernce model Reviews
    localField:'_id' // The localfield tells in which field of the cuurent collection the _id mentioned in the ref is present.
                    // Eg : _id in review is present in _id of the tourModel. 
})


/*****************************Mongoose Query Middleware***************************************/

// Query Populating
tourSchema.pre(/^find/, async function (next) {

    // this.populate('guides') You could have also written like this
    this.populate({
        path: 'guides',
        select: '-__v'
    });

    next(); // You can add or not add next() here as there is only one middleware
})



let Tours = mongoose.model('Tours', tourSchema);


module.exports = Tours;