USE PTTK
GO

CREATE OR ALTER PROC TaoPhieuThanhToan
	@MaPhieuDangKy int,
	@NhanVienThucHien char(8)
AS
BEGIN 
	IF NOT EXISTS (
		SELECT 1 FROM PhieuDangKy 
		WHERE MaPhieuDangKy = @MaPhieuDangKy
	)
    BEGIN
        RAISERROR (N'Phiếu đăng ký không có trong hệ thống', 16, 1);
        RETURN;
    END;
	IF NOT EXISTS (
		SELECT 1 FROM PhieuThanhToan WHERE MaPhieuDangKy = @MaPhieuDangKy
	)
	BEGIN


		DECLARE @SOLUONG INT
		DECLARE @GIAMGIA INT
		DECLARE @TAMTINH INT
		DECLARE @THANHTIEN INT

		SET @SOLUONG = (
		SELECT COUNT(*) FROM ChiTietPhieuDangKy C
		JOIN PhieuDangKy P ON P.MaPhieuDangKy = C.MaPhieuDangKy
		JOIN KhachHang K ON K.MaKhachHang = P.MaKhachHang
		WHERE K.LoaiKhachHang = N'đơn vị' AND P.MaPhieuDangKy = @MaPhieuDangKy) 

		IF @SOLUONG BETWEEN 1 AND 20
		BEGIN
			SET @GIAMGIA = 10;
		END
		ELSE IF @SOLUONG >= 20
		BEGIN
			SET @GIAMGIA = 15;
		END
		ELSE 
		BEGIN
			SET @GIAMGIA = 0;
		END

		SET @TAMTINH = @SOLUONG * (
			SELECT B.LePhiThi FROM BangGiaThi B 
			JOIN PhieuDangKy P ON P.LoaiChungChi = B.MaLoaiChungChi
			WHERE P.MaPhieuDangKy = @MaPhieuDangKy
		);

		SET @THANHTIEN = @TAMTINH - ((10*@TAMTINH)*100);
		INSERT INTO PhieuThanhToan(MaPhieuDangKy, TamTinh, PhanTramGiamGia, ThanhTien,TrangThaiThanhToan, NhanVienThucHien )
		VALUES (@MaPhieuDangKy, @TAMTINH, @GIAMGIA,@THANHTIEN,0,@NhanVienThucHien);
	END		
END
GO


CREATE OR ALTER PROC TaoHoaDon
	@MaPhieuThanhToan int,
	@HinhThucThanhToan nvarchar(20),
	@MaGiaoDich int = null
AS
BEGIN
	DECLARE @MaPhieuDangKy int
	SET @MaPhieuDangKy = (SELECT MaPhieuDangKy FROM PhieuThanhToan WHERE MaPhieuThanhToan = @MaPhieuThanhToan)
	DECLARE @NgayDangKy DATE
	SET @NgayDangKy = (SELECT NgayDangKy FROM PhieuDangKy WHERE MaPhieuDangKy = @MaPhieuDangKy)
	IF GETDATE() > DATEADD(DAY, 3, @NgayDangKy)
	BEGIN 
		RAISERROR (N'Quá hạn thanh toán cho phiếu đăng ký này', 16, 1);
        RETURN;
	END	
	IF (SELECT TrangThaiThanhToan FROM PhieuThanhToan WHERE MaPhieuDangKy = @MaPhieuDangKy) = 1
	BEGIN
		RAISERROR (N'Phiếu đã được thanh toán trước đó.', 16, 1);
        RETURN;
	END


	DECLARE @TongTien INT
	SET @TongTien = (SELECT ThanhTien FROM PhieuThanhToan WHERE MaPhieuDangKy = @MaPhieuDangKy)

	IF NOT EXISTS (
		SELECT 1 FROM PhieuThanhToan 
		WHERE MaPhieuThanhToan = @MaPhieuThanhToan
	)
    BEGIN
        RAISERROR (N'Phiếu thanh toán không có trong hệ thống', 16, 1);
        RETURN;
    END;


	INSERT INTO HoaDonThanhToan (MaPhieuThanhToan, TongTien, HinhThucThanhToan,	NgayThanhToan, MaGiaoDich)
	VALUES (@MaPhieuThanhToan, @TongTien, @HinhThucThanhToan, GETDATE(), @MaGiaoDich);
	UPDATE PhieuThanhToan
	SET TrangThaiThanhToan = 1 WHERE MaPhieuThanhToan = @MaPhieuThanhToan
	UPDATE PhieuDangKy
	SET TrangThaiThanhToan = 1 WHERE MaPhieuDangKy = @MaPhieuDangKy

END
GO

