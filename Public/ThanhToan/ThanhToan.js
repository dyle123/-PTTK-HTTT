document.addEventListener("DOMContentLoaded", function () {
    const radios = document.querySelectorAll("input[name='filter']");
    const searchBox = document.getElementById("search-box");
    const searchBtn = document.getElementById("search-btn");

    // Hàm fetch data từ API
    async function fetchData(filter, maPhieu = "") {
        try {
            let url = new URL("http://localhost:3000/api/getPhieuDangKy");
            let params = new URLSearchParams();

            if (maPhieu) {
                params.append("maPhieu", maPhieu); // Chỉ tìm theo mã phiếu
            } else if (filter) {
                params.append("dieuKien", filter); // Nếu không có mã phiếu, tìm theo radio filter
            }

            url.search = params.toString(); // Gán tham số vào URL

            console.log("Gửi request đến API:", url.toString()); // Debugging

            const response = await fetch(url);
            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    }

    // Hàm render dữ liệu vào bảng
    // Hàm render dữ liệu vào bảng
        function renderTable(data) {
            const tableBody = document.getElementById("table-body");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            if (!Array.isArray(data) || data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='7' style='text-align: center;'>Không có dữ liệu</td></tr>";
                return;
            }

            data.forEach(phieu => {
                const tr = document.createElement("tr");
                let trangThaiHienThi = "";
                let trangThaiClass = "";
                
                if (phieu.TrangThaiThanhToan == 1) {
                    trangThaiHienThi = "Đã thanh toán";
                    trangThaiClass = "da-thanh-toan";
                } else if (phieu.TrangThaiThanhToan == 2) {
                    trangThaiHienThi = "Quá hạn";
                    trangThaiClass = "qua-han";
                } else {
                    trangThaiHienThi = "Chưa thanh toán";
                    trangThaiClass = "chua-thanh-toan";
                }
                



                tr.innerHTML = `
                    <td>${phieu.MaPhieuDangKy}</td>
                    <td>${phieu.LoaiChungChi}</td>
                    <td>${phieu.NgayDangKy}</td>
                    <td>${phieu.LichThi}</td>
                    <td>${phieu.MaKhachHang}</td>
                    <td class="${trangThaiClass}">${trangThaiHienThi}</td>
                    <td>
                        <button class="btn-xem" data-maphieu="${phieu.MaPhieuDangKy}">Xem phiếu thanh toán</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

    // ⚠️ Quan trọng: Gán sự kiện click sau khi bảng đã được render
    document.querySelectorAll(".btn-xem").forEach(button => {
        button.addEventListener("click", function () {
            const maPhieu = this.getAttribute("data-maphieu");
            window.location.href = `/ThanhToan/PhieuThanhToan.html?maPhieuDangKy=${maPhieu}`;
        });
    });
}


     // Thêm sự kiện click cho các button "Xem Phiếu Thanh Toán"
     document.querySelectorAll(".btn-xem").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định
            const maPhieu = this.getAttribute("data-maphieu");
            const targetUrl = `/ThanhToan/PhieuThanhToan.html?maPhieuDangKy=${maPhieu}`;

            // Thêm lớp fade-out vào body
            document.body.classList.add("fade-out");

            // Chờ hiệu ứng hoàn tất rồi chuyển trang
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500); // Thời gian khớp với transition trong CSS
        });
    });

    // Lắng nghe sự thay đổi radio
    radios.forEach(radio => {
        radio.addEventListener("change", function () {
            fetchData(this.value);
        });
    });

    // Lắng nghe sự kiện bấm nút tìm kiếm
    searchBtn.addEventListener("click", function () {
        const maPhieu = searchBox.value.trim();
        const selectedFilter = maPhieu ? "" : (document.querySelector("input[name='filter']:checked")?.id || "");
        fetchData(selectedFilter, maPhieu);
    });

    // Tải dữ liệu ban đầu (mặc định là 'all')
    fetchData("all");
});
// Hiệu ứng fade-in khi tải trang
document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    // Thêm sự kiện để xử lý fade-out khi điều hướng
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (event) {
            const href = this.getAttribute("href");

            // Kiểm tra nếu liên kết không phải là anchor (#) hoặc không trống
            if (href && href !== "#") {
                event.preventDefault(); // Ngăn chặn hành động mặc định
                document.body.classList.add("fade-out");

                // Chờ hiệu ứng hoàn tất rồi chuyển trang
                setTimeout(() => {
                    window.location.href = href;
                }, 500); // Thời gian khớp với transition trong CSS
            }
        });
    });
});