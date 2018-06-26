/************       Xử lý lưu trữ       *******************/
//Đọc danh sách danh mục 2
function DocDanhMuc1(){
    var request = new XMLHttpRequest();
    request.open('GET','http://localhost:3001/LayThongTinDanhMucTrangChu',false);
    request.send();
    var chuoiXml = request.responseText;
    var data = new DOMParser().parseFromString(chuoiXml,"text/xml").documentElement;
    var danhSachDanhMuc = data.getElementsByTagName('DanhMucCap1');
    for(var i = 0; i < danhSachDanhMuc.length;i++){
        if(danhSachDanhMuc[i].getAttribute('maso') == GetURLParameter('masodanhmuc1')){
            return danhSachDanhMuc[i];
        }
    }
}

//Đọc danh sách mặt hàng trang chủ
function DocDanhSachMatHang(){
    var request = new XMLHttpRequest();
    request.open('GET', `http://localhost:3001/LayThongTinMatHangTrangDMC2?ma_so=${GetURLParameter('masodanhmuc2')}`,false);
    request.send();
    var chuoiXml = request.responseText;
    var dom = new DOMParser().parseFromString(chuoiXml,'text/xml').documentElement;
    var danhSachMatHang = dom.getElementsByTagName('MatHang');
    return danhSachMatHang;
}

//Đọc danh sách đặc trưng
function DocDanhSachDacTrung(danhSachDanhMuc2){
    var danhSachDacTrung = [];

    for(var i = 0; i < danhSachDanhMuc2.length;i++){
        var request = new XMLHttpRequest();
        request.open('GET', `http://localhost:3001/LayThongTinDacTrungTrangDMC2?ma_so=${danhSachDanhMuc2[i].getAttribute('maso')}`,false);
        request.send();
        var chuoiXml = request.responseText;
        var dom = new DOMParser().parseFromString(chuoiXml,'text/xml').documentElement;
        danhSachDacTrung.push(dom);
    }
    
    return danhSachDacTrung;
}

/************       Xử lý thể hiện       *******************/
function TaoTieuDeTheoDanhMuc(danhMuc1, masodanhmuc2){
    var h4 = document.createElement('h4');

    var span = document.createElement('span');
    span.innerHTML=danhMuc1.getAttribute('ten')+' > ';
    document.title = danhMuc1.getAttribute('ten');    

    var a = document.createElement('a');
    a.setAttribute('class',"text-secondary");
    a.setAttribute('href', `./XemDanhMuc2.html?masodanhmuc1=${GetURLParameter('masodanhmuc1')}&masodanhmuc2=${masodanhmuc2}`)
    
    var danhSachDanhMuc2 = danhMuc1.getElementsByTagName('DanhMucCap2');
    for(var i = 0; i < danhSachDanhMuc2.length;i++){
        if(danhSachDanhMuc2[i].getAttribute('maso') == masodanhmuc2){
            a.innerHTML = danhSachDanhMuc2[i].getAttribute('ten');
            break;
        }
    }

    h4.appendChild(span);
    h4.appendChild(a);

    return h4;
}

function TaoNoiDungDanhMucCap2(danhMuc, isActive){
    var li = document.createElement('li');
    li.setAttribute('class','nav-item');

    var a = document.createElement('a');
    if(isActive)
        a.setAttribute('class','nav-link active font-weight-bold');
    else
        a.setAttribute('class','nav-link font-weight-bold');

    //id = masodanhmuc1-tab
    a.setAttribute('id',danhMuc.getAttribute('maso')+'-tab');
    a.setAttribute('data-toggle',"tab");
    a.setAttribute('href','#'+a.getAttribute('id')+'-content');
    a.setAttribute('role','tab');
    a.setAttribute('aria-controls',a.getAttribute('id')+"-content");
    a.setAttribute('aria-selected',"true");
    a.innerHTML = danhMuc.getAttribute('ten');
    a.setAttribute('onclick',`location.href ='./XemDanhMuc2.html?masodanhmuc1=${GetURLParameter('masodanhmuc1')}&masodanhmuc2=${danhMuc.getAttribute('maso')}'`);
    li.appendChild(a);
    
    return li;
}

function TaoDanhMucCap2(danhSachDanhMuc){
    var ul = document.createElement('ul');

    for(var i = 0; i < danhSachDanhMuc.length; i++){
        var li1;
        if(danhSachDanhMuc[i].getAttribute('maso') == GetURLParameter('masodanhmuc2'))
            li1 = TaoNoiDungDanhMucCap2(danhSachDanhMuc[i],true);
        else
            li1 = TaoNoiDungDanhMucCap2(danhSachDanhMuc[i],false);
        ul.appendChild(li1);
    }

    return ul;
}


