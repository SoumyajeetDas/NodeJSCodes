const express = require('express');
const dbConnect = require('./config');
const mongoDb = require('mongodb')


const app = express();


const getdata = async () => {
    let result = await (await dbConnect()).find().toArray();
    return result;
}

app.use(express.json())
app.get('/', async (req, res, next) => {
    let response = await getdata();

    res.status(200).send(response);
})



const insertdata = async (data) => {

    const result = await (await dbConnect()).insertOne(data);
    // {
    //     name: 'Sounak',
    //     lang: 'Python',
    //     exp: 10
    // }

    return result;
}


app.post('/', async (req, res, next) => {
    let result = await insertdata(req.body);

    if (result.acknowledged) {
        res.status(201).send("Data Inserted Successfully")
    }
    else {
        res.status(400).send("Data Cannot be inserted Successfully")
    }
})




const updatedata = async (param, data) => {
    let result = await (await dbConnect()).updateOne({ name: param.name },
        { $set: data });

    return result;
}

app.put("/:name", async (req, res) => {
    let result = await updatedata(req.params, req.body);

    if (result.acknowledged) {
        res.status(200).send("Data Updated Successfully");
    }
    else {
        res.status(400).send("Data Cannot be updated Successfully");
    }
});




const deletedata = async (id) => {

    // console.log(typeof new mongoDb.ObjectId(id));
    let result = await (await dbConnect()).deleteOne({ _id: new mongoDb.ObjectId(id) })
    return result;
}

app.delete("/:id", async (req, res) => {
    let result = await deletedata(req.params.id);

    if (result.acknowledged && result.deletedCount > 0) { //If the cond does not gets matched and nothing gets matched then 
        //also it will return acknowledged: true but the deletedCount:0
        //and that will help to identify that cond. is not matched and so no deletion happened.
        res.status(200).send("Deleted Successfully")
    }
    else {
        res.status(400).send("Deleted Unsuccessfully")
    }
})

app.listen(5000);