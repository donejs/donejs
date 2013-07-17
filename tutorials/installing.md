@page installing Installing JavaScriptMVC
@parent tutorials 0

## Requirements

JavaScriptMVC requires [Java JRE 1.6](http://www.oracle.com/technetwork/java/javase/downloads/java-se-jdk-7-download-432154.html) or greater for:

 - Compression (Google Closure)
 - Running [FuncUnit](http://www.funcunit.com/) tests with [Selenium](http://seleniumhq.org/)
 - Easy updating
 - Code Generators

But your backend server can be written in any language.  
Download the latest [Java JRE here](http://www.java.com/en/download/index.jsp).

## Getting JavaScriptMVC

There are 2 ways to get JavaScriptMVC:

 - [Downloading](http://javascriptmvc.com/builder.html)
 - [developwithgit Installing JavaScriptMVC with Git]

## Downloading

[Download](http://javascriptmvc.com/builder.html) the latest JavaScriptMVC. 
Unzip the folder on your file system or web server.  
If you are using this on a webserver, 
unzip in a public folder where the server hosts static content.  
	
> TIP: Unzip these files as
high in your apps folder structure as possible (i.e. don't
put them under a javascriptmvc folder in your public directory).

## Installing JavaScriptMVC with Git.

JavaScriptMVC is comprised of 7 sub projects:

 - [https://github.com/bitovi/steal](http://github.com/bitovi/steal)
 - [https://github.com/bitovi/canjs](https://github.com/bitovi/canjs)
 - [https://github.com/bitovi/canui](https://github.com/bitovi/canui)
 - [https://github.com/bitovi/jquerypp](https://github.com/bitovi/jquerypp)
 - [https://github.com/bitovi/documentjs](http://github.com/bitovi/documentjs)
 - [https://github.com/bitovi/funcunit](http://github.com/bitovi/funcunit)
 - [https://github.com/bitovi/jmvc-generators](https://github.com/bitovi/jmvc-generators)

You want to fork each project and add it as a submodule to your project 
in a public folder (where your server keeps static content).
If these words mean nothing to you, or you'd like more 
explanation, you might want to read
[developwithgit Developing With Git].

Forking the repos looks like:

@codestart text
git submodule add git@github.com:_YOU_/steal.git public/steal
git submodule add git@github.com:_YOU_/canjs.git public/can
git submodule add git@github.com:_YOU_/canui.git public/canui
git submodule add git@github.com:_YOU_/jquerypp.git public/jquerypp
git submodule add git@github.com:_YOU_/documentjs.git public/documentjs
git submodule add git@github.com:_YOU_/funcunit.git public/funcunit
git submodule add git@github.com:_YOU_/jmvc-generators.git public/jmvc
@codeend

Notice that CanJS is in <b style='font-size: 14px;color: red'>can</b> folder and
jQuery++ is in the <b style='font-size: 14px;color: red'>jquerypp</b> folder.  

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
  \canjs      - CanJS MVC Framework
  \canui      - Widgets built on CanJS and jQuery++
  \jquery     - jQuery's missing utils and special events
  \steal      - Compression and build system
  \js.bat     - Windows Rhino shortcut
  \js         - Mac/Linux Rhino shortcut
@codeend


Open a command line to that folder and run:

@codestart
[WINDOWS] > js

[Lin/Mac] > ./js
@codeend

This starts the [Rhino JS engine](http://www.mozilla.org/rhino/).  Type <code>quit()</code> to exit.

