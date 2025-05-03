USE PTTK
GO



CREATE PROCEDURE sp_GetPhieuDangKyById
    @maPhieu INT
AS
BEGIN
    SELECT
        PD.MaPhieuDangKy,
        PD.NgayDangKy,
        L.NgayThi,
        PD.LoaiChungChi,
        PD.MaKhachHang,
        KH.TenKhachHang,
        KH.Email AS EmailKH,
        KH.SoDienThoai AS SDTKH,
        KH.DiaChi,
        TS.HoVaTen AS TenThiSinh,
        TS.NgaySinh,
        TS.Email AS EmailThiSinh,
        TS.SoDienThoai AS SDTThiSinh,
        TS.CCCD
    FROM PhieuDangKy PD
        JOIN KhachHang KH ON PD.MaKhachHang = KH.MaKhachHang
        JOIN ChiTietPhieuDangKy CTP ON PD.MaPhieuDangKy = CTP.MaPhieuDangKy
        JOIN ThiSinh TS ON TS.CCCD = CTP.CCCD
        JOIN LichThi L ON PD.LichThi = L.MaLichThi
    WHERE PD.MaPhieuDangKy = @maPhieu
END

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
		SELECT 1
    FROM PhieuDangKy
    WHERE MaPhieuDangKy = @MaPhieuDangKy
	)
    BEGIN
        RAISERROR (N'Phiếu đăng ký không có trong hệ thống', 16, 1);
        RETURN;
    END;
    IF NOT EXISTS (
		SELECT 1
    FROM PhieuThanhToan
    WHERE MaPhieuDangKy = @MaPhieuDangKy
	)
	BEGIN


        DECLARE @SOLUONG INT
        DECLARE @GIAMGIA INT
        DECLARE @TAMTINH INT
        DECLARE @THANHTIEN INT
        DECLARE @LOAIKHACHHANG NVARCHAR(20)

        SET @SOLUONG = (
		SELECT COUNT(*)
        FROM ChiTietPhieuDangKy C
            JOIN PhieuDangKy P ON P.MaPhieuDangKy = C.MaPhieuDangKy
            JOIN KhachHang K ON K.MaKhachHang = P.MaKhachHang
        WHERE P.MaPhieuDangKy = @MaPhieuDangKy)

        SET @LOAIKHACHHANG = (
		SELECT K.LoaiKhachHang
        FROM KhachHang K
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
			SELECT B.LePhiThi
        FROM BangGiaThi B
            JOIN PhieuDangKy P ON P.LoaiChungChi = B.MaLoaiChungChi
        WHERE P.MaPhieuDangKy = @MaPhieuDangKy
		);

        SET @THANHTIEN = @TAMTINH - ((@GIAMGIA*@TAMTINH)/100);
        INSERT INTO PhieuThanhToan
            (MaPhieuDangKy, TamTinh, PhanTramGiamGia, ThanhTien,TrangThaiThanhToan, NhanVienThucHien )
        VALUES
            (@MaPhieuDangKy, @TAMTINH, @GIAMGIA, @THANHTIEN, 0, @NhanVienThucHien);
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
    SET @MaPhieuDangKy = (SELECT MaPhieuDangKy
    FROM PhieuThanhToan
    WHERE MaPhieuThanhToan = @MaPhieuThanhToan)
    DECLARE @NgayDangKy DATE
    SET @NgayDangKy = (SELECT NgayDangKy
    FROM PhieuDangKy
    WHERE MaPhieuDangKy = @MaPhieuDangKy)
    IF GETDATE() > DATEADD(DAY, 3, @NgayDangKy)
	BEGIN
        RAISERROR (N'Quá hạn thanh toán cho phiếu đăng ký này', 16, 1);
        RETURN;
    END
    IF (SELECT TrangThaiThanhToan
    FROM PhieuThanhToan
    WHERE MaPhieuDangKy = @MaPhieuDangKy) = 1
	BEGIN
        RAISERROR (N'Phiếu đã được thanh toán trước đó.', 16, 1);
        RETURN;
    END


    DECLARE @TongTien INT
    SET @TongTien = (SELECT ThanhTien
    FROM PhieuThanhToan
    WHERE MaPhieuDangKy = @MaPhieuDangKy)

    IF NOT EXISTS (
		SELECT 1
    FROM PhieuThanhToan
    WHERE MaPhieuThanhToan = @MaPhieuThanhToan
	)
    BEGIN
        RAISERROR (N'Phiếu thanh toán không có trong hệ thống', 16, 1);
        RETURN;
    END;


    INSERT INTO HoaDonThanhToan
        (MaPhieuThanhToan, TongTien, HinhThucThanhToan, NgayThanhToan, MaGiaoDich)
    VALUES
        (@MaPhieuThanhToan, @TongTien, @HinhThucThanhToan, GETDATE(), @MaGiaoDich);
    UPDATE PhieuThanhToan
	SET TrangThaiThanhToan = 1 WHERE MaPhieuThanhToan = @MaPhieuThanhToan
    UPDATE PhieuDangKy
	SET TrangThaiThanhToan = 1 WHERE MaPhieuDangKy = @MaPhieuDangKy

