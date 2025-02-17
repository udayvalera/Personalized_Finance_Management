@echo off
mkdir logs 2>nul
start cmd /k "cd backend && npm install && nodemon app.js > ../logs/backend.log 2>&1"
start cmd /k "cd ai-ml && python app.py > ../logs/ai-ml.log 2>&1"
start cmd /k "cd frontend && npm install && npm run dev > ../logs/frontend.log 2>&1"
type nul > nul