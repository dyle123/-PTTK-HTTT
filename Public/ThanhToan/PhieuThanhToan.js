document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("table-body");

    // Hàm gọi API tạo phiếu thanh toán
    async function createPaymentReceipt(maPhieuDangKy) {
        try {
            const nvThucHien = "NV000012"; // Tạm thời hardcode, cần lấy từ session thực tế

            const response = await fetch("http://localhost:3000/api/postPhieuThanhToan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    maPhieuDangKy: maPhieuDangKy,
                    nhanVienThucHien: nvThucHien
                })
            });

            const result = await response.json();
            console.log("Kết quả tạo phiếu thanh toán:", result);
            return result;
        } catch (error) {
            console.error("Lỗi khi tạo phiếu thanh toán:", error);
            return null;
        }
    }

    // Hàm fetch dữ liệu phiếu thanh toán
    async function fetchData(maPhieuDangKy) {
        try {
            let url = new URL("http://localhost:3000/api/getPhieuThanhToan");
            let params = new URLSearchParams();
            if (maPhieuDangKy) params.append("maPhieuDangKy", maPhieuDangKy);
            url.search = params.toString();

            console.log("Gửi request đến API:", url.toString());

            const response = await fetch(url);
            const data = await response.json();

            tableBody.innerHTML = ""; // Xóa dữ liệu cũ
            if (!Array.isArray(data) || data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='7' style='text-align: center;'>Không có dữ liệu</td></tr>";
                return;
            }

            data.forEach(phieu => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${phieu.MaPhieuThanhToan}</td>
                    <td>${phieu.MaPhieuDangKy}</td>
                    <td>${phieu.TamTinh}</td>
                    <td>${phieu.PhanTramGiam}</td>
                    <td>${phieu.ThanhTien}</td>
                    <td>${phieu.TrangThai}</td>
                    <td><button class="thanh-toan">In phiếu</button></td>
                    <td><button class="thanh-toan">Thanh toán</button></td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    }

    // Lấy mã phiếu từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const maPhieuDangKy = urlParams.get("maPhieuDangKy");

    if (maPhieuDangKy) {
        console.log("Bắt đầu tạo phiếu thanh toán...");

        // Gọi API post trước, sau đó mới fetch dữ liệu
        const postResult = await createPaymentReceipt(maPhieuDangKy);
        if (postResult) {
            console.log("Tạo phiếu thành công, bắt đầu lấy dữ liệu...");
            fetchData(maPhieuDangKy);
        } else {
            console.error("Tạo phiếu thất bại, không thể lấy dữ liệu.");
        }
    }
});
