@echo off
setlocal

title KitchenX Customer Web

cd /d "%~dp0"
if errorlevel 1 (
  echo Could not open %~dp0
  pause
  exit /b 1
)

echo.
echo Starting KitchenX customer web dev server...
echo Keep this window open. Code changes will auto-refresh in the browser.
echo Close this window to stop the app.
echo.

echo Freeing port 8081 if a previous customer server is still running...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":8081 " ^| findstr "LISTENING"') do (
  echo Stopping process %%P
  taskkill /F /PID %%P >nul 2>&1
)
timeout /t 1 /nobreak >nul

set CHOKIDAR_USEPOLLING=1
set WATCHPACK_POLLING=true
set FAST_REFRESH=true

corepack pnpm --filter @kitchenx/customer web

echo.
echo KitchenX customer web dev server stopped.
pause
