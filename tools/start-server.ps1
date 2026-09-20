param(
    [int]$Port = 8000
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$php = Join-Path $PSScriptRoot 'php\php.exe'

if (-not (Test-Path -LiteralPath $php)) {
    throw "PHP is not installed at $php"
}

Write-Host "Serving $projectRoot at http://localhost:$Port/"
& $php -S "localhost:$Port" -t $projectRoot
