const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.deleteOne = Model =>catchAsync(async (req, res,next) => {
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

    const doc = await Model.findById(req.params.id);

    if (!doc) {
        // res.status(400).send({
        //     status: "400 Bad Request",
        //     message: "Tour Item not found"
        // })
        return next(new AppError("Item not found",400))
        
    }

    else {

        //await Tour.findOneAndDelete({_id:req.params.id})

        await Model.findByIdAndDelete(req.params.id);

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

