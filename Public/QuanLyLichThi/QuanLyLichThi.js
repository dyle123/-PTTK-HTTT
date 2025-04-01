document.addEventListener("DOMContentLoaded", function () {
    const radios = document.querySelectorAll("input[name='filter']");
    const searchBox = document.getElementById("search-box");
    const searchBtn = document.getElementById("search-btn");
    const btnTaoLichThi = document.getElementById("create-btn");


    // Hàm fetch data từ API
    async function fetchData(filter, searchValue = "") {
        try {
            let url = new URL("http://localhost:3000/api/getLichThi");
            let params = new URLSearchParams();

            if (searchValue) {
                params.append("maLichThi", searchValue); // Tìm theo mã lịch thi
            } else if (filter && filter !== "all") {
                params.append("dieuKien", filter); // Nếu không có mã lịch, tìm theo filter
            }

            url.search = params.toString(); // Gán tham số vào URL

            console.log("Gửi request đến API:", url.toString()); // Debugging

            const response = await fetch(url);
            const data = await response.json().catch(() => {
                console.error("Lỗi khi phân tích JSON");
                return [];
            });

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

    // Sự kiện bấm nút "Tạo Lịch Thi Mới"
    btnTaoLichThi.addEventListener("click", function () {
        window.location.href = "/QuanLyLichThi/TaoLichThiMoi.html";
    });

    // Lắng nghe sự thay đổi radio (lọc theo điều kiện)
    radios.forEach(radio => {
        radio.addEventListener("change", function () {
            searchBox.value = "";
            fetchData(this.value);
        });
    });

    // Lắng nghe sự kiện bấm nút tìm kiếm (tìm theo mã lịch thi)
    searchBtn.addEventListener("click", function () {
        const searchValue = searchBox.value.trim();
        const selectedRadio = document.querySelector("input[name='filter']:checked");
        const selectedFilter = searchValue ? "" : (selectedRadio ? selectedRadio.value : "all");
        fetchData(selectedFilter, searchValue);
    });

    searchBox.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });


    // Tải dữ liệu ban đầu (mặc định hiển thị tất cả lịch thi)
    fetchData("all");
});
