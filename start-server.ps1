Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Starting AQUA CERAMICS LLP Platform Server" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Clear any process occupying port 3000 to avoid EADDRINUSE
$occupied = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($occupied) {
    $occupied | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# 2. Find Node.js
$nodePath = "node"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    $found = Get-ChildItem -Path "C:\Users\HP\AppData\Local\OpenAI\Codex\runtimes\cua_node" -Filter "node.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($found -and (Test-Path $found)) {
        $nodePath = $found
    } else {
        Write-Error "Node.js executable could not be found."
        exit 1
    }
}

Write-Host "Server URL: http://localhost:3000" -ForegroundColor Green
Start-Process "http://localhost:3000"
& $nodePath backend/server.js
