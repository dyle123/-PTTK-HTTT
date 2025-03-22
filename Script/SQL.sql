USE MASTER
GO
ALTER DATABASE PTTK SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
IF DB_ID('PTTK') IS NOT NULL
	DROP DATABASE PTTK

CREATE DATABASE PTTK
GO

USE PTTK
GO
insert into NhanVien(MaNhanVien,HoTen,NgaySinh,SoDienThoai,Luong,BoPhan)
values ('NV000012', N'Le Vy', '2004-12-23', '0973488548', '2000000', 'ketoan')
 insert into Users(MaNhanVien, PassWord, Role)
values ('NV000012', '123','ketoan');




CREATE TABLE KhachHang(
	MaKhachHang int IDENTITY(1,1) Primary Key,
	TenKhachHang nvarchar(50) NOT NULL,
    Email CHAR(60) ,
	SoDienThoai char(10) ,
	DiaChi NVARCHAR(255) NOT NULL,
	LoaiKhachHang nvarchar(20) CHECK(LoaiKhachHang IN (N'tự do', N'đơn vị')) NOT NULL
);

CREATE TABLE NhanVien(
	MaNhanVien char(8) Primary Key,
	HoTen nvarchar(50) NOT NULL,
	NgaySinh date NOT NULL,
	SoDienThoai char(10) UNIQUE,
	Luong varchar(15),
	BoPhan nvarchar(20) NOT NULL
);

CREATE TABLE PhieuThanhToan (
	MaPhieuThanhToan int IDENTITY(1,1) Primary Key,
	TamTinh int,
	PhanTramGiamGia INT,
	ThanhTien INT,
	TrangThaiThanhToan BIT DEFAULT 0 CHECK (TrangThaiThanhToan IN (0,1)) , --0: CHƯA THANH TOÁN, 1: ĐÃ THANH TOÁN
	MaPhieuDangKy int NOT NULL,--f
	NhanVienThucHien char(8) NOT NULL,--f
);

	CREATE TABLE HoaDonThanhToan(
	MaHoaDon int IDENTITY(1,1) Primary Key,
	TongTien int,
	HinhThucThanhToan nvarchar(20) DEFAULT N'tiền mặt' CHECK (HinhThucThanhToan IN ( N'tiền mặt',N'chuyển khoản')),
	NgayThanhToan datetime,
	MaPhieuThanhToan int,--f
	MaGiaoDich INT
);

CREATE TABLE KetQuaThi (
    MaKetQua INT IDENTITY(1,1) PRIMARY KEY,
    MaBaiThi INT,--f
    DiemTong INT,
    NgayCongBo DATE,
    MaChungChi INT--f
);

CREATE TABLE PhongThi (
    MaPhongThi INT IDENTITY(1,1) PRIMARY KEY,
    SucChuaToiDa INT NOT NULL,
    SoLuongHienTai INT NOT NULL
);

CREATE TABLE BaiThi (
    MaBaiThi INT IDENTITY(1,1) PRIMARY KEY,
    SoBaoDanh CHAR(10),
    LichThi DATE,
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

Create table PhieuDangKy(
    MaPhieuDangKy int IDENTITY(1,1) Primary Key,
    LoaiChungChi int ,
    NgayDangKy date,
    TrangThaiThanhToan nvarchar(20),
    ThoiGianMongMuonThi DATE,
    MaKhachHang int
);


create table ChiTietPhieuDangKy(
    MaPhieuDangKy int ,--f
    CCCD char(12) ,--f
    SoLanGiaHan int,
	CONSTRAINT PK_ChiTietPhieuDangKy PRIMARY KEY(MaPhieuDangKy,CCCD),
);

create table ChungChi(
    MaChungChi int IDENTITY(1,1)  Primary Key,
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
	MaLichThi INT IDENTITY(1,1)  Primary Key,
	NgayThi DATE,
	GioThi TIME,
	SoLuongDangKy INT,
	MaPhongThi INT,--f
	LoaiChungChi INT--f
)


CREATE TABLE Users
(
    MaNhanVien char(8) Primary Key,
    PassWord VARCHAR(50),
    Role  NVARCHAR(20)  NOT NULL CHECK (Role IN ('ketoan', 'tiepnhan', 'nhaplieu'))-- Vai trò
)

CREATE TABLE PhieuDuThi(
	SoBaoDanh char(10)  Primary Key,
	CCCD char(12),--f
	TrangThai nvarchar(50),
	LichThi int --f

)

CREATE TABLE BangGiaThi
(
	MaLoaiChungChi int Primary Key,
	TenChungChi nvarchar(50),
	LePhiThi int
)

CREATE TABLE ThongTinTruyCap (
	MaNhanVien char(8) NOT NULL, --Khóa ngoại liên kết đến 'KhachHang'
	SessionID INT PRIMARY KEY IDENTITY(1,1),-- Phiên đăng nhập của khách hàng
	ThoiGianTruyCap INT DEFAULT 0, -- Thời lượng khách hàng thao tác với website
	ThoiDiemTruyCap DATETIME DEFAULT GETDATE() NOT NULL, -- Thời điểm khách hàng truy cập vào website
);


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
	CONSTRAINT FK_PhieuDangKy_BangGiaThi FOREIGN KEY(LoaiChungChi) REFERENCES BangGiaThi(MaLoaiChungChi);

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







