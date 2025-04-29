window.onload = fetchData;
async function fetchData() {
    const cccd = document.getElementById("search-box").value.trim();
    const date = document.getElementById("date-box").value;

    try {
        const response = await fetch('/api/TraCuuSoLanGiaHan', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ CCCD: cccd, NgayThi: date })
        });

        const result = await response.json();

        if (!response.ok) {
            alert("Lỗi: " + result.error);
            return;
        }

        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";

        if (result.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4'>Không tìm thấy dữ liệu.</td></tr>";
            return;
        }

        result.forEach(row => {
            tableBody.innerHTML += `
                <tr>
                    <td>${row.MaPhieuDangKy}</td>
                    <td>${row.CCCD}</td>
                    <td>${new Date(row.NgayThi).toLocaleDateString('vi-VN')}</td>
                    <td>${row.SoLanGiaHan}</td>
                </tr>
            `;
        });

    } catch (error) {
        alert("Lỗi hệ thống: " + error.message);
    }
}