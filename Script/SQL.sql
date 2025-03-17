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



// Khóa ngoại ở đây
ALTER TABLE PhieuThanhToan 
ADD CONSTRAINT FK_PhieuThanhToan_PhieuDangKy FOREIGN KEY (MaPhieuDangKy) REFERENCES PhieuDangKy(MaPhieuDangKy);

ALTER TABLE HoaDonThanhToan
ADD CONSTRAINT FK_HoaDonThanhToan_PhieuThanhToan FOREIGN KEY (MaPhieuThanhToan) REFERENCES PhieuThanhToan(MaPhieuThanhToan)

ALTER TABLE KetQuaThi 
ADD CONSTRAINT FK_KetQuaThi_BaiThi FOREIGN KEY (MaBaiThi) REFERENCES BaiThi(MaBaiThi),
ADD CONSTRAINT FK_KetQuaThi_ChungChi FOREIGN KEY (MaChungChi) REFERENCES ChungChi(MaChungChi);

ALTER TABLE BaiThi 
ADD CONSTRAINT FK_BaiThi_ThiSinh FOREIGN KEY (SoBaoDanh) REFERENCES ThiSinh(SoBaoDanh);

ALTER TABLE ChamThi 
ADD CONSTRAINT FK_ChamThi_BaiThi FOREIGN KEY (MaBaiThi) REFERENCES BaiThi(MaBaiThi),
ADD CONSTRAINT FK_ChamThi_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien);







