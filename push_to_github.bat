@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\Git\cmd;%PATH%"
title Push to GitHub - 4ThePrice / Odoo-Hackathon

echo ========================================================
echo   Pushing 4ThePrice to GitHub
echo   Repository: https://github.com/kritthik/Odoo-Hackathon
echo ========================================================
echo.
echo If prompted, sign in via browser or paste your GitHub Personal Access Token.
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   Push successful!
    echo   View repo: https://github.com/kritthik/Odoo-Hackathon
    echo ========================================================
) else (
    echo ========================================================
    echo   Push encountered an error.
    echo   Please check your GitHub permissions or credentials.
    echo ========================================================
)
echo.
pause
