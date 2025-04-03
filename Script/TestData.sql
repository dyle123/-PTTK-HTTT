USE PTTK
GO
insert into BangGiaThi(MaLoaiChungChi,TenChungChi,LePhiThi)
values (1,'Toeic', 2000000),(2, 'Ielst',5000000)
insert into NhanVien(MaNhanVien,HoTen,NgaySinh,SoDienThoai,Luong,BoPhan)
values ('NV000014', N'Tram Dao', '2004-12-23', '0965422253', '2000000', 'ketoan')
insert into NhanVien(MaNhanVien,HoTen,NgaySinh,SoDienThoai,Luong,BoPhan)
values ('NV000013', N'VirusS', '2004-12-23', '0965422252', '2000000', 'tiepnhan')

 insert into Users(MaNhanVien, PassWord, Role)
values ('NV000014', '123','ketoan');
 insert into Users(MaNhanVien, PassWord, Role)
values ('NV000013', '123','tiepnhan');


INSERT INTO ThiSinh (CCCD, HoVaTen, NgaySinh, Email, SoDienThoai, DiaChi)
VALUES ('123456789012', N'Nguyễn Văn A', '2002-05-15', 'nguyenvana@example.com', '0987654321', N'Hà Nội')

INSERT INTO ThiSinh (CCCD, HoVaTen, NgaySinh, Email, SoDienThoai, DiaChi)
VALUES ('987654321098', N'Trần Thị B', '2001-09-20', 'tranthib@example.com', '0912345678', N'TP. Hồ Chí Minh')

INSERT INTO KhachHang (TenKhachHang, Email, SoDienThoai, DiaChi, LoaiKhachHang)
VALUES (N'Nguyễn Văn C', 'nguyenvanc@example.com', '0987654321', N'Hà Nội', N'tự do')

INSERT INTO KhachHang (TenKhachHang, Email, SoDienThoai, DiaChi, LoaiKhachHang)
VALUES (N'Trần Thị D', 'tranthid@example.com', '0912345678', N'TP. Hồ Chí Minh', N'đơn vị')

INSERT INTO BangGiaThi (MaLoaiChungChi, TenChungChi, LePhiThi)
VALUES (1, N'Chứng chỉ Tiếng Anh B1', 1500000)

INSERT INTO BangGiaThi (MaLoaiChungChi, TenChungChi, LePhiThi)
VALUES (2, N'Chứng chỉ Công nghệ thông tin', 1200000)

INSERT INTO PhieuDangKy (LoaiChungChi, NgayDangKy, TrangThaiThanhToan, ThoiGianMongMuonThi, MaKhachHang)
VALUES (1, '2025-04-02', 1, '2025-05-10', 1)

INSERT INTO PhieuDangKy (LoaiChungChi, NgayDangKy, TrangThaiThanhToan, ThoiGianMongMuonThi, MaKhachHang)
VALUES (2, '2025-04-02', 0, '2025-06-15', 2)

INSERT INTO ChiTietPhieuDangKy (MaPhieuDangKy, CCCD, SoLanGiaHan)
VALUES (2, '123456789012', 0)

INSERT INTO ChiTietPhieuDangKy (MaPhieuDangKy, CCCD, SoLanGiaHan)
VALUES (2, '987654321098', 1)

Select *from ChiTietPhieuDangKy

UPDATE ChiTietPhieuDangKy SET MaPhieuDangKy=3 WHERE CCCD='987654321098'

Select *from PhieuGiaHan
UPDATE PhieuGiaHan SET MaPhieuDangKy=3 WHERE CCCD='987654321098'

 select* from ChiTietPhieuDangKy where MaPhieuDangKy = 5
 select* from ThiSinh
  select* from PhieuDangKy
 select* from  PhieuThanhToan
 update  PhieuDangKy
 set TrangThaiThanhToan = 0 where MaPhieuDangKy = 1
 select* from NhanVien
 select* from Users
 select* from HoaDonThanhToan
 select* from Payments
 update PhieuDangKy
 set NgayDangKy = '2025-03-26' where MaPhieuDangKy = 1
 delete from Payments where MaPhieuDangKy = 2
 -- Giả sử đã có bảng LichThi như sau:
-- CREATE TABLE LichThi (
--     MaLichThi INT PRIMARY KEY IDENTITY,
--     NgayThi DATE,
--     GioThi TIME,
--     SoLuongDangKy INT DEFAULT 0,
--     MaPhongThi NVARCHAR(10),
--     LoaiChungChi INT
-- );
SET IDENTITY_INSERT PhongThi ON;
INSERT INTO PhongThi (MaPhongThi, SucChuaToiDa, SoLuongHienTai)
VALUES 
(1, 30, 10),
(2, 25, 0),
(3, 40, 30);
SET IDENTITY_INSERT PhongThi OFF;
INSERT INTO BangGiaThi (MaLoaiChungChi, TenChungChi, LePhiThi)
VALUES
(1, N'TOEIC', 450000),
(2, N'Tin học B', 300000);

INSERT INTO BangGiaThi (MaLoaiChungChi, TenChungChi, LePhiThi)
VALUES 
(1, N'Chứng chỉ Tin học A', 200000),
(2, N'Chứng chỉ Tiếng Anh B1', 300000),
(3, N'Chứng chỉ Tin học B', 250000);

INSERT INTO LichThi (NgayThi, GioThi, SoLuongDangKy, MaPhongThi, LoaiChungChi)
VALUES
('2025-04-20', '08:00:00', 10, 1, 1), -- TOEIC tại phòng 1
('2025-04-21', '13:30:00', 0, 2, 2),  -- Tin học tại phòng 2
('2025-04-22', '09:00:00', 5, 1, 1);  -- TOEIC tại phòng 1

select* from ThiSinh

select* from PhongThi