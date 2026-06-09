# Regénère le dossier export/ (logo, play-store, legal).
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$export = Join-Path $root "export"
$assets = Join-Path $root "apps\mobile\assets"

$logoSrc = Join-Path $assets "logo.png"
if (-not (Test-Path $logoSrc)) {
  Write-Error "logo.png introuvable : $logoSrc"
}

$dirs = @(
  (Join-Path $export "logo"),
  (Join-Path $export "play-store"),
  (Join-Path $export "legal"),
  (Join-Path $export "play-store\screenshots")
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

Copy-Item $logoSrc (Join-Path $export "logo\logo-transparent.png") -Force
Copy-Item (Join-Path $root "apps\mobile\public\icons\icon-512.png") (Join-Path $export "logo\icon-512.png") -Force
Copy-Item (Join-Path $root "apps\mobile\public\icons\icon-192.png") (Join-Path $export "logo\icon-192.png") -Force
Copy-Item $logoSrc (Join-Path $export "logo\splash-reference.png") -Force
Copy-Item (Join-Path $root "play-store\icon-512.png") (Join-Path $export "play-store\icon-512.png") -Force
Copy-Item (Join-Path $root "play-store\descriptions\fr.txt") (Join-Path $export "play-store\description-fr.txt") -Force
Copy-Item (Join-Path $root "play-store\descriptions\en.txt") (Join-Path $export "play-store\description-en.txt") -Force

$legalSrc = Join-Path $root "..\templates\legal\privacy-policy.fr.md"
if (Test-Path $legalSrc) {
  Copy-Item $legalSrc (Join-Path $export "legal\privacy-policy.fr.md") -Force
}

$zip = Join-Path $export "homeshared-publication.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $export "*") -DestinationPath $zip -Force

Write-Host "Export OK : $export"
Write-Host "ZIP     : $zip"
