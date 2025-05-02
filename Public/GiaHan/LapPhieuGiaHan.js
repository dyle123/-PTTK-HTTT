let daXacNhan=false;
        async function lapPhieuGiaHan() {
            const cccd = document.getElementById('Input_CCCD').value.trim();
            const maPhieuDangKy = parseInt(document.getElementById('Input_MaPhieuDangKy').value);
            const phiGiaHan = parseInt(document.getElementById('Input_PhiGiaHan').value);
            const lyDo = document.getElementById('Input_LyDoGiaHan').value.trim();
            const loaiGiaHan = document.getElementById('Input_LoaiGiaHan').value;
            const ngayCu = document.getElementById('Input_NgayDuThiCu').value;
            const ngayMoi = document.getElementById('Input_NgayDuThiMoi').value;

            if (!cccd || !maPhieuDangKy || !lyDo || !ngayCu || !ngayMoi||!loaiGiaHan||phiGiaHan<0) {
                alert('Vui lòng điền đầy đủ thông tin (hoặc phí gia hạn phải >=0)');
                return;
            }

            try {
                const response = await fetch('/api/lapPhieuGiaHan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        CCCD: cccd,
                        MaPhieuDangKy: maPhieuDangKy,
                        LiDoGiaHan: lyDo,
                        LoaiGiaHan:loaiGiaHan,
                        NgayThiCu: ngayCu,
                        NgayThiMoi: ngayMoi,
                        PhiGiaHan: phiGiaHan
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Lập phiếu gia hạn thành công!');
                    daXacNhan=true;
                   
                } else {
                    alert('Lỗi: ' + result.error);
                }
            } catch (err) {
                console.error(err);
                alert('Có lỗi xảy ra khi kết nối đến server.');
            }
        }

    // 2. Gán sự kiện click sau khi DOM đã load
    document.getElementById('btn_XacNhan').addEventListener('click', lapPhieuGiaHan);

    function chuyenDinhDangNgay(ngay) {
        const [year, month, day] = ngay.split('-'); // Tách ngày theo định dạng yyyy-mm-dd
        return `${day}/${month}/${year}`; // Định dạng lại thành dd/mm/yyyy
    }

    function inPhieu() {
        // Lấy dữ liệu từ các input fields
        const cccd = document.getElementById('Input_CCCD').value.trim();
        const maPhieuDangKy = document.getElementById('Input_MaPhieuDangKy').value.trim();
        const lyDo = document.getElementById('Input_LyDoGiaHan').value.trim();
        const loaiGiaHan = document.getElementById('Input_LoaiGiaHan').value;
        const ngayCu = chuyenDinhDangNgay(document.getElementById('Input_NgayDuThiCu').value); // Định dạng ngày cũ
        const ngayMoi = chuyenDinhDangNgay(document.getElementById('Input_NgayDuThiMoi').value); // Định dạng ngày mới

        if (!daXacNhan) {
        alert('Bạn cần nhấn nút Xác Nhận trước khi in phiếu.');
        return;
        }


        // if (!cccd || !maPhieuDangKy || !lyDo || !ngayCu || !ngayMoi) {
        //     alert('Vui lòng nhập đầy đủ thông tin trước khi in phiếu.');
        //     return;
        // }

        // Tạo nội dung cần in
        const noiDung = `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; width: 80%; margin: 0 auto;">
                        <h2 style="text-align: center;">TRUNG TÂM NGOẠI NGỮ ACCI</h2>
                        <p style="text-align: center;">Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                        <p style="text-align: center;">Điện thoại: (028) 1234 5678</p>
            </div>
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; width: 80%; margin: 0 auto;">
                <h3 style="text-align: center; font-size: 5vh; color: #000;">Thông tin phiếu gia hạn</h3>
                <p style="margin: 10px 0; font-size: 2vh;"><strong>CCCD:</strong> ${cccd}</p>
                <p style="margin: 10px 0; font-size: 2vh;"><strong>Mã phiếu đăng ký:</strong> ${maPhieuDangKy}</p>
                <p style="margin: 10px 0; font-size: 2vh;"><strong>Lý do gia hạn:</strong> ${lyDo}</p>
                <p style="margin: 10px 0; font-size: 2vh;"><strong>Loại gia hạn:</strong> ${loaiGiaHan}</p>
                <p style="margin: 10px 0; font-size: 2vh;"><strong>Ngày dự thi cũ:</strong> ${ngayCu}</p>
                <p style="margin: 10px 0; font-size: 2vh;"><strong>Ngày dự thi mới:</strong> ${ngayMoi}</p>
            </div>
        `;


        // Mở cửa sổ in và hiển thị nội dung
        const win = window.open('', '', 'width=800,height=600');
        win.document.write('<html><head><title>Phiếu Gia Hạn</title></head><body>');
        win.document.write('<html><head></head><body>');
        win.document.write(noiDung);
        win.document.write('</body></html>');
        win.document.close(); // Đóng luồng ghi
        win.print(); // Thực hiện in
        daXacNhan=false;
        
    }