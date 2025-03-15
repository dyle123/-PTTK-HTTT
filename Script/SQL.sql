CREATE DATABASE PTTK
GO
USE PTTK
 GO

CREATE TABLE NhanVien
MaNhanVien int (Primary Key),
HoTen nvarchar(50),
SoDienThoai char(10),
Luong varchar(15),
BoPhan nvarchar(20)

CREATE TABLE PhieuThanhToan
MaPhieuThanhToan int (Primary Key),
SoTien int,
PhanTramGiamGia int,
TrangThaiThanhToan nvarchar(20),
HinhThucThanhToan nvarchar(20),
MaPhieuDangKy int

CREATE TABLE HoaDonThanhToan
MaHoaDon int (Primary Key),
TongTien int,
NgayThanhToan datetime,
MaPhieuThanhToan int



// Khóa ngoại ở đây
ALTER TABLE PhieuThanhToan 
ADD CONSTRAINT FK_PhieuThanhToan_PhieuDangKy FOREIGN KEY (MaPhieuDangKy) REFERENCES PhieuDangKy(MaPhieuDangKy);

ALTER TABLE HoaDonThanhToan
ADD CONSTRAINT FK_HoaDonThanhToan_PhieuThanhToan FOREIGN KEY (MaPhieuThanhToan) REFERENCES PhieuThanhToan(MaPhieuThanhToan)










