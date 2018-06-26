$('#formDangNhap').submit(function (event) {
    //chặn cái default behavior của form lại
    event.preventDefault();
    console.log($('#formDangNhap').serialize());

    event.preventDefault();
    $.ajax({
            url: "http://localhost:3001/DangNhap",
            type: "POST",
            data: $('#formDangNhap').serialize(),
            xhrFields: { //send cookie cho cross domain
                withCredentials: true
            },
        })
        .done(function (data) {
            if (data == '') alert('Đăng nhập thất bại');
            else {
                if (data.search('QL') != -1) location.href = 'http://localhost:3000/Quan_ly.html';
                else location.href = 'http://localhost:3000/Nhan_vien_xem.html';
            }
        });

    // $.post(`http://localhost:3001/DangNhap`, $('#formDangNhap').serialize(), (data) => {
    //     if (data == '') alert('Đăng nhập thất bại');
    //     else {
    //         console.log(data);
    //         //vì handle response bằng tay nên phải set cookie bằng tay
    //         document.cookie = `tokenkey=` + data;
    //         if (data.search('QL') != -1) location.href = 'http://localhost:3000/Quan_ly.html';
    //         else location.href = 'http://localhost:3000/Nhan_vien_xem.html';
    //     }
    // });
})