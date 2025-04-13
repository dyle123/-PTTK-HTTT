
document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById("search-box");
    const searchBtn = document.getElementById("search-btn");

    async function fetchData(maPhieu = "") {
        try {
            let url = new URL("http://localhost:3000/api/getPhieuDangKy");
            if (maPhieu) url.searchParams.append("maPhieu", maPhieu);

            const response = await fetch(url);
            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    }

    function renderTable(data) {
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='7'>Không có dữ liệu</td></tr>";
            return;
        }

        data.forEach(phieu => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${phieu.MaPhieuDangKy}</td>
                <td>${phieu.LoaiChungChi}</td>
                <td>${phieu.NgayDangKy}</td>
                <td>${phieu.NgayThi || ''} ${phieu.GioThi || ''}</td>
                <td>${phieu.MaKhachHang}</td>
                <td><button class="in-phieu" data-ma-phieu="${phieu.MaPhieuDangKy}">🖨️ In phiếu</button></td>
            `;
            tableBody.appendChild(tr);
        });

        document.querySelectorAll(".in-phieu").forEach(button => {
            button.addEventListener("click", function () {
                const maPhieu = this.getAttribute("data-ma-phieu");
                printPhieu(maPhieu);
            });
        });
    }

    async function printPhieu(maPhieuDangKy) {
        try {
            const res = await fetch(`/api/getPhieuDangKyTD?maPhieu=${maPhieuDangKy}`);
            const phieu = (await res.json())[0];
            if (!phieu) {
                alert("Không tìm thấy phiếu");
                return;
            }

            const khachHang = await fetch(`/api/getKhachHangByPhieu?maPhieuDangKy=${maPhieuDangKy}`).then(r => r.json()).then(r => r[0]);
            const chiTiet = await fetch(`/api/getChiTietPhieuDangKy?maPhieuDangKy=${maPhieuDangKy}`).then(r => r.json()).then(r => r[0]);
            const thisinh = await fetch(`/api/getThisinhByCCCD?cccd=${chiTiet?.CCCD}`).then(r => r.json()).then(r => r[0]);

            const html = `
                <div style="padding: 20px; font-family: Arial;">
                    <h2 style="text-align:center">PHIẾU ĐĂNG KÝ DỰ THI</h2>
                    <h3>1. Thông tin khách hàng</h3>
                    <p>Họ tên: ${khachHang?.TenKhachHang}</p>
                    <p>Email: ${khachHang?.Email}</p>
                    <p>SDT: ${khachHang?.SoDienThoai}</p>
                    <p>Địa chỉ: ${khachHang?.DiaChi}</p>
                    <p>Loại: ${khachHang?.LoaiKhachHang}</p>
                    <h3>2. Thông tin thí sinh</h3>
                    <p>Họ tên: ${thisinh?.HoVaTen}</p>
                    <p>CCCD: ${thisinh?.CCCD}</p>
                    <p>Ngày sinh: ${thisinh?.NgaySinh}</p>
                    <p>Email: ${thisinh?.Email}</p>
                    <p>SDT: ${thisinh?.SoDienThoai}</p>
                    <p>Địa chỉ: ${thisinh?.DiaChi}</p>
                    <h3>3. Thông tin phiếu đăng ký</h3>
                    <p>Mã phiếu: ${phieu.MaPhieuDangKy}</p>
                    <p>Ngày đăng ký: ${phieu.NgayDangKy}</p>
                    <p>Ngày thi: ${phieu.NgayThi}</p>
                    <p>Giờ thi: ${phieu.GioThi}</p>
                    <p>Phòng thi: ${phieu.MaPhongThi}</p>
                    <p>Loại chứng chỉ: ${phieu.LoaiChungChi}</p>
                </div>
            `;

            const container = document.getElementById("phieu-in");
            container.innerHTML = html;
            container.style.display = "block";

            setTimeout(() => {
                window.print();
                container.style.display = "none";
            }, 500);
        } catch (err) {
            alert("Lỗi khi in phiếu: " + err.message);
        }
    }

    searchBtn.addEventListener("click", function () {
        const maPhieu = searchBox.value.trim();
        fetchData(maPhieu);
    });

    searchBox.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });

    const maPhieuFromSession = sessionStorage.getItem("maPhieuDangKy");
    if (maPhieuFromSession) {
        fetchData(maPhieuFromSession);
        sessionStorage.removeItem("maPhieuDangKy");
    } else {
        fetchData();
    }
});
