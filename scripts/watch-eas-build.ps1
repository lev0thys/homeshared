# Surveille un build EAS jusqu'à FINISHED ou ERRORED.
param(
  [Parameter(Mandatory = $true)][string]$BuildId,
  [int]$IntervalSeconds = 1200
)

$mobile = Join-Path (Join-Path $PSScriptRoot '..') 'apps\mobile'
Set-Location $mobile

while ($true) {
  Start-Sleep -Seconds $IntervalSeconds
  try {
    $json = eas build:view $BuildId --json 2>$null | Out-String
    $status = if ($json -match '"status"\s*:\s*"([^"]+)"') { $Matches[1] } else { 'UNKNOWN' }
    $ts = (Get-Date).ToString('o')
    Write-Output "AGENT_LOOP_WAKE_easbuild {`"buildId`":`"$BuildId`",`"status`":`"$status`",`"at`":`"$ts`"}"
    if ($status -in @('FINISHED', 'ERRORED', 'CANCELED')) { break }
  } catch {
    Write-Output "AGENT_LOOP_WAKE_easbuild {`"buildId`":`"$BuildId`",`"status`":`"CHECK_FAILED`",`"error`":`"$($_.Exception.Message)`"}"
  }
}
