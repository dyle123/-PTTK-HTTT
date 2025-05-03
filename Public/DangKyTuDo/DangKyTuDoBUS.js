const BUS = {
  initPage() {
    BUS.setupValidation();
    BUS.loadLoaiChungChi();
    BUS.loadLichThi();

    const radios = document.querySelectorAll("input[name='filter']");
    radios.forEach(r => r.addEventListener("change", BUS.onFilterChange));
    document.getElementById("search-btn").addEventListener("click", BUS.onSearch);
  },

  setupValidation() {
    const sdtRegex = /^[0-9]{10}$/;
    const cccdRegex = /^[0-9]{9,12}$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    const inputs = [
      { id: "khach-ho-ten", type: "required", message: "⚠️ Họ tên khách hàng không được để trống!" },
      { id: "khach-sdt", regex: sdtRegex, message: "⚠️ Số điện thoại khách hàng phải là dãy 10 số!" },
      { id: "khach-email", regex: emailRegex, message: "⚠️ Email khách hàng không hợp lệ!" },
      { id: "khach-dia-chi", type: "required", message: "⚠️ Địa chỉ khách hàng không được để trống!" },

      { id: "thisinh-ho-ten", type: "required", message: "⚠️ Họ tên thí sinh không được để trống!" },
      { id: "thisinh-cccd", regex: cccdRegex, message: "⚠️ CCCD thí sinh phải là dãy số từ 9 đến 12 số!" },
      { id: "thisinh-sdt", regex: sdtRegex, message: "⚠️ Số điện thoại thí sinh phải là dãy 10 số!" },
      { id: "thisinh-email", regex: emailRegex, message: "⚠️ Email thí sinh không hợp lệ!" },
      { id: "thisinh-diachi", type: "required", message: "⚠️ Địa chỉ thí sinh không được để trống!" },
      { id: "thisinh-ngaysinh", type: "date", message: "⚠️ Ngày sinh thí sinh phải nhỏ hơn ngày hôm nay!" }
    ];

    inputs.forEach(input => {
      const element = document.getElementById(input.id);
      if (element) {
        element.addEventListener("blur", () => {
          const value = element.value.trim();
          if (input.type === "required" && value === "") alert(input.message);
          else if (input.type === "date" && value >= new Date().toISOString().split('T')[0]) alert(input.message);
          else if (input.regex && !input.regex.test(value)) alert(input.message);
        });
      }
    });
  },

  async loadLoaiChungChi() {
    const data = await DAO.fetchLoaiChungChi();
    const select = document.getElementById('loaichungchi-box');
    data.forEach(loai => {
      const option = document.createElement('option');
      option.value = loai.MaLoaiChungChi;
      option.textContent = loai.TenChungChi;
      select.appendChild(option);
    });
  },

  async loadLichThi(filter = "all", search = "", ngayThi = "", loaiChungChi = "") {
    const data = await DAO.fetchLichThi(filter, search, ngayThi, loaiChungChi);
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='7'>Không có lịch thi phù hợp</td></tr>";
      return;
    }

    data.forEach(lich => {
      const disabled = lich.SoLuongDangKy >= 30;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${lich.MaLichThi}</td>
        <td>${lich.NgayThi}</td>
        <td>${lich.GioThi}</td>
        <td>${lich.SoLuongDangKy || 0}</td>
        <td>${lich.MaPhongThi}</td>
        <td>${lich.LoaiChungChi}</td>
        <td>${disabled ? "<span style='color:gray'>Đã đầy</span>" : `<input type='radio' name='chon-lich' value='${lich.MaLichThi}' data-loaichungchi='${lich.LoaiChungChi}'>`}
        </td>`;
      tableBody.appendChild(row);
    });
  },

  onFilterChange() {
    const value = this.value;
    document.getElementById("search-box").style.display = value === "all" ? "inline" : "none";
    document.getElementById("date-box").style.display = value === "ngaythi" ? "inline" : "none";
    document.getElementById("loaichungchi-box").style.display = value === "loaichungchi" ? "inline" : "none";
  },

  onSearch() {
    const filter = document.querySelector("input[name='filter']:checked")?.value || "all";
    const search = document.getElementById("search-box").value.trim();
    const ngayThi = document.getElementById("date-box").value;
    const loaiChungChi = document.getElementById("loaichungchi-box").value;
    BUS.loadLichThi(filter, search, ngayThi, loaiChungChi);
  },

  async submitDangKy() {
    const selected = document.querySelector("input[name='chon-lich']:checked");
    if (!selected) return alert("⚠️ Vui lòng chọn một lịch thi!");

    const data = {
      TenKH: document.getElementById("khach-ho-ten").value,
      DiaChiKH: document.getElementById("khach-dia-chi").value,
      SoDienThoaiKH: document.getElementById("khach-sdt").value,
      EmailKH: document.getElementById("khach-email").value,
      LoaiKhachHang: "tự do",
      TenTS: document.getElementById("thisinh-ho-ten").value,
      CCCDTS: document.getElementById("thisinh-cccd").value,
      SoDienThoaiTS: document.getElementById("thisinh-sdt").value,
      EmailTS: document.getElementById("thisinh-email").value,
      DiaChiTS: document.getElementById("thisinh-diachi").value,
      NgaySinh: document.getElementById("thisinh-ngaysinh").value,
      LoaiChungChi: parseInt(selected.getAttribute("data-loaichungchi")),
      MaLichThi: parseInt(selected.value)
    };

    const result = await DAO.submitDangKy(data);
    if (result.message) {
      alert("✅ Đăng ký thành công! Mã phiếu: " + result.maPhieuDangKy);
      sessionStorage.setItem("maPhieuDangKy", result.maPhieuDangKy);
      window.location.href = "/InPhieuDangKy/InPhieuDangKyUI.html";
    } else {
      alert("❌ Lỗi: " + result.error);
    }
  }
};
