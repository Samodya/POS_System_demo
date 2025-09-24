@echo off  


start cmd.exe /k "cd server && npm start"

start cmd.exe /k "cd client && npm run dev"

start http://localhost:5173/