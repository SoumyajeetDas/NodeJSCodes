const dbConnect = require('./config')

const insertData = async()=>{
    

    let BlogModel = await dbConnect();


    // Single Document Insert
    let blogmodel = new BlogModel({name:'Sounak',lang:'Python',exp:10})


    let result = await blogmodel.save();



    // Multiple Data Insert

    // let data = await blogModel.insertMany([
    //     {name:"Sir"},
    //     {name:"Dada"}
    // ])


    console.log(result);


}


insertData();