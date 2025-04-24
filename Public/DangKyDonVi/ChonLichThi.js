document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const clearBtn = document.getElementById("clear-filter-btn");
    const nextStepBtn = document.getElementById("next-step-btn");

    const maLichThiInput = document.getElementById("filter-ma-lich-thi");
    const ngayThiInput = document.getElementById("filter-ngay-thi");
    const loaiChungChiInput = document.getElementById("filter-loai-chung-chi");

    const btnTaoLichThi = document.getElementById("create-btn");

    const tableBody = document.getElementById("table-body");
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    // Lấy danh sách chứng chỉ
    async function layDanhSachChungChi() {
        try {
            const response = await fetch('/api/getLoaiChungChi');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

    // Lấy dữ liệu lịch thi
    async function fetchData() {
        try {
            const url = new URL("http://localhost:3000/api/getLichThi");
            const params = new URLSearchParams();

            if (maLichThiInput.value) params.append("maLichThi", maLichThiInput.value);
            if (ngayThiInput.value) {
                params.append("dieuKien", "ngaythi");
                params.append("ngayThi", ngayThiInput.value);
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

    // Hiển thị bảng
    function renderTable(data) {
        tableBody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6' style='text-align: center;'>Không có dữ liệu</td></tr>";
            return;
        }

        data.forEach(lich => {
            const currentRegistrations = lich.SoLuongDangKy || 0; // Ví dụ
            const maxCapacity = lich.SucChua || 30; // Ví dụ
            const isDisabled = currentRegistrations >= maxCapacity;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${lich.MaLichThi}</td>
                <td>${lich.NgayThi}</td>
                <td>${lich.GioThi}</td>
                <td>${currentRegistrations}/${maxCapacity}</td>
                <td>${lich.MaPhongThi}</td>
                <td>${lich.LoaiChungChi}</td>
                <td>
                    ${isDisabled
                    ? "<span style='color:gray'>Đã đầy</span>"
                    : `<input type="radio" name="chon-lich" value="${lich.MaLichThi}" data-loaichungchi="${lich.LoaiChungChi}">`
                }
                </td>
            `;
            if (isDisabled) tr.style.opacity = 0.6;
            tableBody.appendChild(tr);
        });

    }

    // Bắt sự kiện nút tìm kiếm
    searchBtn.addEventListener("click", () => {
        fetchData();
    });

    // Bắt sự kiện nút xoá bộ lọc
    clearBtn.addEventListener("click", () => {
        maLichThiInput.value = "";
        ngayThiInput.value = "";
        loaiChungChiInput.value = "";
        fetchData();
    });



    // Bắt sự kiện Enter để tìm kiếm nhanh
    [maLichThiInput, ngayThiInput, loaiChungChiInput].forEach(input => {
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                fetchData();
            }
        });
    });

    // Bắt sự kiện nút tiếp tục
    nextStepBtn.addEventListener("click", () => {
        const selected = document.querySelector("input[name='chon-lich']:checked");
        if (!selected) {
            alert("Vui lòng chọn một lịch thi.");
            return;
        }
        const selectedMaLichThi = selected.value;
        // Xử lý bước tiếp theo (ví dụ: chuyển trang, lưu vào localStorage, gọi API khác, ...)
        console.log("Lịch thi đã chọn:", selectedMaLichThi);
        window.location.href = `/DangKyDonVi/DienThongTin.html?maLichThi=${selectedMaLichThi}`;
    });

    // Sự kiện click nút tạo lịch thi mới
    btnTaoLichThi.addEventListener("click", () => {
        window.location.href = "/QuanLyLichThi/TaoLichThiMoi.html";

    });

    // Khi trang load lần đầu
    layDanhSachChungChi();
    fetchData();
});
