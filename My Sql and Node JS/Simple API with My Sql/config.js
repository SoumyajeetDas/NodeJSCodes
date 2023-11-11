const mysql = require('mysql');


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'test'
});


con.connect((err) => {
    if (err) {
        console.log("Sql Not connected")
    }

})

module.exports = con;


// con.query('select * from users',(err, result)=>{
//     console.log(result);
// });