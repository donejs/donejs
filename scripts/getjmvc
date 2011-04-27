#!/bin/bash
#
# Use this script to install JMVC from github or your own fork. If its already installed, 
# it will get latest for all the submodules.  Assumes your project uses git.
#
# Options: 
#	-u username (default is jupiterjs)
#	-b branch (default is master)
#	-s source url (default is https://github.com)
#	-p install path (default is current directory)
#
# Usage:
#	Default usage.  This will install from https://jupiterjs@github.com/jupiterjs/steal.git
#		./getjmvc
#
#	Use your own forked submodule repositories. This will install from https://github.com/mycompany/steal.git
#		./getjmvc -u mycompany
#
#	Install to your own path.  You can specify the path where the submodules are installed, like to public/
#		./getjmvc -p public/
#
#	Install a different branch (used to install the 2.0 branches for steal, jquerymx, and funcunit).
#		./getjmvc -b 2.0
#
#	Install from a different repository (not github) or from ssh instead of http (if you have write access).
#		./getjmvc -s git@github.com
#		./getjmvc -s http://mygitrepo.com
#
# 	Update code.  If you installed somewhere besides the current directory, specify a -p.  This will update code in each submodule.
#		./getjmvc
#		./getjmvc -p public/


USERNAME=jupiterjs
BRANCH=master
SRC=https://github.com
INSTALLPATH=
 
while getopts ":u:b:s:p:" opt; do
  case $opt in
    u)
      USERNAME=$OPTARG
      ;;
    b)
      BRANCH=$OPTARG
      ;;
    s)
      SRC=$OPTARG
      ;;
    p)
      INSTALLPATH=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# if steal/steal.js exists, refresh everything
if [ -f ${INSTALLPATH}steal/steal.js ]
then
	cd ${INSTALLPATH}steal
	git pull origin master
	cd ../jquery
	git pull origin master
	cd ../documentjs
	git pull origin master
	cd ../funcunit
	git pull origin master
	cd syn
	git pull origin master
	exit 127
fi

# if its http, should look like this: https://github.com/jupiterjs/jquerymx.git
if [[ $SRC =~ :// ]]; then
	FULLSRC=$SRC/$USERNAME
# else it should look like this: git@github.com:jupiterjs/jquerymx.git
else
	FULLSRC=$SRC:$USERNAME
fi

git submodule add $FULLSRC/steal.git ${INSTALLPATH}steal
git submodule add $FULLSRC/jquerymx.git ${INSTALLPATH}jquery
git submodule add $FULLSRC/documentjs.git ${INSTALLPATH}documentjs
git submodule add $FULLSRC/funcunit.git ${INSTALLPATH}funcunit
git submodule init
git submodule update
cd ${INSTALLPATH}steal
git checkout $BRANCH
cd ../jquery
git checkout $BRANCH
cd ../documentjs
git checkout master
cd ../funcunit
git checkout $BRANCH
git submodule init
git submodule update
cd syn
git checkout $BRANCH
cd ../../
./steal/js steal/make.js
chmod 777 js