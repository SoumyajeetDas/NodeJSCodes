const APIFilter = require('./../utils/apiFeatures')
const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')



/**************** Handler Function or Route Handlers for File System ***********************************/


//const tours = JSON.parse(fs.readFileSync(path.join(__dirname, '../dev-data', 'data', 'tours-simple.json'))) // JSON.parse converts a JSON to JS Object


// exports.getAllTours = (req, res) => {


//     res.status(200).send({
//         status: "Success 200 OK",
//         result: tours.length,
//         data: {
//             tours
//         }
//     })
// }


// exports.getTour = (req, res) => {
//     const tour = tours.find(data => data.id === req.params.id * 1) //req.params.id is in string so to convert into Number we have to do req.params.id*1

//     if (!tour) {
//         res.status(400).send({
//             status: "Failed 400 Bad Request",
//             message: "Invalid Id"
//         })
//     }
//     else {
//         res.status(200).send({
//             status: "Success 200 OK",
//             data: {
//                 tour
//             }
//         })
//     }
// }



// exports.updateTour = (req, res) => {

//     const tour = tours.find(data => data.id === req.params.id * 1) //req.params.id is in string so to convert into Number we have to do req.params.id*1

//     if (!tour) {
//         res.status(400).send({
//             status: "Failed 400 Bad Request",
//             message: "Invalid Id"
//         })
//     }
//     else {
//         const index = tours.findIndex(data => data.id === req.params.id * 1);

//         tours[index] = {
//             ...tours[index],
//             ...req.body
//         }

//         fs.writeFile(path.join(__dirname, '../dev-data', 'data', 'tours-simple.json'), JSON.stringify(tours), err => {
//             res.status(201).send({
//                 status: "Successfuly Updated",
//                 data: {
//                     tour:tours[index]
//                 }
//             })
//         });
//     }
// }



// exports.addTour = (req, res) => {
//     const newTour = {
//         id: tours.length,
//         ...req.body
//     }
//     tours.push(newTour);

//     fs.writeFile(path.join(__dirname, '../dev-data', 'data', 'tours-simple.json'), JSON.stringify(tours), err => {
//         res.status(201).send({
//             status: "Success 201 Created",
//             data: {
//                 newTour
//             }
//         })
//     })
// }


/**************** Handler Function or Route Handlers for DB System ***********************************/



// This will act as middleware and it puts the required data in the query part of the request which will then enter the playWithFilter()
exports.aliasTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}

// body.check Handler Function will be used for Param Middleware
// exports.bodyCheck = (req, res, next) => {

//     if (JSON.stringify(req.body) === "{}") { // Way to check if the request object is empty
//         console.log("In BodyCheck")
//         return res.send({
//             status: "400 Bad Request",
//             message: "Body Not Found"
//         })
//     }

//     else {
//         next();
//     }
// }

