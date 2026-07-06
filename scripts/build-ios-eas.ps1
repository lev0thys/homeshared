# Build iOS production (EAS cloud) — **mode interactif obligatoire** la 1re fois.
# Configure certificats Apple + profils (app + widget extension).
# Usage: powershell -ExecutionPolicy Bypass -File scripts/build-ios-eas.ps1

$ErrorActionPreference = "Stop"
$mobile = Join-Path (Split-Path -Parent $PSScriptRoot) "apps\mobile"
Set-Location $mobile

# Team ID depuis EAS (ou .env.local)
if (-not $env:EXPO_APPLE_TEAM_ID) {
    $env:EXPO_APPLE_TEAM_ID = "T37T3L9M8N"
}

Write-Host "Build iOS production — credentials Apple (interactif si 1re fois)..."
Write-Host "Accepte le contrat Apple Developer sur developer.apple.com si demande."
npx eas-cli build --profile production --platform ios
