import * as DAO from './dao/InPhieuDangKyDAO.js';

export async function fetchData(maPhieu = "") {
    try {
        const data = await DAO.getPhieuDangKy(maPhieu);
        renderTable(data);
    } catch (err) {
        console.error("Lỗi lấy phiếu:", err);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='7'>Không có dữ liệu</td></tr>";
        return;
    }

    data.forEach(phieu => {
        const tr = document.createElement("tr");
        const loai = phieu.LoaiChungChi == 1 ? "Toeic" : (phieu.LoaiChungChi == 2 ? "Ielts" : "Khác");

        tr.innerHTML = `
            <td>${phieu.MaPhieuDangKy}</td>
            <td>${loai}</td>
            <td>${phieu.NgayDangKy?.split('T')[0]}</td>
            <td>${phieu.NgayThi?.split('T')[0] || ""}</td>
            <td>${phieu.MaKhachHang}</td>
            <td><button class="in-phieu" data-ma-phieu="${phieu.MaPhieuDangKy}">In phiếu</button></td>
        `;

        tr.querySelector(".in-phieu").addEventListener("click", () => {
            generatePDF(phieu.MaPhieuDangKy);
        });

        tableBody.appendChild(tr);
    });
}

async function generatePDF(maPhieu) {
    const data = await DAO.getPhieuById(maPhieu);
    if (!data) {
        alert("Không tìm thấy phiếu!");
        return;
    }

    const thiSinhHTML = data.ThiSinhList?.map((ts, i) => `
        <div>
            <b>Thí sinh ${i + 1}</b><br/>
            Họ tên: ${ts.TenThiSinh}<br/>
            Ngày sinh: ${new Date(ts.NgaySinh).toLocaleDateString()}<br/>
            Email: ${ts.Email}<br/>
            SĐT: ${ts.SoDienThoai}<br/>
            CCCD: ${ts.CCCD}
        </div>
    `).join("") || "<i>Không có thí sinh</i>";

    const loai = data.LoaiChungChi == 1 ? "Toeic" : (data.LoaiChungChi == 2 ? "Ielts" : "Khác");
    const content = `
        <div style="font-family: serif; padding: 20px;">
            <h2>PHIẾU ĐĂNG KÝ THI</h2>
            <p><b>Mã phiếu:</b> ${data.MaPhieuDangKy}</p>
            <p><b>Ngày đăng ký:</b> ${new Date(data.NgayDangKy).toLocaleDateString()}</p>
            <p><b>Ngày thi:</b> ${new Date(data.NgayThi).toLocaleDateString()}</p>
            <p><b>Loại chứng chỉ:</b> ${loai}</p>
            <h3>Khách hàng</h3>
            <p><b>Họ tên:</b> ${data.TenKhachHang}</p>
            <p><b>Email:</b> ${data.Email}</p>
            <p><b>SDT:</b> ${data.SoDienThoai}</p>
            <h3>Thí sinh</h3>
            ${thiSinhHTML}
        </div>
    `;

    html2pdf().from(content).save(`PhieuDangKy_${maPhieu}.pdf`);
}
