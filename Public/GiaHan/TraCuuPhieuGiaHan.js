window.onload = fetchData;

async function fetchData() {
    const cccd = document.getElementById('search-box').value.trim();
    const date = document.getElementById("date-box").value;
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Xóa dữ liệu cũ

    try {
        const response = await fetch('/api/getPhieuGiaHan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ CCCD: cccd, NgayDuThi: date }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:red;">${data.error || 'Lỗi không xác định'}</td></tr>`;
            return;
        }

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Không tìm thấy dữ liệu</td></tr>`;
            return;
        }

        const rows = data.map(item => `
            <tr>
                <td>${item.CCCD}</td>
                <td>${item.MaPhieuDangKy}</td>
                <td>${item.LoaiGiaHan}</td>
                <td>${item.PhiGiaHan}</td>
                <td>${item.LiDoGiaHan}</td>
                <td>${new Date(item.NTC).toLocaleDateString('vi-VN')}</td> 
                <td>${new Date(item.NTM).toLocaleDateString('vi-VN')}</td>
                <td>
                    <button class="edit-btn" onclick="editRow('${item.CCCD}', ${item.MaPhieuDangKy})">Sửa</button>
                    <button class="delete-btn" onclick="deleteRow('${item.CCCD}', ${item.MaPhieuDangKy})">Xóa</button>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = rows;

    } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error);
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:red;">Lỗi khi kết nối tới máy chủ.</td></tr>`;
    }
}

async function deleteRow(CCCD, MaPhieuDangKy) {
    if (!confirm('Bạn có chắc chắn muốn xóa phiếu gia hạn này không?')) return;

    try {
        const response = await fetch('/api/deletePhieuGiaHan', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ CCCD, MaPhieuDangKy })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            alert('Không thể xóa phiếu gia hạn: ' + (result.message || 'Lỗi máy chủ'));
            return;
        }

        const escapedCCCD = CCCD.replace(/'/g, "\\'");
        const row = document.querySelector(
            `button[onclick="deleteRow('${escapedCCCD}', ${MaPhieuDangKy})"]`
        )?.closest('tr');

        if (row) row.remove();

        alert('Đã xóa phiếu gia hạn thành công!');
    } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi xóa phiếu gia hạn.');
    }
}

function editRow(CCCD, MaPhieuDangKy) {
    const row = document.querySelector(
        `button[onclick="editRow('${CCCD}', ${MaPhieuDangKy})"]`
    )?.closest('tr');

    if (!row) return;

    const cells = row.querySelectorAll('td');
    const values = Array.from(cells).map(cell => cell.textContent.trim());

    row.innerHTML = `
        <td><input value="${values[0]}" disabled></td>
        <td><input value="${values[1]}" disabled></td>
        <td>
            <select>
                <option value="Hợp lệ" ${values[2] === 'Hợp lệ' ? 'selected' : ''}>Hợp lệ</option>
                <option value="Không hợp lệ" ${values[2] === 'Không hợp lệ' ? 'selected' : ''}>Không hợp lệ</option>
            </select>
        </td>
        <td><input type="number" value="${values[3]}"></td>
        <td><input value="${values[4]}"></td>
        <td><input type="date" value="${formatDateForInput(values[5])}"></td>
        <td><input type="date" value="${formatDateForInput(values[6])}"></td>
        <td>
            <button onclick="saveRow('${CCCD}', ${MaPhieuDangKy}, this)">Lưu</button>
            <button onclick="cancelEdit(this, ${MaPhieuDangKy}, '${CCCD}')">Hủy</button>
        </td>
    `;
}

async function saveRow(CCCD, MaPhieuDangKy, button) {
    const row = button.closest('tr');
    const inputs = row.querySelectorAll('input, select');

    const data = {
        CCCD,
        MaPhieuDangKy,
        LoaiGiaHan: inputs[2].value,
        PhiGiaHan: parseInt(inputs[3].value),
        LiDoGiaHan: inputs[4].value,
        NgayThiCu: inputs[5].value,
        NgayThiMoi: inputs[6].value,
    };

    try {
        const response = await fetch('/api/updatePhieuGiaHan', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            alert('Không thể cập nhật phiếu gia hạn: ' + (result.message || 'Lỗi máy chủ'));
            return;
        }

        alert('Đã cập nhật phiếu gia hạn thành công!');
        fetchData(); // Reload lại bảng
    } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi cập nhật phiếu gia hạn.');
    }
}

function cancelEdit() {
    fetchData(); // Gọi lại fetch để reset bảng về trạng thái ban đầu
}

function formatDateForInput(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
};