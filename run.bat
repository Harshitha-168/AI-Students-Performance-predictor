@echo off
title AI Student Performance Predictor
color 0B
echo ====================================================================
echo             AI STUDENT PERFORMANCE PREDICTOR v1.0.0
echo ====================================================================
echo [1/3] Detecting Python environment...

set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files (x86)\Python314-32\python.exe" (
        set PYTHON_CMD="C:\Program Files (x86)\Python314-32\python.exe"
    ) else if exist "C:\Program Files\Python314\python.exe" (
        set PYTHON_CMD="C:\Program Files\Python314\python.exe"
    ) else if exist "C:\Program Files\Python312\python.exe" (
        set PYTHON_CMD="C:\Program Files\Python312\python.exe"
    ) else if exist "C:\Program Files\Python311\python.exe" (
        set PYTHON_CMD="C:\Program Files\Python311\python.exe"
    ) else (
        echo [ERROR] Python not detected in PATH or standard directories.
        echo Please ensure Python is installed.
        pause
        exit /b 1
    )
)

echo Using: %PYTHON_CMD%
echo.
echo [2/3] Verifying and installing requirements...
%PYTHON_CMD% -m pip install -r requirements.txt --user --quiet

echo.
echo [3/3] Launching Web Application Server on http://127.0.0.1:5000...
echo.
echo Demo Accounts:
echo   - Faculty Dean: faculty@edu.ai / admin123
echo   - Student (High): alex.cs@edu.ai / student123
echo   - Student (Medium): priya.it@edu.ai / student123
echo   - Student (Critical): sara.ec@edu.ai / student123
echo.
echo Press Ctrl+C in this terminal to stop the server.
echo ====================================================================

%PYTHON_CMD% app.py

pause
