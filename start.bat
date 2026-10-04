@echo off
title AI Student Performance Predictor
color 0B
echo ====================================================================
echo             AI STUDENT PERFORMANCE PREDICTOR v1.0.0
echo ====================================================================
echo Starting application on http://127.0.0.1:5000 ...

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
        echo [ERROR] Python not detected. Please ensure Python is installed.
        pause
        exit /b 1
    )
)

%PYTHON_CMD% app.py

pause
