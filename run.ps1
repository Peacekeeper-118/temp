$history = "history.txt"

if (!(Test-Path $history)) {
    New-Item $history
}

Write-Host "Loading history..."

$context = Get-Content $history -Raw

gemini "$context" | Tee-Object -FilePath $history -Append
