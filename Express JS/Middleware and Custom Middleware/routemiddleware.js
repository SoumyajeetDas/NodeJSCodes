const requestFilter= require('./middleware') // Kept middleware in different file
const express = require('express');
const app = express();



const route1 = express.Router(); // This itself returns a middleware function
const route2 = express.Router(); // This itself returns a middleware function




//route1.use(requestFilter) // If route1 gets called then requrstFilter middleware gets used for all the route methods only under route1. 

route1.use('/age',requestFilter) // If route1 gets called and if the url hit by user is having /age after /first then requestFilter will be mounted.


// route1 Route Methods.
route1.get('/home',(req,res,next) => {
    console.log('In Home of Route1')
    // res.send('<h1>Home Page</h1>')
    next();
},(req,res,next)=>{
    console.log('In the next callback')
    res.send('<h1>Home Page</h1>');
});



route1.get('/age',(req,res,next) => { // The miidleware wherever we want to use that requestFilter middleware method logic we have use that router.
    console.log("In age")
    res.send('<h1>Reached to age Page</h1>')
}); 



//route2 Route Methods
route2.get('/',(req,res)=>{
    res.send("<h1>In the home of Route 2</h1>")
})




app.use('/first',route1); // If the /first routing matches then route1 middleware will be called 
app.use('/',route2); // If / routing gets matched then route2 middleware will be called.


app.listen(4500);