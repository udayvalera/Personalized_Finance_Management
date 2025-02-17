@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
"$Host.UI.RawUI.WindowTitle = 'Fullstack App Startup'; ^
Start-Process powershell -ArgumentList '-NoExit','-Command','cd backend; npm install; nodemon app.js'; ^
Start-Process powershell -ArgumentList '-NoExit','-Command','cd ai-ml; python app.py'; ^
Start-Process powershell -ArgumentList '-NoExit','-Command','cd frontend; npm install; npm run dev'"