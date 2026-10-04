# AI Student Performance Predictor PowerShell Runner
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "             AI STUDENT PERFORMANCE PREDICTOR v1.0.0" -ForegroundColor White
Write-Host "====================================================================" -ForegroundColor Cyan

$python = "python"
if (-not (Get-Command "python" -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files (x86)\Python314-32\python.exe") {
        $python = "C:\Program Files (x86)\Python314-32\python.exe"
    } elseif (Test-Path "C:\Program Files\Python314\python.exe") {
        $python = "C:\Program Files\Python314\python.exe"
    } elseif (Test-Path "C:\Program Files\Python312\python.exe") {
        $python = "C:\Program Files\Python312\python.exe"
    } else {
        Write-Error "Python executable not found in PATH or standard Program Files."
        exit 1
    }
}

Write-Host "[1/2] Installing requirements..." -ForegroundColor Yellow
& $python -m pip install -r requirements.txt --user --quiet

Write-Host "[2/2] Starting server at http://127.0.0.1:5000..." -ForegroundColor Green
Write-Host "Demo Credentials:" -ForegroundColor Gray
Write-Host "  Faculty/Dean: faculty@edu.ai / admin123" -ForegroundColor Gray
Write-Host "  Alex Rivera (High): alex.cs@edu.ai / student123" -ForegroundColor Gray
Write-Host "  Priya Sharma (Medium): priya.it@edu.ai / student123" -ForegroundColor Gray
Write-Host "  Sara Jenkins (Critical Risk): sara.ec@edu.ai / student123" -ForegroundColor Gray
Write-Host "====================================================================" -ForegroundColor Cyan

& $python app.py
