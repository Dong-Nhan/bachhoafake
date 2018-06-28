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
          })
      }
      //Quản lý xem: Đẩy dữ liệu cho dropdown menu Danh mục
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
      a.innerHTML = "Quản lý: " + data;
    });
}

function addDataToDropdownMenu(data) {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += `<a class="dropdown-item" href="#" onclick="CreateTable(dsDanhMuc[${i}])">${data[i].ten}</a>`;
  }
  $(`#dropdownMenu`)[0].innerHTML = result;
}

// QUẢN LÝ XEM HÀNG
function CreateTable(danhMuc) {
  stt = 1;
  $(`#tableMatHang tbody`)[0].innerHTML = "";
  for (let i = 0; i < danhMuc.dsMatHang.length; i++) {
    CreateRow(danhMuc.dsMatHang[i]);
  }
}

function CreateRow(matHang) {
  var tr = document.createElement("tr");
  tr.setAttribute('id',matHang.getAttribute('maso'));

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
  
  var edit_button = document.createElement('td');
  edit_button.innerHTML= `<button class="btn btn-success btn-sm" id="${matHang.getAttribute('maso')}-edit" onclick="OnClickChinhSua('${matHang.getAttribute('maso')}')"><i class="material-icons">edit</i></button>`;
  tr.appendChild(edit_button);

  $(`#tableMatHang tbody`)[0].appendChild(tr);
}

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
      if(data == 'true') location.href="http://localhost:3000/Dang_nhap.html";
    });
})

function OnClickChinhSua(id){
  var tr = document.getElementById(id);
  var tdGia = tr.getElementsByTagName('td')[4];
  var tdTinhTrang = tr.getElementsByTagName('td')[5];
  
  tdGia.innerHTML = `<input type='number' class='form-control'  value='${tdGia.innerHTML.substr(0,tdGia.innerHTML.lastIndexOf('V'))}'>`;
  if(tdTinhTrang.innerHTML == 'Bán')
    tdTinhTrang.innerHTML = `<select class='form-control'><option value="ban" selected>Bán</option><option value="ngung" >Ngưng</option></select>`;
  else
    tdTinhTrang.innerHTML = `<select class='form-control'><option value="ban">Bán</option><option value="ngung" selected>Ngưng</option></select>`;

  var editBtn = document.getElementById(id+'-edit');
  editBtn.setAttribute('onclick',`OnClickSave('${id}')`);
}

function OnClickSave(id){
  var tr = document.getElementById(id);
  var tdGia = tr.getElementsByTagName('td')[4];
  var tdTinhTrang = tr.getElementsByTagName('td')[5];
  
  var gia = tdGia.getElementsByTagName('input')[0].value;
  var select = tdTinhTrang.getElementsByTagName('select')[0];
  var tinhTrang = select.options[select.selectedIndex].value;

  var thanhCong = true;

  $.ajax({
    url: `http://localhost:3001/SuaThongTinDonGia?ma_so=${id}&don_gia_moi=${gia}`,
    type: "POST",
    dataType: 'text',
    xhrFields: { //send cookie cho cross domain
      withCredentials: true
    },
  })
  .done(function (data) {
    if(data == 'true'){
      tdGia.innerHTML = gia + 'VND';
    }
    else if(data == 'false'){
      alert('Không thể cập nhật đơn giá mới ở server!!!');
      thanhCong = false;
    }
  });
  
  $.ajax({
    url: `http://localhost:3001/SuaThongTinTinhTrang?ma_so=${id}&tinh_trang_moi=${tinhTrang}`,
    type: "POST",
    dataType: 'text',
    xhrFields: { //send cookie cho cross domain
      withCredentials: true
    },
  })
  .done(function (data) {
    if(data == 'true'){
      tdTinhTrang.innerHTML = tinhTrang=='ban'?'Bán':'Ngưng';
    }
    else if(data == 'false'){
      alert('Không thể cập nhật tình trạng mới ở server!!!');
      thanhCong = false;
    }
  });
  
  if(thanhCong)
  {
    var editBtn = document.getElementById(id+'-edit');
    editBtn.setAttribute('onclick',`OnClickChinhSua('${id}')`);

    for(let i = 0; i < dsDanhMuc.length;i++){
      for(let j = 0; j < dsDanhMuc[i].dsMatHang.length; j++){
        if(dsDanhMuc[i].dsMatHang[j].getAttribute('maso') == id){
          dsDanhMuc[i].dsMatHang[j].setAttribute('gia',gia);
          dsDanhMuc[i].dsMatHang[j].setAttribute('tinhtrang',tinhTrang);
          break 
        }
      }
    }
  }
}