END
GO


CREATE OR ALTER PROCEDURE KIEMTRAKHACHHANG
    @TenKH NVARCHAR(50),
    @EmailKH NVARCHAR(100),
    @SoDienThoaiKH CHAR(10),
    @DiaChiKH NVARCHAR(255),
    @LoaiKhachHang NVARCHAR(20),
    @MaKhachHang INT OUTPUT
AS
BEGIN
    -- Tìm khách hàng trùng SDT và loại khách hàng
    SELECT @MaKhachHang = MaKhachHang
    FROM KhachHang
    WHERE SoDienThoai = @SoDienThoaiKH AND LoaiKhachHang = @LoaiKhachHang;

    -- Nếu đã tồn tại khách hàng, kiểm tra tên có trùng không
    IF @MaKhachHang IS NOT NULL
    BEGIN
        DECLARE @TenCu NVARCHAR(50);
        SELECT @TenCu = TenKhachHang
        FROM KhachHang
        WHERE MaKhachHang = @MaKhachHang;

        IF @TenCu != @TenKH
        BEGIN
            RAISERROR(N'Số điện thoại đã được đăng ký cho một khách hàng khác tên', 16, 1);
            SET @MaKhachHang = NULL;
            RETURN;
        END
    END
    ELSE
    BEGIN
        -- Nếu không tồn tại thì thêm mới khách hàng
        INSERT INTO KhachHang
            (TenKhachHang, Email, SoDienThoai, DiaChi, LoaiKhachHang)
        VALUES
            (@TenKH, @EmailKH, @SoDienThoaiKH, @DiaChiKH, @LoaiKhachHang);

        SET @MaKhachHang = SCOPE_IDENTITY();
    END
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
        INSERT INTO ThiSinh
            (CCCD, HoVaTen, NgaySinh, Email, SoDienThoai, DiaChi)
        VALUES
            (@CCCDTS, @TenTS, @NgaySinh, @EmailTS, @SoDienThoaiTS, @DiaChiTS);
    END
END;
GO



CREATE OR ALTER PROCEDURE TaoPhieuDangKy
    @TenKH NVARCHAR(50),
    @EmailKH NVARCHAR(100),
    @SoDienThoaiKH CHAR(10),
    @DiaChiKH NVARCHAR(255),
    @LoaiKhachHang NVARCHAR(20),
    @LoaiChungChi INT,
    @TenTS NVARCHAR(50),
    @CCCDTS CHAR(12),
    @NgaySinh DATE,
    @EmailTS NVARCHAR(100),
    @SoDienThoaiTS CHAR(10),
    @DiaChiTS NVARCHAR(255)
