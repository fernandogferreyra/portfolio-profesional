param(
    [switch]$Verify
)

$ErrorActionPreference = 'Stop'

$backendRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$targetPath = Join-Path $backendRoot 'target'

Write-Host "Repairing Maven generated target at: $targetPath"

if (Test-Path $targetPath) {
    try {
        attrib -R "$targetPath\*" /S /D 2>$null
    } catch {
        Write-Warning "Could not clear read-only attributes completely: $($_.Exception.Message)"
    }

    try {
        Remove-Item -LiteralPath $targetPath -Recurse -Force
        Write-Host 'Removed backend/target successfully.'
    } catch {
        Write-Error "Could not remove backend/target. Close IDEs/backend Java processes and run this script again. Original error: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host 'backend/target does not exist. Nothing to remove.'
}

if ($Verify) {
    if ([string]::IsNullOrWhiteSpace($env:JAVA_HOME)) {
        $defaultJdk = 'C:\Program Files\Java\jdk-17'
        if (Test-Path $defaultJdk) {
            $env:JAVA_HOME = $defaultJdk
            Write-Host "JAVA_HOME was not set. Using detected JDK: $env:JAVA_HOME"
        }
    }

    Write-Host 'Running Maven process-resources verification...'
    Push-Location $backendRoot
    try {
        & .\mvnw.cmd -DskipTests process-resources
    } finally {
        Pop-Location
    }
}

Write-Host 'Maven target repair completed.'
