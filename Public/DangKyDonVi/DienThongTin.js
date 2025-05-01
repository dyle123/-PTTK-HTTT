
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

    fetch("/api/luuDangKyDonVi", {
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
            const currentForms = formContainer.querySelectorAll(".thisinh-form");
            const stt = currentForms.length + 1; // Số thứ tự mới
            const newForm = document.createElement("div");
            newForm.className = "thisinh-form card";
            newForm.innerHTML = `
        <h2>Thông tin thí sinh ${stt}</h2>
                <div class="input-group">
                    <div class="form-field">
                        <label>Họ tên</label>
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

    const backBtn = document.getElementById('back-choose-btn');
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "/DangKyDonVi/ChonLichThi.html";

        });
    }
});