AS
BEGIN
    DECLARE @MaKhachHang INT, @MaPhieuDangKy INT;

    BEGIN TRANSACTION;

    BEGIN TRY
        -- 1. Kiểm tra hoặc tạo khách hàng
        EXEC KIEMTRAKHACHHANG 
            @TenKH, @EmailKH, @SoDienThoaiKH, @DiaChiKH, @LoaiKhachHang, 
            @MaKhachHang OUTPUT;

        IF @MaKhachHang IS NULL 
        BEGIN
        RAISERROR (N'Lỗi kiểm tra/tạo khách hàng!', 16, 1);
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        RETURN;
    END;

        -- 2. Kiểm tra hoặc tạo thí sinh
        EXEC KIEMTRATHISINH 
            @TenTS, @CCCDTS, @NgaySinh, @EmailTS, @SoDienThoaiTS, @DiaChiTS;

        IF @@ERROR <> 0 
        BEGIN
        RAISERROR (N'Lỗi khi kiểm tra hoặc tạo thí sinh!', 16, 1);
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        RETURN;
    END;

        -- 3. Tạo phiếu đăng ký
        INSERT INTO PhieuDangKy
        (LoaiChungChi, NgayDangKy, MaKhachHang)
    VALUES
        (@LoaiChungChi, GETDATE(), @MaKhachHang);

        SET @MaPhieuDangKy = SCOPE_IDENTITY();

        -- 4. Ghi chi tiết phiếu đăng ký
        INSERT INTO ChiTietPhieuDangKy
        (MaPhieuDangKy, CCCD)
    VALUES
        (@MaPhieuDangKy, @CCCDTS);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END;

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
    SELECT @MaLichThi = LichThi
    FROM PhieuDangKy
    WHERE MaPhieuDangKy = @MaPhieuDangKy;

    IF @MaLichThi IS NULL
    BEGIN
        PRINT N'Không tìm thấy lịch thi phù hợp.';
        RETURN;
    END;

    -- Lấy ngày thi và mã chứng chỉ
    SELECT @NgayThi = NgayThi, @MaChungChi = LoaiChungChi
    FROM LichThi
    WHERE MaLichThi = @MaLichThi;

    -- Kiểm tra nếu phiếu đăng ký đã quá hạn 14 ngày
    IF EXISTS (
        SELECT 1
    FROM PhieuDangKy
    WHERE MaPhieuDangKy = @MaPhieuDangKy AND DATEDIFF(DAY, GETDATE(), @NgayThi) > 14
    )
    BEGIN
        PRINT N'Phiếu đăng ký chưa đến ngày để tạo phiếu dự thi. Ngày thi: ' 
        + CONVERT(nvarchar, @NgayThi, 103) 
        + N'. Còn ' + CONVERT(nvarchar, DATEDIFF(DAY, GETDATE(), @NgayThi)) + N' ngày nữa.';
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
                FORMAT(@SoThuTu, '0000');
            -- NNNN

            -- Chèn vào bảng PhieuDuThi
            INSERT INTO PhieuDuThi
                (SoBaoDanh, CCCD, TrangThai, LichThi)
            VALUES
                (@SoBaoDanh, @CCCD, 0, @MaLichThi);

            -- Debug: In số báo danh đã cấp
            PRINT N'Thí sinh có CCCD: ' + @CCCD + N' - Số báo danh: ' + @SoBaoDanh;

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




Create or alter  procedure LapPhieuGiaHan
    @CCCD char(12),
    @MaPhieuDangKy int,
    @PhiGiaHan int,
    @LiDoGiaHan nvarchar(255),
    @LoaiGiaHan nvarchar(12),
    @NgayThiCu Date,
    @NgayThiMoi Date

