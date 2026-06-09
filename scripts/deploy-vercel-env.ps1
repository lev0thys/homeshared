# Variables Vercel pour apps/mobile (lit .env local, sans les afficher).
# Usage: .\scripts\deploy-vercel-env.ps1
# Prérequis: vercel login + vercel link dans apps/mobile

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$mobile = Join-Path $root "apps\mobile"

function Get-DotEnvValue([string]$path, [string]$key) {
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

function Set-VercelEnv([string]$name, [string]$value, [string]$envType = "production") {
    if (-not $value) {
        Write-Warning "Skip $name (vide)"
        return
    }
    Write-Host "vercel env add $name ($envType)..."
    $value | npx vercel env add $name $envType --force 2>&1 | Out-Null
}

Push-Location $mobile

$envRoot = Join-Path $root ".env"
$envMobile = Join-Path $mobile ".env"

$apiUrl = Get-DotEnvValue $envRoot "EXPO_PUBLIC_API_URL"
if ($apiUrl -match "localhost") { $apiUrl = "https://homeshared-api.fly.dev" }

$siteUrl = Get-DotEnvValue $envRoot "EXPO_PUBLIC_SITE_URL"
if (-not $siteUrl -or $siteUrl -match "localhost") { $siteUrl = "https://homeshared.vercel.app" }

Set-VercelEnv "EXPO_PUBLIC_API_URL" $apiUrl
Set-VercelEnv "EXPO_PUBLIC_SUPABASE_URL" (Get-DotEnvValue $envMobile "EXPO_PUBLIC_SUPABASE_URL")
Set-VercelEnv "EXPO_PUBLIC_SUPABASE_ANON_KEY" (Get-DotEnvValue $envMobile "EXPO_PUBLIC_SUPABASE_ANON_KEY")
Set-VercelEnv "EXPO_PUBLIC_SITE_URL" $siteUrl
Set-VercelEnv "EXPO_PUBLIC_ADMOB_ANDROID_APP_ID" (Get-DotEnvValue $envMobile "EXPO_PUBLIC_ADMOB_ANDROID_APP_ID")
Set-VercelEnv "EXPO_PUBLIC_ADMOB_BANNER_ID" (Get-DotEnvValue $envMobile "EXPO_PUBLIC_ADMOB_BANNER_ID")

Pop-Location
Write-Host "OK - variables Vercel configurees. Lance: cd apps/mobile; vercel --prod"
