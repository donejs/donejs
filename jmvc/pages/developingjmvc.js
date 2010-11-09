/**
@page developingjmvc Developing JavaScriptMVC

Awesome, you want to contribute back some code to JavaScriptMVC, or build your own
download.  This article
explains how.

JavaScriptMVC is comprised of several projects, each with 
it's own repository:

 - [http://github.com/jupiterjs/steal]
 - [http://github.com/jupiterjs/jquerymx]
 - [http://github.com/jupiterjs/documentjs]
 - [http://github.com/jupiterjs/funcunit]

These are collected in the javascriptmvc repository:

 - [http://github.com/jupiterjs/javascriptmvc]

Read how to get, test, and build each project in JavaScriptMVC:

## 1.  Get

In Github, fork the repo you want to make changes to.  Then clone
the javascriptmvc repo and install the submodules like:

@codestart
git clone git@github.com:jupiterjs/javascriptmvc
@codeend

Now, open the javascriptmvc folder's .gitmodule file and change the url of the submodule(s)
you have forked.  For example, you might change:

@codestart
	url = git://github.com/jupiterjs/jquerymx.git
@codeend
to
@codestart
	url = git://github.com/justinbmeyer/jquerymx.git
@codeend

Now run:


@codestart
cd javascriptmvc
git submodule init
git submodule update
@codeend
Finally, you might need <b>cd</b> into each submodule and 
run
@codestart
git checkout
@codeend

Now make your changes!

## 2. Test

To test FuncUnit, Steal, and jQueryMX combined open 
<a href='/test.html'>javascriptmvc/test.html</a> in 
every supported browser and run:

@codestart
./js test/run.js
@codeend

To test just the invidual projects, do the following:

#### StealJS

Open <a href='/steal/test/qunit.html'>/steal/test/qunit.html</a> 
in a browser.

Run:

@codestart
./js steal/test/run.js
@codeend

#### FuncUnit

Open <a href='/funcunit/funcunit.html'>/funcunit/funcunit.html</a> 
and <a href='/funcunit/qunit.html'>/funcunit/qunit.html</a> in every browser.

Run:

@codestart
funcunit/envjs funcunit/funcunit.html
@codeend

#### jQueryMX

Open <a href='/jquery/qunit.html'>/jquery/qunit.html</a> 
in every browser.

Run:

@codestart
./js jquery/test/run.js
@codeend


## 3. Build

Coming soon, but most projects have a build.js and so does framework.

## 4. Building the Docs

Run:
@codestart
js jmvc\scripts\doc.js
@codeend

If you have problems, you might need to create a <code>jmvc/docs</code> folder.
Pages like this one are found in <code>jmvc/pages/</code>.

## 4. Deploying the Docs

Run:
@codestart
ruby scripts\deploy.rb
@codeend

First you need to add our EC2 private key in the scripts folder, named key.  If you want to 
deploy, talk to Brian to get access to this key.
 */
//break