AS
BEGIN
    DECLARE @SLGH INT

    SELECT @SLGH=SoLanGiaHan
    FROM ChiTietPhieuDangKy
    WHERE CCCD=@CCCD AND MaPhieuDangKy=@MaPhieuDangKy

    IF(@SLGH=2)
		BEGIN
        RAISERROR(N'Không thể lập phiếu gia hạn, do thí sinh đã vượt quá số lần gia hạn',16,1)
        return;
    END


    IF NOT EXISTS (SELECT 1
    FROM THISINH
    WHERE CCCD=@CCCD)
		BEGIN
        RAISERROR(N'Căn cước công dân không tồn tại.', 16, 1);
        return
    END

    IF(@LoaiGiaHan!=N'Hợp lệ' and @LoaiGiaHan!=N'Không hợp lệ')
		BEGIN
        RAISERROR(N'Loại gia hạn không hợp lệ',16,1)
        return;
    END
    IF(@PhiGiaHan<0)
		BEGIN
        RAISERROR(N'Phí gia hạn phải >=0',16,1)
        RETURN;
    END
    IF(@LoaiGiaHan=N'Hợp lệ' and @PhiGiaHan>0)
		BEGIN
        RAISERROR(N'Lí do gia hạn hợp lệ nên không có phí gia hạn',16,1)
        RETURN;
    END
    IF(@LoaiGiaHan=N'Không hợp lệ' and @PhiGiaHan<=0)
		BEGIN
        RAISERROR(N'Lí do gia hạn không hợp lệ nên phải có phí gia hạn',16,1)
        RETURN;
    END

    IF NOT EXISTS (SELECT 1
    FROM LichThi
    WHERE NgayThi=@NgayThiCu)
		BEGIN
        RAISERROR(N'Ngày thi cũ bạn nhập không tồn tại',16,1)
        return;
    END
    IF NOT EXISTS (SELECT 1
    FROM LichThi
    WHERE NgayThi=@NgayThiMoi)
		BEGIN
        RAISERROR(N'Ngày thi mới bạn nhập không tồn tại',16,1)
        return;
    END
    IF NOT EXISTS (SELECT 1
    FROM PhieuDangKy
    WHERE MaPhieuDangKy=@MaPhieuDangKy)
		BEGIN
        RAISERROR(N'Mã phiếu đăng ký không tồn tại',16,1)
        return;
    END
	ELSE
		BEGIN
        DECLARE @NgayCu int, @NgayMoi int

        SELECT @NgayCu=MaLichThi
        FROM LichThi
        WHERE NgayThi=@NgayThiCu

        SELECT @NgayMoi=MaLichThi
        FROM LichThi
        WHERE NgayThi=@NgayThiMoi

        IF (@NgayCu=@NgayMoi)
				BEGIN
            RAISERROR(N'Ngày thi mới phải khác ngày thi cũ',16,1)
            return;
        END
		IF EXISTS(SELECT 1 FROM PhieuGiaHan WHERE CCCD=@CCCD AND MaPhieuDangKy=@MaPhieuDangKy)
			BEGIN
				UPDATE PhieuGiaHan
				SET NgayThiCu=@NgayCu, NgayThiMoi=@NgayMoi
				WHERE CCCD=@CCCD AND MaPhieuDangKy=@MaPhieuDangKy
			END
		IF NOT EXISTS(SELECT 1 FROM PhieuGiaHan WHERE CCCD=@CCCD AND MaPhieuDangKy=@MaPhieuDangKy)
			BEGIN
				INSERT INTO PhieuGiaHan (CCCD, MaPhieuDangKy,LiDoGiaHan, LoaiGiaHan ,NgayThiCu, NgayThiMoi) VALUES(@CCCD, @MaPhieuDangKy, @LiDoGiaHan, @LoaiGiaHan, @NgayCu, @NgayMoi);
			END
            UPDATE PhieuDuThi
					SET LichThi=@NgayMoi
					WHERE CCCD=@CCCD AND LichThi=@NgayCu

            UPDATE ChiTietPhieuDangKy
					SET SoLanGiaHan=SoLanGiaHan+1
					WHERE MaPhieuDangKy=@MaPhieuDangKy

            UPDATE PhieuDangKy
					SET LichThi=@NgayMoi
					WHERE MaPhieuDangKy=@MaPhieuDangKy
            UPDATE LichThi
			SET SoLuongDangKy = CASE 
                WHEN SoLuongDangKy - 1 < 0 THEN 0 
                ELSE SoLuongDangKy - 1 
             END
			WHERE MaLichThi = @NgayCu;

            UPDATE LichThi
				SET SoLuongDangKy=SoLuongDangKy+1
				WHERE MaLichThi=@NgayMoi
        
    END
END
go








CREATE or alter  PROCEDURE DocToanBoChiTietPhieuDangKy
AS
BEGIN
    SELECT CT.MaPhieuDangKy, CT.CCCD, LT.NgayThi, CT.SoLanGiaHan
    FROM ChiTietPhieuDangKy as CT
        JOIN PhieuDuThi as PDT on PDT.CCCD=CT.CCCD
        JOIN LichThi AS LT ON PDT.LichThi=LT.MaLichThi
END
GO

CREATE or alter  PROCEDURE TraCuuSoLanGiaHan
    @CCCD char(12)=NULL,
    @NgayThi Date=NULL
