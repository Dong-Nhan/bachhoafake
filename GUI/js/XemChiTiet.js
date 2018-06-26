/************       Xử lý lưu trữ       *******************/
function LayThongTinMatHang(){
    var request = new XMLHttpRequest();
    request.open('GET',`http://localhost:3001/LayThongTinChiTietMatHang?ma_so=${GetURLParameter('maso')}`,false);
    request.send();
    var chuoiXml = request.responseText;
    var data = new DOMParser().parseFromString(chuoiXml,"text/xml").documentElement;
    return data;
}

//Đọc danh mục 1
function DocDanhMuc1(matHang){
    var request = new XMLHttpRequest();
    request.open('GET','http://localhost:3001/LayThongTinDanhMucTrangChu',false);
    request.send();
    var chuoiXml = request.responseText;
    var data = new DOMParser().parseFromString(chuoiXml,"text/xml").documentElement;
    var danhSachDanhMuc = data.getElementsByTagName('DanhMucCap1');
    for(var i = 0; i < danhSachDanhMuc.length;i++){
        if(danhSachDanhMuc[i].getAttribute('maso') == matHang.getAttribute('masodanhmuc1')){
            return danhSachDanhMuc[i];
        }
    }
}

/************       Xử lý thể hiện       *******************/
function TaoTieuDeTheoDanhMuc(danhMuc1, matHang){
    var h4 = document.createElement('h4');

    var span = document.createElement('span');
    span.innerHTML=danhMuc1.getAttribute('ten')+' > ';
    document.title = danhMuc1.getAttribute('ten');    

    var a = document.createElement('a');
    a.setAttribute('href', `./XemDanhMuc2.html?masodanhmuc1=${matHang.getAttribute('masodanhmuc1')}&masodanhmuc2=${matHang.getAttribute('masodanhmuc2')}`)
    
    var danhSachDanhMuc2 = danhMuc1.getElementsByTagName('DanhMucCap2');
    for(var i = 0; i < danhSachDanhMuc2.length;i++){
        if(danhSachDanhMuc2[i].getAttribute('maso') == matHang.getAttribute('masodanhmuc2')){
            a.innerHTML = danhSachDanhMuc2[i].getAttribute('ten')+ ' > ';
            break;
        }
    }

    var aSanPham = document.createElement('a');
    aSanPham.setAttribute('class',"text-secondary");
    aSanPham.innerHTML = matHang.getAttribute('ten');

    h4.appendChild(span);
    h4.appendChild(a);
    h4.appendChild(aSanPham);

    return h4;
}

function TaoThongTin(thongTin){
    var ul = document.createElement('ul');

    for(var i= 0;i < thongTin.length;i++){
        var li = document.createElement('li');
        li.innerHTML = thongTin[i].innerHTML;
        ul.appendChild(li);
    }

    return ul;
}

function TaoChiTiet(chiTiet){
    var ul = document.createElement('ul');

    for(var i= 0;i < chiTiet.length;i++){
        var li = document.createElement('li');
        li.innerHTML = chiTiet[i].getAttribute('ten') + ': ' + chiTiet[i].innerHTML;
        ul.appendChild(li);
    }

    return ul;
}

function TaoChiTietSanPham(matHang){
    var div = document.createElement('div');

    var divCol5 = document.createElement('div');
    divCol5.setAttribute( 'class',"col-md-5 mb-5 p-0 border border-light");
    
    var img = document.createElement('img');
    img.setAttribute('class',"hinh-san-pham d-block mx-auto");
    img.setAttribute( 'src',`./img/${matHang.getAttribute('maso')}/hinh1.jpg`);
    divCol5.appendChild(img);

    var divCol7 = document.createElement('div');
    divCol7.setAttribute( 'class',"col-md-7");

    var h3 = document.createElement('h3');
    h3.setAttribute('class',"col-md-12 text-secondary");
    h3.innerHTML = matHang.getAttribute('ten') + " " + matHang.getAttribute('khoiluongtinh');
    divCol7.appendChild(h3);

    var divGia= document.createElement('div');
    divGia.setAttribute('class',"col-md-12 gia-san-pham font-weight-bold");
    divGia.innerHTML = matHang.getAttribute('gia')+'đ';
    divCol7.appendChild(divGia);

    var h5 = document.createElement('h5');
    h5.setAttribute('class',"col-md-12 h5 mt-3 text-secondary");
    h5.innerHTML = 'Thông tin chung';
    divCol7.appendChild(h5);

    var thongTin = TaoThongTin(matHang.getElementsByTagName('ThongTin'));
    divCol7.appendChild(thongTin)
    
    var h5MoTa = document.createElement('h5');
    h5MoTa.setAttribute('class',"col-md-12 h5 mt-2 text-secondary");
    h5MoTa.innerHTML = 'Thông tin chung';
    divCol7.appendChild(h5MoTa);

    var motTaChiTiet = TaoChiTiet(matHang.getElementsByTagName('MoTa'));
    divCol7.appendChild(motTaChiTiet)

    div.appendChild(divCol5);
    div.appendChild(divCol7);

    return div;
}

/************       Xử lý nghiệp vụ       *******************/
//Lấy các query param trên url
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}