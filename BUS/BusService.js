var http = require('http')
var url = require('url')
var method = require('./BUS.js')
const port = 3001

http.createServer((req,res)=>{
    console.log(`${req.method} ${req.url}`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { pathname, query } = url.parse(req.url, true);

    switch(req.method){
        case "GET":
            switch(pathname){
                case "/DangXuat":
                {
                    method.DangXuat(req.headers.tokenkey);
                }
                break;
                case "/LayThongTinMatHangTrangChu":
                {
                    method.LayThongTinMatHangTrangChu();
                }
                break;
                case "/LayThongTinDanhMucTrangChu":
                {
                    method.LayThongTinDanhMucTrangChu();
                }
                break;
                case "/LayThongTinMatHangTrangDMC2":
                {
                    let ThongTinMatHangDMC2 = method.LayThongTinMatHangTrangDMC2(query.ma_so);
                    return ThongTinMatHangDMC2;
                }
                break;
                case "/LayThongTinDacTrungnTrangDMC2":
                {

                }
                break;
                case "/LayThongTinChiTietMatHang":
                {

                }
                break;
                case "/LayThongTinMatHangChoQuanLyNhanVien":
                {

                }
                break;
                case "/SuaThongTinDonGia":
                {

                }
                break;
                case "/SuaThongTinTinhTrang":
                {

                }
                break;
                case "/BanHang":
                {

                }
                break;
                case "/SuaThongTinTinhTrang":
                {

                }
                break;
                default:
                    console.log("Truy van khong hop le: ", req.method, pathname);
                    res.end();
            }
            break;
        case "POST":
        {
            switch(pathname){
                case "/DangNhap":
                {
                    let tokenkey = method.DangNhap(query.user_name,query.password);
                    res.end(tokenkey);
                }
                break;
                default:
                    console.log("Truy van khong hop le: ", req.method, pathname);
                    res.end();
            }
        }
            break;
        default:
            console.log("Method khong hop le");
            res.end();
    }

}).listen(port,err=>{
    if (err) 
        console.log("Khong the kich hoat dich vu");
    else 
        console.log("Server BUS dang chay o port 3001");
})