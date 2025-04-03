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





CREATE OR ALTER PROCEDURE KIEMTRAKHACHHANG
	@TenKhachHang NVARCHAR(50),
    @Email NVARCHAR(100),  
	@SoDienThoai CHAR(10),
	@DiaChi NVARCHAR(255) ,
	@LoaiKhachHang NVARCHAR(20),
	@MaKhachHang INT OUTPUT
AS
BEGIN
    BEGIN TRY
        -- Kiểm tra xem có khách hàng nào khác tên nhưng dùng cùng số điện thoại hay không
        IF EXISTS (SELECT 1 FROM KhachHang WHERE SoDienThoai = @SoDienThoai AND TenKhachHang <> @TenKhachHang)
        BEGIN
            RAISERROR (N'Số điện thoại đã được đăng ký cho một khách hàng khác tên', 16, 1);
            RETURN;
        END

        -- Kiểm tra xem khách hàng đã tồn tại với cùng loại đăng ký chưa
        IF EXISTS (SELECT 1 FROM KhachHang WHERE SoDienThoai = @SoDienThoai AND TenKhachHang = @TenKhachHang AND LoaiKhachHang = @LoaiKhachHang)
        BEGIN
            -- Nếu tồn tại, lấy mã khách hàng hiện có
            SELECT @MaKhachHang = MaKhachHang FROM KhachHang 
            WHERE SoDienThoai = @SoDienThoai AND TenKhachHang = @TenKhachHang AND LoaiKhachHang = @LoaiKhachHang;
        END
        ELSE
        BEGIN
            -- Nếu chưa tồn tại, thêm mới khách hàng
            BEGIN TRANSACTION;

            INSERT INTO KhachHang (TenKhachHang, SoDienThoai, Email, DiaChi, LoaiKhachHang)
            VALUES (@TenKhachHang, @SoDienThoai, @Email, @DiaChi, @LoaiKhachHang);

            SET @MaKhachHang = SCOPE_IDENTITY();

            COMMIT TRANSACTION;
        END
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, rollback transaction để tránh dữ liệu bị lỗi
        IF @@TRANCOUNT > 0 
            ROLLBACK TRANSACTION;

        -- Hiển thị lỗi cụ thể
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO


CREATE OR ALTER PROCEDURE KIEMTRATHISINH 
    @TenTS NVARCHAR(50),
    @CCCDTS CHAR(12),
    @NgaySinh DATE, 
    @EmailTS NVARCHAR(100),  
    @SoDienThoaiTS CHAR(10),
    @DiaChiTS NVARCHAR(255) 
AS
BEGIN
    DECLARE @HoVaTen NVARCHAR(50), @NgaySinhDB DATE;

    SELECT @HoVaTen = HoVaTen, @NgaySinhDB = NgaySinh
    FROM ThiSinh
    WHERE CCCD = @CCCDTS;

    IF @HoVaTen IS NOT NULL 
    BEGIN 
        IF @HoVaTen != @TenTS OR @NgaySinhDB != @NgaySinh
        BEGIN 
            RAISERROR (N'Thí sinh đã đăng ký thi trước đó nhưng thông tin tiên quyết không khớp', 16, 1);
            RETURN;
        END
        -- Cập nhật thông tin liên hệ nếu khác nhau
        UPDATE ThiSinh
        SET Email = @EmailTS, SoDienThoai = @SoDienThoaiTS, DiaChi = @DiaChiTS
        WHERE CCCD = @CCCDTS AND (Email <> @EmailTS OR SoDienThoai <> @SoDienThoaiTS OR DiaChi <> @DiaChiTS);
    END
    ELSE
    BEGIN
        INSERT INTO ThiSinh (CCCD, HoVaTen, NgaySinh, Email, SoDienThoai, DiaChi)
        VALUES (@CCCDTS, @TenTS, @NgaySinh, @EmailTS, @SoDienThoaiTS, @DiaChiTS);
    END
END;
GO



CREATE OR ALTER PROCEDURE Back
    @TenKH NVARCHAR(50),
    @EmailKH NVARCHAR(100),  
    @SoDienThoaiKH CHAR(10),
    @DiaChiKH NVARCHAR(255),
    @LoaiKhachHang NVARCHAR(20),
    @LoaiChungChi INT,
    @ThoiGianThi DATE,
    @TenTS NVARCHAR(50),
    @CCCDTS CHAR(12),
    @NgaySinh DATE, 
    @EmailTS NVARCHAR(100),  
    @SoDienThoaiTS CHAR(10),
    @DiaChiTS NVARCHAR(255) 
AS
BEGIN
    DECLARE @MaKhachHang INT, @MaPhieuDangKy INT;

    -- Bắt đầu giao dịch
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Kiểm tra hoặc tạo khách hàng
        EXEC KIEMTRAKHACHHANG @TenKH, @EmailKH, @SoDienThoaiKH, @DiaChiKH, @LoaiKhachHang, @MaKhachHang OUTPUT;

        -- Nếu không tìm thấy hoặc tạo được khách hàng thì báo lỗi
        IF @MaKhachHang IS NULL 
        BEGIN 
            RAISERROR (N'Lỗi khi kiểm tra hoặc tạo khách hàng!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Kiểm tra hoặc tạo thí sinh trước khi tạo phiếu đăng ký
        EXEC KIEMTRATHISINH @TenTS, @CCCDTS, @NgaySinh, @EmailTS, @SoDienThoaiTS, @DiaChiTS;

        -- Nếu có lỗi trong KIEMTRATHISINH, dừng lại
        IF @@ERROR <> 0 
        BEGIN 
            RAISERROR (N'Lỗi khi kiểm tra hoặc tạo thí sinh!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Tạo phiếu đăng ký (chỉ tạo nếu không có lỗi thí sinh)
        INSERT INTO PhieuDangKy (LoaiChungChi, NgayDangKy, ThoiGianMongMuonThi, MaKhachHang)
        VALUES (@LoaiChungChi, GETDATE(), @ThoiGianThi, @MaKhachHang);

        -- Lấy ID mới của phiếu đăng ký
        SET @MaPhieuDangKy = SCOPE_IDENTITY();

        -- Thêm vào bảng ChiTietPhieuDangKy
        INSERT INTO ChiTietPhieuDangKy (MaPhieuDangKy, CCCD)
        VALUES (@MaPhieuDangKy, @CCCDTS);

        -- Nếu không có lỗi, commit transaction
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi ở bất kỳ bước nào, rollback lại toàn bộ giao dịch
        ROLLBACK TRANSACTION;
        
        -- Hiển thị lỗi chi tiết
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
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


