@echo off
setlocal enabledelayedexpansion
title 4ThePrice - Subscriptions for Daily Life

echo ========================================================
echo   4ThePrice - Subscriptions for Daily Life
echo   Subscription Billing and Management Platform
echo ========================================================
echo.
echo Choose execution mode:
echo.
echo   [1] DEMO MODE (Default)
echo       - Runs standalone demo API server (zero-dependency)
echo       - Pre-loaded with daily life subscriptions:
echo         * Coffee Club Daily
echo         * Anytime Fitness 24/7
echo         * Daily Commuter Pass
echo         * Daily Life All-in-One Bundle
echo.
echo   [2] REAL BACKEND MODE
echo       - Connects frontend to the Flexprice Go backend
echo       - Target: http://localhost:8080/v1
echo       - Note: Ensure your Go backend and Postgres DB are running
echo         (e.g., via 'go run cmd/server/main.go' or 'docker compose up')
echo.
set /p MODE="Select mode [1 or 2, default: 1]: "
if "%MODE%"=="" set MODE=1

set "PATH=C:\Program Files\nodejs;%PATH%"

if "%MODE%"=="1" (
    echo.
    echo [*] Starting 4ThePrice in DEMO MODE...
    echo [*] Launching Demo API Server on http://localhost:8080/v1...
    start "4ThePrice Demo API" cmd /k "cd flexprice-front && node scripts\demo-server.cjs"
    timeout /t 2 /nobreak >nul
) else (
    echo.
    echo [*] Starting 4ThePrice in REAL BACKEND MODE...
    echo [*] Frontend will connect to real Go backend at http://localhost:8080/v1...
)

echo [*] Launching 4ThePrice Web Frontend on http://localhost:3000...
start "4ThePrice Frontend" cmd /k "cd flexprice-front && npx vite --port 3000"

timeout /t 3 /nobreak >nul
echo.
echo Opening browser at http://localhost:3000...
start http://localhost:3000

echo.
echo ========================================================
echo   4ThePrice is active!
echo   Web Interface: http://localhost:3000
if "%MODE%"=="1" (
    echo   Mode: DEMO MODE (Standalone demo API on port 8080)
) else (
    echo   Mode: REAL BACKEND MODE (Expecting Go server on port 8080)
)
echo ========================================================
pause
