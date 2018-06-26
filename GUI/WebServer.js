var http = require("http")
var method = require("./WebAPI.js")

const port = 3000

http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    var cookie = method.ParseCookies(req);

    // Xử lý nếu req chỉ '/' thì load nội dung file index.html
    var req_url = (req.url == '/') ? '/Home.html' : req.url

    // Xử lý phần header res sẽ gửi về Client
    var file_extension = req.url.lastIndexOf('.');
    var header_type = (file_extension == -1 && req.url != '/') ?
        'text/plain' : {
            '/': 'text/html',
            '.html': 'text/html',
            '.ico': 'image/x-icon',
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.css': 'text/css',
            '.js': 'text/javascript'
        }[req.url.substr(file_extension)];

    switch (req_url) {
        case "/Home.html":
        case "/Dang_nhap.html":
            {
                //Nếu vào trang đăng nhập lại mà đã đăng nhập rồi thì sẽ chuyển hướng dựa theo role
                let role;
                if (typeof cookie.tokenkey !== "undefined") {
                    method.KiemTraTokenKey(cookie.tokenkey, (buffer) => {
                        role = buffer;

                        if (role == "NV") {
                            req_url = "/Nhan_vien_xem.html";
                        } else if (role == "QL") {
                            req_url = "/Quan_ly.html";
                        }
        
                        method.DocFile(req_url, (data) => {
                            if (data != "") {
                                res.setHeader('Content-type', header_type);
                                res.end(data);
                                console.log(req.url, header_type);
                            } else {
                                res.writeHead(404, 'Not found')
                                res.end()
                            }
                        });
                    })
                } 
                else
                {
                    method.DocFile(req_url, (data) => {
                        if (data != "") {
                            res.setHeader('Content-type', header_type);
                            res.end(data);
                            console.log(req.url, header_type);
                        } else {
                            res.writeHead(404, 'Not found')
                            res.end()
                        }
                    });
                }
            }
            break;
        case "/Nhan_vien_ban.html":
        case "/Nhan_vien_xem.html":
            {
                //Kiểm tra token key trong cookie và xác nhận xem có vào được trang ko theo role
                let role;
                if (typeof cookie.tokenkey !== "undefined") {
                    method.KiemTraTokenKey(cookie.tokenkey, (buffer) => {
                        role = buffer;

                        if (role != "NV") {
                            console.log('==> Error: Ban khong co quyen truy cap trang nay!!!')
                            res.writeHead(302, {
                                'Location': 'http://localhost:3000/Dang_nhap.html'
                            });
                            res.end();
                            return;
                        }
        
                        method.DocFile(req_url, (data) => {
                            if (data != "") {
                                res.setHeader('Content-type', header_type);
                                res.end(data);
                                console.log(req.url, header_type);
                            } else {
                                res.writeHead(404, 'Not found')
                                res.end()
                            }
                        });
                    })
                } 
                else
                {
                    console.log('==> Error: Ban khong co quyen truy cap trang nay!!!')
                    res.writeHead(302, {
                        'Location': 'http://localhost:3000/Dang_nhap.html'
                    });
                    res.end();
                    break;
                }
            }
            break;
        case "/Quan_ly.html":
            {
                //Kiểm tra token key trong cookie và xác nhận xem có vào được trang ko theo role
                let role;
                console.log(typeof cookie.tokenkey);
                if (typeof cookie.tokenkey !== "undefined") {
                    method.KiemTraTokenKey(cookie.tokenkey, (buffer) => {
                        role = buffer;

                        if (role == "QL") {
                            req_url = "/Quan_ly.html";
                        } else {
                            console.log('==> Error: Ban khong co quyen truy cap trang nay!!!')
                            res.writeHead(302, {
                                'Location': 'http://localhost:3000/Dang_nhap.html'
                            });
                            res.end();
                            return;
                        }
        
                        method.DocFile(req_url, (data) => {
                            if (data != "") {
                                res.setHeader('Content-type', header_type);
                                res.end(data);
                                console.log(req.url, header_type);
                            } else {
                                res.writeHead(404, 'Not found')
                                res.end()
                            }
                        });
                    })
                } 
                else
                {
                    console.log('==> Error: Ban khong co quyen truy cap trang nay!!!')
                    res.writeHead(302, {
                        'Location': 'http://localhost:3000/Dang_nhap.html'
                    });
                    res.end();
                    break;
                }
            }
            break;
        default:
            {
                //xài đỡ để đọc mấy file js, css
                method.DocFile(req_url, (data) => {
                    if (data != "") {
                        res.setHeader('Content-type', header_type);
                        res.end(data);
                        console.log(req.url, header_type);
                    } else {
                        res.writeHead(404, 'Not found')
                        res.end()
                    }
                });
                // console.log('==> Error 404: Page doesnt exist ' + res.url)
                // res.writeHead(404, 'Not found')
                // res.end()
            }
            break;
    }
}).listen(port, (err) => {
    if (err != null)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})