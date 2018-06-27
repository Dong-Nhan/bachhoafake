var stt = 1;
var dsDanhMuc = [];


$(`body`)[0].onload = function () {
  //lấy danh sách danh mục
  $.ajax({
      url: "http://localhost:3001/LayThongTinDanhMucTrangChu",
      type: "GET",
      dataType: 'xml',
      xhrFields: { //send cookie cho cross domain
        withCredentials: true
      },
    })
    .done(function (data) {
      data = data.getElementsByTagName('DanhMucCap2');
      for (let i = 0; i < data.length; i++) {
        dsDanhMuc.push({
          maso: data[i].getAttribute('maso'),
          ten: data[i].getAttribute('ten')
        });
        //gọi về lấy tiếp các mặt hàng theo danh mục cấp 2
        let query = `ma_so=${dsDanhMuc[i].maso}`;
        $.ajax({
            url: "http://localhost:3001/LayThongTinMatHangChoQuanLyNhanVien?" + query,
            type: "GET",
            dataType: 'xml',
            xhrFields: { //send cookie cho cross domain
              withCredentials: true
            },
          })
          .done(function (data) {
            dsDanhMuc[i].dsMatHang = data.getElementsByTagName('MatHang');
            //Nhân viên bán: Đẩy dữ liệu cho select menu mặt hàng
            addDataToSelectMenu(dsDanhMuc[i].dsMatHang);
          })
      }
      //Nhân viên xem: Đẩy dữ liệu cho dropdown menu Danh mục
      addDataToDropdownMenu(dsDanhMuc);
    });

    //lấy tên nhân viên
  $.ajax({
      url: "http://localhost:3001/LayTenTaiKhoan",
      type: "GET",
      dataType: 'text',
      xhrFields: { //send cookie cho cross domain
        withCredentials: true
      },
    })
    .done(function (data) {
      let a = document.getElementsByClassName('nav-link')[0];
      a.innerHTML = "Nhân viên: " + data;
    });
}

function addDataToDropdownMenu(data) {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += `<a class="dropdown-item" href="#" onclick="CreateTable(dsDanhMuc[${i}])">${data[i].ten}</a>`;
  }
  $(`#dropdownMenu`)[0].innerHTML = result;
}

// NHÂN VIÊN XEM HÀNG
function CreateTable(danhMuc) {
  stt = 1;
  $(`#tableMatHang tbody`)[0].innerHTML = "";
  for (let i = 0; i < danhMuc.dsMatHang.length; i++) {
    CreateRow(danhMuc.dsMatHang[i]);
  }
}

function CreateRow(matHang) {
  var tr = document.createElement("tr");

  var so_thu_tu = document.createElement("td");
  so_thu_tu.innerText = stt;
  stt++;
  tr.appendChild(so_thu_tu);

  var hinh_anh = document.createElement("td");
  hinh_anh.className = "";
  var img = document.createElement("img");
  img.style.cssText = "";
  img.className = "hinh-san-pham";
  img.src = "img/" + matHang.getAttribute('maso') + "/hinh1.jpg";
  hinh_anh.appendChild(img);
  tr.appendChild(hinh_anh);

  var ten = document.createElement("td");
  ten.className = "";
  ten.style.cssText = "";
  ten.innerHTML = matHang.getAttribute('ten');
  tr.appendChild(ten);

  var ma_so_col = document.createElement("td");
  ma_so_col.className = "";
  ma_so_col.innerHTML = matHang.getAttribute('maso');
  tr.appendChild(ma_so_col);


  var gia = document.createElement("td");
  gia.className = "";
  gia.innerHTML = matHang.getAttribute('gia') + "VND";
  tr.appendChild(gia);

  var tinh_trang = document.createElement("td");
  tinh_trang.className = "";
  (matHang.getAttribute('tinhtrang') == 'ban') ? tinh_trang.innerHTML = 'Bán': tinh_trang.innerHTML = 'Ngưng';
  tr.appendChild(tinh_trang);

  $(`#tableMatHang tbody`)[0].appendChild(tr);
}

