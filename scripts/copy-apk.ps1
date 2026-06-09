param(
  [Parameter(Mandatory = $true)]
  [string]$SourcePath
)

$dest = Join-Path $PSScriptRoot "..\apps\mobile\public\download.apk"

if (-not (Test-Path $SourcePath)) {
  Write-Error "Fichier introuvable : $SourcePath"
  exit 1
}

Copy-Item -Path $SourcePath -Destination $dest -Force
Write-Host "APK copié vers : $dest"
Write-Host "Prochaine étape : redéployer Vercel (git push ou redeploy dashboard)."
