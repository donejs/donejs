@page installing Installing JavaScriptMVC
@parent tutorials 0

## Requirements

JavaScriptMVC requires Java JRE 1.6 or greater for:

 - Compression (Google Closure)
 - Running [http://www.funcunit.com/ FuncUnit] tests with [http://seleniumhq.org/ Selenium]
 - Easy updating
 - Code Generators

But your backend server can be written in any language.  
Download [http://www.java.com/en/download/index.jsp Java here].

## Getting JavaScriptMVC

There are 2 ways to get JavaScriptMVC:

 - [http://javascriptmvc.com/builder.html Downloading]
 - [developwithgit Installing JavaScriptMVC with Git]
 
We (and the [http://forum.javascriptmvc.com/ community]) would much prefer you to develop with git.  JavaScriptMVC is built 
around modular development so it fits in perfectly
with git development.  Plus we can trade improvements really easy. 


## Downloading

[http://javascriptmvc.com/builder.html Download] the latest JavaScriptMVC. 
Unzip the folder on your file system or web server.  
If you are using this on a webserver, 
unzip in a public folder where the server hosts static content.  
	
<div class='whisper'>PRO TIP: 
  Unzip these files as
  high in your apps folder structure as possible (i.e. don't
  put them under a javascriptmvc folder in your public directory).
</div>

## Installing JavaScriptMVC with Git.

JavaScriptMVC is comprised of four sub projects:

 - [http://github.com/jupiterjs/steal]
 - [http://github.com/jupiterjs/jquerymx]
 - [http://github.com/jupiterjs/documentjs]
 - [http://github.com/jupiterjs/funcunit]

You want to fork each project and add it as a submodule to your project 
in a public folder (where your server keeps static content).
If these words mean nothing to you, or you'd like more 
explanation, you might want to read
[developwithgit Developing With Git].

Forking the repos looks like:

@codestart text
git submodule add git@github.com:_YOU_/steal.git public/steal
git submodule add git@github.com:_YOU_/jquerymx.git public/<b style='font-size: 14px;color: red'>jquery</b>
git submodule add git@github.com:_YOU_/documentjs.git public/documentjs
git submodule add git@github.com:_YOU_/funcunit.git public/funcunit
@codeend

Notice that the javascriptmvc repository is put in a <b style='font-size: 14px;color: red'>jquery</b> folder.  

After installing the repository, run:

@codestart
[WINDOWS] > steal\js steal\make.js

[Lin/Mac] > ./steal/js steal/make.js
@codeend

## Verifing the install

In your public (or static) folder, you should have something that looks like:

@codestart
static
  \documentjs - DocumentJS library
  \funcunit   - FuncUnit testing library
  \jquery     - jQuery and MVC plugins
  \steal      - compression and build system
  \js.bat     - Windows Rhino shortcut
  \js         - Mac/Linux Rhino shortcut
@codeend


Open a command line to that folder and run:

@codestart
[WINDOWS] > js

[Lin/Mac] > ./js
@codeend

This starts the [http://www.mozilla.org/rhino/ Rhino JS engine].  Type <code>quit()</code> to exit.

## Updating JavaScriptMVC

We are constantly improving JMVC.  If you're using git, you can
just pull changes.  Otherwise, to get the latest, most
error free code, in a console, type:

@codestart text
C:\workspace\Cookbook>js documentjs\update
C:\workspace\Cookbook>js funcunit\update
C:\workspace\Cookbook>js jquery\update
C:\workspace\Cookbook>js steal\update
@codeend
<div class='whisper'>
	P.S. If you are using linux/mac you
	want to use <code>./js</code> and change <code>\</code> 
	to <code>/</code>.
</div>
