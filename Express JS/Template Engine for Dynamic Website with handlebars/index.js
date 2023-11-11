const express = require('express');

const exphbs = require('express-handlebars');

const blogs = require('./data/blogs')

const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');




app.get("/",(req,res)=>{
    res.render('home'); // We are basically telling for this particular request render the home view.
});


app.get("/blog",(req,res)=>{
   res.render('blog',{
    blogs:blogs.blogs // Here we are passing the blogs data into the blog.handlebar and making the website dynamic
   })
})


app.get("/blog/:slug",(req,res)=>{

    blogdata = blogs.blogs.filter((data)=>req.params.slug===data.slug)

    console.log(blogdata);
    res.render('blogPage',{
     blogdata:blogdata   // Here we are passing the blogdata into the blogPage.handlebar and making the website dynamic
    })
 })


app.listen(4500,()=>{
    console.log('listening')
})



