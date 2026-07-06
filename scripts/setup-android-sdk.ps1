# Installe Android SDK (cmdline-tools) pour builds locaux EAS sur Windows.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/setup-android-sdk.ps1
$ErrorActionPreference = "Stop"

$sdkRoot = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$cmdlineDir = Join-Path $sdkRoot "cmdline-tools\latest"
$zipPath = Join-Path $env:TEMP "android-cmdline-tools.zip"
$zipUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"

Write-Host "SDK root: $sdkRoot"

if (-not (Test-Path $cmdlineDir)) {
    New-Item -ItemType Directory -Force -Path (Join-Path $sdkRoot "cmdline-tools") | Out-Null
    Write-Host "Telechargement commandlinetools..."
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath (Join-Path $sdkRoot "cmdline-tools\_tmp") -Force
    if (Test-Path $cmdlineDir) { Remove-Item -Recurse -Force $cmdlineDir }
    Move-Item (Join-Path $sdkRoot "cmdline-tools\_tmp\cmdline-tools") $cmdlineDir
    Remove-Item -Recurse -Force (Join-Path $sdkRoot "cmdline-tools\_tmp") -ErrorAction SilentlyContinue
    Remove-Item $zipPath -ErrorAction SilentlyContinue
}

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$sdkmanager = Join-Path $cmdlineDir "bin\sdkmanager.bat"

Write-Host "Acceptation licences SDK..."
$yes = ("y`n" * 20)
$yes | & $sdkmanager --licenses 2>&1 | Out-Null

Write-Host "Installation packages SDK 35..."
& $sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0" "ndk;26.1.10909125"

# Persist user env
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkRoot, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $sdkRoot, "User")
$pathUser = [Environment]::GetEnvironmentVariable("Path", "User")
$platformTools = Join-Path $sdkRoot "platform-tools"
if ($pathUser -notlike "*$platformTools*") {
    [Environment]::SetEnvironmentVariable("Path", "$pathUser;$platformTools", "User")
}

Write-Host "OK - ANDROID_HOME=$sdkRoot"
Write-Host 'Redemarre le terminal puis: cd apps\mobile; eas build --profile production --platform android --local'
