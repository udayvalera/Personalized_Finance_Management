#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p logs

# Start backend
cd backend && npm install && nodemon app.js > ../logs/backend.log 2>&1 &

# Start AI/ML service
cd ../ai-ml && python app.py > ../logs/ai-ml.log 2>&1 &

# Start frontend
cd ../frontend && npm install && npm run dev > ../logs/frontend.log 2>&1 &

# Show logs in real-time
tail -f logs/*.log