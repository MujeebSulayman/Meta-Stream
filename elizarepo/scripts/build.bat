@echo off
echo Building packages...

:: Build core package first
echo Building @ai16z/eliza...
cd packages\core
call pnpm build
if errorlevel 1 goto error

:: Build other packages in parallel
cd ..
for /d %%d in (*) do (
    if not "%%d"=="core" (
        echo Building %%d...
        cd %%d
        call pnpm build
        if errorlevel 1 goto error
        cd ..
    )
)

echo Build completed successfully
exit /b 0

:error
echo Build failed
exit /b 1 