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
