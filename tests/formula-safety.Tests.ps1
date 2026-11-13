# Test bezpecnosti textov o priprave umeleho mlieka (Guguboo V1).
# Spustenie: powershell -ExecutionPolicy Bypass -File tests/formula-safety.Tests.ps1   (alebo pwsh)
# Subor je ulozeny v UTF-8 s BOM (Windows PowerShell 5.1 inak cita diakritiku zle).
# Preco: aplikacia odporucala "voda 40 C" pri umelom mlieku. Oficialne zdroje sa v teplote vody lisia
# (NHS UK: aspon 70 C; Finsky urad pre potraviny: cca 40 C; vsetky: postupovat podla navodu vyrobcu),
# preto appka nesmie uvadzat konkretnu teplotu vody, len odkaz na navod na baleni a overene spolocne body.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]
$passed = 0

function Read-Utf8([string]$path) { [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8) }
function Check([bool]$ok, [string]$name) {
  if ($ok) { $script:passed++; Write-Host "OK   $name" } else { $script:failures.Add($name); Write-Host "FAIL $name" }
}

$app = Read-Utf8 (Join-Path $root "app.html")
$deg = "°\s?C"            # znak stupna + C
$milkWords = "mliek|mlieko|fľaš|flaš|vod[au]|dojčensk"

# 1) Ziadna konkretna teplota vody / mlieka v okoli slov o mlieku, flasi alebo vode (v app.html ani v JS).
$files = @(Get-ChildItem -Path $root -File | Where-Object { $_.Extension -in ".html", ".js" })
foreach ($f in $files) {
  $text = Read-Utf8 $f.FullName
  $pattern = "(?is)(" + $milkWords + ").{0,60}?\d{2}\s?" + $deg
  $hits = [regex]::Matches($text, $pattern) | Where-Object {
    # vylucit nesuvisiace teploty dietata (horucka) - tie obsahuju "teplot" dietata, nie pripravu
    $_.Value -notmatch "(?i)horúčk|teplotu má|nameran|teplomer"
  }
  Check (@($hits).Count -eq 0) ("$($f.Name): ziadna konkretna teplota vody pri mlieku/flasi" + $(if (@($hits).Count) { " -> " + (@($hits)[0].Value -replace "\s+", " ") } else { "" }))
}

# 2) Starý text "voda 40 °C" uz nie je nikde.
Check ($app -notmatch ("(?i)voda[^<\x22]{0,10}40\s?" + $deg)) "app.html: odstraneny text 'voda 40 C'"

# 3) Polia formulara rodinneho navodu odkazuju na navod na baleni.
$m = [regex]::Match($app, 'id="familyWaterTemp"\s+placeholder="([^"]*)"')
Check ($m.Success -and $m.Groups[1].Value -match "návodu na balení") "familyWaterTemp: placeholder odkazuje na navod na baleni"
Check ($m.Success -and $m.Groups[1].Value -notmatch "\d") "familyWaterTemp: placeholder bez cisla"
$d = [regex]::Match($app, 'id="familyDetails"\s+placeholder="([^"]*)"')
Check ($d.Success -and $d.Groups[1].Value -notmatch $deg) "familyDetails: placeholder bez teploty"

# 4) Postup "Pripravit flasu" obsahuje overene spolocne body (NHS 2023 + Ruokavirasto 2024: navod vyrobcu).
$p = [regex]::Match($app, '"Pripraviť fľašu":\s*"([^"]*)"')
Check $p.Success "Pripravit flasu: text existuje"
if ($p.Success) {
  $t = $p.Groups[1].Value
  Check ($t -match "návodu na balení") "Pripravit flasu: podla navodu na baleni"
  Check ($t -match "zápäst") "Pripravit flasu: kontrola teploty na zapasti"
  Check ($t -match "mikrovln") "Pripravit flasu: varovanie pred mikrovlnkou"
  Check ($t -match "vyliať") "Pripravit flasu: zvysok po kormeni vyliat"
  Check ($t -match "čerstvo") "Pripravit flasu: vzdy cerstvo na jedno kormenie"
  Check ($t -notmatch $deg) "Pripravit flasu: bez konkretnej teploty"
}

# 5) Automaticke doplnenie navodu neuvadza "bezpecnu teplotu podla rutiny" ani cislo.
$a = [regex]::Match($app, '\$\("familyWaterTemp"\)\.value = "([^"]*)"')
Check ($a.Success -and $a.Groups[1].Value -match "návodu na balení" -and $a.Groups[1].Value -notmatch "\d") "Doplnenie navodu: podla navodu na baleni, bez cisla"

Write-Host ""
Write-Host "Vysledok: $passed OK, $($failures.Count) FAIL"
if ($failures.Count -gt 0) { exit 1 } else { exit 0 }
