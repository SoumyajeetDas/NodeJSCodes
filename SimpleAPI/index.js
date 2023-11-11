const http = require('http');

const data = require('./Data')


// http.createServer((req,resp)=>{
//     resp.writeHead(200,{'Content-Type': 'application/json'});
//     resp.write(JSON.stringify({name:'Anil Sindhu',age:20}));
//     resp.end();
// }).listen(4500);


http.createServer((req,resp)=>{
    resp.writeHead(200,{'Content-Type': 'application/json'}); // Sends response header. Response header holds information about 
                                                              //the response.
    
    resp.write(JSON.stringify(data)); // The response data is converted into JSON from JSON String and it is then written in the body.
    
    resp.end(); // All the proceeses are done nothing to be write by .write() now send the response to the user.
}).listen(4500); // Tells which port number the api will run