# StrongPass Generator API Test Script

Write-Host "`nTesting StrongPass Generator API...`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "[1] Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5414/api/password/health" -Method GET
    Write-Host "SUCCESS: $($health.message)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Generate Password
Write-Host "[2] Generating Password (16 characters, all types)..." -ForegroundColor Yellow
try {
    $body = @{
        length = 16
        includeUppercase = $true
        includeLowercase = $true
        includeNumbers = $true
        includeSymbols = $true
        excludeSimilar = $false
        excludeAmbiguous = $false
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5414/api/password/generate" -Method POST -ContentType "application/json" -Body $body
    $result = $response.data
    
    Write-Host "Generated Password: $($result.password)" -ForegroundColor Green
    Write-Host "Strength: $($result.strengthLabel) ($($result.strength)/100)" -ForegroundColor Cyan
    Write-Host "Entropy: $([math]::Round($result.entropy, 1)) bits" -ForegroundColor Cyan
    Write-Host "Crack Time: $($result.estimatedCrackTime)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Generate with exclusions
Write-Host "[3] Generating Password with exclusions..." -ForegroundColor Yellow
try {
    $body = @{
        length = 20
        includeUppercase = $true
        includeLowercase = $true
        includeNumbers = $true
        includeSymbols = $false
        excludeSimilar = $true
        excludeAmbiguous = $false
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5414/api/password/generate" -Method POST -ContentType "application/json" -Body $body
    $result = $response.data
    
    Write-Host "Generated Password: $($result.password)" -ForegroundColor Green
    Write-Host "Strength: $($result.strengthLabel) ($($result.strength)/100)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
    exit 1
}

Write-Host "*** All tests passed! API is working perfectly! ***`n" -ForegroundColor Green
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend URL:  http://localhost:5414`n" -ForegroundColor Cyan
