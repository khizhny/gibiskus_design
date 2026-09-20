@echo off
setlocal

rem =================================================================
rem SSH deployment settings - edit these values before running.
rem Requires the Windows OpenSSH Client (ssh.exe and scp.exe).
rem Authentication uses your SSH key or SSH agent.
rem Only files are processed; subdirectories are preserved and skipped.
rem =================================================================
set "SSH_HOST=vs546.mirohost.net"
set "SSH_PORT=22"
set "SSH_USER=akhyzhnyi"
set "REMOTE_FOLDER=/var/www/devoww"
set "LOCAL_FOLDER=C:\Users\khizh\Documents\WebSite"

rem Optional identity file. Leave empty to use the default key or SSH agent.
set "IDENTITY_FILE="

if not exist "%LOCAL_FOLDER%\" (
    echo ERROR: Local folder does not exist: "%LOCAL_FOLDER%"
    exit /b 1
)

if "%REMOTE_FOLDER%"=="" (
    echo ERROR: REMOTE_FOLDER must not be empty.
    exit /b 1
)

if "%REMOTE_FOLDER%"=="/" (
    echo ERROR: Refusing to deploy directly to the remote root folder.
    exit /b 1
)

where ssh.exe >nul 2>&1
if errorlevel 1 (
    echo ERROR: Windows ssh.exe was not found.
    exit /b 1
)

where scp.exe >nul 2>&1
if errorlevel 1 (
    echo ERROR: Windows scp.exe was not found.
    exit /b 1
)

set "IDENTITY_OPTION="
if not "%IDENTITY_FILE%"=="" set "IDENTITY_OPTION=-i "%IDENTITY_FILE%""

echo Removing files from %SSH_USER%@%SSH_HOST%:%REMOTE_FOLDER%/ ...
ssh.exe -p %SSH_PORT% %IDENTITY_OPTION% "%SSH_USER%@%SSH_HOST%" "find '%REMOTE_FOLDER%' -mindepth 1 -maxdepth 1 -type f -delete"
if errorlevel 1 (
    echo ERROR: Could not remove the remote files. Upload cancelled.
    exit /b 1
)

echo Uploading files from "%LOCAL_FOLDER%" ...
set "UPLOAD_FAILED=0"
for %%F in ("%LOCAL_FOLDER%\*") do (
    if not exist "%%~fF\" (
        scp.exe -P %SSH_PORT% %IDENTITY_OPTION% "%%~fF" "%SSH_USER%@%SSH_HOST%:%REMOTE_FOLDER%/"
        if errorlevel 1 set "UPLOAD_FAILED=1"
    )
)

if "%UPLOAD_FAILED%"=="1" (
    echo ERROR: File upload failed.
    exit /b 1
)

echo Deployment complete.
pause
exit /b 0
