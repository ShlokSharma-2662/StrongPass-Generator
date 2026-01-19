Add-Type -AssemblyName System.Drawing
$source = "d:\Azure DevOps\StrongPass Generator\browser-extension\icons\original.png"
$sizes = 16, 48, 128

foreach ($size in $sizes) {
    $img = [System.Drawing.Image]::FromFile($source)
    $resized = new-object System.Drawing.Bitmap($size, $size)
    $graph = [System.Drawing.Graphics]::FromImage($resized)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.DrawImage($img, 0, 0, $size, $size)
    $resized.Save("d:\Azure DevOps\StrongPass Generator\browser-extension\icons\icon$size.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    $resized.Dispose()
    $graph.Dispose()
}
