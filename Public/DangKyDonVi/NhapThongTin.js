// --- Global variables to store selected schedule info ---
let selectedMaLichThi = null;
let selectedLoaiChungChi = null;

// --- Navbar Loading ---
fetch('/DangNhap/Navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
        if (typeof checkLoginStatus === 'function') {
            checkLoginStatus();
        }
    })
    .catch(err => console.error("Lỗi tải Navbar:", err));

// --- Functions ---

/**
 * Gets URL query parameters.
 * @returns {URLSearchParams}
 */
function getQueryParams() {
    return new URLSearchParams(window.location.search);
}

/**
 * Validates that all required input fields are filled.
 * @returns {boolean} True if all required fields have values, false otherwise.
 */
function validateInputs() {
    const requiredInputs = document.querySelectorAll('input[required]');
    for (const input of requiredInputs) {
        if (!input.value.trim()) {
            alert(`⚠️ Vui lòng điền đầy đủ thông tin: ${input.labels[0]?.textContent || input.placeholder || input.id}`);
            input.focus(); // Focus on the first empty required field
            return false;
        }
        // Add more specific validation if needed (e.g., email format, phone format)
        if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
             alert(`⚠️ Định dạng Email không hợp lệ: ${input.labels[0]?.textContent || input.placeholder || input.id}`);
             input.focus();
             return false;
        }
         if (input.type === 'tel' && !/^\d{9,11}$/.test(input.value)) { // Simple phone check (9-11 digits)
             alert(`⚠️ Số điện thoại không hợp lệ (cần 9-11 số): ${input.labels[0]?.textContent || input.placeholder || input.id}`);
             input.focus();
             return false;
         }
    }
    return true;
}


/**
 * Submits the registration data to the server.
 */
function submitDangKy() {
    // Validate inputs before proceeding
    if (!validateInputs()) {
        return;
    }

    // Ensure schedule info was loaded correctly
    if (!selectedMaLichThi || !selectedLoaiChungChi) {
        alert("❌ Lỗi: Không tìm thấy thông tin lịch thi đã chọn. Vui lòng quay lại bước 1.");
        // Optionally redirect back: window.location.href = 'ChonLichThi.html';
        return;
    }

    const data = {
        // Customer info
        TenKH: document.getElementById("khach-ho-ten").value.trim(),
        DiaChiKH: document.getElementById("khach-dia-chi").value.trim(),
        SoDienThoaiKH: document.getElementById("khach-sdt").value.trim(),
        EmailKH: document.getElementById("khach-email").value.trim(),
        LoaiKhachHang: "tự do", // Hardcoded as per original script

        // Candidate info
        TenTS: document.getElementById("thisinh-ho-ten").value.trim(),
        CCCDTS: document.getElementById("thisinh-cccd").value.trim(),
        SoDienThoaiTS: document.getElementById("thisinh-sdt").value.trim(),
        EmailTS: document.getElementById("thisinh-email").value.trim(),
        DiaChiTS: document.getElementById("thisinh-diachi").value.trim(),
        NgaySinh: document.getElementById("thisinh-ngaysinh").value, // Date input value

        // Schedule info (retrieved from URL parameters on page load)
        MaLichThi: parseInt(selectedMaLichThi),
        LoaiChungChi: parseInt(selectedLoaiChungChi)
    };

    // Disable button to prevent multiple submissions
    const saveButton = document.getElementById('save-registration-btn');
    saveButton.disabled = true;
    saveButton.textContent = 'Đang lưu...';

    fetch("/api/dangkyFull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) {
            // Try to get error message from response body if possible
            return res.json().then(errData => {
                 throw new Error(errData.error || `Lỗi HTTP: ${res.status}`);
            }).catch(() => {
                 // If response is not JSON or other error occurs
                 throw new Error(`Lỗi HTTP: ${res.status}`);
            });
        }
        return res.json();
    })
    .then(result => {
        if (result.maPhieuDangKy) { // Check for success indicator (maPhieuDangKy)
            alert("✅ Đăng ký thành công! Mã phiếu: " + result.maPhieuDangKy);
            // Redirect to the print page or a confirmation page
            window.location.href = "/InPhieuDangKy/InPhieuDangKy.html"; // As per original script
        } else {
            // Handle potential errors returned in a successful response structure
            alert("❌ Lỗi khi đăng ký: " + (result.error || "Lỗi không xác định từ máy chủ."));
            saveButton.disabled = false; // Re-enable button on error
            saveButton.textContent = 'Lưu đăng ký';
        }
    })
    .catch(err => {
        console.error("❌ Lỗi kết nối hoặc xử lý:", err);
        alert(`❌ Lỗi khi gửi đăng ký: ${err.message}. Vui lòng thử lại.`);
        saveButton.disabled = false; // Re-enable button on error
        saveButton.textContent = 'Lưu đăng ký';
    });
}

// --- Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
    const params = getQueryParams();
    selectedMaLichThi = params.get("maLichThi");
    selectedLoaiChungChi = params.get("loaiChungChi");

    if (selectedMaLichThi && selectedLoaiChungChi) {
        // Display selected info (optional)
        document.getElementById("info-ma-lich-thi").textContent = selectedMaLichThi;
        document.getElementById("info-loai-chung-chi").textContent = selectedLoaiChungChi;
        document.getElementById("selected-schedule-info").style.display = 'block';
    } else {
        // Handle missing parameters - redirect back or show error
        alert("⚠️ Không tìm thấy thông tin lịch thi. Vui lòng chọn lại từ Bước 1.");
        document.getElementById("selected-schedule-info").innerHTML = "<p style='color: red; font-weight: bold;'>Lỗi: Thiếu thông tin lịch thi!</p>";
        document.getElementById("selected-schedule-info").style.display = 'block';
        // Disable form submission if essential info is missing
        document.getElementById('save-registration-btn').disabled = true;
        // Optional: Redirect back immediately
        // window.location.href = 'ChonLichThi.html';
    }

    // Attach submit handler to the save button
    const saveButton = document.getElementById('save-registration-btn');
    if(saveButton) {
       saveButton.addEventListener("click", submitDangKy);
    } else {
        console.error("Không tìm thấy nút Lưu đăng ký!");
    }
});