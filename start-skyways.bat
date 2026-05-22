@echo off
echo ============================================
echo   SkyWays Airlines - Starting All Services
echo ============================================

set BASE=C:\Users\yuvraj.mangla\Desktop\Skyways\skyways-airlines
set KAFKA=C:\kafka
set JAVA_HOME=C:\Program Files\Zulu\zulu-17
set FRONTEND=C:\Users\yuvraj.mangla\Desktop\Skyways\skyways-frontend

echo [0/13] Stopping any leftover services...
taskkill /F /IM java.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1
timeout /t 5 /nobreak > nul

echo [1/13] Starting Zookeeper...
start "Zookeeper" cmd /k "cd /d %KAFKA% && bin\windows\zookeeper-server-start.bat config\zookeeper.properties"
timeout /t 10 /nobreak > nul

echo [2/13] Starting Kafka...
start "Kafka" cmd /k "cd /d %KAFKA% && set KAFKA_HEAP_OPTS=-Xmx512M -Xms512M && bin\windows\kafka-server-start.bat config\server.properties"
timeout /t 15 /nobreak > nul

echo [3/13] Starting Config Server...
start "Config Server" cmd /k "cd /d %BASE%\skyways-config-server && mvn spring-boot:run"
timeout /t 35 /nobreak > nul

echo [4/13] Starting Eureka Registry...
start "Eureka Registry" cmd /k "cd /d %BASE%\skyways-registry && mvn spring-boot:run"
timeout /t 35 /nobreak > nul

echo [5/13] Starting User Service...
start "User Service" cmd /k "cd /d %BASE%\skyways-user-service && mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8091"
timeout /t 25 /nobreak > nul

echo [6/13] Starting Flight Service...
start "Flight Service" cmd /k "cd /d %BASE%\skyways-flight-service && mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8092"
timeout /t 25 /nobreak > nul

echo [7/13] Starting Booking Service...
start "Booking Service" cmd /k "cd /d %BASE%\skyways-booking-service && mvn spring-boot:run"
timeout /t 25 /nobreak > nul

echo [8/13] Starting Payment Service...
start "Payment Service" cmd /k "cd /d %BASE%\skyways-payment-service && mvn spring-boot:run"
timeout /t 25 /nobreak > nul

echo [9/13] Starting Saga Orchestrator...
start "Saga Orchestrator" cmd /k "cd /d %BASE%\skyways-saga-orchestrator && mvn spring-boot:run"
timeout /t 25 /nobreak > nul

echo [10/13] Starting Notification Service...
start "Notification Service" cmd /k "cd /d %BASE%\skyways-notification-service && mvn spring-boot:run"
timeout /t 25 /nobreak > nul

echo [11/13] Waiting for all services to fully start and register with Eureka...
echo         (this takes about 60 seconds - do not close this window)
timeout /t 60 /nobreak > nul

echo [12/13] Starting Gateway...
start "Gateway" cmd /k "cd /d %BASE%\skyways-gateway && mvn spring-boot:run"
timeout /t 30 /nobreak > nul

echo [13/13] Starting Frontend...
start "Frontend" cmd /k "cd /d %FRONTEND% && npm start"

echo.
echo ============================================
echo   All services started!
echo   Wait 2-3 more minutes before booking.
echo   Eureka:   http://localhost:8761
echo   Gateway:  http://localhost:8080
echo   Frontend: http://localhost:3000
echo ============================================
pause
