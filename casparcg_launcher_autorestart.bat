@Echo off

:Start

casparcg-launcher.exe

if %ERRORLEVEL% NEQ 0 goto :Start
