$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$items = @(
    @{ Path = "assets/images/hero/hero-driving.jpg"; Url = "https://images.pexels.com/photos/9518016/pexels-photo-9518016.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/courses/lesson-guidance.jpg"; Url = "https://images.pexels.com/photos/9518018/pexels-photo-9518018.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/courses/car-road.jpg"; Url = "https://images.pexels.com/photos/5589367/pexels-photo-5589367.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/vehicles/car-interior.jpg"; Url = "https://images.pexels.com/photos/7395205/pexels-photo-7395205.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/hero/road-view.jpg"; Url = "https://images.pexels.com/photos/9801553/pexels-photo-9801553.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/courses/city-driving.jpg"; Url = "https://images.pexels.com/photos/15487490/pexels-photo-15487490.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/courses/road-safety.jpg"; Url = "https://images.pexels.com/photos/1024241/pexels-photo-1024241.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/vehicles/car-controls.jpg"; Url = "https://images.pexels.com/photos/12765620/pexels-photo-12765620.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/instructors/learner-focus.jpg"; Url = "https://images.pexels.com/photos/9518246/pexels-photo-9518246.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/vehicles/car-urban.jpg"; Url = "https://images.pexels.com/photos/18884662/pexels-photo-18884662.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/courses/scenic-drive.jpg"; Url = "https://images.pexels.com/photos/8437309/pexels-photo-8437309.jpeg?auto=compress&cs=tinysrgb&w=1800" },
    @{ Path = "assets/images/courses/road-trip.jpg"; Url = "https://images.pexels.com/photos/3886669/pexels-photo-3886669.jpeg?auto=compress&cs=tinysrgb&w=1800" }
)
foreach ($item in $items) {
    $destination = Join-Path $root $item.Path
    $directory = Split-Path -Parent $destination
    New-Item -ItemType Directory -Force -Path $directory | Out-Null
    Write-Host "Downloading $($item.Path)"
    Invoke-WebRequest -Uri $item.Url -OutFile $destination
    if ((Get-Item $destination).Length -lt 10000) { throw "Downloaded file appears too small: $destination" }
}
Write-Host "All Pexels images downloaded into assets/images." -ForegroundColor Green
