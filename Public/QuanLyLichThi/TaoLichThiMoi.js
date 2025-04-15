document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const ngayThi = document.getElementById('ngayThi').value;
        const gioThi = document.getElementById('gioThi').value;
        const soLuong = parseInt(document.getElementById('soLuong').value);
        const loaiChungChi = parseInt(document.getElementById('loaiChungChi').value);
        const phongThi = parseInt(document.getElementById('phongThi').value);

        if (!ngayThi || !gioThi || !soLuong || !loaiChungChi || !phongThi) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        const data = {
            ngayThi,
            gioThi,
            soLuong,
            loaiChungChi,
            phongThi
        };

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
                location.reload(); // hoặc redirect đến trang khác
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
