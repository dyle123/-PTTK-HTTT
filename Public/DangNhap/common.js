// Kiểm tra trạng thái đăng nhập và hiển thị nút Login/Logout phù hợp
async function initializeButtons() {
    try {
        const response = await fetch('/check-login', { method: 'GET' });
        const data = await response.json();

        if (response.ok && data.loggedIn) {
            // Nếu đã đăng nhập
            document.getElementById('logout').style.display = 'block';
            document.getElementById('login').style.display = 'none';
            // Lựa chọn tất cả phần tử có id="registerButton"
            const registerButtons = document.querySelectorAll('#registerButton');
            
            // Lặp qua các phần tử và kiểm tra phần tử nào trong Hero (nằm trong .hero)
            registerButtons.forEach(button => {
                if (button.closest('.hero')) {
                    // Nếu phần tử này nằm trong Hero, ẩn nó
                    button.style.display = 'none';
                }
            });
        } else {
            // Nếu chưa đăng nhập
            document.getElementById('login').style.display = 'block';
            document.getElementById('logout').style.display = 'none';
        }
    } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', err);
    }
}
// Xử lý sự kiện Logout
async function handleLogout(event) {
    event.preventDefault(); // Ngăn chặn chuyển hướng mặc định

    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Bạn đã đăng xuất thành công!');
            window.location.href = '/DangNhap/Home.html'; // Chuyển hướng về trang đăng nhập
        } else {
            const error = await response.json();
            alert(error.error || 'Đăng xuất thất bại!');
        }
    } catch (err) {
        console.error('Lỗi khi đăng xuất:', err);
        alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
}

// Khởi tạo các sự kiện
function initializeEvents() {
    // Gắn sự kiện cho nút Logout
    const logoutLink = document.getElementById('logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }

    // Kiểm tra trạng thái đăng nhập và hiển thị nút phù hợp
    initializeButtons();
}

// Kiểm tra trạng thái đăng nhập và mở modal nếu chưa đăng nhập
async function checkLoginStatus(action) {
    try {
        const response = await fetch('/check-login', { method: 'GET' });
        const data = await response.json();

        if (response.ok && data.loggedIn) {
            // Nếu đã đăng nhập, chuyển hướng đến trang tương ứng
            if (action === 'orderOnline') {
                window.location.href = '/KhachHang/Order/menu.html';
            } else if (action === 'reservation') {
                window.location.href = '/KhachHang/PreOrder/Reservation.html';
            } else if(action === 'listOrder')
                window.location.href = '/KhachHang/Order/DonHang.html';
        } else {
            // Nếu chưa đăng nhập, mở modal yêu cầu đăng nhập
            alert('May chua dang nhap')
        }
    } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', err);
    }
}


// Tự động khởi tạo khi tải trang
window.onload = initializeEvents;