function TaoNoiDungThuongHieu(danhSachDacTrung, isActive){
    var divTab = document.createElement('div');
    if(isActive)
        divTab.setAttribute('class',"tab-pane fade show active");
    else
        divTab.setAttribute('class',"tab-pane fade");
    divTab.setAttribute('id',danhSachDacTrung.getAttribute('masodanhmuc2')+"-tab-content");
    divTab.setAttribute('role',"tabpanel");
    divTab.setAttribute('aria-labelledby',danhSachDacTrung.getAttribute('masodanhmuc2')+"-tab");
    
    var divBorder = document.createElement('div');
    divBorder.setAttribute('class',"border border-top-0 rounded p-2 pt-3");

    var divRow = document.createElement('div');
    divRow.setAttribute('class','row');

    var thuongHieu = danhSachDacTrung.getElementsByTagName('ThuongHieu');
    for(var i = 0; i < thuongHieu.length; i++){
        var a = document.createElement('a');
        a.setAttribute('class',"col-2");
        //a.setAttribute('href',`./XemDanhMuc2.html?masodanhmuc1=${danhSachDacTrung.getAttribute('masodanhmuc2')}&masodanhmuc2=${danhMucCap2[i].getAttribute('maso')}`);
        a.setAttribute('id',thuongHieu[i].getAttribute('maso'));
        a.setAttribute('onclick','onClickThuongHieu(this.id, danhSachMatHang)');
        
        var img = document.createElement('img');
        img.setAttribute('class',"d-block mx-auto");
        img.setAttribute( 'src',`./img/${thuongHieu[i].getAttribute('maso')}.png`);

        var divText = document.createElement('div');
        divText.setAttribute( 'class',"text-center font-weight-bold");
        divText.innerHTML = thuongHieu[i].innerHTML;

        a.appendChild(img);
        a.appendChild(divText);
        divRow.appendChild(a);
    }

    divBorder.appendChild(divRow);
    divTab.appendChild(divBorder);
    return divTab;
}

function TaoTabThuongHieu(danhSachDacTrung){
    var div = document.createElement('div');

    for(var i = 0; i < danhSachDacTrung.length; i++){
        var divTab;
        if(danhSachDacTrung[i].getAttribute('masodanhmuc2') == GetURLParameter('masodanhmuc2'))
            divTab = TaoNoiDungThuongHieu(danhSachDacTrung[i],true);
        else
            divTab = TaoNoiDungThuongHieu(danhSachDacTrung[i],false);
        div.appendChild(divTab);
    }

    return div;
}

function TaoNoiDungMatHang(matHang){
    var a = document.createElement('a');
    a.setAttribute('class',"col-md-4 col-lg-3 mb-5 p-0");
    a.setAttribute('href',`./XemChiTiet.html?maso=${matHang.getAttribute('maso')}`);

    var divBorder = document.createElement('div');
    divBorder.setAttribute('class',"border border-light");
    
    var img = document.createElement('img');
    img.setAttribute('class',"hinh-san-pham d-block mx-auto");
    img.setAttribute('src',`./img/${matHang.getAttribute('maso')}/hinh1.jpg`);

    var divTen = document.createElement('div');
    divTen.setAttribute('class',"pl-5 text-secondary");
    divTen.innerHTML = matHang.getAttribute('ten');

    var divGia = document.createElement('div');
    divGia.setAttribute('class',"pl-5 gia-san-pham font-weight-bold");
    divGia.innerHTML = matHang.getAttribute('gia');

    divBorder.appendChild(img);
    divBorder.appendChild(divTen);
    divBorder.appendChild(divGia);

    a.appendChild(divBorder);

    return a;
}

function TaoDanhSachMatHang(danhSachMatHang){
    var div = document.createElement('div');

    for(var i = 0; i < danhSachMatHang.length;i++){
        var aMatHang = TaoNoiDungMatHang(danhSachMatHang[i]);
        div.appendChild(aMatHang); 
    }

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

//Click vào thương hiệu
function onClickThuongHieu(id, danhSachMatHang){
    var div = document.createElement('div');

    for(var i = 0; i < danhSachMatHang.length;i++){
        var thuongHieu = danhSachMatHang[i].getElementsByTagName('ThuongHieu')[0].getAttribute('maso');
        if(thuongHieu == id)
        {
            var aMatHang = TaoNoiDungMatHang(danhSachMatHang[i]);
            div.appendChild(aMatHang); 
        }
    }

    document.getElementById('danhSachSanPham').innerHTML = div.innerHTML;
}