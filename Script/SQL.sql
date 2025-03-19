USE MASTER
GO
ALTER DATABASE PTTK SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
IF DB_ID('PTTK') IS NOT NULL
	DROP DATABASE PTTK

CREATE DATABASE PTTK
GO
USE PTTK
 GO

CREATE TABLE KhachHang(
	MaKhachHang int Primary Key,
	TenKhachHang nvarchar(50),
    Email CHAR(60),
	SoDienThoai char(10),
	DiaChi NVARCHAR(255),
	LoaiKhachHang nvarchar(20)
);

CREATE TABLE NhanVien(
	MaNhanVien int Primary Key,
	HoTen nvarchar(50),
	NgaySinh date,
	SoDienThoai char(10),
	Luong varchar(15),
	BoPhan nvarchar(20)
);

CREATE TABLE PhieuThanhToan (
	MaPhieuThanhToan int Primary Key,
	SoTien int,
	PhanTramGiamGia int,
	TrangThaiThanhToan nvarchar(20),
	HinhThucThanhToan nvarchar(20),
	MaPhieuDangKy int,--f
	NhanVienThucHien int,--f
);

	CREATE TABLE HoaDonThanhToan(
	MaHoaDon int Primary Key,
	TongTien int,
	NgayThanhToan datetime,
	MaPhieuThanhToan int--f
);

CREATE TABLE KetQuaThi (
    MaKetQua INT PRIMARY KEY,
    MaBaiThi INT,--f
    DiemTong INT,
    NgayCongBo DATE,
    MaChungChi INT--f
);

CREATE TABLE PhongThi (
    MaPhongThi INT PRIMARY KEY,
    SucChuaToiDa INT NOT NULL,
    SoLuongHienTai INT NOT NULL
);

CREATE TABLE BaiThi (
    MaBaiThi INT PRIMARY KEY,
    SoBaoDanh CHAR(10),
    LichThi DATE,
    DangBaiThi VARCHAR(255),
    ThoiGianNopBai TIME
);

CREATE TABLE ChamThi (
    MaChamThi INT PRIMARY KEY,
    MaBaiThi INT,--f
    SoCau INT,
    DapAnNop TEXT,
    DapAnDung TEXT,
    DiemPhanManh FLOAT,
    MaNhanVien INT--f
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
    MaPhieuDangKy int Primary Key,
    LoaiChungChi nvarchar(50),
    NgayDangKy date,
    TrangThaiThanhToan nvarchar(20),
    ThoiGianMongMuonThi DATE,
    MaKhachHang int,
    CCCD char(12)
);

create table ChiTietPhieuDangKy(
    MaPhieuDangKy int ,--f
    CCCD char(12) ,--f
    SoLanGiaHan int,
	CONSTRAINT PK_ChiTietPhieuDangKy PRIMARY KEY(MaPhieuDangKy,CCCD),
);

create table ChungChi(
    MaChungChi int Primary Key,
    NgayCap date,
    NgayHetHan date,
    LoaiChungChi nvarchar(50),
    TrangThai nvarchar(20),
    CCCD char(12)--f
);


CREATE TABLE GacThi
(
	MaLichThi INT ,--f
	MaNhanVienGac INT--f,
	CONSTRAINT PK_GacThi PRIMARY KEY(MaLichThi,MaNhanVienGac)
)

CREATE TABLE LichThi
(
	MaLichThi INT Primary Key,
	NgayThi DATE,
	GioThi TIME,
	SoLuongDangKy INT,
	MaPhongThi INT--f
)


CREATE TABLE Users
(
    UserNName VARCHAR(30)Primary Key,
    PassWord VARCHAR(50),
    Role  NVARCHAR(20)  NOT NULL CHECK (Role IN ('ketoan', 'tiepnhan', 'chamthi', 'nhaplieu')), -- Vai trò
    MaNhanVien INT
)

CREATE TABLE PhieuDuThi(
	SoBaoDanh char(10) Primary Key,
	CCCD char(12),--f
	TrangThai nvarchar(50),
	LichThi int --f

)

--insert into Users(UserNName, PassWord, Role)
--values ('yenvy123', '1928374650Vy','ketoan');


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

ALTER TABLE ChamThi 
ADD CONSTRAINT FK_ChamThi_BaiThi FOREIGN KEY (MaBaiThi) REFERENCES BaiThi(MaBaiThi),
	CONSTRAINT FK_ChamThi_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien);

ALTER TABLE GacThi 
ADD CONSTRAINT FK_GacThi_LichThi FOREIGN KEY (MaLichThi) REFERENCES LichThi(MaLichThi),
	CONSTRAINT FK_GacThi_NhanVien FOREIGN KEY (MaNhanVienGac) REFERENCES NhanVien(MaNhanVien)

ALTER TABLE LichThi 
ADD CONSTRAINT FK_LichThi_PhongThi FOREIGN KEY(MaPhongThi) REFERENCES PhongThi(MaPhongThi)

ALTER TABLE PhieuDangKy 
ADD CONSTRAINT FK_PhieuDangKy_KhachHang FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaKhachHang),
	CONSTRAINT FK_PhieuDangKy_ThiSinh FOREIGN KEY (CCCD) REFERENCES ThiSinh(CCCD);

ALTER TABLE ChiTietPhieuDangKy 
ADD CONSTRAINT FK_ChiTietPhieuDangKy_PhieuDangKy FOREIGN KEY (MaPhieuDangKy) REFERENCES PhieuDangKy(MaPhieuDangKy),
	CONSTRAINT FK_ChiTietPhieuDangKy_ThiSinh FOREIGN KEY (CCCD) REFERENCES ThiSinh(CCCD);

ALTER TABLE ChungChi 
ADD CONSTRAINT FK_ChungChi_ThiSinh FOREIGN KEY (CCCD) REFERENCES ThiSinh(CCCD);

ALTER TABLE PhieuDuThi
ADD CONSTRAINT FK_PhieuDuThi_ThiSinh FOREIGN KEY(CCCD) REFERENCES ThiSinh(CCCD),
	CONSTRAINT FK_PhieuDuThi_LichThi FOREIGN KEY(LichThi) REFERENCES LichThi(MaLichThi);







