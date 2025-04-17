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
        INSERT INTO PhieuDangKy
        (LoaiChungChi, NgayDangKy, ThoiGianMongMuonThi, MaKhachHang)
    VALUES
        (@LoaiChungChi, GETDATE(), @ThoiGianThi, @MaKhachHang);

        -- Lấy ID mới của phiếu đăng ký
        SET @MaPhieuDangKy = SCOPE_IDENTITY();

        -- Thêm vào bảng ChiTietPhieuDangKy
        INSERT INTO ChiTietPhieuDangKy
        (MaPhieuDangKy, CCCD)
    VALUES
        (@MaPhieuDangKy, @CCCDTS);

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

EXEC PHATHANHPHIEUDUTHI 1
go

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

select*from PhieuGiaHan
delete from PhieuGiaHan where CCCD='987654321098'

select*from ChiTietPhieuDangKy
update ChiTietPhieuDangKy set SoLanGiaHan=0 where CCCD='987654321098'
drop proc LapPhieuGiaHan

Create procedure LapPhieuGiaHan
    @CCCD char(12),
    @MaPhieuDangKy int,
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

    IF EXISTS (SELECT 1
    FROM PhieuGiaHan
    WHERE MaPhieuDangKy=@MaPhieuDangKy AND CCCD!=@CCCD)
		BEGIN
        RAISERROR(N'Mã phiếu đăng ký đã bị trùng với thí sinh khác',16,1)
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
			ELSE			
				BEGIN
            INSERT INTO PhieuGiaHan
                (CCCD, MaPhieuDangKy,LiDoGiaHan, LoaiGiaHan ,NgayThiCu, NgayThiMoi)
            VALUES
                (@CCCD, @MaPhieuDangKy, @LiDoGiaHan, @LoaiGiaHan,@NgayCu, @NgayMoi);

            UPDATE PhieuDuThi
					SET LichThi=@NgayMoi
					WHERE CCCD=@CCCD AND LichThi=@NgayCu

            UPDATE ChiTietPhieuDangKy
					SET SoLanGiaHan=SoLanGiaHan+1
					WHERE MaPhieuDangKy=@MaPhieuDangKy

            UPDATE PhieuDangKy
					SET LichThi=@NgayMoi
					WHERE MaPhieuDangKy=@MaPhieuDangKy
        END
    END
END
go

select*from ChiTietPhieuDangKy

update ChiTietPhieuDangKy set SoLanGiaHan=0 where CCCD='987654321098'

CREATE TRIGGER trg_KiemTraMaPhieuDangKy
ON PhieuGiaHan
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
    FROM INSERTED i
        JOIN PhieuGiaHan p
        ON i.MaPhieuDangKy = p.MaPhieuDangKy
            AND i.CCCD <> p.CCCD
    )
    BEGIN
        RAISERROR (N'Mỗi CCCD khác nhau phải có MaPhieuDangKy khác nhau.', 16, 1)
        ROLLBACK TRANSACTION
    END
END;
go

CREATE PROCEDURE TraCuuSoLanGiaHan
    @CCCD char(12),
    @NgayThi Date
AS
BEGIN
    IF NOT EXISTS(SELECT 1
    from ThiSinh
    where CCCD=@CCCD)
		BEGIN
        RAISERROR(N'Không tìm thấy thí sinh trong hệ thống',16,1)
        return;
    END
    IF NOT EXISTS (SELECT 1
    FROM ChiTietPhieuDangKy
    WHERE CCCD=@CCCD)
		BEGIN
        RAISERROR(N'Không tìm được số lần gia hạn của thí sinh',16,1)
        return;
    END
    IF NOT EXISTS (SELECT 1
    FROM LichThi
    WHERE NgayThi=@NgayThi)
		BEGIN
        RAISERROR(N'Không tìm thấy ngày thi trong hệ thống',16,1)
    END

    DECLARE @MLT INT

    SELECT @MLT=MaLichThi
    FROM LichThi
    WHERE NgayThi=@NgayThi

    IF NOT EXISTS (SELECT 1
    FROM PhieuDuThi
    WHERE CCCD=@CCCD AND @MLT=LichThi)
		BEGIN
        RAISERROR(N'Phiếu dự thi thí sinh cung cấp không tồn tại trong hệ thống',16,1)
        return;
    END

    SELECT CT.MaPhieuDangKy, CT.CCCD, LT.NgayThi, CT.SoLanGiaHan
    FROM ChiTietPhieuDangKy as CT
        JOIN PhieuDuThi as PDT on PDT.CCCD=CT.CCCD
        JOIN LichThi AS LT ON PDT.LichThi=LT.MaLichThi
    WHERE CT.CCCD=@CCCD AND LT.NgayThi=@NgayThi

END
GO


CREATE PROCEDURE TraCuuPhieuGiaHan
    @CCCD char(12)
AS
BEGIN
    IF NOT EXISTS(SELECT 1
    from ThiSinh
    where CCCD=@CCCD)
		BEGIN
        RAISERROR(N'Không tìm thấy thí sinh trong hệ thống',16,1)
        return;
    END
    IF NOT EXISTS (SELECT 1
    FROM PhieuGiaHan
    WHERE CCCD=@CCCD)
		BEGIN
        RAISERROR(N'Không tìm được phiếu gia hạn của thí sinh',16,1)
        return;
    END
    SELECT PGH.CCCD, PGH.MaPhieuDangKy, PGH.LoaiGiaHan, PGH.PhiGiaHan, PGH.LiDoGiaHan, LT1.NgayThi AS NTC, LT2.NgayThi AS NTM
    from LichThi AS LT1
        JOIN PhieuGiaHan AS PGH ON PGH.NgayThiCu=LT1.MaLichThi
        JOIN LichThi AS LT2 ON PGH.NgayThiMoi=LT2.MaLichThi
    WHERE PGH.CCCD=@CCCD

END
GO

CREATE PROCEDURE XoaPhieuGiaHan
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

CREATE PROCEDURE SuaPhieuGiaHan
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



drop proc TraCuuSoLanGiaHan
drop proc TraCuuPhieuGiaHan

SELECT*
FROM ChiTietPhieuDangKy

select *
from PhieuDuThi

select*
from LichThi

select*
from PhieuGiaHan