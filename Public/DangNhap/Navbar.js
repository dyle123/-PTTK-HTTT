document.addEventListener('DOMContentLoaded', () => {
                initializeEvents(); // Gọi hàm để gắn sự kiện
            });



function loadNavbar() {
            fetch("/DangNhap/Navbar.html")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("navbar-container").innerHTML = data;
                    checkLoginStatus();
                    setupLogoutEvent(); // Gán sự kiện click cho nút Đăng xuất
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
                    console.log('Đã đăng nhập');
                } else {
                    document.getElementById('login').style.display = 'block';
                    document.getElementById("logout").style.display = 'none';
                    console.log('Chưa đăng nhập');
                }
            } catch (error) {
                console.error('Lỗi kiểm tra đăng nhập:', error);
            }
        }

        function setupLogoutEvent() {
            setTimeout(() => { // Đợi navbar load xong
                const logoutBtn = document.getElementById("logout");
                if (logoutBtn) {
                    logoutBtn.addEventListener("click", async function () {
                        try {
                            const response = await fetch('/logout', { method: 'POST' });

                            if (response.ok) {
                                alert('Bạn đã đăng xuất thành công!');
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
    