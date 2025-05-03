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
// async function sqlQuery(query, params = {}) {
//     try {
//         const pool = await sql.connect({
//             user: 'sa',
//             password: '12345678',
//             database: 'PTTK',
//             server: 'localhost',
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



// async function sqlQuery(query, params = {}) {
//     try {
//         const pool = await sql.connect({
//             user: 'sa',
//             password: '12345678',
//             database: 'PTTK',
//             server: 'localhost',
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
//  const config = {
//      user: 'sa',
//      password: '12345678',
//      server: 'localhost',
//      port: 1433,
//      database: 'PTTK',
//      options: {
//          encrypt: false,
//          trustServerCertificate: true,
//          enableArithAbort: true,
//          connectTimeout: 30000
//      }
//  };



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

//Cấu hình kết nối SQL Server
//const config = {
// server: '127.0.0.1', // Địa chỉ IP của máy chủ SQL Server
//    server: '192.168.1.9',
//    port: 1433, // Cổng SQL Server
//    database: 'PTTK',
//    user: 'dungluonghoang',
//    password: 'teuklee1983#',
//    options: {
//        encrypt: false, // Không cần mã hóa
//        enableArithAbort: true, // Bật xử lý lỗi số học
//        connectTimeout: 30000, // Thời gian chờ 30 giây
//    },
//};
//const config = {

    // server: '127.0.0.1', // Địa chỉ IP của máy chủ SQL Server
 //   server: '192.168.1.8',
 //   port: 1433, // Cổng SQL Server
 //   database: 'PTTK',
 //   user: 'dungluonghoang',
 //   password: 'teuklee1983#',
 //   options: {
//        encrypt: false, // Không cần mã hóa
 //       enableArithAbort: true, // Bật xử lý lỗi số học
 //       connectTimeout: 30000, // Thời gian chờ 30 giây
 //   },
