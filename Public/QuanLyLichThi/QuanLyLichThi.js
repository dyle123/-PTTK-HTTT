document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const clearBtn = document.getElementById("clear-filter-btn");
    const btnTaoLichThi = document.getElementById("create-btn");

    const maLichThiInput = document.getElementById("filter-ma-lich-thi");
    const ngayThiInput = document.getElementById("filter-ngay-thi");
    const gioThiInput = document.getElementById("filter-gio-thi");
    const loaiChungChiInput = document.getElementById("filter-loai-chung-chi");

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    // Hàm lấy danh sách loại chứng chỉ và hiển thị vào dropdown
    async function layDanhSachChungChi() {
        try {
            const response = await fetch('/api/getLoaiChungChi');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            loaiChungChiInput.innerHTML = '<option value="">Tất cả</option>';

            data.forEach(chungChi => {
                const option = document.createElement('option');
                option.value = chungChi.MaLoaiChungChi;
                option.textContent = chungChi.TenChungChi;
                loaiChungChiInput.appendChild(option);
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chứng chỉ:', error);
        }
    }

    // Hàm fetch dữ liệu lịch thi từ API và lọc
    async function fetchData() {
        try {
            const url = new URL("http://localhost:3000/api/getLichThi");
            const params = new URLSearchParams();

            if (maLichThiInput.value) {
                params.append("maLichThi", maLichThiInput.value);
            }
            if (ngayThiInput.value) {
                params.append("dieuKien", "ngaythi");
                params.append("ngayThi", ngayThiInput.value);
            }
            if (gioThiInput.value) {
                if (timeRegex.test(gioThiInput.value)) {
                    params.append("dieuKien", "giothi");
                    params.append("gioThi", gioThiInput.value);
                } else {
                    alert("Vui lòng nhập giờ đúng định dạng HH:mm:ss (ví dụ: 09:30:00)");
                    return;
                }
            }
            if (loaiChungChiInput.value) {
                params.append("dieuKien", "loaichungchi");
                params.append("loaiChungChi", loaiChungChiInput.value);
            }

            url.search = params.toString();

            const response = await fetch(url);
            const data = await response.json();

            renderTable(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    }

    // Hiển thị dữ liệu lên bảng
    function renderTable(data) {
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6' style='text-align: center;'>Không có dữ liệu</td></tr>";
            return;
        }

        data.forEach(lich => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${lich.MaLichThi}</td>
                <td>${lich.NgayThi}</td>
                <td>${lich.GioThi}</td>
                <td>${lich.SoLuongDangKy || "0"}</td>
                <td>${lich.MaPhongThi}</td>
                <td>${lich.LoaiChungChi}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Sự kiện click nút tìm kiếm
    searchBtn.addEventListener("click", () => {
        fetchData();
    });

    // Sự kiện click nút xóa bộ lọc
    clearBtn.addEventListener("click", () => {
        maLichThiInput.value = "";
        ngayThiInput.value = "";
        gioThiInput.value = "";
        loaiChungChiInput.value = "";
        fetchData();
    });

    // Sự kiện click nút tạo lịch thi mới
    btnTaoLichThi.addEventListener("click", () => {
        window.location.href = "/QuanLyLichThi/TaoLichThiMoi.html";
    });

    // Thêm sự kiện nhấn Enter ở các input để tự động tìm kiếm
    const inputFields = [maLichThiInput, ngayThiInput, gioThiInput, loaiChungChiInput];
    inputFields.forEach(input => {
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Ngăn submit form nếu có
                fetchData();
            }
        });
    });

    // Khi trang load lần đầu
    layDanhSachChungChi();
    fetchData();
});
