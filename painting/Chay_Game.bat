@echo off
setlocal
cd /d "%~dp0"
if errorlevel 1 exit /b 1
title Tranh Hang Trong - Chay Game
where node >nul 2>&1
if errorlevel 1 (
  echo Can cai Node.js LTS truoc khi chay game.
  pause
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo Khong tim thay npm. Hay cai lai Node.js LTS.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Chua co thu vien. Hay chay npm install trong thu muc nay.
  pause
  exit /b 1
)
echo Dang khoi dong game. Trinh duyet se mo khi server san sang.
echo Giu cua so nay mo trong khi choi. Nhan Ctrl+C de dung.
echo Neu cong 5173 ban, Vite se tu chon cong khac va mo dung dia chi.
call npm run dev -- --host 127.0.0.1 --open
if errorlevel 1 (
  echo Khong khoi dong duoc game. Xem thong bao loi ben tren.
  pause
  exit /b 1
)
endlocal
