// // --- Global variables to store selected schedule info ---
// let selectedMaLichThi = null;
// let selectedLoaiChungChi = null;

// // --- Navbar Loading ---
// fetch('/DangNhap/Navbar.html')
//     .then(response => response.text())
//     .then(data => {
//         document.getElementById('navbar-container').innerHTML = data;
//         if (typeof checkLoginStatus === 'function') {
//             checkLoginStatus();
//         }
//     })
//     .catch(err => console.error("Lỗi tải Navbar:", err));

// // --- Functions ---

// /**
//  * Gets URL query parameters.
//  * @returns {URLSearchParams}
//  */
// function getQueryParams() {
//     return new URLSearchParams(window.location.search);
// }

// /**
//  * Validates that all required input fields are filled.
//  * @returns {boolean} True if all required fields have values, false otherwise.
//  */
// function validateInputs() {
//     const requiredInputs = document.querySelectorAll('input[required]');
//     for (const input of requiredInputs) {
//         if (!input.value.trim()) {
//             alert(`⚠️ Vui lòng điền đầy đủ thông tin: ${input.labels[0]?.textContent || input.placeholder || input.id}`);
//             input.focus(); // Focus on the first empty required field
//             return false;
//         }
//         // Add more specific validation if needed (e.g., email format, phone format)
//         if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
//              alert(`⚠️ Định dạng Email không hợp lệ: ${input.labels[0]?.textContent || input.placeholder || input.id}`);
//              input.focus();
//              return false;
//         }
//          if (input.type === 'tel' && !/^\d{9,11}$/.test(input.value)) { // Simple phone check (9-11 digits)
//              alert(`⚠️ Số điện thoại không hợp lệ (cần 9-11 số): ${input.labels[0]?.textContent || input.placeholder || input.id}`);
//              input.focus();
//              return false;
//          }
//     }
//     return true;
// }


// /**
//  * Submits the registration data to the server.
//  */
// function submitDangKy() {
//     // Validate inputs before proceeding
//     if (!validateInputs()) {
//         return;
//     }

//     // Ensure schedule info was loaded correctly
//     if (!selectedMaLichThi || !selectedLoaiChungChi) {
//         alert("❌ Lỗi: Không tìm thấy thông tin lịch thi đã chọn. Vui lòng quay lại bước 1.");
//         // Optionally redirect back: window.location.href = 'ChonLichThi.html';
//         return;
//     }

//     const data = {
//         // Customer info
//         TenKH: document.getElementById("khach-ho-ten").value.trim(),
//         DiaChiKH: document.getElementById("khach-dia-chi").value.trim(),
//         SoDienThoaiKH: document.getElementById("khach-sdt").value.trim(),
//         EmailKH: document.getElementById("khach-email").value.trim(),
//         LoaiKhachHang: "đơn vị", // Hardcoded as per original script

//         // Candidate info
//         TenTS: document.getElementById("thisinh-ho-ten").value.trim(),
//         CCCDTS: document.getElementById("thisinh-cccd").value.trim(),
//         SoDienThoaiTS: document.getElementById("thisinh-sdt").value.trim(),
//         EmailTS: document.getElementById("thisinh-email").value.trim(),
//         DiaChiTS: document.getElementById("thisinh-diachi").value.trim(),
//         NgaySinh: document.getElementById("thisinh-ngaysinh").value, // Date input value

//         // Schedule info (retrieved from URL parameters on page load)
//         MaLichThi: parseInt(selectedMaLichThi),
//         LoaiChungChi: parseInt(selectedLoaiChungChi)
//     };

//     // Disable button to prevent multiple submissions
//     const saveButton = document.getElementById('save-registration-btn');
//     saveButton.disabled = true;
//     saveButton.textContent = 'Đang lưu...';

//     fetch("/api/dangkyFull", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//     })
//     .then(res => {
//         if (!res.ok) {
//             // Try to get error message from response body if possible
//             return res.json().then(errData => {
//                  throw new Error(errData.error || `Lỗi HTTP: ${res.status}`);
//             }).catch(() => {
//                  // If response is not JSON or other error occurs
//                  throw new Error(`Lỗi HTTP: ${res.status}`);
//             });
//         }
//         return res.json();
//     })
//     .then(result => {
//         if (result.maPhieuDangKy) { // Check for success indicator (maPhieuDangKy)
//             alert("✅ Đăng ký thành công! Mã phiếu: " + result.maPhieuDangKy);
//             // Redirect to the print page or a confirmation page
//             window.location.href = "/InPhieuDangKy/InPhieuDangKy.html"; // As per original script
//         } else {
//             // Handle potential errors returned in a successful response structure
//             alert("❌ Lỗi khi đăng ký: " + (result.error || "Lỗi không xác định từ máy chủ."));
//             saveButton.disabled = false; // Re-enable button on error
//             saveButton.textContent = 'Lưu đăng ký';
//         }
//     })
//     .catch(err => {
//         console.error("❌ Lỗi kết nối hoặc xử lý:", err);
//         alert(`❌ Lỗi khi gửi đăng ký: ${err.message}. Vui lòng thử lại.`);
//         saveButton.disabled = false; // Re-enable button on error
//         saveButton.textContent = 'Lưu đăng ký';
//     });
// }

