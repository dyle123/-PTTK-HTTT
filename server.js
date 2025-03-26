const express = require('express'); // Nhập thư viện express 
const session = require('express-session');
const bodyParser = require('body-parser'); // Để xử lý file request
const sql = require('mssql');
const path = require('path');
const app = express();
const PORT = 3000;

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


// Cấu hình kết nối SQL Server
const config = {
    server: '192.168.102.1', // Địa chỉ IP của máy chủ SQL Server
    port: 1433, // Cổng SQL Server
    database: 'PTTK',
    user: 'sa',
    password: '1928374650Vy',
    options: {
        encrypt: false, // Không cần mã hóa
        enableArithAbort: true, // Bật xử lý lỗi số học
        connectTimeout: 30000, // Thời gian chờ 30 giây
    },
};


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


// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});



// Kiểm tra đăng nhập
app.get('/check-login', (req, res) => {
    if (!req.session.user) {
        return res.json({ loggedIn: false }); // Người dùng chưa đăng n
    }
    res.json({
        loggedIn: true, // Người dùng đã đăng nhập
        user: req.session.user // Thông tin người dùng (tuỳ chọn)
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
        if (user.Role === 'ketoan'|| user.Role === 'tiepnhan') {
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

        if (req.session.user.role === 'ketoan' || req.session.user.role === 'tiepnhan' ) {
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



app.get('/api/getCurrentUser', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Người dùng chưa đăng nhập' });
    }
    console.log('Thông tin người dùng trong session:', req.session.user);
    res.json({ user: req.session.user });
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
    console.log("maPhieuDangKy nhận được:", maPhieuDangKy); // Debugging

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

        console.log("maPhieuDangKy nhận được:", maPhieuDangKy); // Debugging

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

        console.log('Ma phieu nhan vao:', MaPhieuThanhToan, HinhThucThanhToan, MaGiaoDich);

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

app.get('/api/getHoaDon', async (req,res)=>{
    const{maPhieuThanhToan} = req.query;
    try{
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MaPhieuThanhToan', sql.Int,  maPhieuThanhToan)
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
    }catch(err){
        console.error('Không lấy được hóa đơn:', err);
        res.status(500).json({ error: err.message });
    }
});
