const express = require('express'); // Nhập thư viện express 
const session = require('express-session');
const bodyParser = require('body-parser'); // Để xử lý file request
const sql = require('mssql');
const path = require('path');
const app = express();
const PORT = 3000;
const PayOS = require('@payos/node');
const payos = new PayOS("a97645fd-bdc9-4392-9cd3-f7a2d62cebcc", "9e6457b7-927d-48ec-bcd0-015417ded0c7", "cbee15763a8c1e84cfaf34b57c911e4ea155c711c5093c1e2d861b2f0e32362a");
const QRCode = require('qrcode');

// Cấu hình để phục vụ các tệp tĩnh từ thư mục "frontend"
app.use(express.static(path.join(__dirname, 'public')));

// Chuyển hướng đến home.html khi truy cập đường dẫn gốc "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'DangNhap/Home.html'));
});
// Middleware để parse JSON từ body
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Nếu cần xử lý form-urlencoded
// Cấu hình session
app.use(session({
    secret: 'your_secret_key', // Khóa bí mật để ký session ID
    resave: false, // Không lưu session nếu không có thay đổi
    saveUninitialized: true, // Lưu session dù không có dữ liệu
    cookie: { secure: false } // Cookie không yêu cầu HTTPS (chỉ cho local)
}));

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});


//Cấu hình kết nối SQL Server
// const config = {
//     server: '192.168.102.1', // Địa chỉ IP của máy chủ SQL Server
//     port: 1433, // Cổng SQL Server
//     database: 'PTTK',
//     user: 'sa',
//     password: '1928374650Vy',
//     options: {
//         encrypt: false, // Không cần mã hóa
//         enableArithAbort: true, // Bật xử lý lỗi số học
//         connectTimeout: 30000, // Thời gian chờ 30 giây
//     },
// };



async function sqlQuery(query, params = {}) {
    try {
        const pool = await sql.connect({
            user: 'sa',
            password: '1928374650Vy',
            database: 'PTTK',
            server: '192.168.102.1',
            options: { encrypt: false, trustServerCertificate: true }
        });

        const request = pool.request();
        for (const param in params) {
            request.input(param, params[param]);
        }

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error("❌ Lỗi SQL:", error);
        throw error;
    }
}
// Cấu hình kết nối SQL Server


// const config = {
//     // server: '127.0.0.1', // Địa chỉ IP của máy chủ SQL Server
//     server: '192.168.174.1',
//     port: 1433, // Cổng SQL Server
//     database: 'PTTK',
//     user: 'BENU',
//     password: 'benu123',
//     options: {
//         encrypt: false, // Không cần mã hóa
//         enableArithAbort: true, // Bật xử lý lỗi số học
//         connectTimeout: 30000, // Thời gian chờ 30 giây
//     },
// };

// Cấu hình kết nối SQL Server
// const config = {
//     // server: '127.0.0.1', // Địa chỉ IP của máy chủ SQL Server
//     server: '192.168.1.11',
//     port: 1433, // Cổng SQL Server
//     database: 'PTTK',
//     user: 'dungluonghoang',
//     password: 'teuklee1983#',
//     options: {
//         encrypt: false, // Không cần mã hóa
//         enableArithAbort: true, // Bật xử lý lỗi số học
//         connectTimeout: 30000, // Thời gian chờ 30 giây
//     },
// };

// Cấu hình kết nối SQL Server
// const config = {
//     // server: '127.0.0.1', // Địa chỉ IP của máy chủ SQL Server
//     server: '192.168.1.11',
//     port: 1433, // Cổng SQL Server
//     database: 'PTTK',
//     user: 'dungluonghoang',
//     password: 'teuklee1983#',
//     options: {
//         encrypt: false, // Không cần mã hóa
//         enableArithAbort: true, // Bật xử lý lỗi số học
//         connectTimeout: 30000, // Thời gian chờ 30 giây
//     },
// };



// async function sqlQuery(query, params = {}) {
//     try {
//         const pool = await sql.connect({
//             user: 'sa',
//             password: '1928374650Vy',
//             database: 'PTTK',
//             server: '192.168.102.1',
//             options: { encrypt: false, trustServerCertificate: true }
//         });

//         const request = pool.request();
//         for (const param in params) {
//             request.input(param, params[param]);
//         }

//         const result = await request.query(query);
//         return result.recordset;
//     } catch (error) {
//         console.error("❌ Lỗi SQL:", error);
//         throw error;
//     }
// }