//};

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
        `, { orderCode, MaPhieuDangKy, PaymentLink: paymentLink.checkoutUrl, QRCode: paymentLink.qrCode });

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
app.post('/api/dangky', async (req, res) => {
    const {
        TenKH, EmailKH, SoDienThoaiKH, DiaChiKH, LoaiKhachHang,
        LoaiChungChi,
        TenTS, CCCDTS, NgaySinh, EmailTS, SoDienThoaiTS, DiaChiTS
    } = req.body;

    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input('TenKH', sql.NVarChar(50), TenKH)
            .input('EmailKH', sql.NVarChar(100), EmailKH)
            .input('SoDienThoaiKH', sql.Char(10), SoDienThoaiKH)
            .input('DiaChiKH', sql.NVarChar(255), DiaChiKH)
            .input('LoaiKhachHang', sql.NVarChar(20), LoaiKhachHang)

            .input('LoaiChungChi', sql.Int, LoaiChungChi)

            .input('TenTS', sql.NVarChar(50), TenTS)
            .input('CCCDTS', sql.Char(12), CCCDTS)
            .input('NgaySinh', sql.Date, NgaySinh)
            .input('EmailTS', sql.NVarChar(100), EmailTS)
            .input('SoDienThoaiTS', sql.Char(10), SoDienThoaiTS)
            .input('DiaChiTS', sql.NVarChar(255), DiaChiTS)

            .execute('TaoPhieuDangKy');

        // Lấy mã phiếu đăng ký mới nhất
        const result = await pool.request()
            .query('SELECT TOP 1 MaPhieuDangKy FROM PhieuDangKy ORDER BY MaPhieuDangKy DESC');

        const maPhieuDangKy = result.recordset[0]?.MaPhieuDangKy;

        res.status(200).json({
            message: 'Đăng ký thành công!',
            maPhieuDangKy
        });

    } catch (err) {
        console.error('❌ Lỗi khi đăng ký:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/xacNhanLichThi', async (req, res) => {
    const { maPhieuDangKy, maLichThi } = req.body;

    const transaction = new sql.Transaction();

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        // Cập nhật phiếu đăng ký: gán mã lịch thi vào phiếu đã tạo
        await request
            .input('MaPhieuDangKy', sql.Int, maPhieuDangKy)
            .input('MaLichThi', sql.Int, maLichThi)
            .query(`
        UPDATE PhieuDangKy
        SET LichThi = @MaLichThi
        WHERE MaPhieuDangKy = @MaPhieuDangKy
      `);

        // Tăng số lượng đăng ký trong bảng LichThi
        await request
            .query(`
        UPDATE LichThi
        SET SoLuongDangKy = ISNULL(SoLuongDangKy, 0) + 1
        WHERE MaLichThi = ${maLichThi}
      `);

        // Lấy mã phòng thi tương ứng để cập nhật số lượng
        const phongResult = await request.query(`
      SELECT MaPhongThi FROM LichThi WHERE MaLichThi = ${maLichThi}
    `);

        const maPhongThi = phongResult.recordset[0]?.MaPhongThi;
        if (maPhongThi) {
            await request.query(`
        UPDATE PhongThi
        SET SoLuongHienTai = ISNULL(SoLuongHienTai, 0) + 1
        WHERE MaPhongThi = ${maPhongThi}
      `);
        }

        await transaction.commit();
        res.json({ message: "✅ Cập nhật lịch thi và phòng thi thành công!" });

    } catch (err) {
        await transaction.rollback();
        console.error("❌ Lỗi khi xác nhận lịch thi:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/getPhieuDangKy', async (req, res) => {
    const { dieuKien, maPhieu } = req.query; // Lấy từ query string

    try {
        const pool = await sql.connect(config);
        let query = `SELECT * FROM PhieuDangKy
        JOIN BangGiaThi ON LoaiChungChi = MaLoaiChungChi
        JOIN LichThi ON  LichThi = MaLichThi
        
        `;
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



app.get('/api/getPhieuDuThi', async (req, res) => {
    const { dieuKien, ngayThi, loaiChungChi, CCCD } = req.query;
    console.log('Điều kiện nhận vào:', dieuKien, ngayThi, loaiChungChi, CCCD);

    try {
        const pool = await sql.connect(config);
        let query = `
            SELECT 
                PDT.SoBaoDanh,
                PDT.CCCD,
                PDT.TrangThai,
                CONVERT(varchar, LT.NgayThi, 23) as NgayThi,
                CONVERT(varchar(5), LT.GioThi, 108) as GioThi,
                LT.LoaiChungChi, 
                BG.TenChungChi
            FROM PhieuDuThi PDT
            JOIN LichThi LT ON PDT.LichThi = LT.MaLichThi
            JOIN BangGiaThi BG ON LT.LoaiChungChi = BG.MaLoaiChungChi
        `;

        let conditions = [];
        const request = pool.request();

        // Xử lý điều kiện CCCD
        if (CCCD) {
            request.input('CCCD', sql.VarChar(12), CCCD);
            conditions.push('PDT.CCCD = @CCCD');
            console.log('Điều kiện CCCD:', conditions);
        }

        // Xử lý điều kiện trạng thái phát hành
        if (dieuKien === "chuaphathanh") {
            conditions.push('PDT.TrangThai = 0');
            console.log('Điều kiện chưa phát hành:', conditions);
        } else if (dieuKien === "daphathanh") {
            conditions.push('PDT.TrangThai = 1');
            console.log('Điều kiện đã phát hành:', conditions);
        }

        // Xử lý điều kiện ngày thi
        if (ngayThi) {
            request.input('NgayThi', sql.Date, ngayThi);
            conditions.push('CONVERT(date, LT.NgayThi) = @NgayThi');
            console.log('Điều kiện ngày thi:', conditions);
        }

        // Xử lý điều kiện loại chứng chỉ
        if (loaiChungChi) {
            request.input('LoaiChungChi', sql.Int, parseInt(loaiChungChi));
            conditions.push('LT.LoaiChungChi = @LoaiChungChi');
            console.log('Điều kiện loại chứng chỉ:', conditions);
        }

        // Thêm WHERE nếu có điều kiện
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');

        }

        // Thực thi query
        const result = await request.query(query);
        res.json(result);
    } catch (err) {
        console.error('❌ Lỗi lay phieu du thi:', err);
        res.status(500).json({ error: 'Lỗi server' });
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
app.post('/api/TraCuuSoLanGiaHan', async (req, res) => {
    const { CCCD, NgayThi } = req.body;

    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        if ((CCCD == null || CCCD.trim() === '') && (NgayThi == null || NgayThi === '')) {
            // Không lọc => lấy toàn bộ dữ liệu
            const result = await request.execute('DocToanBoChiTietPhieuDangKy');
            res.json(result.recordset);
        } else {
            // Có lọc
            if (CCCD != null && CCCD.trim() !== '') {
                request.input('CCCD', sql.Char(12), CCCD);
            }
            if (NgayThi != null && NgayThi !== '') {
                request.input('NgayThi', sql.Date, NgayThi);
            }
            const result = await request.execute('TraCuuSoLanGiaHan');
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(400).json({ error: err.originalError?.message || err.message });
    }
});


//API TraCuuPhieuGiaHan
app.post('/api/getPhieuGiaHan', async (req, res) => {
    const { CCCD, NgayDuThi } = req.body;

    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        if ((CCCD == null || CCCD.trim() === '') && (NgayDuThi == null || NgayDuThi === '')) {
            const result = await request.execute('DocToanBoPhieuGiaHan');
            res.json(result.recordset);
        } else {
            if (CCCD != null && CCCD.trim() !== '') {
                request.input('CCCD', sql.Char(12), CCCD);
            }
            if (NgayDuThi != null && NgayDuThi !== '') {
                request.input('NgayDuThi', sql.Date, NgayDuThi);
            }

            const result = await request.execute('TraCuuPhieuGiaHan');
            res.json(result.recordset);
        }
    } catch (err) {
        console.error('Lỗi khi gọi SP TraCuuPhieuGiaHan:', err);
        const sqlError = err.originalError?.info?.message || err.message;
        res.status(500).json({ error: `Lỗi: ${sqlError}` });
    }
});

app.delete('/api/deletePhieuGiaHan', async (req, res) => {
    const { CCCD, MaPhieuDangKy } = req.body;

    if (!CCCD || !MaPhieuDangKy) {
        return res.status(400).json({ success: false, message: 'Thiếu CCCD hoặc MaPhieuDangKy.' });
    }

    try {
        await sql.connect(config);
        const request = new sql.Request();

        request.input('CCCD', sql.Char(12), CCCD);
        request.input('MaPhieuDangKy', sql.Int, MaPhieuDangKy);

        await request.execute('XoaPhieuGiaHan'); // Gọi thủ tục

        res.json({ success: true });
    } catch (err) {
        console.error('Lỗi khi gọi SP XoaPhieuGiaHan:', err);

        // Nếu lỗi là từ RAISERROR trong SP thì phản hồi cho người dùng
        const message = err?.originalError?.info?.message || 'Lỗi máy chủ khi xóa phiếu gia hạn.';
        res.status(500).json({ success: false, message });
    }
});

app.put('/api/updatePhieuGiaHan', async (req, res) => {
    const { CCCD, MaPhieuDangKy, LoaiGiaHan, PhiGiaHan, LiDoGiaHan, NgayThiCu, NgayThiMoi } = req.body;

    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('CCCD', sql.Char(12), CCCD);
        request.input('MaPhieuDangKy', sql.Int, MaPhieuDangKy);
        request.input('LoaiGiaHan', sql.NVarChar(12), LoaiGiaHan);
        request.input('PhiGiaHan', sql.Int, PhiGiaHan);
        request.input('LiDoGiaHan', sql.NVarChar(255), LiDoGiaHan);
        request.input('NgayThiCu', sql.Date, NgayThiCu);
        request.input('NgayThiMoi', sql.Date, NgayThiMoi);

        await request.execute('SuaPhieuGiaHan');
        res.json({ success: true });
    } catch (err) {
        console.error('Lỗi khi cập nhật phiếu gia hạn:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/lapPhieuGiaHan', async (req, res) => {
    const { CCCD, MaPhieuDangKy, LiDoGiaHan, LoaiGiaHan, NgayThiCu, NgayThiMoi, PhiGiaHan } = req.body;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('CCCD', sql.Char(12), CCCD)
            .input('MaPhieuDangKy', sql.Int, MaPhieuDangKy)
            .input('PhiGiaHan', sql.Int, PhiGiaHan)
            .input('LiDoGiaHan', sql.NVarChar(255), LiDoGiaHan)
            .input('LoaiGiaHan', sql.NVarChar(12), LoaiGiaHan)
            .input('NgayThiCu', sql.Date, NgayThiCu)       // Là MaLichThi
            .input('NgayThiMoi', sql.Date, NgayThiMoi)     // Là MaLichThi
            .execute('LapPhieuGiaHan'); // gọi procedure bạn đã viết bên SQL

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});



app.get('/api/getLichThi', async (req, res) => {
    const { dieuKien, maLichThi, ngayThi, gioThi, loaiChungChi } = req.query; // Lấy từ query string

    try {
        const pool = await sql.connect(config);
        let query = `SELECT LichThi.*, BangGiaThi.*, PhongThi.SoLuongHienTai, PhongThi.SucChuaToiDa
            FROM LichThi 
            JOIN BangGiaThi ON LichThi.LoaiChungChi = BangGiaThi.MaLoaiChungChi
            JOIN PhongThi ON LichThi.MaPhongThi = PhongThi.MaPhongThi`;
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

app.get('/api/getNgayThi', async (req, res) => {
    const { maLichThi } = req.query;
    console.log('Lich thi nhan vao: ', maLichThi);
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaLichThi', sql.Int, maLichThi)
            .query(`
            select NgayThi from LichThi where MaLichThi = @MaLichThi
            `)
        res.json(result);
    } catch {
        console.error('❌ Lỗi lay ngay thi', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.get('/api/postTaoPhieuDuThi', async (req, res) => {
    const { maPhieuDangKy } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuDangKy', sql.Int, maPhieuDangKy)
            .execute(`PHATHANHPHIEUDUTHI`);
        res.json(result);
    } catch (err) {
        console.error('❌ Lỗi tao phieu du thi', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});



app.get('/api/getLoaiChungChi', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`SELECT * FROM BangGiaThi`);

        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi lay bang gia thi', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});




app.post('/api/updateTrangThaiPhieuDuThi', async (req, res) => {
    const { sbd } = req.body;

    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        request.input('SoBaoDanh', sql.VarChar(12), sbd);

        const query = `
            UPDATE PhieuDuThi 
            SET TrangThai = 1 
            WHERE SoBaoDanh = @SoBaoDanh
        `;

        await request.query(query);
        if (result.rowsAffected[0] === 0) {
            throw new Error('Không tìm thấy phiếu dự thi');
        }

        res.json({ success: true });
    } catch (err) {
        console.error('❌ Lỗi cập nhật trạng thái phiếu:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
app.post('/api/dangkyFull', async (req, res) => {
    const {
        TenKH, EmailKH, SoDienThoaiKH, DiaChiKH, LoaiKhachHang,
        TenTS, CCCDTS, NgaySinh, EmailTS, SoDienThoaiTS, DiaChiTS,
        LoaiChungChi, MaLichThi
    } = req.body;

    const transaction = new sql.Transaction();

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        // 1. Thêm Khách Hàng
        await request
            .input('TenKH', sql.NVarChar(50), TenKH)
            .input('EmailKH', sql.VarChar(60), EmailKH)
            .input('SoDienThoaiKH', sql.Char(10), SoDienThoaiKH)
            .input('DiaChiKH', sql.NVarChar(255), DiaChiKH)
            .input('LoaiKhachHang', sql.NVarChar(20), LoaiKhachHang)
            .query(`
        INSERT INTO KhachHang (TenKhachHang, Email, SoDienThoai, DiaChi, LoaiKhachHang)
        VALUES (@TenKH, @EmailKH, @SoDienThoaiKH, @DiaChiKH, @LoaiKhachHang)
      `);

        const maKHResult = await request.query(`SELECT TOP 1 MaKhachHang FROM KhachHang ORDER BY MaKhachHang DESC`);
        const maKH = maKHResult.recordset[0].MaKhachHang;

        // 2. Thêm Thí Sinh nếu chưa có
        await request.input('CCCDTS', sql.Char(12), CCCDTS);
        const tsCheck = await request.query(`SELECT * FROM ThiSinh WHERE CCCD = @CCCDTS`);
        if (tsCheck.recordset.length === 0) {
            await request.query(`
        INSERT INTO ThiSinh (CCCD, HoVaTen, NgaySinh, Email, SoDienThoai, DiaChi)
        VALUES ('${CCCDTS}', N'${TenTS}', '${NgaySinh}', '${EmailTS}', '${SoDienThoaiTS}', N'${DiaChiTS}')
      `);
        }

        // 3. Thêm Phiếu Đăng Ký
        await request
            .input('LoaiChungChi', sql.Int, LoaiChungChi)
            .input('MaKH', sql.Int, maKH)
            .input('MaLichThi', sql.Int, MaLichThi)
            .query(`
        INSERT INTO PhieuDangKy (LoaiChungChi, MaKhachHang, NgayDangKy, LichThi)
        VALUES (@LoaiChungChi, @MaKH, GETDATE(), @MaLichThi)
      `);

        const maPhieuRes = await request.query(`SELECT TOP 1 MaPhieuDangKy FROM PhieuDangKy ORDER BY MaPhieuDangKy DESC`);
        const maPhieu = maPhieuRes.recordset[0].MaPhieuDangKy;

        // 4. Chi tiết phiếu
        await request.query(`
      INSERT INTO ChiTietPhieuDangKy (MaPhieuDangKy, CCCD)
      VALUES (${maPhieu}, '${CCCDTS}')
    `);

        // 5. Cập nhật số lượng lịch thi + phòng
        const phongRes = await request.query(`SELECT MaPhongThi FROM LichThi WHERE MaLichThi = ${MaLichThi}`);
        const maPhongThi = phongRes.recordset[0]?.MaPhongThi;

        await request.query(`
      UPDATE LichThi SET SoLuongDangKy = ISNULL(SoLuongDangKy, 0) + 1
      WHERE MaLichThi = ${MaLichThi}
    `);

        if (maPhongThi) {
            await request.query(`
        UPDATE PhongThi SET SoLuongHienTai = ISNULL(SoLuongHienTai, 0) + 1
        WHERE MaPhongThi = ${maPhongThi}
      `);
        }

        await transaction.commit();
        res.json({ message: '✅ Đăng ký thành công!', maPhieuDangKy: maPhieu });
    } catch (err) {
        await transaction.rollback();
        console.error("❌ Lỗi trong /api/dangkyFull:", err);
        res.status(500).json({ error: 'Lỗi server khi đăng ký' });
    }
});
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT GETDATE() AS ThoiGianHienTai");
        res.json({
            message: '✅ Kết nối database thành công!',
            thoiGianServer: result.recordset[0].ThoiGianHienTai
        });
    } catch (err) {
        console.error("❌ Lỗi khi test DB:", err);
        res.status(500).json({ error: "Lỗi khi kết nối database", details: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
app.get('/api/getThisinhByCCCD', async (req, res) => {
    const { cccd } = req.query;

    if (!cccd) {
        return res.status(400).json({ error: 'Thiếu CCCD' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('CCCD', sql.Char(12), cccd)
            .query(`SELECT * FROM ThiSinh WHERE CCCD = @CCCD`);

        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi lấy thông tin thí sinh:', err);
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/getKhachHangByPhieu', async (req, res) => {
    const { maPhieuDangKy } = req.query;

    if (!maPhieuDangKy) {
        return res.status(400).json({ error: 'Thiếu mã phiếu đăng ký' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuDangKy', sql.Int, maPhieuDangKy)
            .query(`
                SELECT KH.*
                FROM KhachHang KH
                JOIN PhieuDangKy PD ON KH.MaKhachHang = PD.MaKhachHang
                WHERE PD.MaPhieuDangKy = @MaPhieuDangKy
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi lấy thông tin khách hàng:', err);
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/getPhieuDangKyTD', async (req, res) => {
    const { dieuKien, maPhieu } = req.query;

    try {
        const pool = await sql.connect(config);
        let query = `
            SELECT P.*, 
                   L.NgayThi, 
                   L.GioThi, 
                   L.MaPhongThi
            FROM PhieuDangKy P
            LEFT JOIN LichThi L ON P.LichThi = L.MaLichThi
        `;
        let conditions = [];

        if (dieuKien === "chuaphathanh") {
            conditions.push(`P.TrangThai = 0`);
        } else if (dieuKien === "daphathanh") {
            conditions.push(`P.TrangThai = 1`);
        }

        if (maPhieu) {
            conditions.push(`P.MaPhieuDangKy = @MaPhieu`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const request = pool.request();
        if (maPhieu) request.input('MaPhieu', sql.Int, maPhieu);

        const result = await request.query(query);

        // ✅ Format lại ngày/giờ
        const formatDate = (dateString) => {
            if (!dateString) return null;
            return new Date(dateString).toISOString().split('T')[0]; // YYYY-MM-DD
        };

        const formatTime = (timeValue) => {
            if (!timeValue) return null;
            return timeValue.toString().substring(0, 8); // HH:mm:ss
        };

        const formattedData = result.recordset.map(row => ({
            ...row,
            NgayDangKy: formatDate(row.NgayDangKy),
            NgayThi: formatDate(row.NgayThi),
            GioThi: formatTime(row.GioThi)
        }));

        res.json(formattedData);
    } catch (err) {
        console.error('❌ Lỗi khi lấy phiếu đăng ký:', err);
        res.status(500).json({ error: 'Lỗi khi lấy phiếu đăng ký' });
    }
});


