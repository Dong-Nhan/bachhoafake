var fs = require("fs");
var http = require('http');
const portBUS = 3001;

class WebAPI {
    //Kiểm tra tokenkey trong Cookie và trả về role
    KiemTraTokenKey(tokenkey, cb) {
        var options = {
            protocol: 'http:',
            host: 'localhost',
            port: portBUS,
            path: '/KiemTraTokenKeyVaRole',
            headers: {
                'Content-Type': 'text/xml',
                "tokenkey": tokenkey
            }
        };

        http.get(options, (res) => {
            var buffer = "";
            res.setEncoding("utf8");

            res.on("data", chunk => {
                buffer += chunk;
            });

            res.on("end",()=>{ 
                cb(buffer);
            });
        })
    }

    DocFile(ten_file, cb) {
        // Đọc file 
        fs.readFile(__dirname + ten_file, (err, data) => {
            if (err) {
                // Xử lý phần tìm không thấy resource ở Server
                console.log('==> Error: ' + err)
                console.log('==> Error 404: file not found ' + ten_file)
                
                cb("");
            } else {
                cb(data);
            }
        })
    }
}

var web = new WebAPI();
module.exports = web;