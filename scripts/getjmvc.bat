:: Use this script to install JMVC from github or your own fork. If its already installed, 
:: it will get latest for all the submodules.  Assumes your project uses git.
::
:: Options: 
::	-u username (default is jupiterjs)
::	-b branch (default is master)
::	-s source url (default is https://github.com)
::	-p install path (default is current directory)
::
:: Usage:
::	Default usage.  This will install from https://jupiterjs@github.com/jupiterjs/steal.git
::		./getjmvc
::
::	Use your own forked submodule repositories. This will install from 
::	https://github.com/jupiterjs/steal.git
::		./getjmvc -u cengage
::
::	Install to your own path.  You can specify the path where the submodules are installed, 
::	like to public/
::		./getjmvc -p public/
::
::	Install a different branch (used to install the 2.0 branches for steal, jquerymx, and funcunit).
::		./getjmvc -b 2.0
::
::	Install from a different repository (not github) or from ssh instead of http (if you have 
::	write access).
::		./getjmvc -s git@github.com
::		./getjmvc -s http://mygitrepo.com
::
:: 	Update code.  If you installed somewhere besides the current directory, specify a -p.
::		./getjmvc
::		./getjmvc -p public/

@echo off
set USERNAME=jupiterjs
set BRANCH=master
set SRC=https://github.com
set INSTALLPATH=./

:GETOPTS
if /I "%1"=="-u" (
 	set USERNAME=%2 
 	shift
 	shift
 	goto :GETOPTS
)
if /I "%1"=="-b" (
 	set BRANCH=%2
 	shift
 	shift
 	goto :GETOPTS
)
if /I "%1"=="-s" (
	set SRC=%2
	shift
 	shift
 	goto :GETOPTS
)
if /I "%1"=="-p" (
	set INSTALLPATH=%2
	shift
 	shift
 	goto :GETOPTS
)

set USERNAME=%USERNAME: =%
set BRANCH=%BRANCH: =%
set SRC=%SRC: =%
set INSTALLPATH=%INSTALLPATH: =%

:: if steal/steal.js exists, refresh everything
IF EXIST %INSTALLPATH%steal/steal.js GOTO UPDATE


:: CAN'T DO REGEX IN DOS, SO USE THIS HACK INSTEAD
set WITHOUTHTTP=%SRC:http=%

if "%WITHOUTHTTP%"=="%SRC%" (
	set FULLSRC=%SRC%:%USERNAME%
	GOTO :INSTALL
)
set FULLSRC=%SRC%/%USERNAME%

:INSTALL
call git submodule add %FULLSRC%/steal.git %INSTALLPATH%steal
call git submodule add %FULLSRC%/jquerymx.git %INSTALLPATH%jquery
call git submodule add %FULLSRC%/documentjs.git %INSTALLPATH%documentjs
call git submodule add %FULLSRC%/funcunit.git %INSTALLPATH%funcunit
call git submodule init
call git submodule update
cd %INSTALLPATH%steal
call git checkout %BRANCH%
cd ..\jquery
call git checkout %BRANCH%
cd ..\documentjs
call git checkout master
cd ..\funcunit
call git checkout %BRANCH%
call git submodule init
call git submodule update
cd syn
call git checkout %BRANCH%
cd ..\..\
call steal\js steal/make.js
goto :END

:UPDATE
cd %INSTALLPATH%steal
call git pull origin master
cd ..\jquery
call git pull origin master
cd ..\documentjs
call git pull origin master
cd ..\funcunit
call git pull origin master
cd syn
call git pull origin master
cd ..\..\
goto :END

:END