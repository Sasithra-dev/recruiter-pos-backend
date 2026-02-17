#!/bin/bash

echo "=========================================="
echo "  Recruiter Service Setup (Linux/Mac)"
echo "=========================================="

echo "[1/4] Installing dependencies..."
npm install

echo "[2/4] Configuring environment..."
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
else
    echo ".env already exists, skipping..."
fi

echo "[3/4] Seeding database..."
npm run seed

echo "[4/4] Building documentation..."
npm run docs

echo "=========================================="
echo "  Setup Complete! Run 'npm run dev'"
echo "=========================================="
