USE PTTK
GO


CREATE OR ALTER PROCEDURE CapNhatPhieuDangKyQuaHan
AS
BEGIN
    UPDATE PhieuDangKy
    SET TrangThaiThanhToan = 2
    WHERE DATEDIFF(DAY, NgayDangKy, GETDATE()) >= 3 AND TrangThaiThanhToan = 0;
END;
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
		DECLARE @LOAIKHACHHANG NVARCHAR(20)

		SET @SOLUONG = (
		SELECT COUNT(*) FROM ChiTietPhieuDangKy C
		JOIN PhieuDangKy P ON P.MaPhieuDangKy = C.MaPhieuDangKy
		JOIN KhachHang K ON K.MaKhachHang = P.MaKhachHang
		WHERE P.MaPhieuDangKy = @MaPhieuDangKy) 

		SET @LOAIKHACHHANG = (
		SELECT K.LoaiKhachHang FROM KhachHang K
		JOIN PhieuDangKy P ON K.MaKhachHang = P.MaKhachHang  
		WHERE P.MaPhieuDangKy = @MaPhieuDangKy
		)

		
		IF @LOAIKHACHHANG = N'Đơn vị'
		BEGIN 
			IF @SOLUONG BETWEEN 1 AND 20
			BEGIN
				SET @GIAMGIA = 10;
			END
			ELSE IF @SOLUONG >= 20
			BEGIN
				SET @GIAMGIA = 15;
			END
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

		SET @THANHTIEN = @TAMTINH - ((@GIAMGIA*@TAMTINH)/100);
		INSERT INTO PhieuThanhToan(MaPhieuDangKy, TamTinh, PhanTramGiamGia, ThanhTien,TrangThaiThanhToan, NhanVienThucHien )
		VALUES (@MaPhieuDangKy, @TAMTINH, @GIAMGIA,@THANHTIEN,0,@NhanVienThucHien);
	END		
END
GO




CREATE OR ALTER PROC TaoHoaDon
	@MaPhieuThanhToan int,
	@HinhThucThanhToan nvarchar(20) = null,
	@MaGiaoDich varchar(30) = null
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






CREATE OR ALTER PROC PHATHANHPHIEUDUTHI
    @MaPhieuDangKy INT
AS
BEGIN
    DECLARE @SoThuTu INT = 1;
    DECLARE @SoBaoDanh CHAR(12);
    DECLARE @MaLichThi INT;
    DECLARE @NgayThi DATE;
    DECLARE @MaChungChi INT;
    
    -- Lấy thông tin lịch thi
    SELECT @MaLichThi = LichThi FROM PhieuDangKy WHERE MaPhieuDangKy = @MaPhieuDangKy;

    IF @MaLichThi IS NULL
    BEGIN
        PRINT 'Không tìm thấy lịch thi phù hợp.';
        RETURN;
    END;

    -- Lấy ngày thi và mã chứng chỉ
    SELECT @NgayThi = NgayThi, @MaChungChi = LoaiChungChi FROM LichThi WHERE MaLichThi = @MaLichThi;

    -- Kiểm tra nếu phiếu đăng ký đã quá hạn 14 ngày
    IF NOT EXISTS (
        SELECT 1 
        FROM PhieuDangKy 
        WHERE MaPhieuDangKy = @MaPhieuDangKy 
          AND DATEDIFF(DAY, GETDATE(), @NgayThi) <= 14
    )
    BEGIN
        PRINT 'Phiếu đăng ký không hợp lệ hoặc đã quá 14 ngày.';
        RETURN;
    END;

    -- Lấy danh sách thí sinh thuộc phiếu đăng ký
    DECLARE @CCCD CHAR(12);
    DECLARE cur CURSOR FOR 
    SELECT CCCD 
    FROM ChiTietPhieuDangKy 
    WHERE MaPhieuDangKy = @MaPhieuDangKy
    ORDER BY CCCD ASC;

    -- Mở con trỏ
    OPEN cur;
    FETCH NEXT FROM cur INTO @CCCD;

    -- Xử lý từng thí sinh
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Kiểm tra CCCD hợp lệ
        IF @CCCD IS NOT NULL
        BEGIN
            -- Tạo số báo danh theo format YYMMDDCCNNNN
            SET @SoBaoDanh = 
                FORMAT(@NgayThi, 'yyMMdd') +   -- YYMMDD
                FORMAT(@MaChungChi, '00') +    -- CC
                FORMAT(@SoThuTu, '0000');      -- NNNN

            -- Chèn vào bảng PhieuDuThi
            INSERT INTO PhieuDuThi (SoBaoDanh, CCCD, TrangThai, LichThi)
            VALUES (@SoBaoDanh, @CCCD, N'Chưa thi', @MaLichThi);

            -- Debug: In số báo danh đã cấp
            PRINT 'Thí sinh có CCCD: ' + @CCCD + ' - Số báo danh: ' + @SoBaoDanh;

            -- Tăng số thứ tự
            SET @SoThuTu = @SoThuTu + 1;
        END;

        FETCH NEXT FROM cur INTO @CCCD;
    END;

    -- Đóng con trỏ
    CLOSE cur;
    DEALLOCATE cur;
END;
GO