// // --- Event Listeners ---

// document.addEventListener("DOMContentLoaded", () => {
//     const params = getQueryParams();
//     selectedMaLichThi = params.get("maLichThi");
//     selectedLoaiChungChi = params.get("loaiChungChi");

//     if (selectedMaLichThi && selectedLoaiChungChi) {
//         // Display selected info (optional)
//         document.getElementById("info-ma-lich-thi").textContent = selectedMaLichThi;
//         document.getElementById("info-loai-chung-chi").textContent = selectedLoaiChungChi;
//         document.getElementById("selected-schedule-info").style.display = 'block';
//     } else {
//         // Handle missing parameters - redirect back or show error
//         alert("⚠️ Không tìm thấy thông tin lịch thi. Vui lòng chọn lại từ Bước 1.");
//         document.getElementById("selected-schedule-info").innerHTML = "<p style='color: red; font-weight: bold;'>Lỗi: Thiếu thông tin lịch thi!</p>";
//         document.getElementById("selected-schedule-info").style.display = 'block';
//         // Disable form submission if essential info is missing
//         document.getElementById('save-registration-btn').disabled = true;
//         // Optional: Redirect back immediately
//         // window.location.href = 'ChonLichThi.html';
//     }

//     // Attach submit handler to the save button
//     const saveButton = document.getElementById('save-registration-btn');
//     if(saveButton) {
//        saveButton.addEventListener("click", submitDangKy);
//     } else {
//         console.error("Không tìm thấy nút Lưu đăng ký!");
//     }
// });

// document.getElementById("add-examiner-btn").addEventListener("click", () => {
//     const formContainer = document.getElementById("form-container");

//     // Tạo form thí sinh mới
//     const newForm = document.createElement("div");
//     newForm.className = "thisinh-form card";

//     newForm.innerHTML = `
//         <h2>Thông tin thí sinh</h2>
//         <div class="input-group">
//             <div class="form-field">
//                 <label>Họ tên thí sinh</label>
//                 <input type="text" name="thisinh-ho-ten" required />
//             </div>
//             <div class="form-field">
//                 <label>CCCD</label>
//                 <input type="text" name="thisinh-cccd" required />
//             </div>
//             <div class="form-field">
//                 <label>Số điện thoại</label>
//                 <input type="tel" name="thisinh-sdt" required />
//             </div>
//             <div class="form-field">
//                 <label>Email</label>
//                 <input type="email" name="thisinh-email" required />
//             </div>
//             <div class="form-field">
//                 <label>Địa chỉ</label>
//                 <input type="text" name="thisinh-diachi" required />
//             </div>
//             <div class="form-field">
//                 <label>Ngày sinh</label>
//                 <input type="date" name="thisinh-ngaysinh" required />
//             </div>
//         </div>
//     `;

//     formContainer.appendChild(newForm);
// });

// --- Global variables ---
let selectedMaLichThi = null;
let selectedLoaiChungChi = null;

// --- Navbar Loading ---
fetch('/DangNhap/Navbar.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
        if (typeof checkLoginStatus === 'function') checkLoginStatus();
    })
    .catch(err => console.error("Lỗi tải Navbar:", err));

// --- Utility Functions ---
function getQueryParams() {
    return new URLSearchParams(window.location.search);
}

function validateInputs() {
    const requiredInputs = document.querySelectorAll('input[required]');
    for (const input of requiredInputs) {
        if (!input.value.trim()) {
            alert(`⚠️ Vui lòng điền: ${input.labels?.[0]?.textContent || input.placeholder || input.name}`);
            input.focus();
            return false;
        }
        if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
            alert(`⚠️ Email không hợp lệ: ${input.value}`);
            input.focus();
            return false;
        }
        if (input.type === 'tel' && !/^\d{9,11}$/.test(input.value)) {
            alert(`⚠️ SĐT không hợp lệ (9–11 số): ${input.value}`);
            input.focus();
            return false;
        }
    }
    return true;
}