AS
BEGIN
    IF((@CCCD IS NOT NULL OR @CCCD!='') AND(@NgayThi IS NULL))
		BEGIN
        IF NOT EXISTS (SELECT 1
        FROM ThiSinh
        WHERE CCCD=@CCCD)
				BEGIN
            RAISERROR(N'Thí sinh không tồn tại',16,1)
            RETURN;
        END
        IF NOT EXISTS (SELECT 1
        FROM ChiTietPhieuDangKy
        WHERE CCCD=@CCCD)
				BEGIN
            RAISERROR(N'Không tìm thấy phiếu đăng ký của thí sinh',16,1)
            RETURN;
        END
        SELECT CT.MaPhieuDangKy, CT.CCCD, LT.NgayThi, CT.SoLanGiaHan
        FROM ChiTietPhieuDangKy as CT
            JOIN PhieuDuThi as PDT on PDT.CCCD=CT.CCCD
            JOIN LichThi AS LT ON PDT.LichThi=LT.MaLichThi
        WHERE CT.CCCD=@CCCD
    END
	ELSE IF((@CCCD IS NULL OR @CCCD='') AND (@NgayThi IS NOT NULL))
		BEGIN
        IF NOT EXISTS(SELECT 1
        FROM LichThi
        WHERE NgayThi=@NgayThi)
				BEGIN
            RAISERROR(N'Ngày thi không tồn tại',16,1)
            RETURN;
        END

        DECLARE @MLT INT

        SELECT @MLT=MaLichThi
        FROM LichThi
        WHERE NgayThi=@NgayThi

        IF NOT EXISTS (SELECT 1
        FROM PhieuDangKy
        WHERE LichThi=@MLT)
					BEGIN
            RAISERROR(N'Không tìm thấy ngày thi phù hợp',16,1)
            RETURN;
        END
        SELECT CT.MaPhieuDangKy, CT.CCCD, LT.NgayThi, CT.SoLanGiaHan
        FROM ChiTietPhieuDangKy as CT
            JOIN PhieuDuThi as PDT on PDT.CCCD=CT.CCCD
            JOIN LichThi AS LT ON PDT.LichThi=LT.MaLichThi
        WHERE LT.NgayThi=@NgayThi
    END
	ELSE
		BEGIN
        IF NOT EXISTS (SELECT 1
        FROM ThiSinh
        WHERE CCCD=@CCCD)
				BEGIN
            RAISERROR(N'Thí sinh không tồn tại',16,1)
            RETURN;
        END
        IF NOT EXISTS (SELECT 1
        FROM ChiTietPhieuDangKy
        WHERE CCCD=@CCCD)
				BEGIN
            RAISERROR(N'Không tìm thấy phiếu đăng ký của thí sinh',16,1)
            RETURN;
        END
        IF NOT EXISTS(SELECT 1
        FROM LichThi
        WHERE NgayThi=@NgayThi)
				BEGIN
            RAISERROR(N'Ngày thi không tồn tại',16,1)
            RETURN;
        END

        DECLARE @MLTHI INT

        SELECT @MLTHI=MaLichThi
        FROM LichThi
        WHERE NgayThi=@NgayThi

        IF NOT EXISTS (SELECT 1
        FROM PhieuDangKy
        WHERE LichThi=@MLTHI)
					BEGIN
            RAISERROR(N'Không tìm thấy ngày thi phù hợp',16,1)
            RETURN;
        END

        SELECT CT.MaPhieuDangKy, CT.CCCD, LT.NgayThi, CT.SoLanGiaHan
        FROM ChiTietPhieuDangKy as CT
            JOIN PhieuDuThi as PDT on PDT.CCCD=CT.CCCD
            JOIN LichThi AS LT ON PDT.LichThi=LT.MaLichThi
        WHERE CT.CCCD=@CCCD AND LT.NgayThi=@NgayThi
    END
END
GO



CREATE or alter  PROC DocToanBoPhieuGiaHan
AS
BEGIN
    SELECT PGH.CCCD, PGH.MaPhieuDangKy, PGH.LoaiGiaHan, PGH.PhiGiaHan, PGH.LiDoGiaHan, LT1.NgayThi AS NTC, LT2.NgayThi AS NTM
    from LichThi AS LT1
        JOIN PhieuGiaHan AS PGH ON PGH.NgayThiCu=LT1.MaLichThi
        JOIN LichThi AS LT2 ON PGH.NgayThiMoi=LT2.MaLichThi
