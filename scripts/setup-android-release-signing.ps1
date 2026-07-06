# Signature release Android avec keystore EAS (Play Store).
# 1re fois : telecharge le keystore via EAS (interactif).
# Usage: powershell -ExecutionPolicy Bypass -File scripts/setup-android-release-signing.ps1

$ErrorActionPreference = "Stop"
$mobile = Join-Path (Split-Path -Parent $PSScriptRoot) "apps\mobile"
$credsDir = Join-Path $mobile "credentials\android"
$keystorePath = Join-Path $credsDir "release.keystore"

Write-Host @"
=== Signature release Android (Play Store) ===

Le keystore EAS est deja telecharge si tu vois :
  apps\mobile\@lev0thy__homeshared.jks
  ou apps\mobile\credentials\android\release.keystore

Si besoin : npx eas-cli credentials -p android
  > production > Keystore > Download existing keystore > Y
  Puis **Go back** > **Exit** (le menu reboucle, c'est normal).

Configurer android\keystore.properties (gitignore) depuis l'exemple :
  android\keystore.properties.example

"@

$mobile = Join-Path (Split-Path -Parent $PSScriptRoot) "apps\mobile"
$props = Join-Path $mobile "android\keystore.properties"
if (Test-Path $props) {
    Write-Host "OK — keystore.properties deja present."
} else {
    Write-Host "Manquant : $props — remplis-le apres download EAS."
}
