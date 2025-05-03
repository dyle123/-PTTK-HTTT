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




--NU


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

INSERT INTO PhieuGiaHan (CCCD, MaPhieuDangKy, LoaiGiaHan, PhiGiaHan, LiDoGiaHan, NgayThiCu, NgayThiMoi)
VALUES('123456789012', 2, N'Hợp lệ', 200000, N'Cần thêm thời gian học', '2025-03-01'),('987654321098', 3, N'Không hợp lệ', 0, N'Không đủ điều kiện gia hạn', '2025-03-05');

insert into PhieuDuThi (SoBaoDanh, CCCD, TrangThai, LichThi) values ('090909090909','123456789012',0,1)

---------------------------------------------------------------------------------------------------------------
INSERT INTO ThiSinh (CCCD, HoVaTen, NgaySinh, Email, SoDienThoai, DiaChi) VALUES
('111111111111', N'Nguyễn Văn A', '2000-01-01', 'a@gmail.com', '0901111111', N'Hà Nội'),
('222222222222', N'Lê Thị B', '2001-02-02', 'b@gmail.com', '0902222222', N'Hồ Chí Minh'),
('333333333333', N'Trần Văn C', '2002-03-03', 'c@gmail.com', '0903333333', N'Đà Nẵng'),
('444444444444', N'Phạm Thị D', '2003-04-04', 'd@gmail.com', '0904444444', N'Hải Phòng'),
('555555555555', N'Hoàng Văn E', '2004-05-05', 'e@gmail.com', '0905555555', N'Bình Dương'),
('666666666666', N'Vũ Thị F', '2005-06-06', 'f@gmail.com', '0906666666', N'Cần Thơ'),
('777777777777', N'Đặng Văn G', '2000-07-07', 'g@gmail.com', '0907777777', N'Quảng Ninh'),
('888888888888', N'Ngô Thị H', '2001-08-08', 'h@gmail.com', '0908888888', N'Nghệ An'),
('999999999999', N'Bùi Văn I', '2002-09-09', 'i@gmail.com', '0909999999', N'Thừa Thiên Huế'),
('000000000000', N'Đinh Thị K', '2003-10-10', 'k@gmail.com', '0910000000', N'Bắc Ninh');


INSERT INTO PhongThi (SucChuaToiDa, SoLuongHienTai) VALUES
(100, 50), (120, 80), (150, 100), (200, 150), (90, 45),
(130, 110), (180, 170), (140, 90), (160, 120), (110, 60);


INSERT INTO LichThi (NgayThi, GioThi, SoLuongDangKy, LoaiChungChi, MaPhongThi) VALUES
('2025-05-01', '08:00:00', 40, 1, 1),
('2025-05-02', '09:00:00', 35, 2, 2),
('2025-05-03', '13:00:00', 30, 1, 3),
('2025-05-04', '14:00:00', 45, 2, 4),
('2025-05-05', '07:30:00', 50, 1, 5),
('2025-05-06', '08:30:00', 55, 2, 6),
('2025-05-07', '09:30:00', 25, 1, 7),
('2025-05-08', '10:30:00', 20, 2, 8),
('2025-05-09', '13:30:00', 60, 1, 9),
('2025-05-10', '14:30:00', 65, 2, 10);


INSERT INTO BangGiaThi (MaLoaiChungChi, TenChungChi, LePhiThi) VALUES
(3, N'Tiếng Anh A', 500000),
(4, N'Tiếng Anh B', 600000),
(5, N'Tin học A', 450000),
(6, N'Tin học B', 550000),
(7, N'Tin học MOS', 1200000),
(8, N'Tiếng Nhật N5', 3500000),
(9, N'Tiếng Hàn Topik 1', 3000000),
(10, N'JLPT N4', 4000000);

INSERT INTO ChungChi (NgayCap, NgayHetHan, LoaiChungChi, TrangThai, CCCD) VALUES
('2025-04-01', '2027-04-01', 1, N'Còn hiệu lực', '111111111111'),
('2025-04-02', '2027-04-02', 2, N'Còn hiệu lực', '222222222222'),
('2025-04-03', '2027-04-03', 3, N'Còn hiệu lực', '333333333333'),
('2025-04-04', '2027-04-04', 4, N'Còn hiệu lực', '444444444444'),
('2025-04-05', '2027-04-05', 5, N'Còn hiệu lực', '555555555555'),
('2025-04-06', '2027-04-06', 6, N'Còn hiệu lực', '666666666666'),
('2025-04-07', '2027-04-07', 7, N'Còn hiệu lực', '777777777777'),
('2025-04-08', '2027-04-08', 8, N'Còn hiệu lực', '888888888888'),
('2025-04-09', '2027-04-09', 9, N'Còn hiệu lực', '999999999999'),
('2025-04-10', '2027-04-10', 10, N'Còn hiệu lực', '000000000000');


