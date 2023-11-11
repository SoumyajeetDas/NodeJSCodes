const dbConnect = require('./config')

const updateData = async()=>{
    

    let BlogModel = await dbConnect();


    // Update One Data
    let result = await BlogModel.updateOne({name:'Sounak'},{$set:{exp:4}})


    if(result.acknowledged){
        console.log("Data Updated")
    }
    else{
        console.log("Data Cannot be Updated")
    }

}


updateData();