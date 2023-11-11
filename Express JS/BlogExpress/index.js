const express = require('express');
const data = require('./data/blogs')
const app = express();
const path = require('path');
const blogRoute = require('./routes/blog')

console.log(__dirname)

app.use(express.static(path.join(__dirname, 'static')))

app.use("/",blogRoute);


app.get("/blog",(req,res) => {
    res.json(data);
})


app.get("/blog/:slug",(req,res) => {
    let data1 = data.blogs.filter((data)=> data.slug===req.params.slug)
    res.json(data1);
})


app.listen(5000,()=>{
    console.log("Working fine!!");
})