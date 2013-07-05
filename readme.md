@page javascriptmvc JavaScriptMVC

<div class="top">
	<div class="topCorner">
		<div class="right"></div>
		<div class="left"></div>
	</div>
	<div class="content">
	    <h1>JavaScriptMVC Documentation</h1>
	</div>
	<div class="bottomCorner">
		<div class="right"></div>
		<div class="left"></div>
	</div>	
</div>

JavaScriptMVC (JMVC) is a MIT licensed, client-side, JavaScript framework that
builds maintainable, error-free, lightweight
applications as quick as possible. It packs best-of-breed
libraries and tools that are guaranteed to work together.  It
supports every browser that jQuery supports.

If you are new to the framework, this page followed by 
the [tutorials] is the best place to start.

JMVC's goodies are broken down into four sub-projects:

  - [canjs CanJS] - A client side MVC Framework
  - [jquerypp jQuery++] - A collection of useful DOM helpers and special events for jQuery
  - [stealjs StealJS] - JavaScript and CSS dependency management and build tools
  - [FuncUnit FuncUnit] - Functional and unit testing framework
  - [DocumentJS DocumentJS] - Documentation engine

The remainder of this page highlights each sub-project. Click
the the project links on the left for a more in-depth overview 
of the sub-project.

## CanJS

[canjs CanJS] is a JavaScript framework that makes
building rich web applications easy and the MVC of
JavaScriptMVC. The library is extremely lightweight
(at only 11k minified and compressed) and full featured.

Everything you want and need to know about CanJS
[http://canjs.us can be found here.]

## jQuery++

[jquerypp jQuery++] is a collection of useful jQuery libraries that provide the
missing functionality necessary to implement and organize large-scale
jQuery applications. It provides low-level utilities for things that
jQuery doesn’t support.

The best way to get started is the [jQuery++ overview](http://jquerypp.com).

## StealJS

[stealjs StealJS] is a "code manager" that keeps code beautiful and organized
while developing and FAST for users in production.  It's a collection of 
command-line and browser-based utilities enabling you to:

  - [steal load] JS, CSS, LESS, and CoffeeScript files and build them into a single production file.
  - [steal.generate generate] an application file/folder structure, complete with test, build and documentation scripts.
  - [steal.clean clean and JSLint] your code.
  - make your Ajax app [steal.html crawlable].
  - log [steal.dev messages] in development that get removed in production builds.

[stealjs StealJS] is a stand-alone tool that can be used without the rest of JavaScriptMVC.

## FuncUnit

[FuncUnit FuncUnit] is a web application testing framework that provides automated unit and 
functional testing.  Tests are written and debugged in the browser with
FuncUnit's short, terse, jQuery-like API.  The same tests can be instantly 
automated, run by Envjs or Selenium.  

FuncUnit also supports extremely accurate [Syn event simulation] on practically every browser and
system.

## DocumentJS

[DocumentJS DocumentJS] provides powerful JavaScript documenting
capabilities.  This whole website is built with it! DocumentJS can document practically 
anything.  It's extensible.  And with Markdown support, it's easy to document your code.
