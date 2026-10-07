param([string]$Deck, [string]$OutDir, [string]$Slides = "")
New-Item -ItemType Directory -Force $OutDir | Out-Null
$pp = New-Object -ComObject PowerPoint.Application
try {
  $pres = $pp.Presentations.Open($Deck, $true, $false, $false)
  $n = $pres.Slides.Count
  $list = if ($Slides) { $Slides.Split(",") | ForEach-Object { [int]$_ } } else { 1..$n }
  foreach ($i in $list) {
    $file = Join-Path $OutDir ("s{0:D2}.png" -f $i)
    $pres.Slides.Item($i).Export($file, "PNG", 1600, 900)
  }
  "slides: $n"
  $pres.Close()
} finally {
  $pp.Quit()
  [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pp) | Out-Null
}
