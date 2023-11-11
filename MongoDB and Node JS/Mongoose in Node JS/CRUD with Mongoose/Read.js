const dbConnect = require('./config')

const readData = async()=>{
    

    let BlogModel = await dbConnect();


    // Update One Data
    let result = await BlogModel.find();


    console.log(result);

    

}


readData();