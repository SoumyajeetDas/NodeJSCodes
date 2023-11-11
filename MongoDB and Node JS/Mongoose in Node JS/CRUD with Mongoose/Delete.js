const dbConnect = require('./config')

const deleteData = async()=>{
    

    let BlogModel = await dbConnect();


    // Update One Data
    let result = await BlogModel.deleteOne({name:"Harry2"})


    if(result.acknowledged && result.deletedCount>0){
        console.log("Data Deleted")
    }
    else{
        console.log("Data Cannot be Deleted")
    }

}

deleteData();