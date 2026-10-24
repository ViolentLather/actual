<#
.SYNOPSIS
  Serves this fork's web app from an existing Actual sync server that runs as
  an NSSM Windows service.

.DESCRIPTION
  Downloads the latest "simplifi-web.zip" release (or uses -ZipPath), unpacks
  it next to nssm.exe, points the service at it through the ACTUAL_WEB_ROOT
  environment variable and restarts the service. Budget data and server
  settings are not touched. Run it again to update; use -Revert to go back to
  the web app that ships with the sync server.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\Install-SimplifiWeb.ps1

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\Install-SimplifiWeb.ps1 -Revert
#>
#Requires -RunAsAdministrator
param(
  [string]$InstallDir = 'D:\ActualBudget',
  [string]$ZipUrl = 'https://github.com/ViolentLather/actual/releases/download/simplifi-latest/simplifi-web.zip',
  [string]$ZipPath,
  [switch]$Revert
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$nssm = Join-Path $InstallDir 'nssm.exe'
$webRoot = Join-Path $InstallDir 'simplifi-web'

if (-not (Test-Path $nssm)) {
  throw "nssm.exe not found at $nssm. Pass -InstallDir with the folder that contains it."
}

$service = Get-CimInstance Win32_Service |
  Where-Object { $_.PathName -like "*$nssm*" } |
  Select-Object -First 1
if (-not $service) {
  throw "No Windows service runs $nssm."
}
$name = $service.Name
Write-Host "Using service '$name'."

# Other extra environment variables on the service, without ACTUAL_WEB_ROOT.
# nssm prints UTF-16, which shows up as NUL characters in PowerShell.
function Get-OtherEnvironment {
  $lines = & $nssm get $name AppEnvironmentExtra 2>$null
  @($lines | ForEach-Object { ($_ -replace "`0", '').Trim() } |
    Where-Object { $_ -and $_ -notmatch '^ACTUAL_WEB_ROOT=' })
}

if (-not $Revert) {
  $zip = $ZipPath
  if (-not $zip) {
    $zip = Join-Path $env:TEMP 'simplifi-web.zip'
    Write-Host "Downloading $ZipUrl ..."
    Invoke-WebRequest -Uri $ZipUrl -OutFile $zip -UseBasicParsing
  }
  $staging = "$webRoot.new"
  if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
  Expand-Archive -Path $zip -DestinationPath $staging
  if (-not (Test-Path (Join-Path $staging 'index.html'))) {
    throw "The zip does not contain a web app (index.html missing)."
  }
}

Write-Host "Stopping '$name' ..."
Stop-Service -Name $name

$environment = @(Get-OtherEnvironment)
if (-not $Revert) {
  if (Test-Path $webRoot) { Remove-Item $webRoot -Recurse -Force }
  Move-Item $staging $webRoot
  $environment += "ACTUAL_WEB_ROOT=$webRoot"
}

if ($environment.Count -gt 0) {
  & $nssm set $name AppEnvironmentExtra @environment | Out-Null
} else {
  & $nssm reset $name AppEnvironmentExtra | Out-Null
}

Write-Host "Starting '$name' ..."
Start-Service -Name $name

if ($Revert) {
  Write-Host 'Done. The service serves its bundled web app again.'
} else {
  $version = Get-Content (Join-Path $webRoot 'simplifi-version.txt') -ErrorAction SilentlyContinue
  Write-Host "Done. Serving $webRoot $(if ($version) { "(build $version)" })"
  Write-Host 'Open http://localhost:5006 and press Ctrl+F5 if the old look still shows.'
}