END
go


CREATE or alter  PROCEDURE TraCuuPhieuGiaHan
    @CCCD char(12)=NULL,
    @NgayDuThi Date =NULL
AS
BEGIN
    IF ((@CCCD IS NULL or @CCCD='') AND @NgayDuThi IS NOT NULL)
		BEGIN
        IF NOT EXISTS(SELECT 1
        FROM LichThi
        WHERE NgayThi=@NgayDuThi)
				BEGIN
            RAISERROR(N'Ngày dự thi không tồn tại',16,1)
            RETURN;
        END
        DECLARE @MLT int

        SELECT @MLT=MaLichThi
        FROM LichThi
        WHERE NgayThi=@NgayDuThi

        IF NOT EXISTS (SELECT 1
        FROM PhieuGiaHan
        WHERE NgayThiMoi=@MLT)
				BEGIN
            RAISERROR(N'Không tìm thấy ngày dự thi hợp lệ trong phiếu gia hạn',16,1)
            RETURN;
        END

        SELECT PGH.CCCD, PGH.MaPhieuDangKy, PGH.LoaiGiaHan, PGH.PhiGiaHan, PGH.LiDoGiaHan, LT1.NgayThi AS NTC, LT2.NgayThi AS NTM
        from LichThi AS LT1
            JOIN PhieuGiaHan AS PGH ON PGH.NgayThiCu=LT1.MaLichThi
            JOIN LichThi AS LT2 ON PGH.NgayThiMoi=LT2.MaLichThi
        WHERE PGH.NgayThiMoi=@MLT
    END
	ELSE IF((@CCCD IS NOT NULL or @CCCD!='') AND @NgayDuThi IS NULL)
		BEGIN
        IF NOT EXISTS (SELECT 1
        FROM ThiSinh
        WHERE CCCD=@CCCD)
				BEGIN
            RAISERROR(N'Thí sinh không tồn tại',16,1)
            RETURN;
        END
        IF NOT EXISTS (SELECT 1
        FROM PhieuGiaHan
        where CCCD=@CCCD)
				BEGIN
            RAISERROR(N'Không tìm thấy phiếu gia hạn của thí sinh',16,1)
            RETURN;
        END
        SELECT PGH.CCCD, PGH.MaPhieuDangKy, PGH.LoaiGiaHan, PGH.PhiGiaHan, PGH.LiDoGiaHan, LT1.NgayThi AS NTC, LT2.NgayThi AS NTM
        from LichThi AS LT1
            JOIN PhieuGiaHan AS PGH ON PGH.NgayThiCu=LT1.MaLichThi
            JOIN LichThi AS LT2 ON PGH.NgayThiMoi=LT2.MaLichThi
        WHERE PGH.CCCD=@CCCD
    END
		ELSE IF ((@CCCD IS NOT NULL or @CCCD!='') AND @NgayDuThi IS NOT NULL)
			BEGIN
        IF NOT EXISTS(SELECT 1
        FROM LichThi
        WHERE NgayThi=@NgayDuThi)
				BEGIN
            RAISERROR(N'Ngày dự thi không tồn tại',16,1)
            RETURN;
        END
        DECLARE @MLTHI int

        SELECT @MLTHI=MaLichThi
        FROM LichThi
        WHERE NgayThi=@NgayDuThi

        IF NOT EXISTS (SELECT 1
        FROM PhieuGiaHan
        WHERE NgayThiMoi=@MLTHI)
					BEGIN
            RAISERROR(N'Không tìm thấy ngày dự thi hợp lệ trong phiếu gia hạn',16,1)
            RETURN;
        END
        IF NOT EXISTS (SELECT 1
        FROM ThiSinh
        WHERE CCCD=@CCCD)
				BEGIN
            RAISERROR(N'Thí sinh không tồn tại',16,1)
            RETURN;
        END
        IF NOT EXISTS (SELECT 1
        FROM PhieuGiaHan
        where CCCD=@CCCD)
					BEGIN
            RAISERROR(N'Không tìm thấy phiếu gia hạn của thí sinh',16,1)
            RETURN;
        END
        SELECT PGH.CCCD, PGH.MaPhieuDangKy, PGH.LoaiGiaHan, PGH.PhiGiaHan, PGH.LiDoGiaHan, LT1.NgayThi AS NTC, LT2.NgayThi AS NTM
        from LichThi AS LT1
            JOIN PhieuGiaHan AS PGH ON PGH.NgayThiCu=LT1.MaLichThi
            JOIN LichThi AS LT2 ON PGH.NgayThiMoi=LT2.MaLichThi
        WHERE PGH.CCCD=@CCCD AND PGH.NgayThiMoi=@MLTHI

    END
