# ===============================
# SmartPages Auto Publish Script (clean ASCII)
# ===============================

Write-Host "=== SmartPages Auto Publish gestartet ===" -ForegroundColor Cyan
Write-Host "Arbeitsverzeichnis: $PWD" -ForegroundColor DarkGray

# 1. Ordnerstruktur sicherstellen
Write-Host "`n[1/5] Pruefe/vervollstaendige Ordnerstruktur..." -ForegroundColor Yellow

$folders = @(
    "src/components/core",
    "src/components/shared",
    "src/components/user/UserProfile",
    "src/components/user/UserPage",
    "src/components/user/UserDomain"
)

foreach ($folder in $folders) {
    if (-Not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
        Write-Host ("   [+] erstellt: " + $folder) -ForegroundColor Green
    } else {
        Write-Host ("   [=] vorhanden: " + $folder) -ForegroundColor DarkGray
    }
}

# 2. Git-Änderungen hinzufügen
Write-Host "`n[2/5] Füge neue und geaenderte Dateien hinzu..." -ForegroundColor Yellow
git add .

# 3. Commit erstellen
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "auto: sync project state ($timestamp)"
Write-Host ("[3/5] Commit: " + $commitMessage) -ForegroundColor Cyan
git commit -m "$commitMessage"

# 4. Pull (rebase)
Write-Host "`n[4/5] Pull (rebase) von origin/main..." -ForegroundColor Yellow
git pull origin main --rebase

# 5. Push
Write-Host "`n[5/5] Push zu GitHub (origin/main)..." -ForegroundColor Green
git push origin main

Write-Host "`nAlle Aenderungen wurden erfolgreich synchronisiert!" -ForegroundColor Green