app.post('/api/updatePhieuDangKy', async (req, res) => {
    const { MaPhieu, LoaiChungChi, NgayDangKy, ThoiGianThiDangKy, MaKhachHang } = req.body;
    try {
        await sql.query`EXEC CapNhatPhieuDangKy 
            @MaPhieu=${MaPhieu},
            @LoaiChungChi=${LoaiChungChi},
            @NgayDangKy=${NgayDangKy},
            @ThoiGianThiDangKy=${ThoiGianThiDangKy},
            @MaKhachHang=${MaKhachHang}`;
        res.send({ success: true });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.post('/api/tao-lich-thi', async (req, res) => {
    const { ngayThi, gioThi, loaiChungChi, phongThi, nhanVienGac } = req.body;

    // --- Validation dữ liệu đầu vào ---
    if (!ngayThi || !gioThi || loaiChungChi == null || phongThi == null || !nhanVienGac) {
        let missingFields = [];
        if (!ngayThi) missingFields.push('Ngày thi');
        if (!gioThi) missingFields.push('Giờ thi');
        if (loaiChungChi == null) missingFields.push('Loại chứng chỉ');
        if (phongThi == null) missingFields.push('Phòng thi');
        if (!nhanVienGac) missingFields.push('Nhân viên gác thi');
        return res.status(400).json({ message: `Thiếu thông tin bắt buộc: ${missingFields.join(', ')}.` });
    }

    // Kiểm tra định dạng giờ thi (HH:mm:ss)
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(gioThi)) {
        return res.status(400).json({ message: 'Định dạng giờ thi không hợp lệ (cần HH:mm:ss).' });
    }

    let pool;
    try {
        pool = await sql.connect(config);

        // --- Kiểm tra trùng phòng thi và giờ thi ---
        const checkQuery = `
            SELECT COUNT(*) AS Count
            FROM LichThi
            WHERE NgayThi = @ngayThiParam AND GioThi = @gioThiParam AND MaPhongThi = @phongThiParam
        `;
        const checkRequest = pool.request();
        checkRequest.input('ngayThiParam', sql.Date, ngayThi);
        checkRequest.input('gioThiParam', sql.NVarChar, gioThi);
        checkRequest.input('phongThiParam', sql.Int, phongThi);

        const checkResult = await checkRequest.query(checkQuery);
        if (checkResult.recordset[0].Count > 0) {
            return res.status(400).json({ message: 'Lịch thi trùng với phòng thi và giờ thi đã có.' });
        }

        // --- Kiểm tra trùng nhân viên gác thi ---
        const checkGacThiQuery = `
            SELECT COUNT(*) AS Count
            FROM GacThi
            JOIN LichThi ON LichThi.MaLichThi = GacThi.MaLichThi
            WHERE LichThi.NgayThi = @ngayThiParam AND LichThi.GioThi = @gioThiParam 
        `;
        const checkGacThiRequest = pool.request();
        checkGacThiRequest.input('ngayThiParam', sql.Date, ngayThi);
        checkGacThiRequest.input('gioThiParam', sql.NVarChar, gioThi);
        checkGacThiRequest.input('phongThiParam', sql.Int, phongThi);

        const checkGacThiResult = await checkGacThiRequest.query(checkGacThiQuery);
        if (checkGacThiResult.recordset[0].Count > 0) {
            return res.status(400).json({ message: 'Nhân viên đã được phân công gác thi cho phòng thi và giờ thi này.' });
        }

        // --- Thêm lịch thi ---
        const sqlQuery = `
            INSERT INTO LichThi (NgayThi, GioThi, MaPhongThi, LoaiChungChi)
            VALUES (@ngayThiParam, @gioThiParam, @phongThiParam, @loaiChungChiParam)
            SELECT SCOPE_IDENTITY() AS MaLichThi
        `;
        const insertRequest = pool.request();
        insertRequest.input('ngayThiParam', sql.Date, ngayThi);
        insertRequest.input('gioThiParam', sql.NVarChar, gioThi);
        insertRequest.input('phongThiParam', sql.Int, phongThi);
        insertRequest.input('loaiChungChiParam', sql.Int, loaiChungChi);

        const resultInsert = await insertRequest.query(sqlQuery);
        const MaLichThi = resultInsert.recordset[0].MaLichThi; // Lấy MaLichThi vừa tạo

        // --- Thêm nhân viên gác thi ---
        const insertGacThiQuery = `
        INSERT INTO GacThi (MaLichThi, MaNhanVienGac)
        VALUES (@maLichThi, @maNhanVienGac)
    `;
        const insertGacThiRequest = pool.request();
        insertGacThiRequest.input('maLichThi', sql.Int, MaLichThi);
        insertGacThiRequest.input('maNhanVienGac', sql.Char(8), nhanVienGac);

        await insertGacThiRequest.query(insertGacThiQuery);

        // Thực thi thành công
        res.status(201).json({ message: 'Lịch thi đã được tạo thành công.' });
    } catch (error) {
        console.error('Lỗi khi ghi vào cơ sở dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi ghi vào cơ sở dữ liệu.' });
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (err) {
                console.error('Lỗi khi đóng connection pool:', err);
            }
        }
    }
});


