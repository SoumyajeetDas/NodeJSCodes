const mongoose = require('mongoose');


const database = "CWHBlog";
const url = "mongodb://localhost:27017/"+database;

const dbConnect = async()=>{
    await mongoose.connect(url);
    const blogSchema = mongoose.Schema({
        name:String,
        lang:String,
        exp:Number
    });

    const blogModel = mongoose.model('comments',blogSchema);

    return blogModel;
}


module.exports=dbConnect;

