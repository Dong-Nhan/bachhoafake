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
                    if(method.KiemTraTokeKey(req.headers.tokenkey))
                    {   
                        let result = method.DangXuat(req.headers.tokenkey);
                        if(result)
                            console.log("Dang xuat thanh cong");
                        else
                            console.log("Dang xuat ko thanh cong");
                        res.end(result?"true":"false");
                    }
                    else{
                        console.log("Dang xuat ko thanh cong");
                        res.end("false");
                    }
                }
                break;
                case "/LayThongTinMatHangTrangChu":
                {
                    let DanhSachMatHangTrangChu = method.LayThongTinMatHangTrangChu();
                    res.end(DanhSachMatHangTrangChu);
                }
                break;
                case "/LayThongTinDanhMucTrangChu":
                {
                    let DanhMuc = method.LayThongTinDanhMucTrangChu();
                    res.end(DanhMuc);
                }
                break;
                case "/LayThongTinMatHangTrangDMC2":
                {
                    let ThongTinMatHangDMC2 = method.LayThongTinMatHangTrangDMC2(query.ma_so);
                    res.end(ThongTinMatHangDMC2);
                }
                break;
                case "/LayThongTinDacTrungTrangDMC2":
                {
                    let DacTrungDMC2 = method.LayThongTinDacTrungTrangDMC2(query.ma_so);
                    res.end(DacTrungDMC2);
                }
                break;
                case "/LayThongTinChiTietMatHang":
                {
                    let ChiTietMatHang = method.LayThongTinChiTietMatHang(query.ma_so);
                    res.end(ChiTietMatHang);
                }
                break;
                case "/LayThongTinMatHangChoQuanLyNhanVien":
                {
                    if(method.KiemTraTokeKey(req.headers.tokenkey))
                    {
                        let DanhSachMatHang = method.LayThongTinMatHangChoQuanLyNhanVien(query.ma_so);
                        res.end(DanhSachMatHang);
                    }
                    else{
                        res.end();
                    }
                }
                break;
                case "/SuaThongTinDonGia":
                {
                    if(method.KiemTraTokeKey(req.headers.tokenkey))
                    {
                        let result = method.SuaThongTinDonGia(query.ma_so,query.don_gia_moi);
                        res.end(result?"true":"false");
                    }
                    else{
                        res.end();
                    }
                }
                break;
                case "/SuaThongTinTinhTrang":
                {
                    if(method.KiemTraTokeKey(req.headers.tokenkey))
                    {
                        let result = method.SuaThongTinTinhTrang(query.ma_so,query.tinh_trang_moi);
                        res.end(result?"true":"false");
                    }
                    else{
                        res.end();
                    }
                }
                break;
                case "/BanHang":
                {
                    if(method.KiemTraTokeKey(req.headers.tokenkey))
                    {
                        let result = method.BanHang(query.data,req.headers.tokenkey);
                        res.end(result?"true":"false");
                    }
                    else{
                        res.end();
                    }
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