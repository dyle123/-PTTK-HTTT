const express = require('express'); // Nhập thư viện express 
const session = require('express-session');
const bodyParser = require('body-parser'); // Để xử lý file request
const sql = require('mssql');
const path = require('path');
const app = express();
const PORT = 3000;


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