END
GO


CREATE or alter PROCEDURE XoaPhieuGiaHan
    @CCCD CHAR(12),
    @MaPhieuDangKy int
AS
BEGIN
    IF NOT EXISTS (SELECT 1
    FROM PhieuGiaHan
    where CCCD=@CCCD AND MaPhieuDangKy=@MaPhieuDangKy)
		BEGIN
        RAISERROR(N'Không thể xóa phiếu gia hạn do không tìm thấy phiếu gia hạn trong hệ thống',16,1)
        return;
    END
    DELETE FROM PhieuGiaHan
	WHERE CCCD=@CCCD AND MaPhieuDangKy=@MaPhieuDangKy
END
go

CREATE or alter PROCEDURE SuaPhieuGiaHan
    @CCCD CHAR(12),
    @MaPhieuDangKy INT,
    @LoaiGiaHan NVARCHAR(12),
    @PhiGiaHan INT,
    @LiDoGiaHan NVARCHAR(255),
    @NgayThiCu DATE,
    @NgayThiMoi DATE
AS
BEGIN
    -- Kiểm tra tồn tại trước khi update
    IF NOT EXISTS (SELECT 1
    FROM PhieuGiaHan
    WHERE CCCD = @CCCD AND MaPhieuDangKy = @MaPhieuDangKy)
		BEGIN
        RAISERROR(N'Không tìm thấy phiếu gia hạn để cập nhật.', 16, 1)
        return;
    END
    IF(@PhiGiaHan<0)
		BEGIN
        RAISERROR(N'Phí gia hạn không được nhỏ hơn 0',16,1)
        return;
    END
    IF NOT EXISTS (SELECT 1
    FROM LichThi
    WHERE NgayThi=@NgayThiCu)
		BEGIN
        RAISERROR(N'Ngày thi cũ không có trong hệ thống',16,1)
        return;
    END
    IF NOT EXISTS (SELECT 1
    FROM LichThi
    WHERE NgayThi=@NgayThiMoi)
		BEGIN
        RAISERROR(N'Ngày thi mới không có trong hệ thống',16,1)
        return;
    END
    IF (@NgayThiCu=@NgayThiMoi)
		BEGIN
        RAISERROR(N'Ngày thi cũ và ngày thi mới phải khác nhau',16,1)
        return;
    END

    DECLARE @NgayCu int, @NgayMoi int

    SELECT @NgayCu=MaLichThi
    FROM LichThi
    WHERE NgayThi=@NgayThiCu

    SELECT @NgayMoi=MaLichThi
    FROM LichThi
    WHERE NgayThi=@NgayThiMoi

    -- Cập nhật dữ liệu
    UPDATE PhieuGiaHan
    SET
        LoaiGiaHan = @LoaiGiaHan,
        PhiGiaHan = @PhiGiaHan,
        LiDoGiaHan = @LiDoGiaHan,
        NgayThiCu = @NgayCu,
        NgayThiMoi = @NgayMoi
    WHERE CCCD = @CCCD AND MaPhieuDangKy = @MaPhieuDangKy;
END
GO

-- Tạo Trigger tên là TG_KiemTraNgayThi
CREATE or alter TRIGGER TG_KiemTraNgayThi
ON LichThi
FOR INSERT
AS
BEGIN
    -- Kiểm tra xem có bản ghi nào được chèn vào có ngày thi không hợp lệ hay không
    IF EXISTS (
        SELECT 1
    FROM inserted
    WHERE NgayThi <= DATEADD(day, 2, GETDATE())
    )
    BEGIN
        -- Nếu có, ngăn chặn thao tác INSERT và thông báo lỗi
        RAISERROR ('Không thể thêm lịch thi có ngày thi trong quá khứ hoặc cách ngày hiện tại dưới 3 ngày.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO






