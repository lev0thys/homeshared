# Secrets EAS pour builds preview + production (lit homeshared/.env + apps/mobile/.env).
# Usage: .\scripts\deploy-eas-secrets.ps1
# Prérequis: eas login + eas init dans apps/mobile

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$envRoot = Join-Path $root ".env"
$envMobile = Join-Path $root "apps\mobile\.env"

function Get-DotEnvValue([string]$path, [string]$key) {
    if (-not (Test-Path $path)) { return $null }
    foreach ($line in Get-Content $path -Encoding UTF8) {
        if ($line -match "^\s*$key\s*=\s*(.+)\s*$") {
            $raw = $Matches[1].Trim()
            if ($raw.StartsWith('"') -and $raw.EndsWith('"')) {
                return $raw.Substring(1, $raw.Length - 2)
            }
            return $raw
        }
    }
    return $null
}

function Set-EasEnv([string]$name, [string]$value) {
    if (-not $value) {
        Write-Warning "Skip $name (vide)"
        return
    }
    Write-Host "eas env:create $name ..."
    eas env:create --name $name --value $value --environment production --environment preview `
        --visibility plaintext --scope project --force --non-interactive 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Echec eas env:create $name"
        exit 1
    }
}

Push-Location (Join-Path $root "apps\mobile")

$apiUrl = Get-DotEnvValue $envRoot "EXPO_PUBLIC_API_URL"
if ($apiUrl -match "localhost") {
    $apiUrl = "https://homeshared-api.fly.dev"
    Write-Host "EXPO_PUBLIC_API_URL → homeshared-api.fly.dev (prod)"
}

$siteUrl = Get-DotEnvValue $envRoot "EXPO_PUBLIC_SITE_URL"
if (-not $siteUrl -or $siteUrl -match "localhost") {
    $siteUrl = "https://homeshared.vercel.app"
    Write-Host "EXPO_PUBLIC_SITE_URL → homeshared.vercel.app (à ajuster si autre domaine Vercel)"
}

Set-EasEnv "EXPO_PUBLIC_API_URL" $apiUrl
Set-EasEnv "EXPO_PUBLIC_SUPABASE_URL" (Get-DotEnvValue $envMobile "EXPO_PUBLIC_SUPABASE_URL")
Set-EasEnv "EXPO_PUBLIC_SUPABASE_ANON_KEY" (Get-DotEnvValue $envMobile "EXPO_PUBLIC_SUPABASE_ANON_KEY")
Set-EasEnv "EXPO_PUBLIC_ADMOB_ANDROID_APP_ID" (Get-DotEnvValue $envMobile "EXPO_PUBLIC_ADMOB_ANDROID_APP_ID")
Set-EasEnv "EXPO_PUBLIC_ADMOB_BANNER_ID" (Get-DotEnvValue $envMobile "EXPO_PUBLIC_ADMOB_BANNER_ID")
Set-EasEnv "EXPO_PUBLIC_SITE_URL" $siteUrl

Pop-Location
Write-Host "OK - secrets EAS mis a jour."
