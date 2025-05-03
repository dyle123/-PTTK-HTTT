USE MASTER
GO
ALTER DATABASE PTTK SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
IF DB_ID('PTTK') IS NOT NULL
	DROP DATABASE PTTK

CREATE DATABASE PTTK
GO

USE PTTK
GO

CREATE TABLE KhachHang
(
	MaKhachHang int IDENTITY(1,1) Primary Key,
	TenKhachHang nvarchar(50) NOT NULL,
	Email VARCHAR(60) ,
	SoDienThoai char(10) ,
	DiaChi NVARCHAR(255) NOT NULL,
	LoaiKhachHang nvarchar(20) CHECK(LoaiKhachHang IN (N'tự do', N'đơn vị')) NOT NULL
);

CREATE TABLE NhanVien
(
	MaNhanVien char(8) Primary Key,
	HoTen nvarchar(50) NOT NULL,
	NgaySinh date NOT NULL,
	SoDienThoai char(10) UNIQUE,
	Luong varchar(15),
	BoPhan nvarchar(20) NOT NULL
);

CREATE TABLE PhieuThanhToan
(
	MaPhieuThanhToan int IDENTITY(1,1) Primary Key,
	TamTinh int,
	PhanTramGiamGia INT,
	ThanhTien INT,
	TrangThaiThanhToan TINYINT DEFAULT 0 CHECK (TrangThaiThanhToan IN (0,1,2)),
	--0: CHƯA THANH TOÁN, 1: ĐÃ THANH TOÁN, 2: Quá hạn
	MaPhieuDangKy int NOT NULL,--f
	NhanVienThucHien char(8) NOT NULL,--f
);


CREATE TABLE HoaDonThanhToan
(
	MaHoaDon int IDENTITY(1,1) Primary Key,
	TongTien int,
	HinhThucThanhToan nvarchar(20) DEFAULT N'tiền mặt' CHECK (HinhThucThanhToan IN ( N'tiền mặt',N'chuyển khoản')),
	NgayThanhToan datetime,
	MaPhieuThanhToan int,--f
	MaGiaoDich varchar(30)
);

CREATE TABLE KetQuaThi
(
	MaKetQua INT IDENTITY(1,1) PRIMARY KEY,
	MaBaiThi INT,--f
	DiemTong INT,
	NgayCongBo DATE,
	MaChungChi INT--f
);

CREATE TABLE PhongThi
(
	MaPhongThi INT IDENTITY(1,1) PRIMARY KEY,
	SucChuaToiDa INT NOT NULL,
	SoLuongHienTai INT NOT NULL
);

CREATE TABLE BaiThi
(
	MaBaiThi INT IDENTITY(1,1) PRIMARY KEY,
	SoBaoDanh CHAR(12),
	DangBaiThi VARCHAR(255),
	ThoiGianNopBai DATETIME
);


CREATE TABLE ThiSinh
(
	CCCD CHAR(12) Primary Key,
	HoVaTen NVARCHAR(50),
	NgaySinh DATE,
	Email CHAR(60),
	SoDienThoai CHAR(10),
	DiaChi NVARCHAR(255)
)

Create table PhieuDangKy
(
	MaPhieuDangKy int IDENTITY(1,1) Primary Key,
	LoaiChungChi int ,
	NgayDangKy date,
	TrangThaiThanhToan TINYINT DEFAULT 0 CHECK (TrangThaiThanhToan IN (0,1,2)),
	LichThi int,
	MaKhachHang int,
	PaymentLink text
);

create table ChiTietPhieuDangKy
(
  MaPhieuDangKy int , -- Không còn 'unique' ở đây
  CCCD char(12) ,
  SoLanGiaHan int default 0,
  CONSTRAINT PK_ChiTietPhieuDangKy PRIMARY KEY(MaPhieuDangKy,CCCD),
);

create table ChungChi
(
	MaChungChi int IDENTITY(1,1) Primary Key,
	NgayCap date,
	NgayHetHan date,
	LoaiChungChi int,
	TrangThai nvarchar(20),
	CCCD char(12)--f
);



CREATE TABLE GacThi
(
	MaLichThi INT ,--f
	MaNhanVienGac char(8)--f,
		CONSTRAINT PK_GacThi PRIMARY KEY(MaLichThi,MaNhanVienGac)
)

CREATE TABLE LichThi
(
	MaLichThi INT IDENTITY(1,1) Primary Key,
	NgayThi DATE,
	GioThi TIME,
	SoLuongDangKy INT,
	MaPhongThi INT,--f
	LoaiChungChi INT--f
)

ALTER TABLE LichThi
ADD CONSTRAINT DF_SoLuongDangKy DEFAULT 0 FOR SoLuongDangKy;

CREATE TABLE Users
(
	MaNhanVien char(8) Primary Key,
	PassWord VARCHAR(50),
	Role NVARCHAR(20) NOT NULL CHECK (Role IN ('ketoan', 'tiepnhan', 'nhaplieu'))-- Vai trò
)

CREATE TABLE PhieuDuThi
(
	SoBaoDanh char(12) Primary Key,
	CCCD char(12),--f
	TrangThai TINYINT DEFAULT 0 CHECK (TrangThai IN (0,1,2)),
	LichThi int
	--f
)

CREATE TABLE BangGiaThi
(
	MaLoaiChungChi int Primary Key,
	TenChungChi nvarchar(50),
	LePhiThi int
)

