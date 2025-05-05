document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("table-body");

   
    // Hàm gọi API tạo phiếu thanh toán
    async function TaoPhieuThanhToan(maPhieuDangKy) {
        try {
            const responseSession = await fetch("http://localhost:3000/api/getCurrentUser"); 
            const sessionData = await responseSession.json();
            console.log('Ma nv nhan ve', sessionData.user);
            const nvThucHien = sessionData.user; // Giả sử backend trả về mã nhân viên
           

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
    async function XuatBang(maPhieuDangKy) {
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

            for (const phieu of data) {
                const row = document.createElement("tr");
                const trangThaiHienThi = phieu.TrangThaiThanhToan ? "Đã thanh toán" : "Chưa thanh toán";
                const trangThaiClass = phieu.TrangThaiThanhToan ? "da-thanh-toan" : "chua-thanh-toan";

                // Lấy loại khách hàng trước khi tạo nút
                const loaiKhachHang = await XuatLoaiKhachHang(phieu.MaPhieuDangKy);
                console.log("Loại khách hàng:", loaiKhachHang); // Debug
            
                // Xây dựng nội dung cột thao tác
                let thaoTacHTML = "";
                if (phieu.TrangThaiThanhToan == 1) {
                    thaoTacHTML = `<button class="xem-hoa-don">Xem hóa đơn</button>`;
                } else if (phieu.TrangThaiThanhToan == 0) {
                    thaoTacHTML = `
                        <button class="in-phieu">In phiếu</button>
                        <button class="thanh-toan" data-ma-phieu="${phieu.MaPhieuThanhToan}">Thanh toán</button>
                    `;
                    
                    if (loaiKhachHang === "đơn vị") {
                        thaoTacHTML += `
                            <button title="Nếu khách hàng thanh toán bằng QR Code, nhấn để cập nhật trạng thái thanh toán" class="chuyen-khoan" data-ma-phieu="${phieu.MaPhieuThanhToan}" 
                                data-thanh-tien="${phieu.ThanhTien}">Chuyển khoản</button>
                        `;
                    } else {
                        thaoTacHTML += `
                            <button class="chuyen-khoan" data-ma-phieu="${phieu.MaPhieuThanhToan}" 
                                data-thanh-tien="${phieu.ThanhTien}" disabled 
                                style="opacity: 0.6; cursor: not-allowed">Chuyển khoản</button>
                        `;
                    }
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
                    row.querySelector(".in-phieu").addEventListener("click", () => InPhieuThanhToan(phieu));
                    row.querySelector(".thanh-toan").addEventListener("click", () => {
                        XuatLoaiKhachHang(phieu.MaPhieuDangKy).then(loaiKhachHang => {
                            moModalThanhToan(phieu.MaPhieuDangKy, loaiKhachHang);
                        });
                    });
                } else if(phieu.TrangThaiThanhToan == 1)  {
                    row.querySelector(".xem-hoa-don").addEventListener("click", () => xemHoaDon(phieu.MaPhieuThanhToan));
                }
            
                tableBody.appendChild(row);
            }
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
        const postResult = await TaoPhieuThanhToan(maPhieuDangKy);
        if (postResult) {
            console.log("Tạo phiếu thành công, bắt đầu lấy dữ liệu...");
            XuatBang(maPhieuDangKy);
        } else {
            console.error("Tạo phiếu thất bại, không thể lấy dữ liệu.");
        }
    }


     // Hàm in phiếu thanh toán
     async function InPhieuThanhToan(phieu) {
        try {
            // Kiểm tra loại khách hàng
            const loaiKhachHang = await XuatLoaiKhachHang(phieu.MaPhieuDangKy);
            let qrCode = "";

            // Chỉ tạo QR code nếu là khách hàng đơn vị
            if (loaiKhachHang === "đơn vị") {
                // Gọi API tạo payment link trên PayOS
                const response = await fetch("http://localhost:3000/create-payment-link", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        Amount: phieu.ThanhTien,
                        MaPhieuDangKy: phieu.MaPhieuDangKy
                    })
                });
        
                const data = await response.json();
        
                if (data.qrCode) {
                    const qrResponse = await fetch(`http://localhost:3000/generate-qr?data=${encodeURIComponent(data.qrCode)}`);
                    const qrData = await qrResponse.json();
                    qrCode = qrData.qrImage || "";
                }
            }
    
            // 🔹 Mở cửa sổ in và hiển thị phiếu thanh toán
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
                        .qr-code { margin-top: 20px; }
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
                    <div class="qr-code">
                        <h3>Quét mã QR để thanh toán:</h3>
                        ${qrCode ? `<img src="${qrCode}" alt="QR Code" width="200">` : "<p>Không có mã QR</p>"}
                    </div>
                    <p class="footer">Quý khách vui lòng thanh toán trong vòng 3 ngày!</p>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        } catch (error) {
            console.error("❌ Lỗi khi lấy ảnh QR:", error);
            alert("Không thể lấy mã QR thanh toán!");
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
    
        // Sự kiện khi thay đổi radio button
        radioTienMat.onchange = () => {
            if (radioTienMat.checked) {
                maGiaoDich.disabled = true;
                maGiaoDich.value = "";
            }
        };

        radioChuyenKhoan.onchange = () => {
            if (radioChuyenKhoan.checked) {
                maGiaoDich.disabled = false;
                maGiaoDich.focus();
            }
        };
        
        modal.style.display = "block";
    }

    // Đóng modal
    document.getElementById("huy-modal").addEventListener("click", function () {
        document.getElementById("modal-thanh-toan").style.display = "none";
    });
    
    // Gọi API lấy loại khách hàng khi nhấn nút "Thanh toán"
    async function XuatLoaiKhachHang(maPhieu) {
        try {
            const response = await fetch(`http://localhost:3000/api/getLoaiKhachHang?maPhieu=${maPhieu}`);
            const data = await response.json();
            return data.loaiKhachHang; // Trả về loại khách hàng
        } catch (error) {
            console.error("Lỗi khi lấy loại khách hàng:", error);
            return "KhachHangTuDo"; // Mặc định là khách hàng tự do nếu lỗi
        }
    }

    async function XuatMaPhieuDangKy(maPhieuThanhToan) {
        try {
            const response = await fetch(`http://localhost:3000/api/getMaPhieuDangKy?maPhieuThanhToan=${maPhieuThanhToan}`);
            const data = await response.json();
            return data.maPhieuDangKy; // Trả về loại khách hàng
        } catch (error) {
            console.error("Lỗi khi lấy loại khách hàng:", error);
            return "KhachHangTuDo"; // Mặc định là khách hàng tự do nếu lỗi
        }
    }
    

    document.addEventListener("click", async function (event) {
        console.log("Sự kiện click xảy ra trên:", event.target);
    
        if (event.target.classList.contains("thanh-toan")) {
            const maPhieu = event.target.dataset.maPhieu; 
            const MaPhieuDangKy = await XuatMaPhieuDangKy(maPhieu);
            const loaiKhachHang = await XuatLoaiKhachHang(MaPhieuDangKy);
            console.log("Loại khách hàng moiw:", loaiKhachHang); // Debug
            console.log("Mã phiếu đăng ký:", MaPhieuDangKy); // Debug
            moModalThanhToan(maPhieu, loaiKhachHang);
        }
    });

    // Modify xác nhận thanh toán event listener
    document.getElementById("xac-nhan-thanh-toan").addEventListener("click", async function () {
        const maPhieu = document.querySelector(".thanh-toan").dataset.maPhieu;
        const selectedRadio = document.querySelector('input[name="hinh-thuc-thanh-toan"]:checked');
        const maGiaoDich = document.getElementById("ma-giao-dich");

        if (!selectedRadio) {
            alert("Vui lòng chọn hình thức thanh toán!");
            return;
        }

        const hinhThuc = selectedRadio.value;

        // Kiểm tra mã giao dịch khi chọn chuyển khoản
        if (hinhThuc === "chuyển khoản" && (!maGiaoDich.value || maGiaoDich.value.trim() === "")) {
            alert("Vui lòng nhập mã giao dịch cho hình thức chuyển khoản!");
            maGiaoDich.focus();
            return;
        }

        try {
            // ...existing code for API call...
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    });
});

