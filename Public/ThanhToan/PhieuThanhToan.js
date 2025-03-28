document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("table-body");

    // Hàm in phiếu thanh toán
    function printReceipt(phieu) {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>Phiếu Thanh Toán</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid black; padding: 10px; text-align: center; }
                    th { background-color: #f2f2f2; }
                    .title { font-size: 24px; font-weight: bold; margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 16px; }
                </style>
            </head>
            <body>
                <h2 class="title">Phiếu Thanh Toán</h2>
                <table>
                    <tr><th>Mã phiếu</th><td>${phieu.MaPhieuThanhToan}</td></tr>
                    <tr><th>Mã phiếu đăng ký</th><td>${phieu.MaPhieuDangKy}</td></tr>
                    <tr><th>Tạm tính</th><td>${phieu.TamTinh}</td></tr>
                    <tr><th>Phần trăm giảm</th><td>${phieu.PhanTramGiamGia}%</td></tr>
                    <tr><th>Thành tiền</th><td>${phieu.ThanhTien}</td></tr>
                    <tr><th>Trạng thái</th><td>${phieu.TrangThaiThanhToan ? "Đã thanh toán" : "Chưa thanh toán"}</td></tr>
                    <tr><th>Nhân viên thực hiện</th><td>${phieu.NhanVienThucHien}</td></tr>
                </table>
                <p class="footer">Quý khách vui lòng thanh toán trong vòng 3 ngày kể từ khi đăng ký!</p>
                <p class="footer">Cảm ơn quý khách đã sử dụng dịch vụ!</p>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
        
    }

    // Hàm gọi API tạo phiếu thanh toán
    async function createPaymentReceipt(maPhieuDangKy) {
        try {
            const responseSession = await fetch("http://localhost:3000/api/getCurrentUser"); 
            const sessionData = await responseSession.json();
            const nvThucHien = sessionData.user.id; // Giả sử backend trả về mã nhân viên
            console.log('Ma nv nhan ve', nvThucHien);

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

            tableBody.innerHTML = "";
            if (!Array.isArray(data) || data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='8' style='text-align: center;'>Không có dữ liệu</td></tr>";
                return;
            }

            data.forEach(phieu => {
                const row = document.createElement("tr");
                const trangThaiHienThi = phieu.TrangThaiThanhToan ? "Đã thanh toán nha" : "Chưa thanh toán";
                const trangThaiClass = phieu.TrangThaiThanhToan ? "da-thanh-toan" : "chua-thanh-toan";
            
                // Xây dựng nội dung cột thao tác
                let thaoTacHTML = "";
                if (phieu.TrangThaiThanhToan == 1) {
                    // Đã thanh toán -> Chỉ có nút "Xem hóa đơn"
                    thaoTacHTML = `<button class="xem-hoa-don">Xem hóa đơn</button>`;
                } else if (phieu.TrangThaiThanhToan == 0) {
                    // Chưa thanh toán -> Hiển thị "In phiếu" và "Thanh toán"
                    thaoTacHTML = `
                        <button class="in-phieu">In phiếu</button>
                        <button class="thanh-toan" data-ma-phieu="${phieu.MaPhieuThanhToan}">Thanh toán</button>
                    `;
                }
            
                row.innerHTML = `
                    <td>${phieu.MaPhieuThanhToan}</td>
                    <td>${phieu.MaPhieuDangKy}</td>
                    <td>${phieu.TamTinh}</td>
                    <td>${phieu.PhanTramGiamGia}</td>
                    <td>${phieu.ThanhTien}</td>
                    <td class="${trangThaiClass}">${trangThaiHienThi}</td>
                    <td>${phieu.NhanVienThucHien}</td>
                    <td>${thaoTacHTML}</td>
                `;
            
                // Gán sự kiện click nếu chưa thanh toán
                if (phieu.TrangThaiThanhToan == 0) {
                    row.querySelector(".in-phieu").addEventListener("click", () => printReceipt(phieu));
                    row.querySelector(".thanh-toan").addEventListener("click", () => thanhToan(phieu.MaPhieuThanhToan));
                } else if(phieu.TrangThaiThanhToan == 1)  {
                    row.querySelector(".xem-hoa-don").addEventListener("click", () => xemHoaDon(phieu.MaPhieuThanhToan));
                }
            
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


    async function moModalThanhToan(maPhieu, loaiKhachHang) {
        const modal = document.getElementById("modal-thanh-toan");
        const radioTienMat = document.getElementById("radio-tien-mat");
        const radioChuyenKhoan = document.getElementById("radio-chuyen-khoan");
        const maGiaoDich = document.getElementById("ma-giao-dich");
    
        // Reset modal
        radioTienMat.checked = false;
        radioChuyenKhoan.checked = false;
        maGiaoDich.value = "";
        maGiaoDich.disabled = true;
    
        // Kiểm tra loại khách hàng
        if (loaiKhachHang === "Đơn vị") {
            radioTienMat.checked = true;
            radioChuyenKhoan.disabled = true;
            maGiaoDich.disabled = true;
        } else {
            radioTienMat.disabled = false;
            radioChuyenKhoan.disabled = true;
            maGiaoDich.disabled = true;
        }
    
        // Sự kiện bật/tắt mã giao dịch khi chọn chuyển khoản
        radioChuyenKhoan.onchange = () => {
            maGiaoDich.disabled = !radioChuyenKhoan.checked;
        };
    
        modal.style.display = "block";
    }
    
    // Đóng modal
    document.getElementById("huy-modal").addEventListener("click", function () {
        document.getElementById("modal-thanh-toan").style.display = "none";
    });
    
    // Gọi API lấy loại khách hàng khi nhấn nút "Thanh toán"
    async function fetchLoaiKhachHang(maPhieu) {
        try {
            const response = await fetch(`http://localhost:3000/api/getLoaiKhachHang?maPhieu=${maPhieu}`);
            const data = await response.json();
            return data.loaiKhachHang; // Trả về loại khách hàng
        } catch (error) {
            console.error("Lỗi khi lấy loại khách hàng:", error);
            return "KhachHangTuDo"; // Mặc định là khách hàng tự do nếu lỗi
        }
    }
    

    document.addEventListener("click", async function (event) {
        console.log("Sự kiện click xảy ra trên:", event.target);
    
        if (event.target.classList.contains("thanh-toan")) {
            const maPhieu = event.target.dataset.maPhieu; 
            const loaiKhachHang = await fetchLoaiKhachHang(maPhieu);
            moModalThanhToan(maPhieu, loaiKhachHang);
        }
    });

    document.getElementById("xac-nhan-thanh-toan").addEventListener("click", async function () {
        console.log("Nút xác nhận thanh toán được nhấn!", ); // Kiểm tra xem có chạy không
        const maPhieu = document.querySelector(".thanh-toan").dataset.maPhieu;
        const hinhThuc = document.querySelector('input[name="hinh-thuc-thanh-toan"]:checked').value;
        const maGiaoDich = document.getElementById("ma-giao-dich").value;

        if (hinhThuc === "ChuyenKhoan" && maGiaoDich.trim() === "") {
            alert("Vui lòng nhập mã giao dịch!");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/api/postThanhToan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    MaPhieuThanhToan: maPhieu, 
                    HinhThucThanhToan: hinhThuc,
                    MaGiaoDich: maGiaoDich 
                })
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Thanh toán thành công!");
                document.getElementById("modal-thanh-toan").style.display = "none";
                fetchData(); // Cập nhật lại danh sách
                window.location.href = `/ThanhToan/PhieuThanhToan.html?maPhieuDangKy=${maPhieu}`;
            } else {
                alert("Lỗi thanh toán: " + result.error);
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    });
});


function xemHoaDon(maPhieu) {
    fetch(`http://localhost:3000/api/getHoaDon?maPhieuThanhToan=${maPhieu}`)
        .then(response => response.json())
        .then(data => {
            if (!data) {
                alert("Không tìm thấy hóa đơn!");
                return;
            }
            console.log('reception o day', data);
            // Điền dữ liệu vào modal
            document.getElementById("ma-phieu-moi").textContent = data.MaPhieuThanhToan;
            document.getElementById("ma-hoa-don-moi").textContent = data.MaHoaDon;
            document.getElementById("ngay-thanh-toan-moi").textContent = data.NgayThanhToan || "dd/mm/yy";
            document.getElementById("hinh-thuc-thanh-toan-moi").textContent = data.HinhThucThanhToan || "Chưa xác định";
            document.getElementById("ma-giao-dich-moi").textContent = data.MaGiaoDich || "N/A";
            document.getElementById("tong-tien-moi").textContent = data.TongTien.toLocaleString() + " VND";

            // Hiển thị modal
            document.getElementById("modal-hoa-don-moi").style.display = "block";

            // In hóa đơn
            document.getElementById("in-hoa-don-moi").onclick = function () {
                window.print();
            };
        })
        .catch(error => console.error("Lỗi khi lấy hóa đơn:", error));
}

// Đóng modal khi nhấn dấu "X"
document.querySelector(".close-moi").addEventListener("click", function () {
    document.getElementById("modal-hoa-don-moi").style.display = "none";
});

// Đóng modal khi click ra ngoài
window.onclick = function (event) {
    const modalMoi = document.getElementById("modal-hoa-don-moi");
    if (event.target === modalMoi) {
        modalMoi.style.display = "none";
    }
};