exports.getAllTours = catchAsync(async (req, res, next) => {
    // try {
    //     const tours = await Tour.find();
    //     console.log(await Tour.findOne())

    //     if (tours.length == 0) {
    //         res.status(400).send({
    //             status: "400 Bad Request",
    //             message: "No tour information"
    //         })
    //     }
    //     else {
    //         res.status(200).send({
    //             status: "200 OK",
    //             data: {
    //                 tours
    //             }
    //         })
    //     }


    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send({
    //         status: "500 Internal Server Error",
    //         message: "Could not fetch tour information"
    //     })
    // }


    const tours = await Tour.find();

    if (tours.length == 0) {
        // res.status(400).send({
        //     status: "400 Bad Request",
        //     message: "No tour information"
        // })


        return next(new AppError("No Tour information", 400))
    }
    else {
        res.status(200).send({
            status: "200 OK",
            length: tours.length,
            data: {
                tours
            }
        })
    }

})




exports.getTour = catchAsync(async (req, res, next) => {
    // try {
    //     const tour = await Tour.findById(req.params.id);

    //     if (!tour) {
    //         res.status(400).send({
    //             status: "400 Bad Request",
    //             message: "Could not find tour information"
    //         })
    //     }
    //     else {
    //         res.status(200).send({
    //             status: "200 OK",
    //             data: {
    //                 tour
    //             }
    //         })
    //     }


    // } catch (err) {
    //     res.status(500).send({
    //         status: "500 Internal Server Error",
    //         message: "Could not fetch Tour"
    //     })
    // }



    /********************************Query Populating****************************************** */


    // We don't need the below query we have added that already in Query Middleware for Tours


    // const tour = await Tour.findById(req.params.id).populate('guides');
    // const tour = await Tour.findById(req.params.id).populate({
    //     path:'guides',
    //     select:'-__v'
    // });



    const tour = await Tour.findById(req.params.id).populate({
        path: 'reviews',
        select: 'review -tour -user'
    })



    if (!tour) {
        // res.status(400).send({
        //     status: "400 Bad Request",
        //     message: "Could not find tour information"
        // })

        return next(new AppError("Could not find tour information", 400))
    }
    else {
        res.status(200).send({
            status: "200 OK",
            data: {
                tour
            }
        })
    }
})



// Checking Patch with findByIdAndUpdate. We can also do the same with findOneAndUpdate, updateOne, updateMany.
exports.patchUpdateTour = catchAsync(async (req, res, next) => {

    // try {


    //     const tour = await Tour.findById(req.params.id);

    //     if (!tour) {
    //         res.status(400).send({
    //             status: "400 Bad Request",
    //             message: "No tour found"
    //         })
    //     }
    //     else {
    //         // By findByIdAndUpdate
    //         const updatedTour = await Tour.findByIdAndUpdate(req.params.id, { $set: req.body },
    //             {
    //                 new: true,
    //                 runValidators: true
    //             }
    //         )

    //         // By findOneAndUpdate
    //         // const updatedTour = await Tour.findOneAndUpdate({_id:req.params.id}, {$set:req.body},
    //         //     {
    //         //         new: true,
    //         //         runValidators: true
    //         //     }
    //         // )

    //         res.status(200).send({
    //             status: "200 OK",
    //             data: {
    //                 tour: updatedTour
    //             }
    //         })
    //     }


    // } catch (err) {
    //     res.status(400).send({
    //         status: "400 Bad Request",
    //         message: err
    //     })
    // }


    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        // res.status(400).send({
        //     status: "400 Bad Request",
        //     message: "No tour found"
        // })

        return next(new AppError("No Tour Found", 400))
    }
    else {
        // By findByIdAndUpdate
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        )

        // By findOneAndUpdate
        // const updatedTour = await Tour.findOneAndUpdate({_id:req.params.id}, {$set:req.body},
        //     {
        //         new: true,
        //         runValidators: true
        //     }
        // )

        res.status(200).send({
            status: "200 OK",
            data: {
                tour: updatedTour
            }
        })
    }

})



// Checking Put with updateOne. We can also do the same with findOneAndUpdate, findByIdAndUpdate, updateMany.
exports.putUpdateTour = catchAsync(async (req, res, next) => {

    // try {
    //     const tour = await Tour.findById(req.params.id);

    //     if (!tour) {
    //         res.status(400).send({
    //             status: "400 Bad Request",
    //             message: "No tour found"
    //         })
    //     }

    //     else {
    //         const result = await Tour.updateOne({ _id: req.params.id }, { $set: req.body }, { runValidators: true });

    //         if (result.acknowledged && result.modifiedCount > 0) {


    //             res.status(200).send({
    //                 status: "200 OK",
    //                 message: "Data Got Updated"
    //             })
    //         }
    //         else {

    //             res.status(400).send({
    //                 status: "400 Bad Request",
    //                 "message": "Not Updated as already present"
    //             })
    //         }
    //     }

    // }
    // catch (err) {
    //     console.log(err)
    //     res.status(500).send({
    //         status: "500 Internal Server Error",
    //         "message": "Could not Update Tour"
    //     })
    // }

    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        // res.status(400).send({
        //     status: "400 Bad Request",
        //     message: "No tour found"
        // })

        return next(new AppError("No Tour Found", 400))
    }

    else {
        const result = await Tour.updateOne({ _id: req.params.id }, { $set: req.body }, { runValidators: true });

        if (result.acknowledged && result.modifiedCount > 0) {


            res.status(200).send({
                status: "200 OK",
                message: "Data Got Updated"
            })
        }
        else {

            // res.status(400).send({
            //     status: "400 Bad Request",
            //     "message": "Not Updated as already present"
            // })

            return next(new AppError("Not Updated as already present", 400))
        }
    }
})


// const catchAsync = fn => {

//     return (req,res,next) => { 
//         fn(req,res,next).catch(err => next(err))
//     }

// }


