/* Keeping everything in one place is not a god techbnique */

// const {MongoClient} = require('mongodb');

// const url = 'mongodb://localhost:27017';

// const database = 'CWHBlog';

// const client = new MongoClient(url);

// async function getData(){

//     let result = await client.connect(); // Connecting Mongo DB with the Node JS
//     // console.log("Result",result);

//     let db = result.db(database);
//     console.log("Database",database);

//     let collection = db.collection('comments'); 
//     // console.log("Collection",collection);

//     let response = await collection.find().toArray(); // t0Array() Returns Promise
//     console.log(response);

//     //Shortcut

//     // let response = await result.db(database).collection('comments').find().toArray();

//     // console.log(response);
// }

// getData();




const dbConnect = require('./config.js');


/* 1st Technique */

// dbConnect().then((resp)=>{
//     resp.find().toArray().then((data)=>{
//         console.log(data);
//     })
// })


/* 2nd Technique */

const getData = async()=>{
    const data = await (await dbConnect()).find().toArray();
    console.log(data)
}


getData();