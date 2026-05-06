@echo off
echo Starting Car Management System with Docker...
echo.

REM Build and start all containers
docker-compose up --build -d

echo.
echo Waiting for database to be ready...
timeout /t 10

REM Run migrations
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser

echo.
echo ============================================
echo Car Management System is running!
echo ============================================
echo Frontend: http://localhost
echo Backend API: http://localhost:8000/api/
echo Admin Panel: http://localhost:8000/admin
echo ============================================
echo.
echo To stop: docker-compose down
echo To view logs: docker-compose logs -f
echo.
pause