INSERT INTO PhieuDangKy (LoaiChungChi, NgayDangKy, TrangThaiThanhToan, LichThi, MaKhachHang)
VALUES
(1, '2025-04-01', 0, 1, 1),
(2, '2025-04-02', 1, 2, 2),
(3, '2025-04-03', 0, 3, 1),
(4, '2025-04-04', 1, 4, 2),
(5, '2025-04-05', 0, 5, 1),
(6, '2025-04-06', 1, 6, 2),
(7, '2025-04-07', 0, 7, 1),
(8, '2025-04-08', 1, 8, 2),
(9, '2025-04-09', 0, 9, 1),
(10,'2025-04-10',1,10,2);

INSERT INTO ChiTietPhieuDangKy (MaPhieuDangKy, CCCD, SoLanGiaHan) VALUES
(1, '111111111111', 0),
(2, '222222222222', 0),
(3, '333333333333', 1),
(4, '444444444444', 0),
(5, '555555555555', 2),
(6, '666666666666', 1),
(7, '777777777777', 0),
(8, '888888888888', 0),
(9, '999999999999', 1),
(10,'000000000000', 2);

delete from ChiTietPhieuDangKy


INSERT INTO PhieuGiaHan (CCCD, MaPhieuDangKy, LoaiGiaHan, PhiGiaHan, LiDoGiaHan, NgayThiCu, NgayThiMoi)
VALUES
('111111111111', 3, N'Hợp lệ', 200000, N'Lý do 1', 1, 2),
('222222222222', 4, N'Hợp lệ', 250000, N'Lý do 2', 2, 3),
('333333333333', 5, N'Không hợp lệ', 0, N'Lý do 3', 3, 4),
('444444444444', 6, N'Hợp lệ', 300000, N'Lý do 4', 4, 5),
('555555555555', 7, N'Hợp lệ', 200000, N'Lý do 5', 5, 6),
('666666666666', 8, N'Không hợp lệ', 0, N'Lý do 6', 6, 7),
('777777777777', 9, N'Hợp lệ', 150000, N'Lý do 7', 7, 8),
('888888888888', 10, N'Hợp lệ', 200000, N'Lý do 8', 8, 9)


INSERT INTO PhieuDuThi (SoBaoDanh, CCCD, TrangThai, LichThi) VALUES
('SBD00000001', '111111111111', 0, 1),
('SBD00000002', '222222222222', 1, 2),
('SBD00000003', '333333333333', 0, 3),
('SBD00000004', '444444444444', 2, 4),
('SBD00000005', '555555555555', 0, 5),
('SBD00000006', '666666666666', 1, 6),
('SBD00000007', '777777777777', 0, 7),
('SBD00000008', '888888888888', 2, 8),
('SBD00000009', '999999999999', 0, 9),
('SBD00000010', '000000000000', 1, 10);

--NU

Select*from PhieuDangKy
select* from KhachHang
Select*from ThiSinh
update LichThi
set SoLuongDangKy = 1

select*from PhongThi
select*from BangGiaThi
SELECT MaLoaiChungChi, TenChungChi FROM BangGiaThi
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
 select* from PhongThi
 select * From LichThi

 select * from PhieuDangKy

    select * from ChiTietPhieuDangKy

    select * from ThiSinh

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
('2025-05-30', '08:00:00', 10, 1, 1), -- TOEIC tại phòng 1
('2025-05-21', '13:30:00', 0, 2, 2),  -- Tin học tại phòng 2
('2025-06-22', '09:00:00', 5, 1, 1);  -- TOEIC tại phòng 1

delete from PhieuGiaHan
WHERE CCCD='123456789012'

INSERT INTO LichThi (NgayThi, GioThi, MaPhongThi, LoaiChungChi)
VALUES ('2025-05-09', '10:03:30', 1, 1); -- Thay thế bằng giá trị thực tế của bạn

select* from LichThi
select*from PhieuGiaHan

delete from PhieuGiaHan where CCCD='987654321098'

select * from GacThi

select * from PhieuDangKy


select * from ThiSinh
select *from ChiTietPhieuDangKy

select * from NhanVien

SELECT LichThi.*, BangGiaThi.*, PhongThi.*
            FROM LichThi 
            JOIN BangGiaThi ON LichThi.LoaiChungChi = BangGiaThi.MaLoaiChungChi
            JOIN PhongThi ON LichThi.MaPhongThi = PhongThi.MaPhongThi