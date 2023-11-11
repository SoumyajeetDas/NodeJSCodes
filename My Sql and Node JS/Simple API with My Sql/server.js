const con = require('./config');
const express = require('express');


const app = express();



app.use(express.json());


app.get("/", (req, res) => {
    con.query('select * from users', (err, result) => {
        if(err){
            res.status(500).send("Error")
        }
        else{
            res.status(200).send(result);
        }
    });
})


app.post("/",(req, res) => {

    con.query('INSERT INTO users SET ?',req.body,(err,result,field)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(result);
        }
    })
})


app.put("/:id",(req, res) => {

    const data = [req.body.name,req.body.password,req.params.id]
    con.query('UPDATE users SET name=?, password=? WHERE id=?',data,(err,result,field)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(result);
        }
    })
});



app.delete("/:id",(req,res)=>{
    con.query('DELETE FROM users WHERE id='+req.params.id,(err,result,field)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(result);
        }
    })
})


app.listen(3500);