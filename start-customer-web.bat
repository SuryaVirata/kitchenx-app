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

:restart
set CHOKIDAR_USEPOLLING=1
set WATCHPACK_POLLING=true
set FAST_REFRESH=true

corepack pnpm --filter @kitchenx/customer web

echo.
echo KitchenX customer web dev server stopped. Restarting in 2 seconds...
timeout /t 2 /nobreak >nul
goto restart
