// Kiểm tra trạng thái đăng nhập và hiển thị nút Login/Logout phù hợp
async function initializeButtons() {
    try {
        const response = await fetch('/check-login', { method: 'GET' });
        const data = await response.json();

        if (response.ok && data.loggedIn) {
            // Nếu đã đăng nhập
            document.getElementById('logout').style.display = 'block';
            document.getElementById('login').style.display = 'none';
            document.getElementById('customerInfo').style.display = 'block';
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
            document.getElementById('customerInfo').style.display = 'none';
            document.getElementById('registerButton').style.display = 'block'; // Hiển thị nút Đăng Ký Thành Viên
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
            window.location.href = 'Login.html'; // Chuyển hướng về trang đăng nhập
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
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }

    // Kiểm tra trạng thái đăng nhập và hiển thị nút phù hợp
    initializeButtons();
}


function openModal() {
    document.getElementById('membershipModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('membershipModal').style.display = 'none';
}

// Đóng modal khi người dùng nhấn ngoài modal
window.onclick = function (event) {
    const modal = document.getElementById('membershipModal');
    if (event.target === modal) {
        closeModal();
    }
};

function fetchAndShowCustomerInfo() {
    const customerId = localStorage.getItem('username');
    if (!customerId) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập!');
        window.location.href = 'Login.html';
        return;
    }

    fetch(`/api/customer-info?customerId=${customerId}`)
        .then(response => response.json())
        .then(customer => {
            if (customer.error) {
                alert(`Lỗi: ${customer.error}`);
                return;
            }
            // Cập nhật nội dung modal
            document.getElementById('modalCustomerName').textContent = customer.HoTen || 'Không xác định';
            document.getElementById('modalCustomerEmail').textContent = customer.Email || 'Không xác định';
            document.getElementById('modalCustomerPhone').textContent = customer.SoDienThoai || 'Không xác định';
            document.getElementById('modalCustomerPoints').textContent = customer.TongDiem || 0;

            // Hiển thị modal
            document.getElementById('customerInfoModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin khách hàng:', error);
            alert('Không thể tải thông tin khách hàng. Vui lòng thử lại sau.');
        });
}

function closeCustomerInfoModal() {
    document.getElementById('customerInfoModal').style.display = 'none';
}


function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

// Đóng Modal yêu cầu đăng nhập
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none'; 
}

// Lắng nghe sự kiện click vào "Đặt hàng" và "Đặt trước"
document.getElementById('orderOnlineButton').addEventListener('click', function (event) {
    event.preventDefault();
    checkLoginStatus('orderOnline');
});

document.getElementById('reservationButton').addEventListener('click', function (event) {
    event.preventDefault();
    checkLoginStatus('reservation');
});

document.getElementById('listOrder').addEventListener('click', function (event) {
    event.preventDefault();
    checkLoginStatus('listOrder');
});

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
            openLoginModal();
        }
    } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', err);
    }
}


// Tự động khởi tạo khi tải trang
window.onload = initializeEvents;
