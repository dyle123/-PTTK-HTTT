document.querySelector("#login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn trình duyệt reload trang

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      showModal("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    console.log("Thông tin đăng nhập:", { username, password }); // Kiểm tra dữ liệu
    
    try {
      // Gửi thông tin đăng nhập tới server
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
        
      });
      const data = await response.json();
      if (response.ok) {
        await fetch('/api/capNhatPhieuQuaHan', { method: 'GET' })
          .then(res => res.json())
          .then(data => console.log("Cập nhật phiếu quá hạn:", data))
          .catch(err => console.error("Lỗi cập nhật phiếu quá hạn:", err));
        

        // Chuyển hướng dựa trên vai trò
        if (data.role === 'ketoan' || data.role === 'tiepnhan') {
            window.location.href = '/'; // Trang quản trị chi nhánh
        } else {
            showModal("Vai trò không xác định, vui lòng liên hệ quản trị viên!");
        }
      } else {
          showModal(data.error || "Đăng nhập thất bại!");
      }
 
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu đăng nhập:', err);
      showModal('Lỗi server, vui lòng thử lại sau!');
    }
  });

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