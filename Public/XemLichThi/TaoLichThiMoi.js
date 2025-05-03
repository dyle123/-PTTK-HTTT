async function layDanhSachChungChi() {
    try {
        const response = await fetch('/api/getLoaiChungChi');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dữ liệu JSON nhận được:', data);
        const selectLoaiChungChi = document.getElementById('loaiChungChi');

        selectLoaiChungChi.innerHTML = '<option value="">Chọn loại chứng chỉ</option>';

        data.forEach(chungChi => {
            console.log('Đang xử lý chứng chỉ:', chungChi);
            const option = document.createElement('option');
            option.value = chungChi.MaLoaiChungChi;
            option.textContent = chungChi.TenChungChi;
            selectLoaiChungChi.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách chứng chỉ:', error);
    }
}

async function layDanhSachPhongThi() {
    try {
        const response = await fetch('/api/phongthi'); // Gọi API mà không có tham số query
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const selectPhongThi = document.getElementById('phongThi');

        selectPhongThi.innerHTML = '<option value="">Chọn phòng thi</option>';

        data.forEach(phongThi => {
            const option = document.createElement('option');
            option.value = phongThi.MaPhongThi;
            option.textContent = `Phòng ${phongThi.MaPhongThi} (Sức chứa: ${phongThi.SucChuaToiDa})`;
            selectPhongThi.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng thi:', error);
    }
}

async function layDanhSachNhanVien() {
    try {
        const response = await fetch('/api/nhanvienGac'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const selectNhanVien = document.getElementById('nhanVienGac');

        // Xóa các option cũ (nếu có)
        selectNhanVien.innerHTML = '<option value="">Chọn nhân viên</option>';

        data.forEach(nhanVienGac => {
            const option = document.createElement('option');
            option.value = nhanVienGac.MaNhanVien;
            option.textContent = nhanVienGac.HoTen;
            selectNhanVien.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    layDanhSachChungChi();
    layDanhSachPhongThi();
    layDanhSachNhanVien();

    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const gioThiInput = document.getElementById('gioThi'); // Lấy tham chiếu đến input giờ thi

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const ngayThi = document.getElementById('ngayThi').value;
        let gioThi = gioThiInput.value; // Lấy giá trị từ input type='time'

        // Đảm bảo định dạng HH:mm:ss
        if (gioThi && gioThi.split(':').length === 2) {
            gioThi += ':00'; // Thêm giây nếu chỉ có giờ và phút
        } else if (!gioThi) {
            alert("Vui lòng chọn giờ thi.");
            return;
        }

        const loaiChungChi = parseInt(document.getElementById('loaiChungChi').value);
        const phongThi = parseInt(document.getElementById('phongThi').value);
        const nhanVienGac = document.getElementById('nhanVienGac').value; // Lấy giá trị từ dropdown nhân viên


        console.log('ngayThi:', ngayThi);
        console.log('gioThi (đã xử lý):', gioThi);
        console.log('loaiChungChi:', loaiChungChi);
        console.log('phongThi:', phongThi);
        console.log('nhanVienGac:', nhanVienGac);


        if (!ngayThi || !gioThi || isNaN(loaiChungChi) || isNaN(phongThi) || !nhanVienGac) {
            alert("Vui lòng điền đầy đủ thông tin ngày thi, giờ thi, loại chứng chỉ và phòng thi và nhân viên gác thi.");
            return;
        }

        const data = {
            ngayThi: ngayThi,
            gioThi: gioThi,
            loaiChungChi: loaiChungChi,
            phongThi: phongThi,
            nhanVienGac: nhanVienGac, 
            SoLuongDangKy: 0
        };

        console.log('Dữ liệu gửi đi:', data);
        try {
            const response = await fetch('/api/tao-lich-thi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Tạo lịch thi thành công!');
                window.location.href = '/QuanLyLichThi/QuanLyLichThi.html';
            } else {
                alert(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            alert('Đã xảy ra lỗi khi tạo lịch thi.');
        }
    });

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });
});