// Thêm event listener cho document để bắt sự kiện click cho nút chuyển khoản
document.addEventListener("click", async function(event) {
    if (event.target.classList.contains("chuyen-khoan")) {
        const maPhieu = event.target.dataset.maPhieu;
        const thanhTien = event.target.dataset.thanhTien;
        await chuyenKhoan(maPhieu, thanhTien);
    }
});


// Sửa lại hàm chuyển khoản
async function chuyenKhoan(maPhieu, thanhTien) {
    try {
        console.log("Bắt đầu chuyển khoản với:", {maPhieu, thanhTien}); // Debug

        if (!maPhieu || !thanhTien) {
            console.error("Thiếu thông tin:", {maPhieu, thanhTien});
            alert("Không tìm thấy thông tin thanh toán.");
            return;
        }

        const response = await fetch("http://localhost:3000/create-payment-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                Amount: parseInt(thanhTien),
                MaPhieuDangKy: maPhieu
            })
        });

        const data = await response.json();
        console.log("Response từ PayOS:", data); // Debug

        if (data.url) {
            window.open(data.url, '_blank'); // Mở URL trong tab mới
        } else {
            throw new Error('Không nhận được URL thanh toán');
        }
    } catch (error) {
        console.error("Lỗi khi tạo link thanh toán:", error);
        alert("Có lỗi xảy ra khi tạo link thanh toán!");
    }
}

// Gán sự kiện click vào document
// document.addEventListener("click", chuyenKhoan);

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