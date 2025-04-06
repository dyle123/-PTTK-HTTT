document.addEventListener("DOMContentLoaded", async function () {
    const radios = document.querySelectorAll("input[name='filter']");
    const searchBoxCCCD = document.getElementById("search-paper-box");
    const searchBoxDate = document.getElementById("search-day-box");
    const searchBoxType = document.getElementById("search-type-box");
    const searchBtn = document.getElementById("search-btn");
    const clearBtn = document.getElementById("clear-btn");


    // Debounced search function
    const debouncedSearch = debounce(() => {
        const CCCD = searchBoxCCCD.value.trim();
        if (CCCD && !/^\d{12}$/.test(CCCD)) {
            return;
        }
        const ngayThi = searchBoxDate.value;
        const loaiChungChi = searchBoxType.value.trim();
        const filter = document.querySelector("input[name='filter']:checked").value;
        fetchData(filter, CCCD, ngayThi, loaiChungChi);
    }, 500);

    // Add event listeners for real-time search
    searchBoxCCCD.addEventListener("input", debouncedSearch);
    searchBoxDate.addEventListener("change", debouncedSearch);
    searchBoxType.addEventListener("change", debouncedSearch);
    
    // Add Enter key support
    [searchBoxCCCD, searchBoxDate, searchBoxType].forEach(input => {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                debouncedSearch();
            }
        });
    });

    // Button click handlers
    searchBtn.addEventListener("click", debouncedSearch);
    
    // Radio button change handlers
    radios.forEach(radio => {
        radio.addEventListener("change", debouncedSearch);
    });

    // Clear button handler
    clearBtn.addEventListener("click", function() {
        searchBoxCCCD.value = "";
        searchBoxDate.value = "";
        searchBoxType.value = "";
        document.getElementById("filter-all").checked = true;
        fetchData("all");
    });




    function showLoading(show = true) {
        const tableBody = document.getElementById("table-body");
        if (show) {
            tableBody.innerHTML = `
            <tr>
                <td colspan='6' style='text-align: center;'>
                    <div class="loading">Đang tải dữ liệu...</div>
                </td>
            </tr>`;
        }
    }
    // Hàm fetch data từ API
    async function fetchData(filter, CCCD = "", ngayThi, loaiChungChi) { 
        showLoading(true);
        try {
            let url = new URL("http://localhost:3000/api/getPhieuDuThi");
            let params = new URLSearchParams();

            if (CCCD) {
                params.append("CCCD", CCCD); // Chỉ tìm theo mã phiếu
            } else{
                if (filter&& filter !== "filter-all") {
                    params.append("dieuKien", filter); // Nếu không có mã phiếu, tìm theo radio filter
                }
                if (ngayThi) {
                    params.append("ngayThi", ngayThi); // Nếu có ngày thi
                }
                if (loaiChungChi) {
                    params.append("loaiChungChi", loaiChungChi); // Nếu có loại chứng chỉ
                }
            }
            

            url.search = params.toString(); // Gán tham số vào URL

            console.log("Gửi request đến API:", url.toString()); // Debugging

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            renderTable(data.recordset || data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            showModal("Có lỗi xảy ra khi tải dữ liệu!");
        }finally{
            showLoading(false);
        }
    }
    // Hàm render dữ liệu vào bảng
    function renderTable(data) {
        const tableBody = document.getElementById("table-body");
        const fragment = document.createDocumentFragment();
        tableBody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6' style='text-align: center;'>Không có dữ liệu</td></tr>";
            return;
        }

        data.forEach(phieu => {
            const tr = document.createElement("tr");
            let trangThaiHienThi = "";
            let trangThaiClass = "";
            
            // Xử lý trạng thái
            switch(phieu.TrangThai) {
                case 0:
                    trangThaiHienThi = "Chưa phát hành";
                    trangThaiClass = "chua-phat-hanh";
                    break;
                case 1:
                    trangThaiHienThi = "Đã phát hành";
                    trangThaiClass = "da-phat-hanh";
                    break;
                case 2:
                    trangThaiHienThi = "Quá ngày thi";
                    trangThaiClass = "qua-han";
                    break;
                default:
                    trangThaiHienThi = "Không xác định";
                    trangThaiClass = "";
            }

            // Format ngày thi và giờ thi
            const ngayThi = phieu.NgayThi ? new Date(phieu.NgayThi).toLocaleDateString('vi-VN') : '';
            const gioThi = phieu.GioThi 
            const lichThi = `${gioThi} - ${ngayThi} `;

            // Xử lý loại chứng chỉ
            const loaiChungChi = phieu.TenChungChi

            // Xây dựng nút thao tác
            let thaoTacHTML = "" ;
            if (phieu.TrangThai == 0) {
                // Chưa thi -> Có thể in phiếu
                thaoTacHTML = `
                <button class="btn-in" data-sbd="${phieu.SoBaoDanh}">
                    <i class="fas fa-print"></i> In phiếu
                </button>`;
            } else {
                // Đã thi hoặc vắng thi -> Vô hiệu hóa nút in
                thaoTacHTML = `
                <button class="btn-in disabled" disabled title="Không thể in phiếu khi phiếu đã in hoặc quá hạn thi">
                    <i class="fas fa-print"></i> In phiếu
                </button>`;
            }

            tr.innerHTML = `
                <td>${phieu.SoBaoDanh}</td>
                <td>${phieu.CCCD}</td>
                <td>${loaiChungChi}</td>
                <td>${lichThi}</td>
                <td class="${trangThaiClass}">${trangThaiHienThi}</td>
                <td>${thaoTacHTML}</td>
            `;
            fragment.appendChild(tr);
        });
        tableBody.appendChild(fragment);

        // Gán sự kiện cho nút in phiếu
        document.querySelectorAll(".btn-in").forEach(button => {
            button.addEventListener("click", function() {
                const sbd = this.getAttribute("data-sbd");
                if (confirm('Bạn có chắc muốn in phiếu dự thi này?')) {
                    handleInPhieu(sbd);
                }
            });
        });
    }


     // Xử lý in phiếu
     async function handleInPhieu(sbd) {
        try {
            // Fetch phiếu dự thi data
            const response = await fetch(`/api/getPhieuDuThi?sbd=${sbd}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!data.recordset || !data.recordset[0]) {
                throw new Error('Không tìm thấy thông tin phiếu dự thi');
            }
            const phieu = data.recordset[0];
    
            if (!phieu) {
                throw new Error('Không tìm thấy thông tin phiếu dự thi');
            }
    
            // Mở cửa sổ in và hiển thị phiếu dự thi
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
                <html>
                <head>
                    <title>Phiếu Dự Thi</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 20px;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px; 
                        }
                        th, td { 
                            border: 1px solid black; 
                            padding: 10px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f2f2f2; 
                            width: 40%;
                        }
                        .title { 
                            font-size: 24px; 
                            font-weight: bold; 
                            margin-top: 20px; 
                        }
                        .footer { 
                            margin-top: 30px; 
                            font-style: italic;
                        }
                        .header {
                            margin-bottom: 30px;
                        }
                        .warning {
                            color: red;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>TRUNG TÂM NGOẠI NGỮ ACCI</h2>
                        <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                        <p>Điện thoại: (028) 1234 5678</p>
                    </div>
                    <h2 class="title">PHIẾU DỰ THI ${phieu.TenChungChi}</h2>
                    <table>
                        <tr><th>Số báo danh</th><td>${phieu.SoBaoDanh}</td></tr>
                        <tr><th>CCCD</th><td>${phieu.CCCD}</td></tr>
                        <tr><th>Ngày thi</th><td>${new Date(phieu.NgayThi).toLocaleDateString('vi-VN')}</td></tr>
                        <tr><th>Giờ thi</th><td>${phieu.GioThi}</td></tr>
                        <tr><th>Loại chứng chỉ</th><td>${phieu.TenChungChi}</td></tr>
                        <tr><th>Trạng thái</th><td>${
                            phieu.TrangThai === 0 ? 'Chưa phát hành' :
                            phieu.TrangThai === 1 ? 'Đã phát hành' :
                            phieu.TrangThai === 2 ? 'Quá ngày thi' : 'Không xác định'
                        }</td></tr>
                    </table>
                    <p class="warning">Thí sinh vui lòng mang theo CCCD khi đi thi!</p>
                    <p class="footer">Phiếu này có giá trị dự thi. Vui lòng giữ cẩn thận và mang theo khi đi thi.</p>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
            // After successful print, update the status
            const updateResponse = await fetch('/api/updateTrangThaiPhieuDuThi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sbd })
            });

            if (!updateResponse.ok) {
                throw new Error('Không thể cập nhật trạng thái phiếu');
            }

            // Refresh with current filters - using "all" instead of "filter-all"
            const filter = document.querySelector("input[name='filter']:checked").value || "all";
            const CCCD = document.getElementById("search-paper-box").value.trim();
            const ngayThi = document.getElementById("search-day-box").value;
            const loaiChungChi = document.getElementById("search-type-box").value.trim();
            // Force refresh data
            await fetchData(filter, CCCD, ngayThi, loaiChungChi);
            showModal("In phiếu thành công!");
        } catch (error) {
            console.error('Lỗi khi in phiếu:', error);
            showModal("Có lỗi xảy ra khi in phiếu!");
        }
    }

    // Gán sự kiện cho các element
    searchBtn.addEventListener("click", function() {
        const CCCD = searchBoxCCCD.value.trim();
        if (CCCD && !/^\d{12}$/.test(CCCD)) {
            showModal("CCCD không hợp lệ!");
            return;
        }
        const ngayThi = searchBoxDate.value;
        const loaiChungChi = searchBoxType.value.trim();
        const filter = document.querySelector("input[name='filter']:checked").value;
        fetchData(filter, CCCD, ngayThi, loaiChungChi);
    });

    radios.forEach(radio => {
        radio.addEventListener("change", function() {
            const CCCD = searchBoxCCCD.value.trim();
            const ngayThi = searchBoxDate.value;
            const loaiChungChi = searchBoxType.value.trim();
            
            fetchData(this.value, CCCD, ngayThi, loaiChungChi);
        });
    });

    // Load initial data
    fetchData("filter-all");

    // Load loại chứng chỉ options
    async function loadLoaiChungChi() {
        try {
            const response = await fetch('/api/getLoaiChungChi');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            const selectBox = document.getElementById('search-type-box');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.MaLoaiChungChi;
                option.textContent = item.TenChungChi;
                selectBox.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading loại chứng chỉ:', error);
            showModal('Không thể tải danh sách loại chứng chỉ');
        }
    }

    // Load loại chứng chỉ when page loads
    await loadLoaiChungChi();
});

function showModal(message) {
    const modalText = document.getElementById("modalText");
    const modal = document.getElementById("customModal");
    modalText.textContent = message;
    modal.style.display = "block";
    setTimeout(() => {
        modal.style.display = "none";
    }, 2000);
}

    const clearBtn = document.getElementById("clear-btn");
    clearBtn.addEventListener("click", function() {
        // Reset all inputs
        document.getElementById("search-paper-box").value = "";
        document.getElementById("search-day-box").value = "";
        document.getElementById("search-type-box").value = "";
        
        // Reset radio button to "Tất cả"
        document.getElementById("filter-all").checked = true;
        
        // Fetch all data again
        fetchData("all");
        
        // Show feedback
        showModal("Đã xóa bộ lọc");
    });

    // ...existing code...



function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

 


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