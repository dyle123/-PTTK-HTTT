document.addEventListener('DOMContentLoaded', TaiNavbar);

function TaiNavbar() {
    fetch("/DangNhap/Navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
            // Chỉ gọi KiemTraTrangThaiDangNhap sau khi navbar được thêm vào DOM
            setTimeout(() => {
                KiemTraTrangThaiDangNhap();
                ChuanBiDangXuat();
            }, 100);
        })
        .catch(error => console.error("Lỗi khi tải Navbar:", error));
}

async function KiemTraTrangThaiDangNhap() {
    try {
        const response = await fetch('/check-login', { method: 'GET' });
        const data = await response.json();

        const loginBtn = document.getElementById("login");
        const logoutBtn = document.getElementById("logout");

        if (!loginBtn || !logoutBtn) {
            console.warn("Không tìm thấy nút đăng nhập/đăng xuất");
            return;
        }

        if (response.ok && data.loggedIn) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';

            // Nếu không phải kế toán, chặn nút thanh toán
            if (data.role !== "ketoan") {
                KhoaThanhToan();
            } 
            else if(data.role !== "tiepnhan") {
                KhoaDangKy();
                KhoaGiaHan();
            
            }
        } else {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            // Nếu chưa đăng nhập, chặn tất cả các nút cần bảo vệ
            KhoaChucNang();
        }
    } catch (error) {
        console.error('Lỗi kiểm tra đăng nhập:', error);
    }
}
// ✅ Hàm chặn truy cập vào các trang khi chưa đăng nhập
function KhoaChucNang() {
    ["pay", "postpone","register", "examform"].forEach(id => {
        const element = document.getElementById(id);
        if (element) { // Kiểm tra element tồn tại
            const link = element.querySelector("a");
            if (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault(); // Chặn chuyển trang
                HienThiThongBao("Bạn cần đăng nhập để truy cập trang này!");
            });
            link.style.cursor = "not-allowed"; // Đổi con trỏ chuột
            link.style.opacity = "0.6"; // Làm mờ nút
        }
    }
    });
}

// ✅ Hàm chặn nút Thanh Toán nếu không phải kế toán
function KhoaThanhToan() {
    const thanhToanLink = document.querySelector("a[href='/ThanhToan/ThanhToan.html']");
    if (thanhToanLink) {
        thanhToanLink.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn truy cập
            HienThiThongBao("Bạn không có quyền truy cập vào trang này!");
        });
        thanhToanLink.style.cursor = "not-allowed";
        thanhToanLink.style.opacity = "0.6";
        console.log("🔒 Nút Thanh Toán đã bị vô hiệu hóa.");
    }
}

function KhoaDangKy() {
    // Định nghĩa mảng các trang cần chặn
    const restrictedPages = [
        '/DangKyDonVi/ChonLichThi.html',
        '/DangKyDonVi/DienThongTin.html',
        '/DangKyTuDo/DangKyTuDo.html',
        '/InPhieuDangKy/InPhieuDangKy.html',
        '/QuanLyLichThi/QuanLyLichThi.html',
        '/QuanlyLichThi/TaoLichThiMoi.html',
        // Thêm các trang khác cần chặn ở đây
    ];
    
    // Chặn từng trang cụ thể
    restrictedPages.forEach(page => {
        const links = document.querySelectorAll(`a[href="${page}"]`);
        
        links.forEach(link => {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                HienThiThongBao("Bạn không có quyền truy cập vào trang này!");
            });
            link.style.cursor = "not-allowed";
            link.style.opacity = "0.6";
        });
    });

    console.log(`🔒 Đã khóa ${restrictedPages.length} trang trong thư mục ThanhToan`);
}



// function KhoaDangKy() {
//     const inPhieuDangKyLink = document.querySelector("a[href='/InPhieuDangKy/InPhieuDangKy.html']");
//     const quanLyLichThiLink = document.querySelector("a[href='/QuanLyLichThi/QuanLyLichThi.html']");
//     const dangKyLink = document.querySelector("a[href='/dangky.html']");
//     if (dangKyLink && quanLyLichThiLink && inPhieuDangKyLink) {
//         dangKyLink.addEventListener("click", function (event) {
//             event.preventDefault(); // Ngăn truy cập
//             HienThiThongBao("Bạn không có quyền truy cập vào trang này!");
//         });
//         quanLyLichThiLink.addEventListener("click", function (event) {
//             event.preventDefault(); // Ngăn truy cập
//             HienThiThongBao("Bạn không có quyền truy cập vào trang này!");
//         });
//         inPhieuDangKyLink.addEventListener("click", function (event) {
//             event.preventDefault(); // Ngăn truy cập
//             HienThiThongBao("Bạn không có quyền truy cập vào trang này!");
//         });

//         dangKyLink.style.cursor = "not-allowed";
//         dangKyLink.style.opacity = "0.6";
//         quanLyLichThiLink.style.cursor = "not-allowed";
//         quanLyLichThiLink.style.opacity = "0.6";
//         inPhieuDangKyLink.style.cursor = "not-allowed";
//         inPhieuDangKyLink.style.opacity = "0.6";
//         console.log("🔒 Nút Thanh Toán đã bị vô hiệu hóa.");
//     }
// }


// ✅ Hàm hiển thị thông báo
function HienThiThongBao(message) {
    let modal = document.getElementById("customModal");
    let modalText = document.getElementById("modalText");

    modalText.innerText = message;
    modal.style.display = "block";

    // Ẩn modal sau 2 giây
    setTimeout(() => {
        modal.style.display = "none";
    }, 2000);
}

async function DangXuat() {
    try {
        const response = await fetch('/logout', { method: 'POST' });
        return response;
    } catch (error) {
        console.error('Lỗi khi gọi API đăng xuất:', error);
        throw error; // Ném lỗi lên để UI xử lý
    }
}

        function ChuanBiDangXuat() {
            setTimeout(() => { // Đợi navbar load xong
                const logoutBtn = document.getElementById("logout");
                if (logoutBtn) {
                    logoutBtn.addEventListener("click", async function () {
                        try {
                            const response = await DangXuat(); // Gọi hàm ở lớp 2

                            if (response.ok) {
                                HienThiThongBao('Bạn đã đăng xuất thành công!');
                                document.getElementById('login').style.display = 'block';
                                document.getElementById('logout').style.display = 'none';
                                window.location.href = '/DangNhap/Home.html';
                            } else {
                                console.error("Lỗi khi đăng xuất");
                            }
                        } catch (error) {
                            console.error('Lỗi đăng xuất:', error);
                        }
                    });
                } else {
                    console.error("Không tìm thấy nút Đăng xuất");
                }
            }, 500); // Đợi 500ms để đảm bảo navbar đã load
        }
        // Hàm vô hiệu hóa nút truy cập ThanhToan.html
        
        

        function HienThiThongBao(message) {
            let modal = document.getElementById("customModal");
            let modalText = document.getElementById("modalText");
        
            modalText.innerText = message;
            modal.style.display = "block";
        
            // Ẩn modal sau 2 giây
            setTimeout(() => {
                modal.style.display = "none";
            }, 2000);
        }

// Hàm xử lý dropdown menu cho Đăng ký
function setupDropdown() {
    const registerItem = document.getElementById("register");
    if (registerItem) {
        registerItem.addEventListener("mouseenter", () => {
            document.querySelector(".dropdown-menu").style.display = "block";
        });

        registerItem.addEventListener("mouseleave", () => {
            document.querySelector(".dropdown-menu").style.display = "none";
        });
    } else {
        console.warn("⚠️ Không tìm thấy phần tử Đăng ký.");
    }
}