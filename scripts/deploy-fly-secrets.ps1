# Charge homeshared/.env et pousse les secrets Fly.io (sans afficher les valeurs).
# Usage: .\scripts\deploy-fly-secrets.ps1
# Prérequis: flyctl auth login

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root ".env"

if (-not (Test-Path $envFile)) {
    Write-Error "Fichier .env introuvable : $envFile"
    exit 1
}

function Get-DotEnvValue([string]$key) {
    foreach ($line in Get-Content $envFile -Encoding UTF8) {
        if ($line -match "^\s*$key\s*=\s*(.+)\s*$") {
            $raw = $Matches[1].Trim()
            if ($raw.StartsWith('"') -and $raw.EndsWith('"')) {
                return $raw.Substring(1, $raw.Length - 2)
            }
            if ($raw.StartsWith("'") -and $raw.EndsWith("'")) {
                return $raw.Substring(1, $raw.Length - 2)
            }
            return $raw
        }
    }
    return $null
}

$databaseUrl = Get-DotEnvValue "DATABASE_URL"
$directUrl = Get-DotEnvValue "DIRECT_DATABASE_URL"
$jwt = Get-DotEnvValue "JWT_SECRET"
$supabaseUrl = Get-DotEnvValue "SUPABASE_URL"
$anon = Get-DotEnvValue "SUPABASE_ANON_KEY"
$service = Get-DotEnvValue "SUPABASE_SERVICE_ROLE_KEY"

foreach ($pair in @(
    @{ Name = "DATABASE_URL"; Value = $databaseUrl },
    @{ Name = "DIRECT_DATABASE_URL"; Value = $directUrl },
    @{ Name = "JWT_SECRET"; Value = $jwt },
    @{ Name = "SUPABASE_URL"; Value = $supabaseUrl },
    @{ Name = "SUPABASE_ANON_KEY"; Value = $anon },
    @{ Name = "SUPABASE_SERVICE_ROLE_KEY"; Value = $service }
)) {
    if (-not $pair.Value) {
        Write-Error "Variable manquante dans .env : $($pair.Name)"
        exit 1
    }
}

# Transaction pooler 6543 recommandé pour l'API prod (évite max clients pooler).
if ($databaseUrl -match "pooler\.supabase\.com:5432") {
    $databaseUrl = $databaseUrl -replace ":5432/", ":6543/"
    if ($databaseUrl -notmatch "pgbouncer=true") {
        $sep = if ($databaseUrl -match "\?") { "&" } else { "?" }
        $databaseUrl = "$databaseUrl${sep}pgbouncer=true"
    }
    if ($databaseUrl -notmatch "connection_limit=") {
        $sep = if ($databaseUrl -match "\?") { "&" } else { "?" }
        $databaseUrl = "$databaseUrl${sep}connection_limit=1"
    }
    Write-Host "DATABASE_URL prod : pooler port 6543 + pgbouncer (sans afficher l'URL)."
}

$fly = Join-Path $env:USERPROFILE ".fly\bin\flyctl.exe"
if (-not (Test-Path $fly)) {
    $fly = "flyctl"
}

Write-Host "Mise à jour des secrets Fly (app homeshared-api)..."
& $fly secrets set `
    "DATABASE_URL=$databaseUrl" `
    "DIRECT_DATABASE_URL=$directUrl" `
    "JWT_SECRET=$jwt" `
    "SUPABASE_URL=$supabaseUrl" `
    "SUPABASE_ANON_KEY=$anon" `
    "SUPABASE_SERVICE_ROLE_KEY=$service" `
    "NODE_ENV=production"

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "OK - secrets Fly mis a jour."
