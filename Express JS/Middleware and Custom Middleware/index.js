const express = require('express');

const app = express();


const requestFilter = (req,res,next) => {
    console.log('In middleware');
    
    if(!req.query.age)
    {
        res.send("<h1>Please provide the age</h1>")
    }
    if(req.query.age<18){
        res.send("<h1>Age is less than 18</h1>");
    }
    else{
        next();
    }
     // If we don't give next then it will not go the next middleware or will not 
}

app.use(requestFilter);

app.get('',(req,res,next) => {
    console.log('In Home')
    res.send('<h1>Home Page</h1>')
});


app.get('/age',(req,res,next) => {
    res.send('<h1>Reached to age Page</h1>')
});



app.listen(5000);