const express = require('express');
const route = express.Router();
const path = require('path');


route.get("/",(req, res) => {
    res.sendFile(path.join(__dirname,'/views/index.html')) // Here the dirname is "JS\Codes\Express JS\BlogExpress\routes" 
                                                        // so need to go one step back by writing .. 
});


module.exports = route;