document.addEventListener('DOMContentLoaded', checkLoginStatus);


    function loadNavbar() {
        fetch("/DangNhap/Navbar.html")
            .then(response => response.text())
            .then(data => {
                document.getElementById("navbar-container").innerHTML = data;
                checkLoginStatus(); // Gọi sau khi Navbar đã được thêm vào DOM
                setupLogoutEvent();
            })
            .catch(error => console.error("Lỗi khi tải Navbar:", error));
    }

            
document.addEventListener("DOMContentLoaded", loadNavbar);

async function checkLoginStatus() {
    try {
        const response = await fetch('/check-login', { method: 'GET' });
        const data = await response.json();

        if (response.ok && data.loggedIn) {
            document.getElementById('login').style.display = 'none';
            document.getElementById("logout").style.display = 'block';

            // Nếu không phải kế toán, chặn nút thanh toán
            if (data.role !== "ketoan") {
                disableThanhToan();
            }
            else if(data.role !== "tiepnhan"){
                disableDangKy();
            }

        } else {
            // Nếu chưa đăng nhập, chặn tất cả các nút cần bảo vệ
            disableProtectedLinks();
        }
    } catch (error) {
        console.error('Lỗi kiểm tra đăng nhập:', error);
    }
}

// ✅ Hàm chặn truy cập vào các trang khi chưa đăng nhập
function disableProtectedLinks() {
    ["pay", "postpone","register"].forEach(id => {
        let link = document.getElementById(id).querySelector("a");
        if (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault(); // Chặn chuyển trang
                showModal("Bạn cần đăng nhập để truy cập trang này!");
            });
            link.style.cursor = "not-allowed"; // Đổi con trỏ chuột
            link.style.opacity = "0.6"; // Làm mờ nút
        }
    });
}

// ✅ Hàm chặn nút Thanh Toán nếu không phải kế toán
function disableThanhToan() {
    const thanhToanLink = document.querySelector("a[href='/ThanhToan/ThanhToan.html']");
    if (thanhToanLink) {
        thanhToanLink.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn truy cập
            showModal("Bạn không có quyền truy cập vào trang này!");
        });
        thanhToanLink.style.cursor = "not-allowed";
        thanhToanLink.style.opacity = "0.6";
        console.log("🔒 Nút Thanh Toán đã bị vô hiệu hóa.");
    }
}

function disableDangKy() {
    const inPhieuDangKyLink = document.querySelector("a[href='/InPhieuDangKy/InPhieuDangKy.html']");
    const quanLyLichThiLink = document.querySelector("a[href='/QuanLyLichThi/QuanLyLichThi.html']");
    const dangKyLink = document.querySelector("a[href='/dangky.html']");
    if (dangKyLink && quanLyLichThiLink && inPhieuDangKyLink) {
        dangKyLink.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn truy cập
            showModal("Bạn không có quyền truy cập vào trang này!");
        });
        quanLyLichThiLink.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn truy cập
            showModal("Bạn không có quyền truy cập vào trang này!");
        });
        inPhieuDangKyLink.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn truy cập
            showModal("Bạn không có quyền truy cập vào trang này!");
        });

        dangKyLink.style.cursor = "not-allowed";
        dangKyLink.style.opacity = "0.6";
        quanLyLichThiLink.style.cursor = "not-allowed";
        quanLyLichThiLink.style.opacity = "0.6";
        inPhieuDangKyLink.style.cursor = "not-allowed";
        inPhieuDangKyLink.style.opacity = "0.6";
        console.log("🔒 Nút Thanh Toán đã bị vô hiệu hóa.");
    }
}


// ✅ Hàm hiển thị thông báo
function showModal(message) {
    let modal = document.getElementById("customModal");
    let modalText = document.getElementById("modalText");

    modalText.innerText = message;
    modal.style.display = "block";

    // Ẩn modal sau 2 giây
    setTimeout(() => {
        modal.style.display = "none";
    }, 2000);
}



        function setupLogoutEvent() {
            setTimeout(() => { // Đợi navbar load xong
                const logoutBtn = document.getElementById("logout");
                if (logoutBtn) {
                    logoutBtn.addEventListener("click", async function () {
                        try {
                            const response = await fetch('/logout', { method: 'POST' });

                            if (response.ok) {
                                showModal('Bạn đã đăng xuất thành công!');
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
        
        

        function showModal(message) {
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