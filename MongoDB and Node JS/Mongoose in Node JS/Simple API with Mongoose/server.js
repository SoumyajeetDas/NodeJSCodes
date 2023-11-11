const BlogModel = require('./comments');
require('./config');
const express = require('express');



const app = express();


app.use(express.json());



const getData = async()=>{
    let result = await BlogModel.find();

    return result;
}

app.get("/",async(req,res)=>{

    let result = await getData();
    
    res.status(200).send(result);  // Result is in JSON Format.
});


const search = async(query)=>{
    let result = await BlogModel.find({$or:[{name:{$regex:query,$options:"i"}},{lang:{$regex:query,$options:"i"}}]});

    return result;
}


app.get("/search/:value",async(req,res)=>{

    let result = await search(req.params.value);

    res.status(200).send(result);
});



const insertData = async(data)=>{
    let blogModel = new BlogModel(data);
    await blogModel.save();
}

app.post("/",(req, res) => {
    
    insertData(req.body);
    // {
    //     name: 'Sounak',
    //     lang: 'Python',
    //     exp: 10
    // }


    res.status(201).send("Data is inserted")
})





const updateDataByName = async(name,value)=>{
    let result = await BlogModel.updateOne({name:name},{$set:value})

    return result;
}

app.put("/:name",async(req,res)=>{
    let result = await updateDataByName(req.params.name,req.body);

    if(result.acknowledged && result.modifiedCount>0){
        res.status(200).send("Data Got Updated");
    }
    else{
        res.status(400).send("Data Was Not Modified");
    }
});




const updateDataById = async(param,value)=>{
    let result = await BlogModel.updateOne(param,{$set:value})

    return result;
}

app.put("/update/:_id",async(req,res)=>{
    let result = await updateDataById(req.params,req.body);

    if(result.acknowledged && result.modifiedCount>0){
        res.status(200).send("Data Got Updated");
    }
    else{
        res.status(400).send("Data Was Not Modified");
    }
});



const deleteData = async(data)=>{
    let result = await BlogModel.deleteOne(data);

    return result;
}


app.delete("/:_id",async(req,res)=>{
    let result = await deleteData(req.params);

    if(result.acknowledged && result.deletedCount>0){
        res.send("Data Successfully Deleted")
    }
    else{
        res.send("Data Deletion Unsuccessful");
    }
})

app.listen(6000);
