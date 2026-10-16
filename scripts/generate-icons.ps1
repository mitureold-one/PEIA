Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [string]$Path,
        [int]$Size,
        [string]$BgHex,
        [bool]$Transparent,
        [bool]$Monochrome
    )
    
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    
    if (-not $Transparent) {
        $bgColor = [System.Drawing.ColorTranslator]::FromHtml($BgHex)
        $g.Clear($bgColor)
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
    }
    
    if (-not $Monochrome -and -not $Transparent) {
        # Fundo com gradiente suave ou círculo glow
        $brushGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 99, 102, 241))
        $g.FillEllipse($brushGlow, [int]($Size * 0.1), [int]($Size * 0.1), [int]($Size * 0.8), [int]($Size * 0.8))
        $brushGlow.Dispose()
    }
    
    # Texto PEIA
    $fontSize = [int]($Size * 0.22)
    $font = New-Object System.Drawing.Font('Arial', $fontSize, [System.Drawing.FontStyle]::Bold)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    
    if ($Monochrome) {
        $brushText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    } elseif ($Transparent) {
        $brushText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 99, 102, 241))
    } else {
        $brushText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    }
    
    $g.DrawString('PEIA', $font, $brushText, $rect, $format)
    
    # Subtítulo se o ícone for grande e com fundo
    if ($Size -ge 512 -and -not $Transparent -and -not $Monochrome) {
        $subFontSize = [int]($Size * 0.038)
        $subFont = New-Object System.Drawing.Font('Arial', $subFontSize, [System.Drawing.FontStyle]::Regular)
        $subRect = New-Object System.Drawing.RectangleF(0, [int]($Size * 0.62), $Size, [int]($Size * 0.2))
        $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 165, 180, 252))
        $g.DrawString('Educação & Emprego', $subFont, $subBrush, $subRect, $format)
        $subFont.Dispose()
        $subBrush.Dispose()
    }
    
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $font.Dispose()
    $format.Dispose()
    $brushText.Dispose()
}

$destDir = "C:\Users\Konor\Downloads\PJBL\PEIA\assets\images"
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

Create-Icon -Path "$destDir\icon.png" -Size 1024 -BgHex "#03031b" -Transparent $false -Monochrome $false
Create-Icon -Path "$destDir\android-icon-foreground.png" -Size 1024 -BgHex "" -Transparent $true -Monochrome $false
Create-Icon -Path "$destDir\android-icon-background.png" -Size 1024 -BgHex "#03031b" -Transparent $false -Monochrome $false
Create-Icon -Path "$destDir\android-icon-monochrome.png" -Size 1024 -BgHex "" -Transparent $true -Monochrome $true
Create-Icon -Path "$destDir\splash-icon.png" -Size 512 -BgHex "" -Transparent $true -Monochrome $false
Create-Icon -Path "$destDir\favicon.png" -Size 192 -BgHex "#03031b" -Transparent $false -Monochrome $false

Write-Output "Assets created successfully!"