function submitDangKy() {
    if (!validateInputs()) return;

    if (!selectedMaLichThi || !selectedLoaiChungChi) {
        alert("❌ Lỗi: Thiếu thông tin lịch thi.");
        return;
    }

    const data = {
        TenKH: document.getElementById("khach-ho-ten").value.trim(),
        DiaChiKH: document.getElementById("khach-dia-chi").value.trim(),
        SoDienThoaiKH: document.getElementById("khach-sdt").value.trim(),
        EmailKH: document.getElementById("khach-email").value.trim(),
        LoaiKhachHang: "đơn vị",
        MaLichThi: parseInt(selectedMaLichThi),
        LoaiChungChi: parseInt(selectedLoaiChungChi),
        ThiSinhList: [] // Array thí sinh
    };

    const formNodes = document.querySelectorAll(".thisinh-form");
    formNodes.forEach(form => {
        const getField = name => form.querySelector(`[name="${name}"]`)?.value?.trim();

        const ts = {
            TenTS: getField("thisinh-ho-ten"),
            CCCDTS: getField("thisinh-cccd"),
            SoDienThoaiTS: getField("thisinh-sdt"),
            EmailTS: getField("thisinh-email"),
            DiaChiTS: getField("thisinh-diachi"),
            NgaySinh: form.querySelector(`[name="thisinh-ngaysinh"]`)?.value
        };
        data.ThiSinhList.push(ts);
    });

    const saveBtn = document.getElementById('save-registration-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Đang lưu...';

    fetch("/api/dangkyFull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.error || `Lỗi HTTP: ${res.status}`);
                }).catch(() => {
                    throw new Error(`Lỗi HTTP: ${res.status}`);
                });
            }
            return res.json();
        })
        .then(result => {
            if (result.maPhieuDangKy) {
                alert("✅ Đăng ký thành công! Mã phiếu: " + result.maPhieuDangKy);
                window.location.href = "/InPhieuDangKy/InPhieuDangKy.html";
            } else {
                alert("❌ Lỗi đăng ký: " + (result.error || "Không rõ lỗi."));
                saveBtn.disabled = false;
                saveBtn.textContent = 'Lưu đăng ký';
            }
        })
        .catch(err => {
            console.error("❌ Lỗi gửi:", err);
            alert("❌ Lỗi gửi đăng ký: " + err.message);
            saveBtn.disabled = false;
            saveBtn.textContent = 'Lưu đăng ký';
        });
}

// --- DOM Ready ---
document.addEventListener("DOMContentLoaded", () => {
    const params = getQueryParams();
    selectedMaLichThi = params.get("maLichThi");
    selectedLoaiChungChi = params.get("loaiChungChi");

    if (selectedMaLichThi && selectedLoaiChungChi) {
        document.getElementById("info-ma-lich-thi").textContent = selectedMaLichThi;
        document.getElementById("info-loai-chung-chi").textContent = selectedLoaiChungChi;
        document.getElementById("selected-schedule-info").style.display = 'block';
    } else {
        alert("⚠️ Thiếu thông tin lịch thi.");
        document.getElementById("selected-schedule-info").innerHTML = "<p style='color:red;'>Thiếu thông tin lịch thi!</p>";
        document.getElementById("selected-schedule-info").style.display = 'block';
        document.getElementById('save-registration-btn').disabled = true;
    }

    const saveBtn = document.getElementById('save-registration-btn');
    if (saveBtn) {
        saveBtn.addEventListener("click", submitDangKy);
    }

    const addBtn = document.getElementById("add-examiner-btn");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            const formContainer = document.getElementById("form-container");
            const newForm = document.createElement("div");
            newForm.className = "thisinh-form card";
            newForm.innerHTML = `
                <h2>Thông tin thí sinh</h2>
                <div class="input-group">
                    <div class="form-field">
                        <label>Họ tên thí sinh</label>
                        <input type="text" name="thisinh-ho-ten" required />
                    </div>
                    <div class="form-field">
                        <label>CCCD</label>
                        <input type="text" name="thisinh-cccd" required />
                    </div>
                    <div class="form-field">
                        <label>Số điện thoại</label>
                        <input type="tel" name="thisinh-sdt" required />
                    </div>
                    <div class="form-field">
                        <label>Email</label>
                        <input type="email" name="thisinh-email" required />
                    </div>
                    <div class="form-field">
                        <label>Địa chỉ</label>
                        <input type="text" name="thisinh-diachi" required />
                    </div>
                    <div class="form-field">
                        <label>Ngày sinh</label>
                        <input type="date" name="thisinh-ngaysinh" required />
                    </div>
                </div>
            `;
            formContainer.appendChild(newForm);
        });
    }
});



