# Build AAB Android production en local (Windows) — sans quota EAS cloud.
# Prérequis : scripts/setup-android-sdk.ps1 exécuté une fois, Java 17, pnpm install.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/build-android-aab-local.ps1

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$mobile = Join-Path $repoRoot "apps\mobile"

# Chemin court pour éviter MAX_PATH (260) avec CMake / New Architecture
if (-not (Get-PSDrive -Name W -ErrorAction SilentlyContinue)) {
    subst W: $repoRoot | Out-Null
    Write-Host "Drive W: -> $repoRoot"
}

$shortMobile = "W:\apps\mobile"
$env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:EXPO_NO_ANDROID_WIDGETS = "true"

Write-Host "Prebuild Android (widgets desactives en prod)..."
Set-Location $shortMobile
npx expo prebuild --platform android --no-install 2>&1 | Out-Host

# Patch monorepo dans android/app/build.gradle (prebuild ecrase parfois)
$gradleApp = Join-Path $shortMobile "android\app\build.gradle"
$gradleText = Get-Content $gradleApp -Raw
if ($gradleText -notmatch 'root = file\("\.\./\.\./"\)') {
    $gradleText = $gradleText -replace '(react \{)', "`$1`n    root = file(`"../../`")"
}
if ($gradleText -notmatch 'extraPackagerArgs') {
    $gradleText = $gradleText -replace '(entryFile = file\("\.\./\.\./index\.js"\))', "`$1`n    extraPackagerArgs = [`"--entry-file`", `"apps/mobile/index.js`"]"
}
if ($gradleText -match 'entryFile = file\(\["node"') {
    $gradleText = $gradleText -replace 'entryFile = file\(\["node".*?\)\)', 'entryFile = file("../../index.js")'
}
Set-Content $gradleApp $gradleText -NoNewline

$gradleProps = Join-Path $shortMobile "android\gradle.properties"
(Get-Content $gradleProps -Raw) `
    -replace 'newArchEnabled=true', 'newArchEnabled=false' `
    -replace 'android.minSdkVersion=23', 'android.minSdkVersion=24' |
    Set-Content $gradleProps -NoNewline

Write-Host "Gradle bundleRelease..."
Set-Location (Join-Path $shortMobile "android")
.\gradlew.bat bundleRelease --no-daemon 2>&1 | Out-Host

$aab = Join-Path $shortMobile "android\app\build\outputs\bundle\release\app-release.aab"
$dest = Join-Path $repoRoot "apps\mobile\build.aab"
if (Test-Path $aab) {
    Copy-Item $aab $dest -Force
    Write-Host "OK — AAB: $dest"
} else {
    Write-Error "AAB introuvable apres build. Verifier les logs Gradle."
}
