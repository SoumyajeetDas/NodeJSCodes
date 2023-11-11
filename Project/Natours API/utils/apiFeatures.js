
class APIFilter {
    constructor(query, querystring) {
        this.query = query
        this.querystring = querystring
    }

    filter() {
        //Filtering 
        const queryObj = { ...this.querystring }

        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        excludedFields.forEach(field => delete queryObj[field])


        //Advanced filtering


        // queryobj = {duration:{"gte":"5"},difficulty:"easy"}

        let queryStr = JSON.stringify(queryObj); // Converting to JSON String so that String Functions can be performed.

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) // Converting gte to $gte. 


        this.query = this.query.find(JSON.parse(queryStr)) // Converting the JSON String back to JSON and then performing find() on that

        return this;
    }

    sort() {
        if (this.querystring.sort) {

            // req.query.sort = 'duration,ratingAverage' 
            let sortBy = this.querystring.sort.split(',').join(' '); // sortBy = 'duration ratingAverage'

            this.query.sort(sortBy) // query.sort('duration ratingAverage')
        }
        else {
            this.query.sort('-createdAt') // This is the default sorting if no query is present.
        }

        return this;
    }

    
    // Projection
    limiting() {
        
        if (this.querystring.fields) {
            let limitBy = this.querystring.fields.split(',').join(' ');

            this.query.select(limitBy);
        }

        return this;
    }

    pagination() {
        let page = this.querystring.page * 1
        let limit = this.querystring.limit * 1 || 100;
        let skip = (page - 1) * limit;


        this.query.skip(skip).limit(limit);

        // await Tour.count() <= skip  && res.status(400).send({   // This checks whether the no. of element in the document is less 
        //                                                         // than the no. of documents skipped
        //     status: '400 Bad Request',
        //     message:"No of pages finished"
        // })
    }

}


module.exports = APIFilter;