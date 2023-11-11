const fs = require('fs');
const path = require('path');




for(i=0;i<4;i++){
    fs.writeFileSync(`${__dirname}/files/file${i}.txt`,"I am Soumyajeet");
}

console.log("Successfully Created");




fs.readdir(`${__dirname}/files`,(error,data)=>{
    data.forEach((item)=>{
       fs.readFile(`${__dirname}/files/${item}`,'utf8',(err,data)=>{
        console.log(data.toString());
       });
    })
})