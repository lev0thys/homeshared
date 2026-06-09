# Verifie API + bundle web Expo (a lancer depuis homeshared/)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "=== Health API ===" -ForegroundColor Cyan
try {
  $h = Invoke-RestMethod -Uri "http://localhost:3001/health/" -TimeoutSec 5
  Write-Host "OK: $($h | ConvertTo-Json -Compress)"
}
catch {
  Write-Host "FAIL: API non joignable sur :3001 - lance pnpm dev:api" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "=== Bundle web Expo ===" -ForegroundColor Cyan
$bundleQuery = @{
  platform = "web"
  dev      = "true"
}
$bundleUri = [UriBuilder]::new("http://localhost:8081/node_modules/expo-router/entry.bundle")
$bundleUri.Query = ($bundleQuery.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&"
try {
  $resp = Invoke-WebRequest -Uri $bundleUri.Uri -TimeoutSec 120 -UseBasicParsing
  if ($resp.StatusCode -eq 200) {
    Write-Host "OK: bundle HTTP 200"
  }
  else {
    Write-Host "FAIL: bundle HTTP $($resp.StatusCode)" -ForegroundColor Red
    exit 1
  }
}
catch {
  Write-Host "FAIL: Expo non joignable sur :8081 - relance start:clear" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "=== Auth Supabase (signup test) ===" -ForegroundColor Cyan
node scripts/test-supabase-auth.mjs
Write-Host ""
Write-Host "Tout est OK." -ForegroundColor Green
