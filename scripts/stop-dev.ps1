# Arrete les serveurs dev homeshared (API :3001, Expo :8081-8089).
# Usage: .\scripts\stop-dev.ps1

$ports = @(3001) + (8081..8089)
$killed = @()

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        $procId = $conn.OwningProcess
        if ($procId -and $killed -notcontains $procId) {
            Write-Host "Port $port -> PID $procId (stop)"
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            $killed += $procId
        }
    }
}

Start-Sleep -Milliseconds 500

$still = @()
foreach ($port in $ports) {
    if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
        $still += $port
    }
}

if ($still.Count -eq 0) {
    Write-Host "OK - ports 3001 et 8081-8089 libres."
} else {
    Write-Host "Attention - encore occupes: $($still -join ', ')"
    Write-Host "Relance en admin ou ferme le terminal qui les utilise."
}
