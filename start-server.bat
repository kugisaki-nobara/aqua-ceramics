@echo off
title AQUA CERAMICS LLP - Platform Server
echo ==================================================
echo  Starting AQUA CERAMICS LLP Website and Store
echo ==================================================

REM 1. Clear any zombie node processes on port 3000 to prevent EADDRINUSE
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM 2. Detect Node.js (system PATH first, then Codex runtimes)
set "NODE_CMD="
where node >nul 2>nul
if %errorlevel% equ 0 (
    set "NODE_CMD=node"
) else (
    for /r "%LOCALAPPDATA%\OpenAI\Codex\runtimes\cua_node" %%F in (node.exe) do (
        if exist "%%F" if not defined NODE_CMD set "NODE_CMD=%%F"
    )
)

if not defined NODE_CMD (
    echo Error: Node.js executable not found.
    pause
    exit /b 1
)

echo Using Node: %NODE_CMD%
echo Server running at: http://localhost:3000
echo.
echo Opening browser...
start http://localhost:3000
echo.
"%NODE_CMD%" backend/server.js
pause
