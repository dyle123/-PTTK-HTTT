USE PTTK
GO

INSERT INTO BangGiaThi VALUES
(1, N'Toeic', 500000),
(2, N'Ielts', 700000)

INSERT INTO KhachHang VALUES
(N'Nguyễn Văn A', 'a@gmail.com', '0123456789', N'Hà Nội', N'tự do'),
(N'Nguyễn Thị B', 'b@gmail.com', '0987654321', N'Hồ Chí Minh', N'đơn vị'),
(N'Trần Văn C', 'c@gmail.com', '0111222333', N'Đà Nẵng', N'tự do');

INSERT INTO ThiSinh VALUES
('123456789001', N'Lê Văn Hùng', '1990-01-01', 'hung@gmail.com', '0909090909', N'Hải Phòng'),
('123456789002', N'Ngô Thị Hoa', '1995-02-02', 'hoa@gmail.com', '0912121212', N'Bắc Ninh'),
('123456789003', N'Phạm Minh Đức', '1998-03-03', 'duc@gmail.com', '0933333333', N'Quảng Ninh');

INSERT INTO PhongThi VALUES
(30, 0),
(40, 0),
(50, 0);


INSERT INTO LichThi (NgayThi, GioThi, SoLuongDangKy, MaPhongThi, LoaiChungChi) VALUES
('2025-06-01', '08:00', 0, 1, 1),
('2025-06-02', '08:00', 0, 2, 2);

INSERT INTO NhanVien VALUES
('NV000014', N'Trịnh Văn Long', '1985-05-05', '0988111222', '10000000', N'Kế toán'),
('NV000013', N'Hoàng Mỹ Linh', '1990-06-06', '0911222333', '12000000', N'Tiếp nhận'),
('NV000015', N'Lưu Quốc An', '1992-07-07', '0900333444', '11000000', N'Nhập liệu');

insert into Users(MaNhanVien, PassWord, Role)
values ('NV000014', '123','ketoan');
 insert into Users(MaNhanVien, PassWord, Role)
values ('NV000013', '123','tiepnhan');

INSERT INTO PhieuDangKy (LoaiChungChi, NgayDangKy, TrangThaiThanhToan, LichThi, MaKhachHang, PaymentLink) VALUES
(1, '2025-05-01', 0, 2, 1, null),
(2, '2025-05-02', 0, 3, 2, null);

INSERT INTO ChiTietPhieuDangKy VALUES
(4, '123456789002', 0),
(5, '123456789003', 0);

INSERT INTO PhieuThanhToan (TamTinh, PhanTramGiamGia, ThanhTien, TrangThaiThanhToan, MaPhieuDangKy, NhanVienThucHien) VALUES
(500000, 0, 500000, 0, 4, 'NV000014'),
(700000, 10, 630000, 1, 5, 'NV000014');

INSERT INTO HoaDonThanhToan (TongTien, HinhThucThanhToan, NgayThanhToan, MaPhieuThanhToan, MaGiaoDich) VALUES
(630000, N'chuyển khoản', '2025-05-06', 4, 'GD002'),
(855000, N'tiền mặt', '2025-05-07', 5, 'GD003');

INSERT INTO PhieuDuThi VALUES
('SBD00000001', '123456789001', 0, 2),
('SBD00000002', '123456789002', 0, 3);


INSERT INTO BaiThi (SoBaoDanh, DangBaiThi, ThoiGianNopBai) VALUES
('SBD00000001', 'Bài trắc nghiệm', '2025-06-01 09:30:00'),
('SBD00000002', 'Bài viết', '2025-06-02 10:00:00');

INSERT INTO ChungChi (NgayCap, NgayHetHan, LoaiChungChi, TrangThai, CCCD) VALUES
('2025-06-15', '2027-06-15', 1, N'Cấp phát', '123456789001'),
('2025-06-16', '2027-06-16', 2, N'Cấp phát', '123456789002');

INSERT INTO KetQuaThi (MaBaiThi, DiemTong, NgayCongBo, MaChungChi) VALUES
(4, 85, '2025-06-10', 4),
(5, 90, '2025-06-11', 5);



INSERT INTO GacThi VALUES
(3, 'NV000013'),
(2, 'NV000014');


INSERT INTO PhieuGiaHan VALUES
('123456789001', 4, N'Hợp lệ', 100000, N'Lý do cá nhân', 2, 3),
('123456789002', 5, N'Không hợp lệ', 100000, N'Trễ giờ', 2, 3);

