module.exports = (req,res,next) => {
    console.log('In middleware');
    
    if(!req.query.age)
    {
        return res.send("<h1>Please provide the age</h1>")
    }
    if(req.query.age<18){
        return res.send("<h1>Age is less than 18</h1>");
    }
    else{
        next();
    }
     // If we don't give next then it will not go the next middleware or will not 
}