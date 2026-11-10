@echo off
chcp 65001 > nul
title VẠN TƯỢNG - BẢO TÀNG 3D LOCAL SERVER
echo ===================================================================
echo     VẠN TƯỢNG - KỲ ÁN NÉT MỰC THẤT TRUYỀN (BẢO TÀNG 3D ĐẠI VIỆT)
echo ===================================================================
echo.
echo [1/2] Đang khởi động máy chủ WebGL cục bộ (Port 8000)...
echo [2/2] Đang mở trình duyệt tại: http://localhost:8000
echo.
echo * Lưu ý: Giữ cửa sổ này mở trong khi trải nghiệm bảo tàng 3D.
echo * Để dừng máy chủ, nhấn Ctrl + C hoặc đóng cửa sổ này.
echo ===================================================================
echo.

start http://localhost:8000
python -m http.server 8000

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Không tìm thấy Python, đang thử khởi động bằng Node.js...
    npx serve . -p 8000
)

pause
