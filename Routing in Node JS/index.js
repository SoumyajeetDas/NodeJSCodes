const http = require('http');

const server = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/html'})
    if(req.url==='/')
        res.end("This is Home Page");
    if(req.url==='/about')
        res.end("This is About Page")
    else
        res.end("404 Not Found")
});


server.listen(5000,()=>{
    console.log("Server Running Fine")
})