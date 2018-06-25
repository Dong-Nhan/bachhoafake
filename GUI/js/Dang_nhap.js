$('#formDangNhap').submit(function (event) {
    //chặn cái default behavior của form lại
    event.preventDefault();
    console.log($('#formDangNhap').serialize());    
    $.post(`http://localhost:3001/DangNhap`, $('#formDangNhap').serialize(), (data) => {
        if (data == '') alert('Đăng nhập thất bại');
        else {
            alert('Đăng nhập thành công');
            location.reload();
            if (data.search('QL')) location.href = 'http://localhost:3000/Quan_ly.html';
            else location.href = 'http://localhost:3000/Nhan_vien_xem.html';
            
        }
    });
})