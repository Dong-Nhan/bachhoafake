var http = require("http");
var queryString = require('querystring');
http.post = require("http-post");
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var taikhoanBUS = {
    user_name: "bus",
    password: "1"
};
var busTokenKey;
const portDAL = 3002;
var Chuoi_DanhSachPhieuBanHang, Chuoi_DanhSachDacTrung, Chuoi_DanhSachDanhMucSanPham, Chuoi_DanhSachMatHang, Chuoi_DanhSachTaiKhoan;
var DOM_DanhSachPhieuBanHang, DOM_DanhSachDacTrung, DOM_DanhSachDanhMucSanPham, DOM_DanhSachMatHang, DOM_DanhSachTaiKhoan;

//Lấy data từ DAL
function GetFunction(url){
    var options = {
        protocol:'http:',  
        host: 'localhost',
        port: portDAL,
        path: url,
        headers: {
            'Content-Type': 'text/xml',
            "bustokenkey": busTokenKey
        }
    };

    http.get(options,(res)=>{
        var buffer = "";
        res.setEncoding("utf8");

        res.on("data", chunk => {
            buffer += chunk;
        });

        res.on("end", () => {
            switch(url)
            {
                case "/ReadDSTaiKhoan":
                    Chuoi_DanhSachTaiKhoan = buffer;
                    DOM_DanhSachTaiKhoan = new DOMParser().parseFromString(Chuoi_DanhSachTaiKhoan, "text/xml")
                    console.log("Da doc danh sach tai khoan tu DAL");
                    break;
                case "/ReadDSDanhMucSanPham":
                    Chuoi_DanhSachDanhMucSanPham = buffer;
                    DOM_DanhSachDanhMucSanPham = new DOMParser().parseFromString(Chuoi_DanhSachDanhMucSanPham, "text/xml")
                    console.log("Da doc danh sach danh muc tu DAL");
                    break;
                case "/ReadDSDacTrung":
                    Chuoi_DanhSachDacTrung = buffer;
                    DOM_DanhSachDacTrung = new DOMParser().parseFromString(Chuoi_DanhSachDacTrung, "text/xml")
                    console.log("Da doc danh sach dac trung tu DAL");
                    break;
                case "/ReadDSPhieuBanHang":
                    Chuoi_DanhSachPhieuBanHang = buffer;
                    DOM_DanhSachPhieuBanHang = new DOMParser().parseFromString(Chuoi_DanhSachPhieuBanHang, "text/xml")
                    console.log("Da doc danh sach phieu ban hang tu DAL");
                    break;
                case "/ReadDSMatHang":
                    Chuoi_DanhSachMatHang = buffer;
                    DOM_DanhSachMatHang = new DOMParser().parseFromString(Chuoi_DanhSachMatHang, "text/xml")
                    console.log("Da doc danh sach mat hang tu DAL");
                    break;
            }
        });
    })
}

function GetData(){
    //Lấy danh sach tai khoan
    GetFunction(`/ReadDSTaiKhoan`)

    //Lấy danh sách danh mục sản phẩm
    GetFunction(`/ReadDSDanhMucSanPham`)

    //Lấy danh sách đặc trưng
    GetFunction(`/ReadDSDacTrung`)

    //Lấy danh sách phiếu bán hàng
    GetFunction(`/ReadDSPhieuBanHang`)

    //Lấy danh sách mặt hàng
    GetFunction(`/ReadDSMatHang`)
}


//update data ở DAL
function UpdateFunction(url){
    var options = {
        protocol:'http:',  
        host: 'localhost',
        port: portDAL,
        path: url,
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml',
            "bustokenkey": busTokenKey
        }
    };

    var request = http.request(options,(res)=>{
        var buffer = "";
        res.setEncoding("utf8");

        res.on("data", chunk => {
            buffer += chunk;
        });

        res.on("end", ()=>{
            if(buffer == "true")
                console.log(`Da cap nhat lai san pham o DAL`);
            else
                console.log(`Khong the cap nhat lai san pham o DAL`);
        });
    })

    request.end();
}


