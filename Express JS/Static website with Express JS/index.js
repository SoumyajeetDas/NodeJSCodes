const express = require('express');
const path = require('path');

const app = express();



app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname,'index.html')); 

});
app.use(express.static('public'))



app.listen(5000);