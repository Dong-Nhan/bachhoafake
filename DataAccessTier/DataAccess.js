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

}

var XuLy = new DataAccessTier();
module.exports = XuLy;