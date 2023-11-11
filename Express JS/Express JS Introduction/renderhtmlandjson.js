const express = require('express');

const app = express();

app.get('',(req,res)=>{

    res.send(`<h1>Hello this is Home page</h1><br><a href="/about?name=Soumyajeet">Go to About</a>`) // It basically returns the body of HTTP Response
})

app.get('/about',(req,res)=>{
    res.send(`<input type='text' value=${req.query.name} ></input>`)
})


app.get('/json',(req,res)=>{
    res.send([
        {
            name:'Soumyajeet',
            age:20
        },
        {
            name:'Sounak',
            age:30
        }
    ])
})





app.listen(5000);