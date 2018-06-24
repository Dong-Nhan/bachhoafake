var fs = require("fs");
var DuongDan = "./DuLieu/";
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var TenFile = ["DanhSachPhieuBanHang.xml", "DanhSachDacTrung.xml", "DanhSachDanhMucSanPham.xml", "DanhSachMatHang.xml", "DanhSachTaiKhoan.xml"];

var Chuoi_DanhSachPhieuBanHang, Chuoi_DanhSachDacTrung, Chuoi_DanhSachDanhMucSanPham, Chuoi_DanhSachMatHang, Chuoi_DanhSachTaiKhoan;
var DOM_DanhSachPhieuBanHang, DOM_DanhSachDacTrung, DOM_DanhSachDanhMucSanPham, DOM_DanhSachMatHang, DOM_DanhSachTaiKhoan;

//đọc và cache dữ liệu trên RAM
function CacheData() {
    Chuoi_DanhSachPhieuBanHang = fs.readFileSync(DuongDan + TenFile[0], "utf8");
    DOM_DanhSachPhieuBanHang = new DOMParser().parseFromString(Chuoi_DanhSachPhieuBanHang, "text/xml");

    Chuoi_DanhSachDacTrung = fs.readFileSync(DuongDan + TenFile[1], "utf8");
    DOM_DanhSachDacTrung = new DOMParser().parseFromString(Chuoi_DanhSachDacTrung, "text/xml");

    Chuoi_DanhSachDanhMucSanPham = fs.readFileSync(DuongDan + TenFile[2], "utf8");
    DOM_DanhSachDanhMucSanPham = new DOMParser().parseFromString(Chuoi_DanhSachDanhMucSanPham, "text/xml");

    Chuoi_DanhSachMatHang = fs.readFileSync(DuongDan + TenFile[3], "utf8");
    DOM_DanhSachMatHang = new DOMParser().parseFromString(Chuoi_DanhSachMatHang, "text/xml");

    Chuoi_DanhSachTaiKhoan = fs.readFileSync(DuongDan + TenFile[4], "utf8");
    DOM_DanhSachTaiKhoan = new DOMParser().parseFromString(Chuoi_DanhSachTaiKhoan, "text/xml");

};


//xử lý với điều kiện tầng BUS đã kiểm tra tính đúng đắn của thông tin
class DataAccessTier {
    constructor() {
        CacheData();
        this.dsTokenKey = [];
        this.dsTaiKhoanHopLe = [{
            username: 'bus',
            password: '1'
        }]
    }

    //đăng nhập thành công trả về tokenkey dạng username-validBusTokenKey
    //đăng nhập thất bại trả về ""
    DangNhapBUS(username, password) {
        let newTokenKey = "";
        for (let i = 0; i < this.dsTaiKhoanHopLe.length; i++) {
            if (this.dsTaiKhoanHopLe[i].username == username && this.dsTaiKhoanHopLe[i].password == password) {
                newTokenKey = this.dsTaiKhoanHopLe[i].username + "-validBusTokenKey";
                this.dsTokenKey.push(newTokenKey);
                console.log("BUS dang nhap thanh cong");
                break;
            }
        }
        return newTokenKey;
    }

    KiemTraBUSTokenKey(busTokenKey) {
        if (!busTokenKey) return false;
        for (let i = 0; i < this.dsTokenKey.length; i++) {
            if (this.dsTokenKey[i] == busTokenKey) return true;
        }
        return false;
    }

    ReadDSPhieuBanHang() {
        return Chuoi_DanhSachPhieuBanHang;
    }

    ReadDSDacTrung() {
        return Chuoi_DanhSachDacTrung;
    }

    ReadDSDanhMucSanPham() {
        return Chuoi_DanhSachDanhMucSanPham;
    }

    ReadDSMatHang() {
        return Chuoi_DanhSachMatHang;
    }

    ReadDSTaiKhoan() {
        return Chuoi_DanhSachTaiKhoan;
    }

    CapNhatGiaBan(ma_so, gia_moi, callback) {
        //kiểm tra giá
        gia_moi = parseFloat(gia_moi);
        let giaHopLe = !isNaN(gia_moi);
        if (!giaHopLe) {
            callback(true);
            console.log('Gia ban khong hop le');
            return;
        }

        //tìm và cập nhật
        let dsMatHang = DOM_DanhSachMatHang.getElementsByTagName("MatHang");
        for (let i = 0; i < dsMatHang.length; i++) {
            if (dsMatHang[i].getAttribute('maso') == ma_so) {
                dsMatHang[i].setAttribute('gia', gia_moi); //cập nhật DOM
                Chuoi_DanhSachMatHang = new XMLSerializer().serializeToString(DOM_DanhSachMatHang); //cập nhật chuỗi
                fs.writeFile(DuongDan + TenFile[3], Chuoi_DanhSachMatHang, (err) => { //cập nhật file xml
                    if (err) {
                        console.log(`Ghi file ${TenFile[3]} that bai`);
                        console.log('Cap nhat gia ban that bai');
                        callback(err);
                    } else {
                        console.log(`Ghi file ${TenFile[3]} thanh cong`);
                        console.log('Ban hang thanh cong');
                        callback(null);
                    }
                })
                return;
            }
        }
        console.log('Khong tim thay mat hang');
    }

    CapNhatTinhTrang(ma_so, tinh_trang, callback) {
        //kiểm tra tình trạng bán/ngưng đơn giản
        if (tinh_trang != "ban" && tinh_trang != "ngung") {
            callback(true);
            console.log('Tinh trang khong dung');
            return;
        }

        //tìm và cập nhật
        let dsMatHang = DOM_DanhSachMatHang.getElementsByTagName("MatHang");
        for (let i = 0; i < dsMatHang.length; i++) {
            if (dsMatHang[i].getAttribute('maso') == ma_so) {
                dsMatHang[i].setAttribute('tinhtrang', tinh_trang); //cập nhật DOM
                Chuoi_DanhSachMatHang = new XMLSerializer().serializeToString(DOM_DanhSachMatHang); //cập nhật chuỗi
                fs.writeFile(DuongDan + TenFile[3], Chuoi_DanhSachMatHang, (err) => { //cập nhật file xml
                    if (err) {
                        console.log(`Ghi file ${TenFile[3]} that bai`);
                        console.log('Cap nhat tinh trang that bai');
                        callback(err);
                    } else {
                        console.log(`Ghi file ${TenFile[3]} thanh cong`);
                        console.log('Cap nhat tinh trang thanh cong');
                        callback(null);
                    }
                })
                return;
            }
        }
        console.log('Khong tim thay mat hang');
    }

    BanHang(data, callback) {
        let phieuBanHang = new DOMParser().parseFromString(data);
        DOM_DanhSachPhieuBanHang.documentElement.appendChild(phieuBanHang);
        Chuoi_DanhSachPhieuBanHang = new XMLSerializer().serializeToString(DOM_DanhSachPhieuBanHang);
        fs.writeFile(DuongDan + TenFile[0], Chuoi_DanhSachPhieuBanHang, (err) => { //cập nhật file xml
            if (err) {
                console.log(`Ghi file ${TenFile[0]} that bai`);
                console.log('Ban hang that bai');
                callback(err);
            } else {
                console.log(`Ghi file ${TenFile[0]} thanh cong`);
                console.log('Ban hang thanh cong');
                callback(null);
            }
        })
    }

}

var XuLy = new DataAccessTier();
module.exports = XuLy;