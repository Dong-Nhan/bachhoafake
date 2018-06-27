var http = require('http')
var url = require('url')
var queryString = require('querystring');
var method = require('./BUS.js')
const port = 3001

http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    //để phía client có thể gửi kèm cookie cho cross-domain request
    //tạm thời set cứng localhost:3000
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const {
        pathname,
        query
    } = url.parse(req.url, true);
    //parse thành 1 object để dễ sử dụng
    let cookie = queryString.parse(req.headers.cookie);
    switch (req.method) {
        case "GET":
            switch (pathname) {

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
                        if (method.KiemTraTokeKey(cookie.tokenkey)) {
                            let DanhSachMatHang = method.LayThongTinMatHangChoQuanLyNhanVien(query.ma_so);
                            res.end(DanhSachMatHang);
                        } else {
                            res.end();
                        }
                    }
                    break;
                case "/KiemTraTokenKeyVaRole":
                    {
                        let role = method.KiemTraTokeKeyVaRole(req.headers.tokenkey);
                        res.end(role);
                    }
                    break;
                case "/LayTenTaiKhoan":
                    {
                        if (method.KiemTraTokeKey(cookie.tokenkey)) {
                            res.end(method.LayTenTaiKhoan(cookie.tokenkey));
                        } else {
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
                //phần dữ liệu được truyền trong gói POST sẽ nằm ở phần body
                //sử dụng cách này thay vì xài query trong URL để tận dụng được HTML Form
                //và tránh bị giới hạn độ dài của URL
                let body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function () {
                    //parse thành 1 object để dễ sử dụng
                    body = queryString.parse(body);
                    //để phía client có thể gửi kèm cookie cho cross-domain request
                    //tạm thời set cứng localhost:3000
                    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
                    switch (pathname) {
                        case "/DangXuat":
                            {
                                console.log(cookie.tokenkey);
                                if (method.KiemTraTokeKey(cookie.tokenkey)) {
                                    let result = method.DangXuat(cookie.tokenkey);
                                    if (result) {
                                        res.setHeader('Set-Cookie', 'tokenkey=');
                                        console.log("Dang xuat thanh cong");
                                    } else
                                        console.log("Dang xuat ko thanh cong 1");
                                    res.end(result ? "true" : "false");
                                } else {
                                    console.log("Dang xuat ko thanh cong");
                                    res.end("false");
                                }
                            }
                            break;
                        case "/DangNhap":
                            {
                                console.log(body);
                                let tokenkey = method.DangNhap(body.user_name, body.password);
                                console.log(tokenkey);
                                res.setHeader('Set-Cookie', `tokenkey=${tokenkey}`);
                                res.end(tokenkey);
                            }
                            break;
                        case "/SuaThongTinDonGia":
                            {
                                if (method.KiemTraTokeKey(cookie.tokenkey)) {
                                    let result = method.SuaThongTinDonGia(query.ma_so, query.don_gia_moi);
                                    res.end(result ? "true" : "false");
                                } else {
                                    res.end();
                                }
                            }
                            break;
                        case "/SuaThongTinTinhTrang":
                            {
                                if (method.KiemTraTokeKey(cookie.tokenkey)) {
                                    let result = method.SuaThongTinTinhTrang(query.ma_so, query.tinh_trang_moi);
                                    res.end(result ? "true" : "false");
                                } else {
                                    res.end();
                                }
                            }
                            break;
                        case "/BanHang":
                            {
                                if (method.KiemTraTokeKey(cookie.tokenkey)) {
                                    let result = method.BanHang(body, cookie.tokenkey);
                                    res.end(result ? "true" : "false");
                                } else {
                                    res.end();
                                }
                            }
                            break;
                        default:
                            console.log("Truy van khong hop le: ", req.method, pathname);
                            res.end();
                    }
                });

            }
            break;
        default:
            console.log("Method khong hop le");
            res.end();
    }

}).listen(port, err => {
    if (err)
        console.log("Khong the kich hoat dich vu");
    else
        console.log("Server BUS dang chay o port 3001");
})