app.get('/api/nhanvienGac', async (req, res) => {
    const { query } = req.query;
    try {
        let sqlQuery = `SELECT MaNhanVien, HoTen FROM NhanVien`;
        if (query) {
            sqlQuery += ` WHERE HoTen LIKE N'%${query}%'`;
        }
        const result = await sql.query(sqlQuery);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi lấy nhân viên');
    }
});

app.get('/api/phongthi', async (req, res) => {
    const { query } = req.query;
    try {
        let sqlQuery = `SELECT MaPhongThi, SucChuaToiDa FROM PhongThi`;
        if (query) {
            sqlQuery += ` WHERE CAST(MaPhongThi AS NVARCHAR) LIKE N'%${query}%'`;
        }
        const result = await sql.query(sqlQuery);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi lấy phòng thi');
    }
});
app.get('/api/getPhieuDangKyMoiNhat', async (req, res) => {
    const { maPhieuDangKy } = req.query;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuDangKy', sql.Int, maPhieuDangKy)
            .query(`
                SELECT 
                    P.MaPhieuDangKy, 
                    P.NgayDangKy,
                    P.TrangThaiThanhToan,
                    P.LoaiChungChi,
                    L.NgayThi,
                    L.GioThi
                FROM PhieuDangKy P
                LEFT JOIN LichThi L ON P.LichThi = L.MaLichThi
                WHERE P.MaPhieuDangKy = @MaPhieuDangKy
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy phiếu đăng ký' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Lỗi khi lấy phiếu:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.get('/api/GetLichThi', async (req, res) => {
    const { dieuKien, maLichThi, ngayThi, gioThi, loaiChungChi, thangThi } = req.query;

    try {
        const pool = await sql.connect(config);
        let query = `SELECT * FROM LichThi JOIN BangGiaThi ON LoaiChungChi = MaLoaiChungChi`;
        let conditions = [];

        console.log('DieuKien:', dieuKien);

        if (dieuKien === "ngaythi" && ngayThi) {
            conditions.push(`NgayThi = @NgayThi`);
        }
        if (dieuKien === "thangthi" && thangThi) {
            conditions.push(`YEAR(NgayThi) = @Year AND MONTH(NgayThi) = @Month`);
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

        if (maLichThi) request.input('MaLichThi', sql.Int, maLichThi);
        if (ngayThi) request.input('NgayThi', sql.Date, ngayThi);
        if (gioThi) request.input('GioThi', sql.Time, gioThi);
        if (loaiChungChi) request.input('LoaiChungChi', sql.NVarChar, loaiChungChi);

        if (thangThi) {
            const [year, month] = thangThi.split('-'); // Parse '2025-06'
            request.input('Year', sql.Int, parseInt(year));
            request.input('Month', sql.Int, parseInt(month));
        }

        const result = await request.query(query);
        console.log('Kết quả truy vấn lich thi:', result.recordset); // Log kết quả truy vấn

        const formatDate = (dateString) => {
            if (!dateString) return null;
            return new Date(dateString).toISOString().split('T')[0];
        };

        const formatTime = (timeValue) => {
            if (!timeValue) return null;
            return timeValue.toISOString().split('T')[1].slice(0, 8);
        };

        const formattedData = result.recordset.map(row => ({
            ...row,
            NgayThi: formatDate(row.NgayThi),
            GioThi: formatTime(row.GioThi)
        }));

        res.json(formattedData);
    } catch (err) {
        console.error('❌ Lỗi getLichThi:', err);
        res.status(500).json({ error: 'Lỗi khi lấy lịch thi' });
    }
});
app.get('/api/getPhieuDangKyById', async (req, res) => {
    const { maPhieu } = req.query;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('maPhieu', sql.Int, maPhieu)
            .execute('sp_GetPhieuDangKyById');

        const rows = result.recordset;
        if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy phiếu' });

        const first = rows[0];
        const response = {
            MaPhieuDangKy: first.MaPhieuDangKy,
            NgayDangKy: first.NgayDangKy,
            NgayThi: first.NgayThi,
            LoaiChungChi: first.LoaiChungChi,
            TenKhachHang: first.TenKhachHang,
            Email: first.EmailKH,
            SoDienThoai: first.SDTKH,
            DiaChi: first.DiaChi,
            ThiSinhList: rows.map(row => ({
                TenThiSinh: row.TenThiSinh,
                NgaySinh: row.NgaySinh,
                Email: row.EmailThiSinh,
                SoDienThoai: row.SDTThiSinh,
                CCCD: row.CCCD
            }))
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi lấy thông tin phiếu đăng ký" });
    }
});





app.post('/api/luuDangKyDonVi', async (req, res) => {
    const {
        TenKH, EmailKH, SoDienThoaiKH, DiaChiKH, LoaiKhachHang,
        ThiSinhList, LoaiChungChi, MaLichThi
    } = req.body;

    if (!TenKH || !EmailKH || !SoDienThoaiKH || !DiaChiKH || !ThiSinhList || ThiSinhList.length === 0) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc hoặc chưa thêm thí sinh.' });
    }

    const jsonTS = JSON.stringify(ThiSinhList);

    try {
        const request = new sql.Request();
        request.input('TenKH', sql.NVarChar(50), TenKH);
        request.input('EmailKH', sql.VarChar(60), EmailKH);
        request.input('SoDienThoaiKH', sql.Char(10), SoDienThoaiKH);
        request.input('DiaChiKH', sql.NVarChar(255), DiaChiKH);
        request.input('LoaiKhachHang', sql.NVarChar(20), LoaiKhachHang);
        request.input('LoaiChungChi', sql.Int, LoaiChungChi);
        request.input('MaLichThi', sql.Int, MaLichThi);
        request.input('ThiSinhList', sql.NVarChar(sql.MAX), jsonTS);

        const result = await request.execute('sp_DangKyDonVi');

        const maPhieu = result.recordset[0].MaPhieuDangKy;
        res.json({ message: '✅ Đăng ký thành công!', maPhieuDangKy: maPhieu });

    } catch (err) {
        console.error("❌ Lỗi khi gọi SP:", err);
        res.status(500).json({ error: 'Lỗi server khi thực hiện đăng ký' });
    }
});
