CREATE DATABASE PTTK
GO
USE PTTK
 GO

CREATE TABLE NhanVien(
	MaNhanVien int (Primary Key),
	HoTen nvarchar(50),
	SoDienThoai char(10),
	Luong varchar(15),
	BoPhan nvarchar(20)
);

CREATE TABLE PhieuThanhToan (
	MaPhieuThanhToan int (Primary Key),
	SoTien int,
	PhanTramGiamGia int,
	TrangThaiThanhToan nvarchar(20),
	HinhThucThanhToan nvarchar(20),
	MaPhieuDangKy int
);

	CREATE TABLE HoaDonThanhToan(
	MaHoaDon int (Primary Key),
	TongTien int,
	NgayThanhToan datetime,
	MaPhieuThanhToan int
);

//My Y

CREATE TABLE KetQuaThi (
    MaKetQua INT PRIMARY KEY,
    MaBaiThi INT,
    DiemTong INT,
    NgayCongBo DATE,
    MaChungChi INT
);

CREATE TABLE PhongThi (
    MaPhongThi INT PRIMARY KEY,
    SucChuaToiDa INT NOT NULL,
    SoLuongHienTai INT NOT NULL
);

CREATE TABLE BaiThi (
    MaBaiThi INT PRIMARY KEY,
    SoBaoDanh INT,
    LichThi DATE,
    DangBaiThi VARCHAR(255),
    ThoiGianNopBai TIME
);

CREATE TABLE ChamThi (
    MaChamThi INT PRIMARY KEY,
    MaBaiThi INT,
    SoCau INT,
    DapAnNop TEXT,
    DapAnDung TEXT,
    DiemPhanManh FLOAT,
    MaNhanVien INT
);

CREATE TABLE ThiSinh
(
	CCCD CHAR(12),
	HoVaTen NVARCHAR(50),
	NgaySinh DATE,
	Email CHAR(60),
	SoDienThoai CHAR(10),
	DiaChi NVARCHAR(255),
	MaKhachHang INT
   
)

CREATE TABLE GacThi
(
	MaLichThi INT,
	MaNhanVienGac INT
)

CREATE TABLE LichThi
(
	MaLichThi INT,
	NgayThi DATE,
	GioThi TIME,
	SoLuongDangKy INT,
	MaPhongThi INT
)


CREATE TABLE Users
(
    UserNName VARCHAR(30),
    PassWord VARCHAR(50),
    Role  NVARCHAR(20)  NOT NULL CHECK (Role IN ('ketoan', 'tiepnhan', 'chamthi', 'nhaplieu')), -- Vai trò
    MaNhanVien INT
)


// Khóa ngoại ở đây
ALTER TABLE PhieuThanhToan 
ADD CONSTRAINT FK_PhieuThanhToan_PhieuDangKy FOREIGN KEY (MaPhieuDangKy) REFERENCES PhieuDangKy(MaPhieuDangKy);

ALTER TABLE HoaDonThanhToan
ADD CONSTRAINT FK_HoaDonThanhToan_PhieuThanhToan FOREIGN KEY (MaPhieuThanhToan) REFERENCES PhieuThanhToan(MaPhieuThanhToan);

ALTER TABLE Users
ADD CONSTRAINT FK_Users_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien);

ALTER TABLE KetQuaThi 
ADD CONSTRAINT FK_KetQuaThi_BaiThi FOREIGN KEY (MaBaiThi) REFERENCES BaiThi(MaBaiThi),
ADD CONSTRAINT FK_KetQuaThi_ChungChi FOREIGN KEY (MaChungChi) REFERENCES ChungChi(MaChungChi);

ALTER TABLE BaiThi 
ADD CONSTRAINT FK_BaiThi_ThiSinh FOREIGN KEY (SoBaoDanh) REFERENCES ThiSinh(SoBaoDanh);

ALTER TABLE ChamThi 
ADD CONSTRAINT FK_ChamThi_BaiThi FOREIGN KEY (MaBaiThi) REFERENCES BaiThi(MaBaiThi),
ADD CONSTRAINT FK_ChamThi_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien);

ALTER TABLE ThiSinh ADD CONSTRAINT PK_ThiSinh PRIMARY KEY(CCCD)
ALTER TABLE ThiSinh ADD CONSTRAINT FK_ThiSinh_KhachHang FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaKhachHang)

ALTER TABLE GacThi ADD CONSTRAINT PK_GacThi PRIMARY KEY (MaLichThi, MaNhanVienGac)
ALTER TABLE GacThi ADD CONSTRAINT FK_GacThi_LichThi FOREIGN KEY (MaLichThi) REFERENCES LichThi(MaLichThi)
ALTER TABLE GacThi ADD CONSTRAINT FK_GacThi_NhanVien FOREIGN KEY (MaNhanVienGac) REFERENCES NhanVien(MaNhanVien)

ALTER TABLE LichThi ADD CONSTRAINT PK_LichThi PRIMARY KEY (MaLichThi)
ALTER TABLE LichThi ADD CONSTRAINT FK_LichThi_PhongThi FOREIGN KEY(MaPhongThi) REFERENCES PhongThi(MaPhongThi)






