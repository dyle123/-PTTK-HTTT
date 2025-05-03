const DAO = {
  async fetchLoaiChungChi() {
    const res = await fetch('/api/getLoaiChungChi');
    return res.json();
  },

  async fetchLichThi(filter = "all", search = "", ngayThi = "", loaiChungChi = "") {
    let url = new URL("/api/GetLichThi", window.location.origin);
    if (filter === "all" && search) {
      url.searchParams.append("maLichThi", search);
    } else {
      url.searchParams.append("dieuKien", filter);
      if (filter === "ngaythi" && ngayThi) url.searchParams.append("ngayThi", ngayThi);
      if (filter === "loaichungchi" && loaiChungChi) url.searchParams.append("loaiChungChi", loaiChungChi);
    }
    const res = await fetch(url);
    return res.json();
  },

  async submitDangKy(data) {
    const res = await fetch("/api/dangkyFull", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async fetchNavbar() {
    const res = await fetch('/DangNhap/Navbar.html');
    const html = await res.text();
    document.getElementById('navbar-container').innerHTML = html;
    if (typeof checkLoginStatus === 'function') checkLoginStatus();
  }
};
