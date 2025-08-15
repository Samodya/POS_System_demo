@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM ====== CONFIGURATION ======
SET "DB_USER=root"
SET "DB_PASS="
SET "DB_NAME=pos_db"
SET "BACKUP_FOLDER=C:\MySQL_Backups"

REM ====== TIMESTAMP ======
FOR /F "tokens=1-4 delims=/ " %%A IN ('date /t') DO (
    SET DAY=%%A
    SET MONTH=%%B
    SET YEAR=%%C
)
FOR /F "tokens=1-2 delims=: " %%A IN ('time /t') DO (
    SET HOUR=%%A
    SET MINUTE=%%B
)
SET MINUTE=%MINUTE: =%
SET TIMESTAMP=%YEAR%-%MONTH%-%DAY%_%HOUR%h%MINUTE%m

REM ====== CREATE BACKUP ======
IF NOT EXIST "%BACKUP_FOLDER%" mkdir "%BACKUP_FOLDER%"
IF "%DB_PASS%"=="" (
    mysqldump -u%DB_USER% %DB_NAME% > "%BACKUP_FOLDER%\%DB_NAME%_%TIMESTAMP%.sql"
) ELSE (
    mysqldump -u%DB_USER% -p%DB_PASS% %DB_NAME% > "%BACKUP_FOLDER%\%DB_NAME%_%TIMESTAMP%.sql"
)

IF %ERRORLEVEL%==0 (
    echo Backup successful: "%BACKUP_FOLDER%\%DB_NAME%_%TIMESTAMP%.sql"
) ELSE (
    echo Backup failed!
)

pause