function CacheDuLieuMatHangTrangChu(){
    let DanhSachMatHangTrangChu = DOM_DanhSachMatHang.createElement("DanhSachMatHang");
    let MatHang = DOM_DanhSachMatHang.getElementsByTagName("MatHang");
    if(MatHang.length > 10){
        for(let i = 0; i < 10;i++){
            let ran = Math.floor(Math.random())+MatHang.length;
            DanhSachMatHangTrangChu.appendChild(MatHang[ran].cloneNode());
        }
        let ChuoiDanhSachMatHang = new XMLSerializer().serializeToString(DanhSachMatHangTrangChu);
        return ChuoiDanhSachMatHang;
    }
    else{
        for(let i = 0; i < MatHang.length;i++){
            DanhSachMatHangTrangChu.appendChild(MatHang[i].cloneNode());
        }
        let ChuoiDanhSachMatHang = new XMLSerializer().serializeToString(DanhSachMatHangTrangChu);
        return ChuoiDanhSachMatHang;
    }
}

function CacheDuLieuNV(masodanhmuc2){
    let DanhSachMatHangNV = DOM_DanhSachMatHang.createElement("DanhSachMatHang");
    let MatHang = DOM_DanhSachMatHang.getElementsByTagName("MatHang");
    for(let i = 0; i < MatHang.length;i++){
        if(MatHang[i].getAttribute("masodanhmuc2") == masodanhmuc2){
            DanhSachMatHangNV.appendChild(MatHang[i].cloneNode());
        }
    }
    let ChuoiDanhSachMatHang = new XMLSerializer().serializeToString(DanhSachMatHangNV);
    return ChuoiDanhSachMatHang;
}

function CacheDuLieuKhachXemDanhMuc2(masodanhmuc2){
    let DanhSachMatHangDMC2 = DOM_DanhSachMatHang.createElement("DanhSachMatHang");
    let MatHang = DOM_DanhSachMatHang.getElementsByTagName("MatHang");
    for(let i = 0; i < MatHang.length;i++){
        if(MatHang[i].getAttribute("masodanhmuc2") == masodanhmuc2){
            let MatHangClone = MatHang[i].cloneNode();
            MatHangClone.appendChild(MatHang[i].getElementsByTagName('ThuongHieu')[0].cloneNode());
            DanhSachMatHangDMC2.appendChild(MatHangClone);
        }
    }
    let ChuoiDanhSachMatHangDMC2 = new XMLSerializer().serializeToString(DanhSachMatHangDMC2);
    return ChuoiDanhSachMatHangDMC2;
}

function CacheDuLieuKhachXemChiTiet(masomathang){
    let MatHang = DOM_DanhSachMatHang.getElementsByTagName("MatHang");
    for(let i = 0; i < MatHang.length;i++){
        if(MatHang[i].getAttribute("maso") == masomathang){
            return new XMLSerializer().serializeToString(MatHang[i]);
        }
    }
    //Trả về rỗng nếu ko tìm thấy
    return "";
}

function LayTenNhanVien(tokenkey){
    let MaNV = "";
    for(let i = 0; i < tokenkey.length;i++){
        if(tokenkey[i] == '-')
            break;
        MaNV+=tokenkey[i];
    }
    let NhanVien = DOM_DanhSachTaiKhoan.getElementsByTagName("TaiKhoan");
    for(let i = 0; i < NhanVien.length;i++){
        if(NhanVien[i].getAttribute("username") == MaNV){
            return NhanVien[i].getAttribute("ten");
        }
    }
}