// Hàm kiểm tra kết nối
async function testDatabaseConnection() {
    try {
        const pool = await sql.connect(config);
        console.log('Kết nối thành công đến cơ sở dữ liệu!');
        await pool.close();
    } catch (err) {
        console.error('Lỗi khi kết nối đến cơ sở dữ liệu:', err);
    }
}

// Gọi hàm kiểm tra khi server khởi động
testDatabaseConnection();



app.post('/create-payment-link', async (req, res) => {
    const { Amount, MaPhieuDangKy } = req.body;
    console.log('sao undefine quai z', MaPhieuDangKy);
    try {
        // 🔍 Truy vấn CSDL kiểm tra xem đơn thanh toán đã tồn tại chưa
        const existingOrder = await sqlQuery(`
            SELECT PaymentLink, QRCode  -- 🔹 Thêm QRCode vào truy vấn
            FROM Payments 
            WHERE MaPhieuDangKy = @MaPhieuDangKy
        `, { MaPhieuDangKy });

        if (existingOrder.length > 0) {
            console.log("🔄 Đơn thanh toán đã tồn tại, trả về link cũ:", existingOrder[0].PaymentLink, existingOrder[0].QRCode);
            return res.json({
                url: existingOrder[0].PaymentLink,
                qrCode: existingOrder[0].QRCode // 🔹 Trả về mã QR đã lưu
            });
        }

        // 🆕 Nếu chưa có đơn thanh toán, tạo mới
        const orderCode = Math.floor(Math.random() * 100000);
        const order = {
            amount: 2000, // Giá trị đơn hàng
            description: `Thanh toán phiếu`, // Giới hạn 25 ký tự
            orderCode: orderCode,
            returnUrl: `http://localhost:${PORT}/ThanhToan/payment-success.html?OrderCode=${MaPhieuDangKy}`,
            cancelUrl: `http://localhost:${PORT}/ThanhToan/payment-cancel.html?OrderCode=${MaPhieuDangKy}`,
            expired_at: Math.floor(Date.now() / 1000) + 259200, // Hết hạn sau 3 ngày
        };

        const paymentLink = await payos.createPaymentLink(order);
        console.log("📝 API Response:", paymentLink);

        // ✅ Lưu link thanh toán và QRCode vào CSDL
        await sqlQuery(`
            INSERT INTO Payments (OrderCode, MaPhieuDangKy, PaymentLink, TrangThai, QRCode) 
            VALUES (@OrderCode, @MaPhieuDangKy, @PaymentLink, 'pending', @QRCode)
        `, {orderCode, MaPhieuDangKy, PaymentLink: paymentLink.checkoutUrl, QRCode: paymentLink.qrCode });

        res.json({
            url: paymentLink.checkoutUrl,
            qrCode: paymentLink.qrCode // 🔹 Trả về mã QR mới
        });

    } catch (error) {
        console.error('❌ Lỗi khi tạo link thanh toán:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});


app.get('/generate-qr', async (req, res) => {
    try {
        const qrCodeData = req.query.data || req.body.data; // Lấy từ query hoặc body

        if (!qrCodeData) {
            return res.status(400).json({ error: 'Thiếu dữ liệu QR Code' });
        }

        // Tạo QR dưới dạng Base64
        const qrImage = await QRCode.toDataURL(qrCodeData);

        res.json({ qrImage }); // Trả về ảnh QR dưới dạng Base64
    } catch (error) {
        console.error('❌ Lỗi tạo QR Code:', error);
        res.status(500).json({ error: 'Lỗi server khi tạo QR Code' });
    }
});



// Kiểm tra đăng nhập
app.get('/check-login', (req, res) => {
    if (!req.session.user) {
        return res.json({ loggedIn: false }); // Người dùng chưa đăng n
    }
    res.json({
        loggedIn: true, // Người dùng đã đăng nhập
        user: req.session.user, // Thông tin người dùng (tuỳ chọn)
        role: req.session.user.role
    });
});



// API xử lý đăng nhập
app.post('/login', async (req, res) => {
    console.log("Dữ liệu nhận được từ client:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
        console.log("Thiếu thông tin đăng nhập:", { username, password });
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    console.log("Username:", username);
    console.log("Password:", password);

    try {
        const pool = await sql.connect(config);
        // Kiểm tra thông tin đăng nhập trong database
        const result = await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('Password', sql.NVarChar, password)
            .query(`
                SELECT MaNhanVien, Role
                FROM Users
                WHERE MaNhanVien = @Username AND PassWord = @Password
            `);

        const user = result.recordset[0];
        if (!user) {
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
        console.log("Vai trò từ database:", user.Role);
        // Lưu trạng thái người dùng vào session
        req.session.user = { id: user.MaNhanVien, role: user.Role };
        // Chỉ lưu thông tin truy cập nếu role là 'khachhang'
        if (user.Role === 'ketoan' || user.Role === 'tiepnhan') {
            await pool.request()
                .input('Username', sql.Char(10), user.MaNhanVien)
                .query(`
                    INSERT INTO ThongTinTruyCap (MaNhanVien, ThoiDiemTruyCap)
                    SELECT MaNhanVien, GETDATE()
                    FROM NhanVien
                    WHERE MaNhanVien = @Username
                `);
        }
        res.json({ message: 'Đăng nhập thành công!', role: user.Role });
    } catch (err) {
        console.error('Loi:', err.message);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Xác thực quyền trước khi xài api
function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
        }

        const userRole = req.session.user.role;

        // Kiểm tra xem vai trò có trong danh sách được phép không
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Bạn không có quyền truy cập vào API này' });
        }

        next(); // Vai trò hợp lệ, tiếp tục xử lý API
    };
}

//API đăng xuất
app.post('/logout', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
    }

    try {
        // Đúng tên biến: 'id' thay vì 'Username'
        const username = req.session.user.id;
        console.log("Username được sử dụng:", username);

        if (req.session.user.role === 'ketoan' || req.session.user.role === 'tiepnhan') {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('username', sql.VarChar, username)
                .query(`
                    UPDATE ThongTinTruyCap
                    SET ThoiGianTruyCap = DATEDIFF(SECOND, ThoiDiemTruyCap, GETDATE())
                    WHERE MaNhanVien = @username AND ThoiGianTruyCap = 0
                `);

            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({ error: 'Không tìm thấy phiên đăng nhập để cập nhật!' });
            }
        }

        // Xóa session
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: 'Đăng xuất thất bại' });
            }
            res.json({ message: 'Đăng xuất thành công!' });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.get("/api/getUserRole", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Bạn chưa đăng nhập" });
    }

    res.json({ role: req.session.user.role });
});

