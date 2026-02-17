@echo off
echo ==========================================
echo   Recruiter Service Setup (Windows)
echo ==========================================

echo [1/4] Installing dependencies...
call npm install

echo [2/4] Configuring environment...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
) else (
    echo .env already exists, skipping...
)

echo [3/4] Seeding database...
call npm run seed

echo [4/4] Building documentation...
call npm run docs

echo ==========================================
echo   Setup Complete! Run 'npm run dev'
echo ==========================================
pause