// addTour consist of the total middleware returned by catchAsync. The actual look of addTour is given below.

// addTour = (req, res, next) => {
//     async(req, res, next){.....}.catch(err => next(err))
// }


exports.addTour = catchAsync(async (req, res, next) => {

    // try {
    //     // const newTour = new Tour(req.body);
    //     // let result = await newTour.save();

    //     const newTour = await Tour.create(req.body); // Shortcut of above two lines

    //     res.status(201).send({
    //         status: '201 Created',
    //         data: {
    //             tour: newTour
    //         }
    //     })
    // } catch (err) {
    //     res.status(500).send({
    //         status: "500 Internal Server Error",
    //         message: err.message
    //     })
    // }



    // const newTour = new Tour(req.body);
    // let result = await newTour.save();

    const newTour = await Tour.create(req.body); // Shortcut of above two lines

    res.status(201).send({
        status: '201 Created',
        data: {
            tour: newTour
        }
    })
})


exports.deleteTour = catchAsync(async (req, res, next) => {
    // try {
    //     // const tour = await Tour.findById(req.params.id);

    //     const tour = await Tour.findById(req.params.id);

    //     if (!tour) {
    //         res.status(400).send({
    //             status: "400 Bad Request",
    //             message: "Tour Item not found"
    //         })
    //     }

    //     else {

    //         //await Tour.findOneAndDelete({_id:req.params.id})

    //         await Tour.findByIdAndDelete(req.params.id);

    //         res.status(204).send({
    //             status: "204 No Content",
    //             data: null
    //         })



    //         /****************** By deleteOne **********************/

    //         // let result = await Tour.deleteOne({ _id: req.params.id })

    //         // if (result.acknowledged && result.deletedCount > 0) {
    //         //     res.status(204).send()
    //         // }
    //         // else {
    //         //     result.status(400).send({
    //         //         status: "400 Bad Request",
    //         //         message: "Nothing got deleted"
    //         //     })
    //         // }

    //         /*****************************************************/

    //     }
    // }
    // catch (err) {
    //     res.status(500).send({
    //         status: "500 Internal Server Error",
    //         message: "Could not delete"
    //     })
    // }


    // const tour = await Tour.findById(req.params.id);

    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        // res.status(400).send({
        //     status: "400 Bad Request",
        //     message: "Tour Item not found"
        // })
        return next(new AppError("Tour Item not found", 400))

    }

    else {

        //await Tour.findOneAndDelete({_id:req.params.id})

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).send({
            status: "204 No Content",
            data: null
        })



        /****************** By deleteOne **********************/

        // let result = await Tour.deleteOne({ _id: req.params.id })

        // if (result.acknowledged && result.deletedCount > 0) {
        //     res.status(204).send()
        // }
        // else {
        //     result.status(400).send({
        //         status: "400 Bad Request",
        //         message: "Nothing got deleted"
        //     })
        // }

        /*****************************************************/

    }
})




exports.playWithFilter = catchAsync(async (req, res, next) => {

    // try {
    //     let features = new APIFilter(Tour, req.query);

    //     features
    //         .filter()
    //         .sort()
    //         .limiting()
    //         .pagination();



    //     // Executing the Query
    //     const tour = await features.query;

    //     res.status(200).send({
    //         status: "200 OK",
    //         lengths: tour.length,
    //         data: {
    //             tour
    //         }
    //     })
    // }
    // catch (err) {
    //     res.status(500).send({
    //         status: "500 Internal Server Error",
    //         message: err.message
    //     })
    // }

    let features = new APIFilter(Tour, req.query);

    features
        .filter()
        .sort()
        .limiting()
        .pagination();



    // Executing the Query
    const tour = await features.query;

    res.status(200).send({
        status: "200 OK",
        lengths: tour.length,
        data: {
            tour
        }
    })

})