// NHÂN VIÊN BÁN HÀNG
$(`#btnThem`).click(function addTableRow() {
  $('#tableBanHang tbody').append($('#tableBanHang tr')[1].outerHTML);
  stt++;
  let tdSTT = $('#tableBanHang tbody tr:last-child td:first-child');
  tdSTT.text(stt);
  tdSTT.siblings()[2].getElementsByTagName('input')[0].value  = 0;
  tdSTT.siblings()[3].getElementsByTagName('input')[0].value  = 0;
})

function addDataToSelectMenu(data) {
  let selectMenu = $('#tableBanHang tbody select')[0];
  for (let i = 0; i < data.length; i++) {
    selectMenu.innerHTML += `<option data-maso="${data[i].getAttribute('maso')}" data-gia="${data[i].getAttribute('gia')}" value="${data[i].getAttribute('maso')}">${data[i].getAttribute('ten')}</option>`
  }
}

//hiển thị đơn giá, thành tiền và tổng tiền
$('#tableBanHang tbody').on('change', 'select', function (e) {
  //lấy option bị thay đổi
  let select = $(this);
  let selectedOption = select.find(':selected');

  let dsTableData = $(this).closest('td').siblings();
  let tdSoLuong = dsTableData[1];
  //set lại đơn giá
  let tdDonGia = dsTableData[2];
  tdDonGia.getElementsByTagName('input')[0].value = (selectedOption[0].dataset.gia);

  //set lại thành tiền
  let tdThanhTien = dsTableData[3];
  let thanhTien_old = parseInt(tdThanhTien.getElementsByTagName('input')[0].value);
  tdThanhTien.getElementsByTagName('input')[0].value = tdSoLuong.getElementsByTagName('input')[0].value * parseInt(tdDonGia.getElementsByTagName('input')[0].value);
  let thanhTien_new = parseInt(tdThanhTien.getElementsByTagName('input')[0].value);

  //set lại tổng tiền
  let spanTongTien = $('#tongTien');
  let tongTien_old = parseInt(spanTongTien.text());
  let tongTien_new = tongTien_old - thanhTien_old + thanhTien_new;
  spanTongTien.text(tongTien_new);
})

//khi số lượng thay đổi, set lại thành tiền và tổng tiền
$('tbody').on('change', 'input[type="number"]', function () {
  let dsTableData = $(this).closest('td').siblings();
  let tdDonGia = dsTableData[2];
  //set lại thành tiền
  let tdThanhTien = dsTableData[3];
  let thanhTien_old = parseInt(tdThanhTien.getElementsByTagName('input')[0].value);
  tdThanhTien.getElementsByTagName('input')[0].value = $(this).val() * parseInt(tdDonGia.getElementsByTagName('input')[0].value);
  let thanhTien_new = parseInt(tdThanhTien.getElementsByTagName('input')[0].value);

  //set lại tổng tiền
  let spanTongTien = $('#tongTien');
  let tongTien_old = parseInt(spanTongTien.text());
  let tongTien_new = tongTien_old - thanhTien_old + thanhTien_new;
  spanTongTien.text(tongTien_new);
  
})

$('#formBanHang').submit(function (event) {
  //chặn cái default behavior của form lại
  event.preventDefault();
  // console.log($('#formBanHang').serialize());
  // return;
  $.ajax({
      url: "http://localhost:3001/BanHang",
      type: "POST",
      data: $('#formBanHang').serialize(),
      xhrFields: { //send cookie cho cross domain
        withCredentials: true
      },
    })
    .done(function (data) {
      if (data == 'true') {
        alert('Bán hàng thành công');
        location.reload();
      }
    });
})

//ĐĂNG XUẤT
$('#formDangXuat').submit(function (event) {
  //chặn cái default behavior của form lại
  event.preventDefault();
  $.ajax({
      url: "http://localhost:3001/DangXuat",
      type: "POST",
      xhrFields: { //send cookie cho cross domain
        withCredentials: true
      },
    })
    .done(function (data) {
      if (data == 'true') location.href = "http://localhost:3000/Dang_nhap.html";
    });
})