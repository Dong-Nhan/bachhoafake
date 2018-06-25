var http = require("http")

const port = 3000

http.createServer((req,res)=>{
    console.log(`${req.method} ${req.url}`);
    
    
}).listen(port,(err)=>{
    if(err != null)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})