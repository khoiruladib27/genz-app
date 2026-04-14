@echo off
echo ==========================================
echo  Gen-Z (Gen Zone) -- Setup dan Start
echo ==========================================
echo.

echo Installing root dependencies...
call npm install

echo.
echo Installing server dependencies...
cd server
call npm install
cd ..

echo.
echo Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo ==========================================
echo  SETUP SELESAI!
echo ==========================================
echo.
echo Cara menjalankan:
echo.
echo   [Terminal 1 - Backend]:
echo   cd server
echo   node index.js
echo.
echo   [Terminal 2 - Frontend]:
echo   cd client
echo   npm start
echo.
echo Buka browser: http://localhost:3000
echo Admin login : admin@genz.id / admin123
echo.
echo PENTING: Pastikan MongoDB sudah berjalan!
echo mongod --dbpath "C:\data\db"
echo.
pause
