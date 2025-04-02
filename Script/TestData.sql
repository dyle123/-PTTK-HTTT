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


INSERT INTO PhieuGiaHan (CCCD, MaPhieuDangKy, LoaiGiaHan, PhiGiaHan, LiDoGiaHan, NgayGiaHan)
VALUES ('123456789012', 2, N'Hợp lệ', 200000, N'Lý do sức khỏe', '2025-04-02')

INSERT INTO PhieuGiaHan (CCCD, MaPhieuDangKy, LoaiGiaHan, PhiGiaHan, LiDoGiaHan, NgayGiaHan)
VALUES ('987654321098', 2, N'Không hợp lệ', 0, N'Không đủ điều kiện gia hạn', '2025-04-02')

select *from PhieuDangKy

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
