document.addEventListener("DOMContentLoaded", function () {
    const radios = document.querySelectorAll("input[name='filter']");
    const searchBox = document.getElementById("search-box");
    const searchBtn = document.getElementById("search-btn");
    const tableBody = document.getElementById("table-body");

    async function fetchData(filter, searchValue = "") {
        try {
            let url = new URL("http://localhost:3000/api/getLichThi");
            let params = new URLSearchParams();

            if (searchValue) {
                params.append("maLichThi", searchValue);
            } else if (filter && filter !== "all") {
                params.append("dieuKien", filter);
            }

            url.search = params.toString();

            const res = await fetch(url);
            const data = await res.json();
            renderTable(data);
        } catch (err) {
            console.error("Lỗi fetch:", err);
        }
    }

    function renderTable(data) {
        tableBody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            tableBody.innerHTML = <tr><td colspan="7" style="text-align:center;">Không có lịch thi phù hợp</td></tr>;
            return;
        }

        data.forEach(lich => {
            if (lich.SoLuongDangKy >= 30) return; // Ẩn nếu đã đủ thí sinh

            const tr = document.createElement("tr");
            tr.innerHTML = `
    <td>${lich.MaLichThi}</td>
    <td>${lich.NgayThi}</td>
    <td>${lich.GioThi}</td>
    <td>${lich.SoLuongDangKy || 0}</td>
    <td>${lich.MaPhongThi}</td>
    <td>${lich.LoaiChungChi}</td>
    <td>
        <input type="radio" name="chon-lich" value="${lich.MaLichThi}" 
               data-loaichungchi="${lich.LoaiChungChi}" 
               data-thoigian="${lich.NgayThi}">
    </td>
`;
   tableBody.appendChild(tr);
        });
    }

    document.getElementById("btn-xac-nhan").addEventListener("click", async () => {
        const selected = document.querySelector("input[name='chon-lich']:checked");
        if (!selected) {
            alert("⚠️ Vui lòng chọn một lịch thi!");
            return;
        }

        const maPhieuDangKy = sessionStorage.getItem("maPhieuDangKy");
        if (!maPhieuDangKy) {
            alert("❌ Không tìm thấy phiếu đăng ký. Vui lòng đăng ký lại.");
            return;
        }

        const maLichThi = parseInt(selected.value);
        const loaiChungChi = parseInt(selected.getAttribute("data-loaichungchi"));
        const thoiGianThi = selected.getAttribute("data-thoigian");

        try {
            const res = await fetch("/api/xacNhanLichThi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    maPhieuDangKy: parseInt(maPhieuDangKy),
                    maLichThi,
                    loaiChungChi
                })
            });

            const result = await res.json();
            if (result.message) {
                alert("✅ " + result.message);
                // Có thể chuyển trang hoặc làm mới danh sách
                 window.location.href = "/InPhieuDangKy/InPhieuDangKy.html";
                fetchData("all"); // Làm mới danh sách
            } else {
                alert("❌ " + result.error);
            }
        } catch (err) {
            console.error("Lỗi xác nhận lịch:", err);
            alert("❌ Lỗi kết nối tới máy chủ.");
        }
    });

    radios.forEach(r => r.addEventListener("change", () => {
        searchBox.value = "";
        fetchData(r.value);
    }));

    searchBtn.addEventListener("click", () => {
        const keyword = searchBox.value.trim();
        const selectedRadio = document.querySelector("input[name='filter']:checked");
        const filter = keyword ? "" : selectedRadio?.value || "all";
        fetchData(filter, keyword);
    });

    searchBox.addEventListener("keypress", e => {
        if (e.key === "Enter") searchBtn.click();
    });

    // Gọi lần đầu
    fetchData("all");

    // Tải navbar
    fetch('/DangNhap/Navbar.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
            checkLoginStatus();
        });
});



