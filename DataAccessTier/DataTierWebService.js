var XuLy = require("./DataAccess.js");
var http = require("http");
var url = require("url");
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

http.createServer((req, res) => {
    var parsedUrl = url.parse(req.url, true);
    console.log(req.method, parsedUrl.path);
    var queryObject = parsedUrl.query; //dùng để lấy data trong query string 
    res.setHeader("Content-Type", "text/xml");
    switch (req.method) {
        case "GET":
            switch (parsedUrl.pathname) {
                case "/ReadDSPhieuBanHang":
                    if (!XuLy.KiemTraBUSTokenKey(req.headers.bustokenkey)) {
                        console.log("BUS token key khong hop le");
                        res.end();
                        break;
                    }
                    res.end(XuLy.ReadDSPhieuBanHang());
                    break;
                case "/ReadDSDacTrung":
                    if (!XuLy.KiemTraBUSTokenKey(req.headers.bustokenkey)) {
                        console.log("BUS token key khong hop le");
                        res.end();
                        break;
                    }
                    res.end(XuLy.ReadDSDacTrung());
                    break;
                case "/ReadDSDanhMucSanPham":
                    if (!XuLy.KiemTraBUSTokenKey(req.headers.bustokenkey)) {
                        console.log("BUS token key khong hop le");
                        res.end();
                        break;
                    }
                    res.end(XuLy.ReadDSDanhMucSanPham());
                    break;
                case "/ReadDSMatHang":
                    if (!XuLy.KiemTraBUSTokenKey(req.headers.bustokenkey)) {
                        console.log("BUS token key khong hop le");
                        res.end(null);
                        break;
                    }
                    res.end(XuLy.ReadDSMatHang());
                    break;
                case "/ReadDSTaiKhoan":
                    if (!XuLy.KiemTraBUSTokenKey(req.headers.bustokenkey)) {
                        console.log("BUS token key khong hop le");
                        res.end();
                        break;
                    }
                    res.end(XuLy.ReadDSTaiKhoan());
                    break;
                default:
                    console.log("Truy van khong hop le: ", req.method, parsedUrl.pathname);
                    res.end();
            }
            break;
        case "POST":
            switch (parsedUrl.pathname) {
                case '/DangNhapBUS':
                    let newTokenKey = XuLy.DangNhapBUS(queryObject.user_name, queryObject.password);
                    //res.setHeader("Set-Cookie", "busTokenKey=" + newTokenKey);
                    res.end(newTokenKey);
                    break;
                case "/CapNhatGiaBan":
                    if (!XuLy.KiemTraBUSTokenKey(req.headers.bustokenkey)) {
                        console.log("BUS token key khong hop le");
                        res.end();
                        break;
                    }
                    XuLy.CapNhatGiaBan(queryObject.ma_so, queryObject.gia, (err) => {
                        if (err) res.end("false");
                        else res.end("true");
                    })
                    break;
                case "/CapNhatTinhTrang":
                    if (!XuLy.KiemTraBUSTokenKey(req.headers.bustokenkey)) {
                        console.log("BUS token key khong hop le");
                        res.end();
                        break;
                    }
                    XuLy.CapNhatTinhTrang(queryObject.ma_so, queryObject.tinh_trang, (err) => {
                        if (err) res.end("false");
                        else res.end("true");
                    })
                    break;
                case "/BanHang":
                    if (!XuLy.KiemTraBUSTokenKey(req.headers.bustokenkey)) {
                        console.log("BUS token key khong hop le");
                        res.end();
                        break;
                    }
                    XuLy.BanHang(queryObject.data, (err) => {
                        if (err) res.end("false");
                        else res.end("true");
                    })
                    break;
                default:
                    console.log("Truy van khong hop le: ", req.method, parsedUrl.pathname);
                    res.end();
            }
            break;
        default:
            console.log("Method khong hop le");
            res.end();

    }

}).listen(3002, (err) => {
    if (err) console.log("Khong the kich hoat dich vu");
    else console.log("Server dang chay o port 3002");
})