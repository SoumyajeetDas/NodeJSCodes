const fs = require('fs');

console.log("Hi")
// fs.readFile('abc.txt','utf8',function(err, data){
//     console.log(data);
// });


const data = fs.readFileSync('abc.txt').toString();

console.log(data);


console.log("hello");