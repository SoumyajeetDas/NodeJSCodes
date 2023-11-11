const dbConnect = require('./config');


const updatedata = async()=>{
    let result = await (await dbConnect()).updateOne({name:'Soumyajeet'},
    {$set:{exp:4}})

    if(result.acknowledged){
        console.log(result)
    }
    else{
        console.log("Data Cannot be Updated")
    }
}

updatedata();