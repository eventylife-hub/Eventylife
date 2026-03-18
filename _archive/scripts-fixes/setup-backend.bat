@echo off
REM =========================================================
REM Eventy Life - Backend Setup Script (Windows)
REM Install all backend dependencies in one command
REM =========================================================

echo.
echo ================================================
echo Eventy Life - Backend Dependency Installation
echo ================================================
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo Error: package.json not found!
    echo Please run this script from the backend directory.
    echo Usage: cd backend && setup-backend.bat
    pause
    exit /b 1
)

echo Installing dependencies...
echo.

REM Install production dependencies
echo [1/3] Installing main NestJS packages...
call npm install @nestjs/schedule @nestjs/swagger@7 swagger-ui-express @nestjs/websockets @nestjs/platform-socket.io socket.io json2csv @anatine/zod-nestjs @anatine/zod-openapi @aws-sdk/client-s3 @aws-sdk/s3-request-presigner uuid bcryptjs cookie-parser

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install production dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Installing dev dependencies...
call npm install -D @types/bcryptjs @types/uuid @types/json2csv @types/cookie-parser

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dev dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Generating Prisma client...
call npx prisma generate

if errorlevel 1 (
    echo.
    echo WARNING: Prisma generation had issues
    echo You may need to run: npx prisma generate manually
)

echo.
echo ================================================
echo Installation Complete!
echo ================================================
echo.
echo Next steps:
echo 1. Configure your .env file with database and API keys
echo 2. Run: npx prisma db push
echo 3. Run: npx prisma db seed (if available)
echo 4. Run: npm run start:dev
echo.
echo Frontend development URL: http://localhost:3000
echo Backend API URL: http://localhost:3001/api
echo Swagger Docs: http://localhost:3001/api/docs
echo.
pause
