# ============================================
# Aidevix local dev - firewall qoidalari
# ADMINISTRATOR sifatida ishga tushiring!
# (PowerShell + o'ng tugma + Run as administrator)
# ============================================
# Bu skript 3 narsani qiladi:
#   1) Joriy Wi-Fi profilini Private ga ozgartiradi
#   2) Port 5000 (Backend) va 8081 (Metro) uchun firewall qoidasi qoshadi
#   3) Tekshiruv korsatadi

# --- 0) Admin tekshirish ---
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "XATO: Bu skript ADMINISTRATOR rejimida ishga tushirilishi shart!" -ForegroundColor Red
    Write-Host "PowerShell ni ong tugma bilan bosing va 'Run as administrator' tanlang." -ForegroundColor Yellow
    exit 1
}

# --- 1) Wi-Fi ni Private qilish ---
Write-Host ""
Write-Host "[1/3] Wi-Fi profilini tekshiraman..." -ForegroundColor Cyan
$publicProfiles = Get-NetConnectionProfile | Where-Object { $_.NetworkCategory -eq 'Public' -and $_.IPv4Connectivity -eq 'Internet' }
if ($publicProfiles) {
    foreach ($p in $publicProfiles) {
        try {
            Set-NetConnectionProfile -InterfaceIndex $p.InterfaceIndex -NetworkCategory Private -ErrorAction Stop
            Write-Host "  [OK] $($p.InterfaceAlias) endi Private" -ForegroundColor Green
        } catch {
            Write-Host "  [XATO] $($p.InterfaceAlias): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  [SKIP] Public Wi-Fi yoq (yaxshi)" -ForegroundColor Gray
}

# --- 2) Firewall qoidalari ---
Write-Host ""
Write-Host "[2/3] Firewall qoidalarini ornataman..." -ForegroundColor Cyan
$rules = @(
    @{ Name = "Expo Metro Bundler"; Port = 8081 },
    @{ Name = "Aidevix Backend";    Port = 5000 }
)
foreach ($r in $rules) {
    Remove-NetFirewallRule -DisplayName $r.Name -ErrorAction SilentlyContinue
    New-NetFirewallRule `
        -DisplayName $r.Name `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort $r.Port `
        -Profile Private,Domain `
        -Action Allow | Out-Null
    Write-Host "  [OK] $($r.Name) (TCP $($r.Port), Private+Domain)" -ForegroundColor Green
}

# --- 3) Tekshiruv ---
Write-Host ""
Write-Host "[3/3] Tekshiruv:" -ForegroundColor Cyan
Get-NetConnectionProfile | Format-Table InterfaceAlias, NetworkCategory, IPv4Connectivity -AutoSize
foreach ($r in $rules) {
    $rule = Get-NetFirewallRule -DisplayName $r.Name -ErrorAction SilentlyContinue
    if ($rule) {
        $port = $rule | Get-NetFirewallPortFilter
        Write-Host "  $($r.Name): Profile=$($rule.Profile), Port=$($port.LocalPort), Enabled=$($rule.Enabled)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "TAYYOR! Endi telefondan http://192.168.81.214:5000 ga ulanish ishlashi kerak." -ForegroundColor Green
Write-Host "Test: telefon brauzerida shu URL ni oching - javob kelsa, demak hammasi joyida." -ForegroundColor Yellow
