/*
@page index JavaScriptMVC

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

  - [jquerymx jQueryMX] - jQuery MVC and DOM extensions
  - [stealjs StealJS] - JavaScript and CSS dependency management and build tools
  - [FuncUnit] - Functional and unit testing framework
  - [DocumentJS] - Documentation engine

JavaScriptMVC is extremely modular. Use each sub-project together or 
separately (via the [http://javascriptmvc.com/builder.html download builder]). Start 
small, using only [jQuery.Controller $.Controller] and add in parts
of the framework as necessary. 

The remainder of this page highlights each sub-project. Click 
the the project links on the left for a more in-depth overview 
of the sub-project.

## jQueryMX

[jquerymx jQueryMX] is a collection of useful jQuery libraries that provide 
the missing functionality necessary to implement and organize
large-scale jQuery applications. For example, it includes things like:

  - Special events like [jQuery.Drag drag]-[jQuery.Drop drop] and [jQuery.event.special.resize resize]
  - Language helpers like [jQuery.toJSON toJSON] and an [jQuery.Observe observable system]
  - DOM extensions for things like [jQuery.Range text ranges] and [jQuery.cookie cookies]
  - Browser history [jQuery.route routing].
  - A [jQuery.Class class-like] system
  
jQueryMX also puts the MVC in JavaScript with $.Model,
$.View, and $.Controller.  [jQuery.Model Models] connect to your
server over a RESTful JSON interface.  [jQuery.View Views] are super-charged 
client side templates.  [jQuery.Controller Controllers] prevent 
memory leaks with declarative event handling.

jQueryMX is very lightweight.  It's MVC libraries combined (including their $.Class dependency) are 7kb minified
and gzipped.  Furthermore, you can use every part of jQueryMX independently of JavaScriptMVC 
and even independently of other parts of jQueryMX.  For example, you can use $.Controller without $.Model.

## StealJS

[stealjs StealJS] is a "code manager" that keeps code beautiful and organized
while developing and FAST for users in production.  It's a collection of 
command-line and browser-based utilities enabling you to:

  - [steal load] JS, CSS, LESS, and CoffeeScript files and build them into a single production file.
  - [steal.generate generate] an application file/folder structure, complete with test, build and documentation scripts.
  - [steal.get install] 3rd party dependencies.
  - [steal.clean clean and JSLint] your code.
  - make your Ajax app [steal.html crawlable].
  - log [steal.dev messages] in development that get removed in production builds.

[stealjs StealJS] is a stand-alone tool that can be used without the rest of JavaScriptMVC.

## FuncUnit

[FuncUnit] is a web application testing framework that provides automated unit and 
functional testing.  Tests are written and debugged in the browser with
FuncUnit's short, terse, jQuery-like API.  The same tests can be instantly 
automated, run by Envjs or Selenium.  

FuncUnit also supports extremely accurate [Syn event simulation] on practically every browser and
system.

## DocumentJS

[DocumentJS] provides powerful JavaScript documenting 
capabilities.  This whole website is built with it! DocumentJS can document practically 
anything.  It's extensible.  And with Markdown support, it's easy to document your code.

 */
steal(
'./learn.js',
'./why.js',
'./help.js',
'./developingwithgit.js',
'./folders.js',
'./developingjmvc.js')



