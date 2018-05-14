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
    gia.id = ma_so + "_gia";
    gia.innerHTML = "100000vnd";
    gia.setAttribute ("onclick","FixPrice(this.id)");
    row.appendChild(gia);
  
    var tinh_trang = document.createElement("div");
    tinh_trang.className = "col-2 border border-danger";
    tinh_trang.id = ma_so+"_tt";
    tinh_trang.innerHTML = "Tạm dừng";
    tinh_trang.setAttribute ("onclick","ChangeState(this.id)");
    tinh_trang.setAttribute ("value","false");
    row.appendChild(tinh_trang);
  
    document.getElementById("noi_dung").appendChild(row);
  }
  
  function CreateTable(loai) {
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
  
function FixPrice(id){
  var gia_id = document.getElementById(id); 
  var gia = prompt("Giá mới:", gia_id.innerHTML);
  if(gia != null && gia !=""){
    gia_id.innerHTML = gia;
  }
}

function ChangeState(id){
  var state = document.getElementById(id);
  if(state.getAttribute("value") == "false"){
    state.setAttribute("value","true");
    state.innerHTML = "Còn hàng";
  }
  else{
    state.setAttribute("value","false");
    state.innerHTML = "Tạm dừng";
  }
}