// Aggregate
exports.getTourStats = catchAsync(async (req, res, next) => {


    // try {
    //     const stats = await Tour.aggregate([
    //         { $match: { ratingsAverage: { $gte: 4.5 } } },
    //         {
    //             $group: {
    //                 _id: { $toUpper: '$difficulty' },
    //                 avgRating: { $avg: '$ratingsAverage' },
    //                 avgPrice: { $avg: '$price' },
    //                 minPrice: { $min: '$price' },
    //                 maxPrice: { $max: '$price' }
    //             }
    //         },
    //         {
    //             $sort: { avgPrice: 1 }
    //         }
    //         // {
    //         //     $match:{_id:{$ne:'EASY'}}
    //         // }
    //     ]);

    //     res.status(200).send({
    //         status: "200 OK",
    //         length: stats.length,
    //         data: {
    //             stats
    //         }
    //     })
    // }
    // catch (err) {
    //     res.status(500).send({
    //         status: "500 Internal Server Error",
    //         message: err.message
    //     })
    // }

    const stats = await Tour.aggregate([
        { $match: { ratingsAverage: { $gte: 4.5 } } },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
        // {
        //     $match:{_id:{$ne:'EASY'}}
        // }
    ]);

    res.status(200).send({
        status: "200 OK",
        length: stats.length,
        data: {
            stats
        }
    })
})


// Aggregate
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    // try {
    //     const year = req.params.year * 1;

    //     const plans = await Tour.aggregate([
    //         {
    //             $unwind: '$startDates'
    //         },
    //         {
    //             $match: {
    //                 startDates: {
    //                     $gte: new Date(`${year}-01-01`),
    //                     $lte: new Date(`${year}-12-31`),
    //                 }
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: { $month: '$startDates' },
    //                 numTotalTours: { $sum: 1 },
    //                 tours: { $push: '$name' }
    //             }
    //         },
    //         // {
    //         //     $addFields:{
    //         //         month:'$_id'
    //         //     }
    //         // },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 month: '$_id'
    //             }
    //         }
    //     ]);

    //     res.status(200).send({
    //         status: "200 OK",
    //         length: plans.length,
    //         data: {
    //             plans
    //         }
    //     })
    // }
    // catch (err) {
    //     res.status(500).send({
    //         status: "500 Internal Server Error",
    //         message: err.message
    //     })
    // }


    const year = req.params.year * 1;

    const plans = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTotalTours: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        // {
        //     $addFields:{
        //         month:'$_id'
        //     }
        // },
        {
            $project: {
                _id: 0,
                month: '$_id'
            }
        }
    ]);

    res.status(200).send({
        status: "200 OK",
        length: plans.length,
        data: {
            plans
        }
    })
})



// Geospatial Querying


// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/400/center/-118.470440,33.997499/unit/mi
exports.getTourWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;

    const [lat, lng] = latlng.split(',');

    // The radius should be radians.
    // Radians is calculated by dividing the distance/earth-Radius
    // earth-Radius in miles : 3963.2
    // earth-Radius in km : 6378.1
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if (!lat || !lng) {
        return next(new AppError("Please provide latitude and longitude in the format lat,long", 400))
    }


    // The query is telling find the Tours where the start Location is within the given radius where the center point is the 
    // latitude and longitude. 
    // $geoWithin allows us describe the geospatial data for the given shape. Here the shape is circle. 
    // centerSphere helps to create the sphere with given long and lat and radius and find out the places within the sphere

    // We have also added a indexing for this query. Check the tourModel. tourSchema.index({startLocation:'2dsphere'})
    const tours = await Tour.find({
        startLocation: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    })

    res.status(200).send({
        status: "200 OK",
        length: tours.length,
        data: {
            tours
        }
    })
})



// FInd the distance within given point and the starting Point
exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;

    const [lat, lng] = latlng.split(',');


    if (!lat || !lng) {
        return next(new AppError("Please provide latitude and longitude in the format lat,long", 400))
    }

    const multiplier = unit==='mi'?0.000621371:0.001

    const tours = await Tour.aggregate([{

        // For Geosptial Aggregation the starting should be always $geoNear.
        // To work with $geoNear the field/fields. on which we are working must be index otherwise it will not work.
        // Like here it is the startLocation
        $geoNear: {

            // The value of the field near is always the GeoJson Data.
            // near field basically tells the point from where we want to measure the distance upto startLocation
            near: {
                type: 'Point',
                coordinates: [lng * 1, lat * 1]
            },


            // It mentions the fieldname where the distance calculated will be stored.
            distanceField: 'distance',

            // distanceMultiplier will multiply the distance with the value in the multiplier and will convert into wither km or miles
            distanceMultiplier: multiplier 
        }
    },
    {
        $project: {
            name: 1,
            distance: 1,
            location : '$startLocation.description'
        }
    }
    ])

    res.status(200).send({
        status: "200 OK",
        length: tours.length,
        data: {
            tours
        }
    })
})