CREATE TABLE ThongTinTruyCap
(
	MaNhanVien char(8) NOT NULL,
	--Khóa ngoại liên kết đến 'KhachHang'
	SessionID INT PRIMARY KEY IDENTITY(1,1),-- Phiên đăng nhập của khách hàng
	ThoiGianTruyCap INT DEFAULT 0,
	-- Thời lượng khách hàng thao tác với website
	ThoiDiemTruyCap DATETIME DEFAULT GETDATE() NOT NULL,
	-- Thời điểm khách hàng truy cập vào website
);

CREATE TABLE Payments
(
	OrderCode INT PRIMARY KEY,
	PaymentLink NVARCHAR(500),
	TrangThai NVARCHAR(50) DEFAULT 'pending',
	MaPhieuDangKy int,
	QRCode varchar(500)
);



CREATE TABLE PhieuGiaHan
(
	CCCD char(12),
	MaPhieuDangKy int,
	LoaiGiaHan nvarchar(12) check (LoaiGiaHan in (N'Hợp lệ', N'Không hợp lệ')),
	PhiGiaHan int,
	LiDoGiaHan nvarchar(255),
	NgayThiCu Int,
	NgayThiMoi Int,
	CONSTRAINT PK_PhieuGiaHan PRIMARY KEY (CCCD, MaPhieuDangKy)
)

-- Khóa ngoại ở đây
ALTER TABLE PhieuThanhToan 
ADD CONSTRAINT FK_PhieuThanhToan_PhieuDangKy FOREIGN KEY (MaPhieuDangKy) REFERENCES PhieuDangKy(MaPhieuDangKy),
	CONSTRAINT FK_PhieuThanhToan_NhanVien FOREIGN KEY (NhanVienThucHien) REFERENCES NhanVien(MaNhanVien);

ALTER TABLE HoaDonThanhToan
ADD CONSTRAINT FK_HoaDonThanhToan_PhieuThanhToan FOREIGN KEY (MaPhieuThanhToan) REFERENCES PhieuThanhToan(MaPhieuThanhToan);

ALTER TABLE Users
ADD CONSTRAINT FK_Users_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien);

ALTER TABLE KetQuaThi 
ADD CONSTRAINT FK_KetQuaThi_BaiThi FOREIGN KEY (MaBaiThi) REFERENCES BaiThi(MaBaiThi),
	CONSTRAINT FK_KetQuaThi_ChungChi FOREIGN KEY (MaChungChi) REFERENCES ChungChi(MaChungChi);

ALTER TABLE BaiThi 
ADD CONSTRAINT FK_BaiThi_ThiSinh FOREIGN KEY (SoBaoDanh) REFERENCES PhieuDuThi(SoBaoDanh);


ALTER TABLE GacThi 
ADD CONSTRAINT FK_GacThi_LichThi FOREIGN KEY (MaLichThi) REFERENCES LichThi(MaLichThi),
	CONSTRAINT FK_GacThi_NhanVien FOREIGN KEY (MaNhanVienGac) REFERENCES NhanVien(MaNhanVien)

ALTER TABLE LichThi 
ADD CONSTRAINT FK_LichThi_PhongThi FOREIGN KEY(MaPhongThi) REFERENCES PhongThi(MaPhongThi),
	CONSTRAINT FK_LichThi_BangGiaThi FOREIGN KEY(LoaiChungChi) REFERENCES BangGiaThi(MaLoaiChungChi);

ALTER TABLE PhieuDangKy 
ADD CONSTRAINT FK_PhieuDangKy_KhachHang FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaKhachHang),
	CONSTRAINT FK_PhieuDangKy_BangGiaThi FOREIGN KEY(LoaiChungChi) REFERENCES BangGiaThi(MaLoaiChungChi),
	CONSTRAINT FK_PhieuDangKy_LichThi FOREIGN KEY(LichThi) REFERENCES LichThi(MaLichThi);

ALTER TABLE ChiTietPhieuDangKy 
ADD CONSTRAINT FK_ChiTietPhieuDangKy_PhieuDangKy FOREIGN KEY (MaPhieuDangKy) REFERENCES PhieuDangKy(MaPhieuDangKy),
	CONSTRAINT FK_ChiTietPhieuDangKy_ThiSinh FOREIGN KEY (CCCD) REFERENCES ThiSinh(CCCD);

ALTER TABLE ChungChi 
ADD CONSTRAINT FK_ChungChi_ThiSinh FOREIGN KEY (CCCD) REFERENCES ThiSinh(CCCD),
	CONSTRAINT FK_ChungChi_BangGiaThi FOREIGN KEY(LoaiChungChi) REFERENCES BangGiaThi(MaLoaiChungChi);

ALTER TABLE PhieuDuThi
ADD CONSTRAINT FK_PhieuDuThi_ThiSinh FOREIGN KEY(CCCD) REFERENCES ThiSinh(CCCD),
	CONSTRAINT FK_PhieuDuThi_LichThi FOREIGN KEY(LichThi) REFERENCES LichThi(MaLichThi);

ALTER TABLE ThongTinTruyCap
ADD CONSTRAINT FK_ThongTinTruyCap_KhachHang FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien);

ALTER TABLE PhieuGiaHan
ADD CONSTRAINT FK_PhieuGiaHan_ThiSinh FOREIGN KEY(CCCD) REFERENCES ThiSinh(CCCD),
    CONSTRAINT FK_PhieuGiaHan_PhieuDangKy FOREIGN KEY(MaPhieuDangKy) REFERENCES PhieuDangKy(MaPhieuDangKy),
	CONSTRAINT FK_PhieuGiaHan_LichThi FOREIGN KEY (NgayThiCu) REFERENCES LichThi(MaLichThi),
	CONSTRAINT FK_PhieuGiaHan2_LichThi FOREIGN KEY (NgayThiMoi) REFERENCES LichThi(MaLichThi)