class BUS{
    constructor(){
        busTokenKey = "";
        this.DanhSachTokenKey = [];

        //Đăng nhập BUS
        http.post(`http://localhost:${portDAL}/DangNhapBUS?user_name=${taikhoanBUS.user_name}&password=${taikhoanBUS.password}`,
        {
            name:"BUS",
            action:"LoginDAL"
        },
        res=>{
            let buffer = "";
            res.setEncoding("utf8");

            res.on("data", chunk => {
                buffer += chunk;
            });

            res.on("end", () => {
                busTokenKey = buffer;
                console.log("Dang nhap BUS thanh cong");
                
                //Sau khi có token key thì lấy dữ liệu
                GetData();
            });
        })
    }

    //Kiểm tra token key có hợp lệ hay không
    KiemTraTokeKey(tokenkey){
        if(!tokenkey) return false;
        for(var i = 0; i < this.DanhSachTokenKey.length; i++){
            if(this.DanhSachTokenKey[i] == tokenkey){
                return true;
            }
        }
        return false;
    }

    //Đăng nhập tài khoản, kiểm tra và tạo tokenkey tương ứng
    DangNhap(user_name, password){
        var DanhSachtaiKhoan = DOM_DanhSachTaiKhoan.getElementsByTagName("TaiKhoan");
        for(var i = 0; i < DanhSachtaiKhoan.length;i++){
            if(DanhSachtaiKhoan[i].getAttribute("username") == user_name && DanhSachtaiKhoan[i].getAttribute("password") == password){
                //Phát sinh token key và trả về
                //Dạng tokenkey username-role
                let tokenkey = user_name + "-" +DanhSachtaiKhoan[i].getAttribute("role");
                this.DanhSachTokenKey.push(tokenkey);
                console.log(`User: ${user_name} dang nhap thanh cong`);
                return tokenkey;
            }
        }
        return "";
    }

    //Đăng xuất tài khoản, xóa token key trên RAM
    //BUS_service sẽ đảm nhiệm phần lấy token key từ header và gọi hàm
    DangXuat(tokenkey){
        if(!tokenkey) return false;
        for(var i = 0; i < this.DanhSachTokenKey.length; i++){
            console.log(this.DanhSachTokenKey[i]);
            if(this.DanhSachTokenKey[i] == tokenkey){
                this.DanhSachTokenKey.splice(i,1);
                return true;
            }
        }
        return false;
    }

    //Lấy thông tin mặt hàng trang chủ, trả về chuỗi xml tương ứng
    LayThongTinMatHangTrangChu(){
        return CacheDuLieuMatHangTrangChu();
    }

    //Lấy thông tin danh mục để render giao diện tại trang chủ
    LayThongTinDanhMucTrangChu(){
        return Chuoi_DanhSachDanhMucSanPham;
    }

    //Lấy thong tin mặt hàng theo danh mục cấp 2
    //ma_so cua danh mục cấp 2
    LayThongTinMatHangTrangDMC2(ma_so){
        return CacheDuLieuKhachXemDanhMuc2(ma_so);
    }

    //Lấy thông tin đặc trưng để render giao diện trang DMC2
    LayThongTinDacTrungTrangDMC2(ma_so){
        let DacTrung = DOM_DanhSachDacTrung.getElementsByTagName("DacTrung");
        for(let i = 0; i < DacTrung.length;i++){
            if(DacTrung[i].getAttribute("masodanhmuc2") == ma_so){
                return new XMLSerializer().serializeToString(DacTrung[i]);
            }
        }
        return "";
    }
    
    //Ma_so của mặt hàng
    LayThongTinChiTietMatHang(ma_so){
        return CacheDuLieuKhachXemChiTiet(ma_so);
    }

    //Ma_so của danh mục cấp 2
    LayThongTinMatHangChoQuanLyNhanVien(ma_so){
        return CacheDuLieuNV(ma_so);
    }

    //Ma_so mặt hàng
    SuaThongTinDonGia(ma_so, don_gia_moi){
        let MatHang = DOM_DanhSachMatHang.getElementsByTagName("MatHang");
        for(let i = 0; i < MatHang.length;i++){
            if(MatHang[i].getAttribute("maso") == ma_so){
                MatHang[i].setAttribute("gia",don_gia_moi);
                Chuoi_DanhSachMatHang = new XMLSerializer().serializeToString(DOM_DanhSachMatHang);
                UpdateFunction(`/CapNhatGiaBan?ma_so=${ma_so}&gia=${don_gia_moi}`);
                return true;
            }
        }
        //Không tìm thấy
        return false;
    }

