const http = require('http');

const server = http.createServer((req,resp)=>{

    resp.writeHead(200,{'Content-Type': 'text/html'})


    // resp.write('<h1>Hello, I am Soumyajeet</h1>');
    // resp.end();

    resp.end("<h1>Hello, I am Soumyajeet</h1>")

});

server.listen(4500, ()=>{
    console.log('Server Running');
})