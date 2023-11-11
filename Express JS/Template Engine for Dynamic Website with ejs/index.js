const express = require('express');


const app = express();


app.set('view engine', 'ejs');

app.get("",(req,res)=>{

    const user = {
        name:'Soumyajeet',
        age:20
    }
    res.render('Home',{user})
});

app.get("/about",(req,res)=>{
    res.render('About')
});

app.listen(5000);