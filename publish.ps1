# ===================================================================
# SmartPages Auto Deploy Script (Multi-Branch Version)
# ===================================================================
# Funktion:
# 1. Prüft, welcher Branch aktiv ist (oder lässt dich auswählen)
# 2. Commit + Push zu GitHub
# 3. Löst automatisch Cloudflare Deployment über Webhook aus
# 4. Zeigt Status in PowerShell an
# ===================================================================

Write-Host "=== SmartPages Auto Deploy gestartet ===" -ForegroundColor Cyan
Write-Host ""

# 🔍 Projektverzeichnis
$projectPath = Get-Location
Write-Host "Arbeitsverzeichnis: $projectPath" -ForegroundColor Gray

# -------------------------------------------------------------
# Auswahl: Branch bestimmen
# -------------------------------------------------------------
$branches = @("main", "user")
Write-Host "`nWelche Umgebung möchtest du deployen?"
for ($i = 0; $i -lt $branches.Count; $i++) {
    Write-Host "[$($i+1)] $($branches[$i])"
}
$selection = Read-Host "Gib die Zahl ein (1 oder 2)"
$branch = $branches[$selection - 1]

if (-not $branch) {
    Write-Host "❌ Ungültige Auswahl. Abbruch." -ForegroundColor Red
    exit
}

Write-Host "`n→ Verwende Branch: $branch" -ForegroundColor Yellow

# -------------------------------------------------------------
# Cloudflare Webhook URLs (ersetze durch deine eigenen!)
# -------------------------------------------------------------
$webhooks = @{
    "main" = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/1ffe0e24-f934-4f26-8f67-dc0b87ef1c1f"
    "user" = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/bb845cbd-13a4-4eb2-9cee-c89a4a57a978"
}

$webhookUrl = $webhooks[$branch]

if (-not $webhookUrl) {
    Write-Host "❌ Kein Webhook für diesen Branch definiert." -ForegroundColor Red
    exit
}

# -------------------------------------------------------------
# GitHub Sync
# -------------------------------------------------------------
Write-Host "`n[1/4] Füge neue & geänderte Dateien hinzu..." -ForegroundColor Yellow
git add .

$commitMessage = Read-Host "Commit Nachricht (optional, Enter für auto)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "auto: sync $branch branch ($(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))"
}

git commit -m "$commitMessage" 2>$null

Write-Host "[2/4] Pulle Änderungen von origin/$branch (rebase)..." -ForegroundColor Yellow
git pull origin $branch --rebase

Write-Host "[3/4] Pushe zu GitHub ($branch)..." -ForegroundColor Yellow
git push origin $branch

# -------------------------------------------------------------
# Cloudflare Deployment Trigger
# -------------------------------------------------------------
Write-Host "`n[4/4] Löse Cloudflare Deployment aus..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post
    Write-Host "✅ Deployment erfolgreich ausgelöst!" -ForegroundColor Green
} catch {
    Write-Host "❌ Fehler beim Senden des Webhooks: $_" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Alle Änderungen für [$branch] wurden erfolgreich synchronisiert!" -ForegroundColor Green
Write-Host "Cloudflare-Build wird nun automatisch gestartet und deployed..." -ForegroundColor Gray
Write-Host ""
