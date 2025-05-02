// --- Global Variables ---
let selectedMaLichThi = null;
let selectedLoaiChungChi = null;

// --- Navbar Loading ---
fetch('/DangNhap/Navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar-container').innerHTML = html;
    if (typeof checkLoginStatus === 'function') checkLoginStatus();
  })
  .catch(err => console.error("Lỗi tải Navbar:", err));

// --- Helper Functions ---
function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

function showError(input, message) {
  alert(`⚠️ ${message}`);
  input.focus();
}

function validateInputs() {
  const requiredInputs = document.querySelectorAll('input[required]');
  for (const input of requiredInputs) {
    const label = input.labels?.[0]?.textContent || input.placeholder || input.name;
    const value = input.value.trim();

    if (!value) {
      showError(input, `Vui lòng điền: ${label}`);
      return false;
    }

    if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
      showError(input, `Email không hợp lệ: ${value}`);
      return false;
    }

    if (input.type === 'tel' && !/^\d{9,11}$/.test(value)) {
      showError(input, `SĐT không hợp lệ (9–11 số): ${value}`);
      return false;
    }
  }
  return true;
}

function collectThiSinhData() {
  const forms = document.querySelectorAll('.thisinh-form');
  return Array.from(forms).map(form => {
    const getField = name => form.querySelector(`[name="${name}"]`)?.value?.trim() || "";

    return {
      TenTS: getField("thisinh-ho-ten"),
      CCCDTS: getField("thisinh-cccd"),
      SoDienThoaiTS: getField("thisinh-sdt"),
      EmailTS: getField("thisinh-email"),
      DiaChiTS: getField("thisinh-diachi"),
      NgaySinh: form.querySelector(`[name="thisinh-ngaysinh"]`)?.value || null
    };
  });
}

function submitDangKy() {
    if (!validateInputs()) return;
  
    // Kiểm tra danh sách thí sinh
    if (!validateThiSinhList()) return;
  
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
      ThiSinhList: collectThiSinhData()
    };
  
    const btn = document.getElementById('save-registration-btn');
    btn.disabled = true;
    btn.textContent = "Đang lưu...";
  
    fetch("/api/luuDangKyDonVi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json().then(body => ({ status: res.status, body })))
      .then(({ status, body }) => {
        if (status === 200 && body.maPhieuDangKy) {
          alert("✅ Đăng ký thành công! Mã phiếu: " + body.maPhieuDangKy);
          window.location.href = "/InPhieuDangKy/InPhieuDangKy.html";
        } else {
          throw new Error(body.error || "Lỗi không xác định.");
        }
      })
      .catch(err => {
        console.error("❌ Lỗi đăng ký:", err);
        alert("❌ Đăng ký thất bại: " + err.message);
        btn.disabled = false;
        btn.textContent = "Lưu đăng ký";
      });
  }
  

// --- DOM Ready ---
document.addEventListener("DOMContentLoaded", () => {
  const params = getQueryParams();
  selectedMaLichThi = params.get("maLichThi");
  selectedLoaiChungChi = params.get("loaiChungChi");

  const infoDiv = document.getElementById("selected-schedule-info");

  if (selectedMaLichThi && selectedLoaiChungChi) {
    document.getElementById("info-ma-lich-thi").textContent = selectedMaLichThi;
    document.getElementById("info-loai-chung-chi").textContent = selectedLoaiChungChi;
    infoDiv.style.display = "block";
  } else {
    infoDiv.innerHTML = "<p style='color:red;'>Thiếu thông tin lịch thi!</p>";
    infoDiv.style.display = "block";
    document.getElementById("save-registration-btn").disabled = true;
  }

  document.getElementById("save-registration-btn")?.addEventListener("click", submitDangKy);

  document.getElementById("add-examiner-btn")?.addEventListener("click", () => {
    const formContainer = document.getElementById("form-container");
    const currentForms = formContainer.querySelectorAll(".thisinh-form");
    const stt = currentForms.length + 1;

    const newForm = document.createElement("div");
    newForm.className = "thisinh-form card";
    newForm.innerHTML = `
      <h2>Thông tin thí sinh ${stt}</h2>
      <div class="input-group">
        <div class="form-field"><label>Họ tên</label><input type="text" name="thisinh-ho-ten" required></div>
        <div class="form-field"><label>CCCD</label><input type="text" name="thisinh-cccd" required></div>
        <div class="form-field"><label>Số điện thoại</label><input type="tel" name="thisinh-sdt" required></div>
        <div class="form-field"><label>Email</label><input type="email" name="thisinh-email" required></div>
        <div class="form-field"><label>Địa chỉ</label><input type="text" name="thisinh-diachi" required></div>
        <div class="form-field"><label>Ngày sinh</label><input type="date" name="thisinh-ngaysinh" required></div>
      </div>
    `;
    formContainer.appendChild(newForm);
  });

  document.getElementById("back-choose-btn")?.addEventListener("click", () => {
    window.location.href = "/DangKyDonVi/ChonLichThi.html";
  });
});

function validateThiSinhList() {
    const thiSinhForms = document.querySelectorAll('.thisinh-form');
    if (thiSinhForms.length === 0) {
      alert("⚠️ Phải thêm ít nhất 1 thí sinh.");
      return false;
    }
  
    for (const form of thiSinhForms) {  
       console.log(form);
      const required = ['thisinh-ho-ten', 'thisinh-cccd', 'thisinh-sdt', 'thisinh-email', 'thisinh-diachi', 'thisinh-ngaysinh'];
      for (const name of required) {
        const input = form.querySelector(`[name="${name}"]`);
        if (!input || !input.value.trim()) {
          alert(`⚠️ Vui lòng điền đầy đủ thông tin: ${name}`);
          input.focus();
          return false;
        }
      }
    }
    return true;
  }
  