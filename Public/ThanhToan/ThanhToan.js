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
    function renderTable(data) {
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = ""; // Xóa dữ liệu cũ

        if (!Array.isArray(data) || data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='7' style='text-align: center;'>Không có dữ liệu</td></tr>";
            return;
        }

        data.forEach(phieu => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${phieu.MaPhieuDangKy}</td>
                <td>${phieu.LoaiChungChi}</td>
                <td>${phieu.NgayDangKy}</td>
                <td>${phieu.ThoiGianMongMuonThi}</td>
                <td>${phieu.MaKhachHang}</td>
                <td>${phieu.TrangThaiThanhToan}</td>
                <td><button class="pay-btn">Phiếu thanh toán</button></td>
            `;
            tableBody.appendChild(tr);
        });
    }

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
