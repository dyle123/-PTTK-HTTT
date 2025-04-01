document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById("search-box");
    const searchBtn = document.getElementById("search-btn");

    // Hàm fetch data từ API
    async function fetchData(maPhieu = "") {
        try {
            let url = new URL("http://localhost:3000/api/getPhieuDangKy");
            let params = new URLSearchParams();

            if (maPhieu) {
                params.append("maPhieu", maPhieu); // Tìm theo mã phiếu
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

            let thaoTacHTML = `<button class="in-phieu" data-ma-phieu="${phieu.MaPhieuDangKy}">In phiếu</button>`;

            tr.innerHTML = `
                <td>${phieu.MaPhieuDangKy}</td>
                <td>${phieu.LoaiChungChi}</td>
                <td>${phieu.NgayDangKy}</td>
                <td>${phieu.ThoiGianMongMuonThi}</td>
                <td>${phieu.MaKhachHang}</td>
                <td>${thaoTacHTML}</td>
            `;
            tableBody.appendChild(tr);
        });

        // Gán sự kiện cho nút "In phiếu"
        document.querySelectorAll(".in-phieu").forEach(button => {
            button.addEventListener("click", function () {
                const maPhieu = this.getAttribute("data-ma-phieu");
                printPhieu(maPhieu);
            });
        });
    }

    // Hàm in phiếu
    function printPhieu(maPhieu) {
        if (confirm(`Bạn có chắc chắn muốn in phiếu #${maPhieu}?`)) {
            // Mở cửa sổ mới để in phiếu
            window.open(`/InPhieuDangKy/InPhieuDangKy.html?maPhieu=${maPhieu}`, '_blank');
        }
    }

    // Lắng nghe sự kiện bấm nút tìm kiếm
    searchBtn.addEventListener("click", function () {
        const maPhieu = searchBox.value.trim();
        fetchData(maPhieu); // Tìm kiếm theo mã phiếu
    });

    searchBox.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });

    // Tải dữ liệu ban đầu (mặc định không có mã phiếu)
    fetchData();
});
