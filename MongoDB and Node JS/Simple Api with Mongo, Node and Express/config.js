/* This is the common part so kept in a file which will be shared by everybody */

const {MongoClient} = require('mongodb');

const url = 'mongodb://localhost:27017';

const database = 'CWHBlog';

const client = new MongoClient(url);

async function dbConnect(){
    let result = await client.connect(); // Connecting Mongo DB with the Node JS
    // console.log("Result",result);

    let db = result.db(database);

    let collection = db.collection('comments'); // Returns Promise
    // console.log("Collection",collection);


    return collection;
}

module.exports=dbConnect;