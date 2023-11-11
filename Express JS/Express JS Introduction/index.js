const express = require('express');

const app = express();

app.get('',(req,res)=>{

    res.send(`<h1>Hello this is Home page for ${req.query.name}</h1>`) // It basically returns the body of HTTP Response
})

app.get('/about',(req,res)=>{
    res.send("<h1>Hello this is About page</h1>")
})





app.listen(5000);