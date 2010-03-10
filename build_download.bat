@echo off

:: used to build a downloadable zip file jmvc
:: ie: build_download

:: remove previous download directory
rmdir ..\download /s /Q
rm download.zip

:: create a new directory called download
mkdir ..\download

:: copy documentjs into it
mkdir ..\download\documentjs
xcopy documentjs\*.* ..\download\documentjs\ /e

:: copy funcunit into it
mkdir ..\download\funcunit
xcopy funcunit\*.* ..\download\funcunit\ /e
rmdir ..\download\funcunit\dist\ /s /Q

:: copy jquery into it
mkdir ..\download\jquery
xcopy jquery\*.* ..\download\jquery\ /e

:: copy steal into it
mkdir ..\download\steal
xcopy steal\*.* ..\download\steal\ /e

:: zip that directory
cd ..\download && zip -r javascriptmvc-3.0.0.zip * -i documentjs\* -i jquery\* -i funcunit\* -i steal\*