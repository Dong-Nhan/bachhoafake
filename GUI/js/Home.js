/************       Xử lý lưu trữ       *******************/
//Đọc danh sách danh mục
function DocDanhSachDanhMuc(){
    var request = new XMLHttpRequest();
    request.open('GET','http://localhost:3001/LayThongTinDanhMucTrangChu',false);
    request.send();
    var chuoiXml = request.responseText;
    var data = new DOMParser().parseFromString(chuoiXml,"text/xml").documentElement;
    var danhSachDanhMuc = data.getElementsByTagName('DanhMucCap1');
    return danhSachDanhMuc;
}

//Đọc danh sách mặt hàng trang chủ
function DocDanhSachMatHang(){
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:3001/LayThongTinMatHangTrangChu',false);
    request.send();
    var chuoiXml = request.responseText;
    var dom = new DOMParser().parseFromString(chuoiXml,'text/xml').documentElement;
    var danhSachMatHang = dom.getElementsByTagName('MatHang');
    return danhSachMatHang;
}

/************       Xử lý thể hiện       *******************/
function TaoNoiDungDanhMucSanPham(danhMuc, isActive){
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

    a.setAttribute('onclick','ClickDMC1(this.id, danhSachMatHang)');
    li.appendChild(a);
    
    return li;
}

function TaoDanhMucSanPham(danhSachDanhMuc){
    var ul = document.createElement('ul');

    var li = TaoNoiDungDanhMucSanPham(danhSachDanhMuc[0],true);
    ul.appendChild(li);

    for(var i = 1; i < danhSachDanhMuc.length; i++){
        var li1 = TaoNoiDungDanhMucSanPham(danhSachDanhMuc[i],false);
        ul.appendChild(li1);
    }

    return ul;
}

function TaoNoiDungDanhMucCap2(danhSachDanhMucCap2, isActive){
    var divTab = document.createElement('div');
    if(isActive)
        divTab.setAttribute('class',"tab-pane fade show active");
    else
        divTab.setAttribute('class',"tab-pane fade");
    divTab.setAttribute('id',danhSachDanhMucCap2.getAttribute('maso')+"-tab-content");
    divTab.setAttribute('role',"tabpanel");
    divTab.setAttribute('aria-labelledby',danhSachDanhMucCap2.getAttribute('maso')+"-tab");
    
    var divBorder = document.createElement('div');
    divBorder.setAttribute('class',"border border-top-0 rounded p-2 pt-3");

    var divRow = document.createElement('div');
    divRow.setAttribute('class','row');

    var danhMucCap2 = danhSachDanhMucCap2.getElementsByTagName('DanhMucCap2');
    for(var i = 0; i < danhMucCap2.length; i++){
        var a = document.createElement('a');
        a.setAttribute('class',"col-2");
        a.setAttribute('href',`./XemDanhMuc2.html?masodanhmuc1=${danhSachDanhMucCap2.getAttribute('maso')}&masodanhmuc2=${danhMucCap2[i].getAttribute('maso')}`);
        a.setAttribute('id',danhMucCap2[i].getAttribute('maso'));
        //a.setAttribute('onclick','ClickDMC1(this.id, danhSachMatHang)');
        
        var img = document.createElement('img');
        img.setAttribute('class',"d-block mx-auto");
        img.setAttribute( 'src',`./img/${danhMucCap2[i].getAttribute('maso')}.png`);

        var divText = document.createElement('div');
        divText.setAttribute( 'class',"text-center font-weight-bold");
        divText.innerHTML = danhMucCap2[i].getAttribute('ten');

        a.appendChild(img);
        a.appendChild(divText);
        divRow.appendChild(a);
    }

    divBorder.appendChild(divRow);
    divTab.appendChild(divBorder);
    return divTab;
}

function TaoTabDanhMucCap2(danhSachDanhMuc){
    var div = document.createElement('div');

    var divTabActive = TaoNoiDungDanhMucCap2(danhSachDanhMuc[0],true);
    div.appendChild(divTabActive);

    for(var i = 1; i < danhSachDanhMuc.length; i++){
        var divTab = TaoNoiDungDanhMucCap2(danhSachDanhMuc[i],false);
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
    let parent = danhSachMatHang[0].parentNode;

    for(var i = 0; i < 12;i++){
        let ran = Math.floor(Math.random()*(danhSachMatHang.length-i));
        let sanPham = parent.removeChild(danhSachMatHang[ran]);
        var aMatHang = TaoNoiDungMatHang(sanPham);
        parent.appendChild(sanPham);
        div.appendChild(aMatHang); 
    }

    return div;
}


/************       Xử lý nghiệp vụ       *******************/
function ClickDMC1(id, danhSachMatHang){
    var masodanhmuc1 = id.substring(0,id.lastIndexOf('-'));
    var div = document.createElement('div');

    for(var i = 0; i < danhSachMatHang.length;i++){
        if(danhSachMatHang[i].getAttribute('masodanhmuc1') == masodanhmuc1)
        {
            var aMatHang = TaoNoiDungMatHang(danhSachMatHang[i]);
            div.appendChild(aMatHang); 
        }
    }

    document.getElementById('danhSachSanPham').innerHTML = div.innerHTML;
}