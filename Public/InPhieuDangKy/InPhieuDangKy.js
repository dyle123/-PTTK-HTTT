document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById("search-box");
    const searchBtn = document.getElementById("search-btn");

    async function fetchData(maPhieu = "") {
        try {
            let url = new URL("/api/getPhieuDangKy", window.location.origin);
            let params = new URLSearchParams();

            if (maPhieu) {
                params.append("maPhieu", maPhieu);
            }

            url.search = params.toString();
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
            tableBody.innerHTML = "<tr><td colspan='7' style='text-align: center;'>Không có dữ liệu</td></tr>";
            return;
        }

        data.forEach(phieu => {
            const tr = document.createElement("tr");

            const loaiChungChiCode = String(phieu.LoaiChungChi).split(',')[0];
            const loaiChungChiText = loaiChungChiCode == 1 ? "Toeic" : (loaiChungChiCode == 2 ? "Ielts" : "Khác");

            let thaoTacHTML = `<button class="in-phieu" data-ma-phieu="${phieu.MaPhieuDangKy}">In phiếu</button>`;

            tr.innerHTML = `
                <td>${phieu.MaPhieuDangKy}</td>
                <td>${loaiChungChiText}</td>
                <td>${phieu.NgayDangKy?.split('T')[0]}</td>
                <td>${phieu.NgayThi ? phieu.NgayThi.split('T')[0] : ""}</td>
                <td>${phieu.MaKhachHang}</td>
                <td>${thaoTacHTML}</td>
            `;
            tableBody.appendChild(tr);
        });

        document.querySelectorAll(".in-phieu").forEach(button => {
            button.addEventListener("click", function () {
                const maPhieu = this.getAttribute("data-ma-phieu");
                generatePDF(maPhieu);
            });
        });
    }

    async function generatePDF(maPhieu) {
    try {
        const response = await fetch(`/api/getPhieuDangKyById?maPhieu=${maPhieu}`);
        const data = await response.json();
        if (!data || data.length === 0) {
            alert("Không tìm thấy phiếu đăng ký!");
            return;
        }
        const phieu = data[0];

            const content = `
                <div style="font-family: 'Times New Roman', serif; padding: 20px; max-width: 600px; margin: auto; border: 2px solid black; border-radius: 10px;">
                    <h2 style="text-align: center;">PHIẾU ĐĂNG KÝ THI</h2>

                    <p><strong>Mã phiếu:</strong> ${phieu.MaPhieuDangKy}</p>
                    <p><strong>Ngày đăng ký:</strong> ${phieu.NgayDangKy?.split('T')[0]}</p>
                    <p><strong>Ngày thi:</strong> ${phieu.NgayThi?.split('T')[0]}</p>
                    <p><strong>Loại chứng chỉ:</strong> ${phieu.LoaiChungChi == 1 ? "Toeic" : (phieu.LoaiChungChi == 2 ? "Ielts" : "Khác")}</p>

                    <hr style="margin: 20px 0;"/>

                    <h3>Thông tin Khách hàng</h3>
                    <div style="padding-left: 20px;">
                        <p><strong>Họ tên:</strong> ${phieu.TenKhachHang || ""}</p>
                        <p><strong>Email:</strong> ${phieu.Email || ""}</p>
                        <p><strong>Số điện thoại:</strong> ${phieu.SoDienThoai || ""}</p>
                        <p><strong>Địa chỉ:</strong> ${phieu.DiaChi || ""}</p>
                    </div>

                    <hr style="margin: 20px 0;"/>

                    <h3>Thông tin Thí sinh</h3>
                    <div style="padding-left: 20px;">
                        <p><strong>Họ tên:</strong> ${phieu.TenThiSinh || ""}</p>
                        <p><strong>Ngày sinh:</strong> ${phieu.NgaySinh?.split('T')[0] || ""}</p>
                        <p><strong>CCCD:</strong> ${phieu.CCCD || ""}</p>
                        <p><strong>Email:</strong> ${phieu.EmailThiSinh || ""}</p>
                        <p><strong>Số điện thoại:</strong> ${phieu.SDTThiSinh || ""}</p>
                    </div>

                    <hr style="margin: 20px 0;"/>

                    <p style="text-align: right; margin-top: 50px;">Ngày .... tháng .... năm ....</p>
                    <p style="text-align: right;">(Chữ ký khách hàng)</p>
                </div>
            `;

            const opt = {
                margin: 0.5,
                filename: `PhieuDangKy_${maPhieu}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().from(content).set(opt).save();
        } catch (error) {
            console.error("Lỗi khi tạo PDF:", error);
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

    const maPhieuDangKy = sessionStorage.getItem("maPhieuDangKy");
    if (maPhieuDangKy) {
        fetchData(maPhieuDangKy);
        sessionStorage.removeItem("maPhieuDangKy");
    } else {
        fetchData();
    }
});
