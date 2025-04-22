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

select*from BangGiaThi

INSERT INTO BangGiaThi (MaLoaiChungChi, TenChungChi, LePhiThi)
VALUES (1, N'Chứng chỉ Tiếng Anh B1', 1500000)

INSERT INTO BangGiaThi (MaLoaiChungChi, TenChungChi, LePhiThi)
VALUES (2, N'Chứng chỉ Công nghệ thông tin', 1200000)




--nu
Select*from ThiSinh
Select*from LichThi
Select* from PhongThi

INSERT INTO PhongThi (SucChuaToiDa, SoLuongHienTai)
VALUES (100, 50),(150, 120); 

INSERT INTO LichThi (NgayThi, GioThi, SoLuongDangKy, LoaiChungChi)
VALUES ('2025-04-10', '08:00:00', 50, 1),('2025-04-12', '14:00:00', 30, 2);

INSERT INTO ChungChi (NgayCap, NgayHetHan, LoaiChungChi, TrangThai, CCCD)
VALUES ('2025-03-01', '2027-03-01', 1, N'Còn hiệu lực', '123456789012'),('2025-03-15', '2027-03-15', 2, N'Còn hiệu lực', '987654321098');

INSERT INTO PhieuDangKy (LoaiChungChi, NgayDangKy, TrangThaiThanhToan, LichThi, MaKhachHang)
VALUES (1, '2025-03-01', 0, 1, 1),(2, '2025-03-02', 1, 2, 2);

INSERT INTO ChiTietPhieuDangKy (MaPhieuDangKy, CCCD, SoLanGiaHan)
VALUES (1, '123456789012', 0), (2, '987654321098', 1);

Select*from ChiTietPhieuDangKy
Select*from PhieuDangKy

--INSERT INTO PhieuGiaHan (CCCD, MaPhieuDangKy, LoaiGiaHan, PhiGiaHan, LiDoGiaHan, NgayThiCu, NgayThiMoi)
--VALUES('123456789012', 2, N'Hợp lệ', 200000, N'Cần thêm thời gian học', '2025-03-01'),('987654321098', 3, N'Không hợp lệ', 0, N'Không đủ điều kiện gia hạn', '2025-03-05');

INSERT INTO PhieuGiaHan (CCCD, MaPhieuDangKy, LoaiGiaHan, PhiGiaHan, LiDoGiaHan, NgayThiCu, NgayThiMoi)
VALUES('123456789012', 1, N'Hợp lệ', 200000, N'Cần thêm thời gian học', 1,2);

insert into PhieuDuThi (SoBaoDanh, CCCD, TrangThai, LichThi) values ('090909090909','123456789012',0,1)

--nu

Select*from PhieuDangKy
select* from KhachHang
Select*from ThiSinh
update LichThi
set SoLuongDangKy = 1



Select *from ChiTietPhieuDangKy

UPDATE ChiTietPhieuDangKy SET MaPhieuDangKy=3 WHERE CCCD='987654321098'

Select *from PhieuGiaHan
UPDATE PhieuGiaHan SET MaPhieuDangKy=3 WHERE CCCD='987654321098'

 select* from ChiTietPhieuDangKy where MaPhieuDangKy = 5
 select* from ThiSinh
 select* from PhieuDangKy
 select* from  PhieuThanhToan
  select* from  PhieuDuThi
 update  PhieuDangKy
 set TrangThaiThanhToan = 0 where MaPhieuDangKy = 1
 select* from NhanVien
 select* from Users
 select* from HoaDonThanhToan
 select* from Payments
 update PhieuDangKy
 delete from PhieuDuThi
 drop table PhieuDuThi

 select GioThi From LichThi

 select* from PhieuDuThi
 set NgayDangKy = '2025-03-26' where MaPhieuDangKy = 1
 delete from Payments where MaPhieuDangKy = 2
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

delete from PhieuGiaHan
WHERE CCCD='123456789012'
