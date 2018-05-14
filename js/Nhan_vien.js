function CreateRow(ma_so) {
  var row = document.createElement("div");
  row.setAttribute("class", "row");

  var hinh_anh = document.createElement("div");
  hinh_anh.className = "col-2 border border-danger";
  var img = document.createElement("img");
  img.style.cssText = "width:10em; height = 10em";
  img.src = "img/" + ma_so + ".jpg";
  hinh_anh.appendChild(img);
  row.appendChild(hinh_anh);

  var ten = document.createElement("div");
  ten.className = "col-3 border border-danger";
  ten.style.cssText = "word-wrap: break-word";
  ten.innerHTML = "Tên sản phẩm ";
  row.appendChild(ten);

  var ma_so_col = document.createElement("div");
  ma_so_col.className = "col-2 border border-danger";
  ma_so_col.innerHTML = ma_so;
  row.appendChild(ma_so_col);

  var so_luong = document.createElement("div");
  so_luong.className = "col-1 border border-danger";
  so_luong.innerHTML = "1";
  row.appendChild(so_luong);

  var gia = document.createElement("div");
  gia.className = "col-2 border border-danger";
  gia.innerHTML = "100000vnd";
  row.appendChild(gia);

  var tinh_trang = document.createElement("div");
  tinh_trang.className = "col-2 border border-danger";
  tinh_trang.innerHTML = "Tạm dừng";
  row.appendChild(tinh_trang);

  document.getElementById("noi_dung").appendChild(row);
}

function CreateTable(loai) {
  form_ban.style.cssText = "display:none";
  xac_nhan.value = "true";
  XacNhanKhach();
  noi_dung.innerHTML = "";
  if (loai == "bia") {
    CreateRow("bia_larue");
    CreateRow("bia_saigon");
    CreateRow("bia_su_tu");
  } else if (loai == "sua") {
    CreateRow("sua_vinamilk");
    CreateRow("sua_dutchlady");
    CreateRow("sua_dutchlady_dau");
  }
}

function TinhTien() {
  var don_gia = parseInt(document.getElementById("don_gia").innerHTML);
  var so_luong = parseInt(document.getElementById("so_luong").value);
  var tien = document.getElementById("tien");
  tien.innerHTML = parseInt(don_gia * so_luong);
}

function CreateSellRow() {
  var row = document.createElement("tr");
  var hang = document.createElement("th");
  hang.setAttribute("scope", "row");
  hang.innerHTML = document.getElementById("mat_hang").value;
  var so_luong = document.createElement("td");
  so_luong.innerHTML = document.getElementById("so_luong").value;
  var don_gia = document.createElement("td");
  don_gia.innerHTML = document.getElementById("don_gia").innerHTML;
  var tien = document.createElement("td");
  tien.innerHTML = document.getElementById("tien").innerHTML;

  row.appendChild(hang);
  row.appendChild(so_luong);
  row.appendChild(don_gia);
  row.appendChild(tien);

  document.getElementsByTagName("tbody")[0].appendChild(row);
}

function XacNhanKhach() {
  if (xac_nhan.value == "true") {
    xac_nhan.value = "false";
    form_ban_hang.style.cssText = "display:none";
  } else if (xac_nhan.value == "false") {
    xac_nhan.value = "true";
    form_ban_hang.style.cssText = "padding: 0; margin: 1em 0 0 0";
  }
}