    //Ma_so mặt hàng
    SuaThongTinTinhTrang(ma_so, tinh_trang_moi){
        let MatHang = DOM_DanhSachMatHang.getElementsByTagName("MatHang");
        for(let i = 0; i < MatHang.length;i++){
            if(MatHang[i].getAttribute("maso") == ma_so){
                MatHang[i].setAttribute("tinhtrang",tinh_trang_moi);
                Chuoi_DanhSachMatHang = new XMLSerializer().serializeToString(DOM_DanhSachMatHang);
                UpdateFunction(`/CapNhatTinhTrang?ma_so=${ma_so}&tinh_trang=${tinh_trang_moi}`);
                return true;
            }
        }
        //Không tìm thấy
        return false;
    }

    /*data{
        string ho_ten_khach, string dia_chi, 
        string dien_thoai, string ngay, 
        Object[] mat_hang{ma_so, so_luong, don_gia,tien}
    }*/
    //tokenkey để xác định nhân viên bán hàng
    BanHang(data, tokenkey){
        console.log(data);
        let PhieuBan = DOM_DanhSachPhieuBanHang.createElement("PhieuBanHang");
        PhieuBan.setAttribute("hotennguoimua",data.ho_ten_khach);
        PhieuBan.setAttribute("diachi",data.dia_chi);
        PhieuBan.setAttribute("dienthoai",data.dien_thoai);
        PhieuBan.setAttribute("ngay",data.ngay);
        let NhanVienBan = LayTenNhanVien(tokenkey);
        PhieuBan.setAttribute("hotennhanvien",NhanVienBan);

        let TongTien = 0;
        for(let i = 0; i < data.ma_so.length;i++){
            let MatHang = DOM_DanhSachPhieuBanHang.createElement("MatHang");
            MatHang.setAttribute("maso", data.ma_so[i]);
            MatHang.setAttribute("soluong", data.so_luong[i]);
            MatHang.setAttribute("dongia", data.don_gia[i]);
            MatHang.setAttribute("tien", data.tien[i]);
            PhieuBan.appendChild(MatHang);
            TongTien+=parseInt(data.tien[i]);
        }
        PhieuBan.setAttribute("tongtien",TongTien);
        DOM_DanhSachPhieuBanHang.appendChild(PhieuBan);
        Chuoi_DanhSachPhieuBanHang = new XMLSerializer().serializeToString(DOM_DanhSachPhieuBanHang);

        //serialize data và request sang DAL
        let dataSend = new XMLSerializer().serializeToString(PhieuBan);
        UpdateFunction(`/BanHang?data=${encodeURIComponent(dataSend)}`);
        return true;
    }

    KiemTraTokeKeyVaRole(tokenkey){
        if(!tokenkey) return "";
        for(var i = 0; i < this.DanhSachTokenKey.length; i++){
            if(this.DanhSachTokenKey[i] == tokenkey){
                return tokenkey.substring(tokenkey.length-2,tokenkey.length);
            }
        }
        //Nếu ko tìm thấy trả về rỗng
        return "";
    }

    LayTenTaiKhoan(tokenkey){
        if(!tokenkey) return "";
        let DanhSachTaiKhoan = DOM_DanhSachTaiKhoan.getElementsByTagName("TaiKhoan");
        let username = tokenkey.substr(0,tokenkey.lastIndexOf('-'));
        for(var i = 0; i< DanhSachTaiKhoan.length;i++){
            if(DanhSachTaiKhoan[i].getAttribute('username') == username){
                return DanhSachTaiKhoan[i].getAttribute('ten');
            }
        }
        return "";
    }
}

var bus = new BUS();
module.exports = bus;