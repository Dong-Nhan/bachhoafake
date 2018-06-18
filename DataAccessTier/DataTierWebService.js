var XuLy = require("./DataAccess.js");
var http = require("http");
var url = require("url");
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

http.createServer((YeuCau, DapUng) => {
    var parsedUrl = url.parse(YeuCau.url, true);
    var queryObject = parsedUrl.query;
    DapUng.setHeader("Content-type", "text/xml");

    //xử lý các đường dẫn
    switch (parsedUrl.pathname) {
        //đọc dữ liệu
        case "/ReadDSPhieuBanHang":
            DapUng.end(XuLy.ReadDSPhieuBanHang());
            break;
        case "/ReadDSDacTrung":
            DapUng.end(XuLy.ReadDSDacTrung());
            break;
        case "/ReadDSDanhMucSanPham":
            DapUng.end(XuLy.ReadDSDanhMucSanPham());
            break;
        case "/ReadDSMatHang":
            DapUng.end(XuLy.ReadDSMatHang());
            break;
        case "/ReadDSTaiKhoan":
            DapUng.end(XuLy.ReadDSTaiKhoan());
            break;
        default:
            console.log("Truy van khong hop le: ", parsedUrl.pathname);
            DapUng.end();
    }

}).listen(3002, (err) => {
    if (err) console.log("Khong the kich hoat dich vu");
    else console.log("Server dang chay o port 3002");
})