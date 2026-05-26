<#
.SYNOPSIS
    Crée le repo GitHub 'homeshared' et pousse les 3 branches (main, commit, dev).

.DESCRIPTION
    Pré-requis : gh CLI authentifié (`gh auth login`).
    Si ton identité git n'est pas configurée, ce script t'aidera à le faire
    sans toucher au reste de ta config.

.EXAMPLE
    .\scripts\push-to-github.ps1
#>

$ErrorActionPreference = "Stop"

# Rafraîchir le PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Push-Location (Split-Path -Parent $PSScriptRoot)

try {
    Write-Host "==> Vérification de l'auth gh..." -ForegroundColor Cyan
    gh auth status
    if ($LASTEXITCODE -ne 0) {
        Write-Error "gh n'est pas authentifié. Lance d'abord : gh auth login"
        exit 1
    }

    Write-Host "==> Vérification de l'identité git..." -ForegroundColor Cyan
    $gitEmail = git config --global user.email
    $gitName = git config --global user.name

    if (-not $gitEmail -or -not $gitName) {
        Write-Host "Identité git non configurée. Saisis tes infos :" -ForegroundColor Yellow
        $name = Read-Host "Nom (ex: Steve)"
        $email = Read-Host "Email GitHub (utilise <id>+<user>@users.noreply.github.com si tu veux le masquer)"
        git config --global user.name "$name"
        git config --global user.email "$email"
        Write-Host "Identité configurée." -ForegroundColor Green
    } else {
        Write-Host "Identité git OK : $gitName <$gitEmail>" -ForegroundColor Gray
    }

    Write-Host "==> Création du repo GitHub..." -ForegroundColor Cyan
    gh repo create homeshared --public --source=. --remote=origin --description "Hub partagé pour foyers : courses, frigo, recettes."
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Création du repo a échoué (peut-être déjà existant). Tentative de push sur l'origin existant..."
    }

    Write-Host "==> Push des 3 branches..." -ForegroundColor Cyan
    git push -u origin main
    git push -u origin commit
    git push -u origin dev

    Write-Host ""
    Write-Host "✅ Repo prêt sur GitHub." -ForegroundColor Green
    Write-Host "   URL : $(gh repo view --json url -q .url)"
    Write-Host ""
    Write-Host "Branche par défaut sur GitHub : main." -ForegroundColor Yellow
    Write-Host "Tu peux changer la branche par défaut en 'dev' pour bosser au quotidien :"
    Write-Host "  gh repo edit --default-branch dev"
}
finally {
    Pop-Location
}
