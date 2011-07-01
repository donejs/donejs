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


Welcome to the happy path. This page demonstrates many of JavaScriptMVC's most important 
features. If you are new to the framework, this page followed by 
the [getstarted Getting Started Guide] is the best place to start.

The [getstarted Getting Started Guide] walks you through 
creating, testing, minifiying, and documenting an application. Or, if you're in crazy 
hurry, try the [rapidstart Rapid Start Guide].
  
## How to Use the Docs

Click [#&search=core Core] at the top for links to documentation on each core component.

Use the search box at the top left to find the object, class, attribute, function, page or anything else you are looking for. 

After you've typed a search, click up/down/enter to navigate results in the sidebar.

If you find a method you keep needing to reference, you can favorite it for quick access.  On the right of every page title there is a gray star icon. Click it to save that page as a favorite.  Your favorites are listed when you click "Favorites" on the top right navigation.


## Overview

JavaScriptMVC is comprised of 4 independent projects:

  - [jquerymx jQueryMX] - jQuery MVC and DOM extensions
  - [stealjs StealJS] - JavaScript and CSS dependency management and build tools
  - [FuncUnit] - Functional and Unit Testing framework.
  - [DocumentJS] - Documentation Engine

You can use them together or 
separately (via the [http://javascriptmvc.com/builder.html download builder]). This
page highlights what is in each project.  Click the the project links on the left for 
a more in-depth overview of each project.

## jQueryMX

[jquerymx jQueryMX] is a collection of mega-useful jQuery plugins. They provide 
functionality missing from jQuery necessary to implement and organize
large-scale jQuery applications.

### $.Class

[jQuery.Class $.Class] provides simple prototypal 
inheritance.  It's used by [jQuery.Controller $.Controller] and 
[jQuery.Model $.Model].

	$.Class( NAME , STATIC_PROPS, PROTOTYPE_PROPS );

### $.Model

[jQuery.Model $.Model] encapsulates the service and data layer.  It helps you 

  - Create, retrieve, update, and delete data on the server.
  - Convert service data to more useful JS data. EX: "April 18, 2011" to new Date(2011,3,18).
  - Listen to changes in data
  - Data validation
    
### $.View

[jQuery.View $.View] is a client-side template framework. It 
super-powers client-side templating libraries, giving them

  - Convenient and uniform syntax
  - Template loading from html elements or external files
  - Synchronous or asynchronous template loading
  - Template preloading
  - Caching of processed templates
  - Bundling of processed templates in production builds
  - $.Deferred support

### $.Controller

[jQuery.Controller $.Controller] is a jQuery widget factory that specializes in preventing
memory leaks. 

The following creates a <code>$.fn.list</code> [jquery.controller.plugin plugin] that writes 
a message into an element:

    $.Controller( "List", {
      init: function( ) {
        this.element.text( this.options.message );
      }
    });

	// create the list
	$('#list').list({message: "Hello World"});

### Special Events and Dom Extensions

JavaScriptMVC comes packed with jQuery [specialevents special events]
(like [jQuery.Drag drag]-[jQuery.Drop drop]) and 
useful [dom DOM extensions] (like [jQuery.fixture $.fixture]). Check them out!

## StealJS

[stealjs StealJS] is a dependency management and build system.  To 
load scripts, first load <code>[steal steal/steal.js]</code> in your page and point 
it to the first JavaScript file you want to load like:

    <script type='text/javascript'
            src='../../steal/steal.js?taskmanager/taskmanager.js'>

<b>Note:</b> The path to script.js should be given relative to 
JavaScriptMVC's [rootfolder root folder].

### Loading other scripts

To load other scripts, css, and files, simply 
'steal' them relative to the current file. 

    steal('../list/list','models/task').css('taskmanager')
    
Typically, once all your dependencies are loaded, you'll want to do 
something with them.  Pass a function to 
steal (aliased as <code>.[steal.static.then]</code>) to run
code once all prior dependencies have completed.  <code>taskmanager.js</code> 
might look like:

    steal('../list/list','models/task')
          .css('taskmanager').then(function($){
    
      $('#tasks').list({model: Task})      
    
    })

You could also write steal('../list/list') like:

    steal('//list/list');
    
Script paths that start with '//' load relative to JMVC's root folder.

Steal encourages you to organize your plugins and apps 
in a folder structure like:

    plugin\
      plugin.js
      plugin.html
      plugin_test.js
      plugin_test.html
      views\
      
    app\
      app.js
      app.html
      models\
      views\
      test\
      scripts\
      
To make creating files and folders like this easy, Steal includes generators that create this structure:

    windows   > js jquery\generate\plugin plugin
    windows   > js jquery\generate\app app
    
    linux/mac > ./js jquery/generate/plugin plugin
    linux/mac > ./js jquery/generate/app app

To make loading files like this easy, steal.plugins loads files named in this way relative to JMVC's root:

    steal.plugins(
      'list',              // loads //list/list.js
      'jquery/event/drag'  // loads //jquery/event/drag/drag.js
      )

### Building scripts

If you used the application generator to create an application, to combine and minifiy your scripts into
a single production build, run:

    windows   > js app\scripts\build.js
    linux/mac > ./js app/scripts/build.js

### Using the production build

To load the production version of your app, change your page's script tag
from <b>steal.js</b>, to steal.<b>production</b>.js like:

    <script type='text/javascript'
            src='../../steal/steal.production.js?taskmanager/taskmanager.js'>

## FuncUnit

[FuncUnit] provides automated unit and 
functional testing on top of [http://docs.jquery.com/QUnit QUnit].  Like every other project, 
it can be used independently or within JavaScriptMVC.  

### Unit Tests

To write a Unit test, create a [http://docs.jquery.com/QUnit QUnit page] 
(ex <code>taskmanager/qunit.html</code>) that loads 
steal and your test script like:

    <script type='text/javascript'
            src='../../steal/steal.js?taskmanager/taskmanager/test/qunit.js'>

Then steal FuncUnit's <code>qunit</code> plugin, any files you want to test, and write your test:

    steal.plugins('funcunit/qunit')
         .then('//taskmanager/models/task', function(){
         
         module("Task Model")
         
         test('findAll', function(){
         
           stop()
           Task.findAll({}, function(tasks){
             ok(tasks.length > 0, "We found at least 1 task");
             start();
           });
           
         });
         
    })

To run your tests, open the qunit.html page in your favorite browser or with Envjs's headless browser like:

    windows   > funcunit\envjs taskmanager\qunit.html
    linux/mac > ./funcunit/envjs taskmanager/qunit.html

### Functional Tests

To write a Functional test, the process is very similar.  Create a 
[http://docs.jquery.com/QUnit QUnit page] (ex <code>taskmanager/funcunit.html</code>) that 
loads a test script like:

    <script type='text/javascript'
            src='../../steal/steal.js?taskmanager/taskmanager/test/funcunit.js'>  

Then steal the <code>funcunit</code> plugin and write your test:

    steal.plugins('funcunit')
         .then(function(){
         
         module("Task Manager",{
           setup : function(){
             S.open('//taskmanager/taskmanager.html');
             
             //wait for tasks to exist
			 S('li').exit()
           }
         })
         
         test('creating a task', function(){
            
            // enter a task name and submit the form
            S('input[name=name]').type('Do the dishes\n');
            
            // make sure the new task is present
			S('li:contains(Do the dishes)').exists(function(){
			  ok(true, "created a task")
			});
         })
         
    })

To run your funcunit test, open the funcunit.html page in your favorite browser or with Envjs's headless browser like:

    windows   > funcunit\envjs taskmanager\qunit.html
    linux/mac > ./funcunit/envjs taskmanager/qunit.html

## DocumentJS

[DocumentJS] provides powerful JavaScript 
documenting capabilities.  This whole website is built with it.  

Document a 'class-like' object like:

* @codestart
* /*
*  * @@class Customer
*  * @@parent crm 
*  * @@constructor
*  * Creates a new customer.
*  * @@param {String} name
*  *|
*  var Customer = function(name) {
*     this.name = name;
*  }
* @codeend 

If you used the app generator to create an application, you can document your app like:

    windows   > js app\scripts\doc.js
    linux/mac > ./js app/scripts/doc.js

## Beyond the basics

After you've mastered the basics, here is some reading to continue your mastery:

  - [learn Learn] - some FAQs about the bigger picture
  - [http://jupiterjs.com/news/organizing-a-jquery-application Organizing a jQuery Application] - the architecture for assembling an app
  - [http://jupiterjs.com/news/creating-a-javascriptmvc-slider Creating a JavaScriptMVC Slider] - how to create a widget
  - [http://jupiterit.com/news/javascriptmvc-features JavaScriptMVC Features] - features list
  - [http://jupiterjs.com/news/javascriptmvc-3-0-good-to-go JavaScriptMVC 3.0 Good to Go] - what's new in the 3.0 release

 */
steal(
'api',
'download',
'learn',
'why',
'help',
'developingwithgit',
'folders',
'developingjmvc',
'rapidstart')



