// The server.js file is the starting file form where it wil fetch the app.js

const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const app = require('./app')



//Configuring the required environment into Node JS which is present in config.env file.
dotenv.config({path:'./config.env'})




//Connecting DB
const db = process.env.DATABASE.replace("<Password>",process.env.DATABASE_PASSWORD);


mongoose.connect(db).then(()=>{
    // console.log(conn.connections);
    console.log("Database Successfully Connected");
}).catch((err)=>{
    var error = {
        status : "Cannot Connect to DB",
        error : err
    }
    console.log(error);
});



// Listening to the port acording to the environment

let port;
if(process.env.NODE_ENV === 'production'){
    port = process.env.PORT || 4000
}
else{
    port = 3000
}



app.listen(port, () => {
    console.log(`listening on Port : ${port}`);
})
