# ===================================================================
# SmartPages Auto Deploy (stable UTF-8 safe version)
# ===================================================================

Write-Host "=== SmartPages Auto Deploy gestartet ===" -ForegroundColor Cyan
Write-Host ""

$projectPath = Get-Location
Write-Host "Arbeitsverzeichnis: $projectPath" -ForegroundColor Gray

# -------------------------------------------------------------
# Branch-Auswahl
# -------------------------------------------------------------
$branches = @("main", "user")
Write-Host "`nWelche Umgebung moechtest du deployen?"
for ($i = 0; $i -lt $branches.Count; $i++) {
    Write-Host "[$($i+1)] $($branches[$i])"
}
$selection = Read-Host "Gib die Zahl ein (1 oder 2)"
$branch = $branches[$selection - 1]

if (-not $branch) {
    Write-Host "Invalid selection. Abbruch." -ForegroundColor Red
    exit
}

Write-Host "`n-> Verwende Branch: $branch" -ForegroundColor Yellow

# -------------------------------------------------------------
# Cloudflare Webhooks
# -------------------------------------------------------------
$webhooks = @{
    "main" = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/1ffe0e24-f934-4f26-8f67-dc0b87ef1c1f"
    "user" = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/bb845cbd-13a4-4eb2-9cee-c89a4a57a978"
}

$webhookUrl = $webhooks[$branch]

if (-not $webhookUrl) {
    Write-Host "Kein Webhook fuer diesen Branch definiert." -ForegroundColor Red
    exit
}

# -------------------------------------------------------------
# Git Vorgang
# -------------------------------------------------------------
Write-Host "`n[1/4] Fuege neue und geaenderte Dateien hinzu..." -ForegroundColor Yellow
git add .

# Automatische Commit Message
$commitMessage = "auto: sync $branch branch ($(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))"
git commit -m "$commitMessage" 2>$null

Write-Host "[2/4] Pulle Aenderungen von origin/$branch (mit Rebase)..." -ForegroundColor Yellow
git pull origin $branch --rebase

Write-Host "[3/4] Pushe Aenderungen zu GitHub ($branch)..." -ForegroundColor Yellow
git push origin $branch

# -------------------------------------------------------------
# Cloudflare Deployment ausloesen
# -------------------------------------------------------------
Write-Host "`n[4/4] Loese Cloudflare Deployment aus..." -ForegroundColor Yellow

try {
    Invoke-RestMethod -Uri $webhookUrl -Method Post | Out-Null
    Write-Host "Deployment erfolgreich ausgeloest!" -ForegroundColor Green
} catch {
    Write-Host "Fehler beim Senden des Webhooks: $_" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host ("Alle Aenderungen fuer [" + $branch + "] wurden erfolgreich synchronisiert!") -ForegroundColor Green
Write-Host "Cloudflare-Build wird nun automatisch gestartet und deployed..." -ForegroundColor Gray
Write-Host ""
