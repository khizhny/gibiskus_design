@echo off
setlocal

rem ================================================================
rem FTP deployment settings - edit these values before running.
rem This script uses Windows ftp.exe (plain FTP, not SFTP or FTPS).
rem It processes files only; subdirectories are not uploaded or deleted.
rem ================================================================
set "FTP_HOST=ftp.example.com"
set "FTP_USER=your-username"
set "FTP_PASSWORD=your-password"
set "REMOTE_FOLDER=/public_html"
set "LOCAL_FOLDER=C:\path\to\local\folder"

if not exist "%LOCAL_FOLDER%\" (
    echo ERROR: Local folder does not exist: "%LOCAL_FOLDER%"
    exit /b 1
)

where ftp.exe >nul 2>&1
if errorlevel 1 (
    echo ERROR: Windows ftp.exe was not found.
    exit /b 1
)

set "FTP_COMMANDS=%TEMP%\ftp-deploy-%RANDOM%-%RANDOM%.txt"

(
    echo open %FTP_HOST%
    echo %FTP_USER%
    echo %FTP_PASSWORD%
    echo binary
    echo cd %REMOTE_FOLDER%
    echo mdelete *
    echo lcd %LOCAL_FOLDER%
    echo mput *
    echo bye
) > "%FTP_COMMANDS%"

echo Deploying files to ftp://%FTP_HOST%%REMOTE_FOLDER%/ ...
ftp.exe -n -i -s:"%FTP_COMMANDS%"
set "FTP_EXIT_CODE=%ERRORLEVEL%"

del /q "%FTP_COMMANDS%" >nul 2>&1

if not "%FTP_EXIT_CODE%"=="0" (
    echo ERROR: FTP deployment failed with exit code %FTP_EXIT_CODE%.
    exit /b %FTP_EXIT_CODE%
)

echo Deployment complete.
exit /b 0