app.get('/api/getCurrentUser', (req, res) => {
    console.log("Session hiện tại:", req.session);
    if (!req.session.user) {
        return res.status(401).json({ error: 'Người dùng chưa đăng nhập' });
    }
    console.log('Thông tin người dùng trong session:', req.session.user.id);
    res.json({ user: req.session.user.id, role: req.session.user.role });
});


app.get('/api/getPhieuDangKy', async (req, res) => {
    const { dieuKien, maPhieu } = req.query; // Lấy từ query string

    try {
        const pool = await sql.connect(config);
        let query = `SELECT * FROM PhieuDangKy `;
        let conditions = [];

        console.log('DieuKien:', dieuKien);

        // Điều kiện lọc theo trạng thái thanh toán
        if (dieuKien === "chuathanhtoan") {
            conditions.push(`TrangThaiThanhToan = 0`);
        } else if (dieuKien === "dathanhtoan") {
            conditions.push(`TrangThaiThanhToan = 1`);
        }

        // Điều kiện lọc theo mã phiếu đăng ký
        if (maPhieu) {
            conditions.push(`MaPhieuDangKy = @MaPhieu`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        const result = await pool.request()
            .input('MaPhieu', sql.Int, maPhieu)
            .query(query);

        // ✅ Format lại ngày
        const formatDate = (dateString) => {
            if (!dateString) return null;
            return new Date(dateString).toISOString().split('T')[0]; // YYYY-MM-DD
        };

        const formattedData = result.recordset.map(row => ({
            ...row,
            NgayDangKy: formatDate(row.NgayDangKy),
            ThoiGianMongMuonThi: formatDate(row.ThoiGianMongMuonThi)
        }));

        res.json(formattedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi lấy phiếu đăng ký' });
    }
});




app.get('/api/getPhieuThanhToan', async (req, res) => {
    const { maPhieuDangKy } = req.query;
    console.log("maPhieuDangKy nhận được ở api getget:", maPhieuDangKy); // Debugging

    if (!maPhieuDangKy) {
        return res.status(400).json({ error: "Thiếu mã phiếu đăng ký" });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuDangKy', sql.VarChar, maPhieuDangKy)
            .query(`SELECT * FROM PhieuThanhToan WHERE MaPhieuDangKy = @MaPhieuDangKy`);

        console.log("Dữ liệu từ SQL Server:", result.recordset);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy phiếu thanh toán" });
        }

        // ✅ Format lại ngày trước khi trả về
        const formatDate = (dateString) => {
            if (!dateString) return null;
            return new Date(dateString).toISOString().split('T')[0]; // Chuyển về YYYY-MM-DD
        };

        const formattedData = result.recordset.map(row => ({
            ...row,
            NgayDangKy: formatDate(row.NgayDangKy),
            NgayThanhToan: formatDate(row.NgayThanhToan)
        }));

        res.json(formattedData);
    } catch (err) {
        console.error('Lỗi server:', err.message);
        res.status(500).json({ error: 'Lỗi server' });
    }
});


app.post('/api/postPhieuThanhToan', async (req, res) => {
    try {
        const { maPhieuDangKy, nhanVienThucHien } = req.body;

        console.log("maPhieuDangKy nhận được ở api post:", maPhieuDangKy, nhanVienThucHien); // Debugging

        if (!maPhieuDangKy || !nhanVienThucHien) {
            return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
        }

        const pool = await sql.connect(config);
        await pool.request()
            .input('MaPhieuDangKy', sql.Int, parseInt(maPhieuDangKy)) // Ép kiểu số nguyên
            .input('NhanVienThucHien', sql.Char(8), nhanVienThucHien)
            .execute('TaoPhieuThanhToan');

        res.json({ message: 'Thêm phiếu thanh toán thành công' });
    } catch (err) {
        console.error('Lỗi server:', err.message);
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/postThanhToan', async (req, res) => {
    let { MaPhieuThanhToan, HinhThucThanhToan, MaGiaoDich } = req.body;

    try {
        // Kiểm tra giá trị đầu vào
        if (!MaPhieuThanhToan) {
            return res.status(400).json({ error: "MaPhieuThanhToan là bắt buộc" });
        }

        // Chuyển đổi kiểu dữ liệu hợp lệ
        MaPhieuThanhToan = parseInt(MaPhieuThanhToan, 10);
        MaGiaoDich = MaGiaoDich ? String(MaGiaoDich) : null; // Chuyển thành chuỗi nếu có
        HinhThucThanhToan = HinhThucThanhToan || null; // Nếu rỗng thì gán null

        console.log('Ma phieu nhan vao nhe:', MaPhieuThanhToan, HinhThucThanhToan, MaGiaoDich);

        const pool = await sql.connect(config);
        await pool.request()
            .input('MaPhieuThanhToan', sql.Int, MaPhieuThanhToan)
            .input('HinhThucThanhToan', sql.NVarChar(20), HinhThucThanhToan ? HinhThucThanhToan : null)
            .input('MaGiaoDich', sql.NVarChar(30), MaGiaoDich ? MaGiaoDich : null) // Dùng NVarChar thay vì VarChar nếu có Unicode

            .execute('TaoHoaDon');

        res.json({ message: 'Tạo hóa đơn thành công' });

    } catch (err) {
        console.error('Lỗi server thanh toán:', err);
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/getLoaiKhachHang', async (req, res) => {
    try {
        const { maPhieu } = req.query; // Sử dụng query thay vì body

        if (!maPhieu) {
            return res.status(400).json({ error: "Thiếu mã phiếu thanh toán" });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuThanhToan', sql.VarChar, maPhieu)
            .query(`
                SELECT LoaiKhachHang 
                FROM KhachHang K 
                JOIN PhieuDangKy P ON K.MaKhachHang = P.MaKhachHang
                JOIN PhieuThanhToan T ON T.MaPhieuDangKy = P.MaPhieuDangKy
                WHERE T.MaPhieuThanhToan = @MaPhieuThanhToan
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy loại khách hàng" });
        }

        res.json({ loaiKhachHang: result.recordset[0].LoaiKhachHang });
    } catch (err) {
        console.error('Không lấy được loại khách hàng:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/capNhatPhieuQuaHan', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        await pool.request().execute('CapNhatPhieuDangKyQuaHan');
        res.json({ message: 'Cập nhật trạng thái quá hạn thành công' });
    } catch (err) {
        console.error('Lỗi cập nhật trạng thái quá hạn:', err.message);
        res.status(500).json({ error: 'Lỗi cập nhật trạng thái quá hạn' });
    }
});

app.get('/api/getHoaDon', async (req, res) => {
    const { maPhieuThanhToan } = req.query;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuThanhToan', sql.Int, maPhieuThanhToan)
            .query(`
                SELECT* FROM HoaDonThanhToan where MaPhieuThanhToan = @MaPhieuThanhToan
                `)
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
        }

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy loại khách hàng" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Không lấy được hóa đơn:', err);
        res.status(500).json({ error: err.message });
    }
});


//API TraCuuSoLanGiaHan
app.get('/api/getChiTietPhieuDangKy', async (req, res) => {
    const { maPhieuDangKy } = req.query;
    if (!maPhieuDangKy) {
        return res.status(400).json({ error: 'Mã phiếu đăng ký là bắt buộc' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuDangKy', sql.Int, maPhieuDangKy)
            .query(`SELECT * FROM ChiTietPhieuDangKy WHERE MaPhieuDangKy = @MaPhieuDangKy`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy phiếu đăng ký' });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        res.status(500).json({ error: err.message });
    }
});


//API TraCuuPhieuGiaHan
app.get('/api/getPhieuGiaHan', async (req, res) => {
    const { maPhieuDangKy } = req.query;
    if (!maPhieuDangKy) {
        return res.status(400).json({ error: 'Mã phiếu đăng ký là bắt buộc' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuDangKy', sql.Int, maPhieuDangKy)
            .query(`SELECT * FROM PhieuGiaHan WHERE MaPhieuDangKy = @maPhieuDangKy`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy phiếu gia hạn' });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        res.status(500).json({ error: err.message });
    }
});



app.get('/api/getLichThi', async (req, res) => {
    const { dieuKien, maLichThi, ngayThi, gioThi, loaiChungChi } = req.query; // Lấy từ query string

    try {
        const pool = await sql.connect(config);
        let query = `SELECT * FROM LichThi `;
        let conditions = [];

        console.log('DieuKien:', dieuKien);

        // Điều kiện lọc linh hoạt
        if (dieuKien === "ngaythi" && ngayThi) {
            conditions.push(`NgayThi = @NgayThi`);
        }
        if (dieuKien === "giothi" && gioThi) {
            conditions.push(`GioThi = @GioThi`);
        }
        if (dieuKien === "loaichungchi" && loaiChungChi) {
            conditions.push(`LoaiChungChi = @LoaiChungChi`);
        }
        if (maLichThi) {
            conditions.push(`MaLichThi = @MaLichThi`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        const request = pool.request();

        // Gán giá trị cho tham số nếu có
        if (maLichThi) request.input('MaLichThi', sql.Int, maLichThi);
        if (ngayThi) request.input('NgayThi', sql.Date, ngayThi);
        if (gioThi) request.input('GioThi', sql.Time, gioThi);  // Nếu `GioThi` là kiểu TIME
        if (loaiChungChi) request.input('LoaiChungChi', sql.NVarChar, loaiChungChi);

        const result = await request.query(query);

        // ✅ Format lại ngày
        const formatDate = (dateString) => {
            if (!dateString) return null;
            return new Date(dateString).toISOString().split('T')[0]; // YYYY-MM-DD
        };

        const formatTime = (timeValue) => {
            if (!timeValue) return null;
            return timeValue.toISOString().split('T')[1].slice(0, 8); // Lấy HH:mm:ss
        };
        


        const formattedData = result.recordset.map(row => ({
            ...row,
            NgayThi: formatDate(row.NgayThi),
            GioThi: formatTime(row.GioThi)  // Format giờ thi
        }));

        res.json(formattedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi lấy lịch thi' });
    }
});

app.post('/api/xoaPayment', async (req, res) => {
    const { maPhieuDangKy } = req.body;

    // Kiểm tra đầu vào
    if (!maPhieuDangKy || isNaN(maPhieuDangKy)) {
        return res.status(400).json({ error: 'Mã phiếu đăng ký không hợp lệ' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuDangKy', sql.Int, maPhieuDangKy)
            .query(`
                DELETE FROM Payments WHERE MaPhieuDangKy = @MaPhieuDangKy
            `);

        // Kiểm tra xem có dòng nào bị xóa không
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Không tìm thấy mã phiếu đăng ký' });
        }

        res.json({ message: 'Xóa payment thành công' });
    } catch (err) {
        console.error('❌ Lỗi xóa payment:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

