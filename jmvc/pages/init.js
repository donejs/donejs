/*
@page index home

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


## Getting Started

If you are new to the framework, the [getstarted Getting Started Guide] is the best place to start.  
There, you'll install JavaScriptMVC, create an app, test, compress, and document it.  
Or, if you're in a hurry, try the [rapidstart Rapid Start Guide].
  
## How to Use the Docs

Click [#&search=core Core] at the top for links to documentation on each core component.

Use the search box at the top left to find the object, class, attribute, function, page or anything else you are looking for. 

After you've typed a search, click up/down/enter to navigate results in the sidebar.

If you find a method you keep needing to reference, you can favorite it for quick access.  On the right of every page title there is a gray star icon. Click it to save that page as a favorite.  Your favorites are listed when you click "Favorites" on the top right navigation.


## Overview

JavaScriptMVC is comprised of 4 independent projects:

  - [stealjs Steal] - JavaScript and CSS dependency management and build tools
  - [jQueryMX] - jQuery MVC and DOM extensions
  - [FuncUnit] - Functional and Unit Testing framework.
  - [DocumentJS] - Documentation Engine

You can use them together or separately.

## jQueryMX

jQueryMX is a collection of useful jQuery plugins.  You can use 
the [http://javascriptmvc.com/builder.html download builder] to get Steal-less versions of these plugins.

The following highlights some of jQueryMX's core plugins:

### $.Class

$.Class provides simple prototypal inheritance.  It's used by both $.Controller and $.Model.

    // create a Monster Class
	$.Class("Monster",
	
	// static methods 
	{
	
	  // keep a list of all monsters
	  monsters : []
	},
	
	// prototype methods
	{
	
	  // called when a new monster is created
	  init : function(name){
	  
	    // stores a reference to the name
	    this.name = name;
	    this.Class.monsters.push(this);
	  },
	  
	  // a method on monsters
	  speak : function(){
	    alert(this.name + " says hello.")
	  }
	});
	
	// create a monster
    var hydra = new Monster("hydra");	


### $.Model

$.Model encapsulates the service and data layer.  The following connects to a JSON REST service
and adds a helper to let us know if we can destroy a task:

    $.Model("Task",{
      findAll : "GET /tasks.json",
      findOne : "GET /tasks/{id}.json",
      create  : "POST /tasks.json",
      update  : "PUT /tasks/{id}.json",
      destroy : "DELETE /tasks/{id}.json"
    },{
      canDestroy : function(){
        return this.acl.indexOf('w') > -1
      }
    })

Assuming '/tasks.json' returns a JSON array like:

    [{
      "id"       : 1,
      "name"     : "take out trash",
      "acl"      : "rw",
      "createdAt": 1303000731164 // April 16 2011
    },
    {
      "id"       : 2,
      "name"     : "do the dishes",
      "acl"      : "r" ,
      "createdAt": 1303087131164 // April 17 2011
    }]

The following will retrieve all tasks and then destroy tasks that the user is allowed to destroy:

    Task.findAll({}, function(tasks){
      for(var i =0; i < tasks.length; i++){
       
        var task = tasks[i];
        
        if( task.canDestroy() ){
          task.destroy();
        }
      }
    })

Model has a number of other useful features such as:

  - Listening to events
  
      // listen to name changes on a task
      task.bind("name", function(ev, newName){
         alert('task name = '+newName);
      });
      
      //change the task's name
	  task.attr('name', "laundry");

      //listen for Tasks being created:
	  Task.bind("created", function(newTask){
	     // create newTask's html and add it to the page
	  })

  - Converters
  
      $.Model('Task', {
        convert  : {
          'date' : function(raw){
            return new Date(raw)
          }
        },
        attributes : {
          'createdAt' : 'date' 
        }
      })
      
      new Task({
	    createdAt : 1303087131164
	  }).createdAt.getFullYear() // -> 2011

  - Lists
  
     // define a task list
     $.Model.List('Task.List',{
     
       // add a helper method to a collection of tasks
       canDestroyAll : function(){
         return this.grep(function(task){
           return task.canDestroy();
         }).length === this.length
       }
     });
     
     Task.findAll({}, function(tasks){
     
       //tasks is a Task.List
       tasks.canDestroyAll();
     })

  - Deferreds
  
     // make 2 requests, and do something when they are 
	 // both complete
	 
	 $.when( Task.findAll(), People.findAll() )
	   .done(function(tasks, people){
	 
	 })

### $.View

$.View is a template framework.  It allows you to use any template engine in
the same way.  The following loads a template at "task/views/tasks.ejs", renders
it with tasks data, and inserts the result in the '#tasks' element.

    $('#tasks').html('task/views/tasks.ejs', Task.findAll() );

The tasks.ejs file might look like:

    <% $.each(this, function(task){  %>
      <li><%= task.name %></li>
    <% }) %>

Any template engine can be used with $.View.  JavaScriptMVC comes with:

  - EJS
  - JAML
  - MICRO
  - jQuery.tmpl

### $.Controller

$.Controller is a jQuery widget factory. The following creates a 'list' plugin
that writes a message into an element:

    $.Controller("List",{
      init : function(){
        this.element.text(this.options.message)
      }
    })

	// create the list
	$('#list').list({message: "Hello World"});

$.Controller lets you define default options:

    $.Controller("List",{
      defaults : {
        message : "I am list"
      }
    },{
      init : function(){
        this.element.text(this.options.message)
      }
    })

    // create's a list that writes "I am list"
	$('#list').list();

Controller's best feature is that it organizes your event handlers, and 
makes binding and unbinding event handlers extremely easy. The following writes
task names in a ul, and alert's the task name when a task is clicked:

    $.Controller("TaskList",{
      init : function(){
        // uses a view to render tasks
        this.element.html("tasks.ejs", Task.findAll())
      },
      "li click" : function(el){
        alert( el.text() )
      }
    })

Controller makes it easy to parameterize event binding.  The following listens for
tasks being created and inserts them into the list:

    $.Controller("TaskList",{
      init : function(){
        // uses a view to render tasks
        this.element.html("tasks.ejs", Task.findAll())
      },
      "{Task} created" : function(Task, ev, newTask){
        this.element.append("tasks.ejs",[newTask])
      }
    })

Finally, this makes it very easy to create widgets that work with any model:

    $.Controller("\List",{
      init : function(){
        // uses a view to render tasks
        this.element.html(this.options.view, this.options.model.findAll())
      },
      "{model} created" : function(Model, ev, instance){
        this.element.append(this.options.view,[instance])
      }
    });
    
    $("#tasks").list({model: Task, view: 'tasks.ejs'});
    $("#people").list({model: Person, view: 'people.ejs'});

### Special Events and Dom Extensions

JavaScriptMVC comes packed with jQuery special events like drag-drop and useful DOM extensions. Check them out!

## Steal

Steal is a dependency management and build tool system.  To load scripts, first load 
steal/steal.js in your page and point it to the first JavaScript file you want to load like:

    <script type='text/javascript'
            src='../../steal/steal.js?taskmanager/taskmanager.js'>

<b>Note:</b> The path to script.js should be given relative to JavaScriptMVC's root folder.

### Loading other scripts

To load other scripts, css, and files, simply 'steal' them relative to the current file. 

    steal('../list/list','models/task').css('taskmanager')
    
Typically, once all your dependencies are loaded, you'll want to do 
something with them.  Pass a function to steal (aliased as <code>.then</code>) to run
some code once all prior dependencies have completed.  The previous example might look like:

    steal('../list/list','models/task')
          .css('taskmanager').then(function($){
    
      $('#tasks').list({model: Task})      
    
    })

You could also write steal('../list/list') like:

    steal('//list/list');
    
Script paths that start with '//' load relative to JMVC's root folder.

Steal encourages you to organize you plugins and apps in a folder structure like:

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

Make your page load the production version of your app, instead of 
loading <b>steal.js</b>, load steal.<b>production</b>.js like:

    <script type='text/javascript'
            src='../../steal/steal.production.js?taskmanager/taskmanager.js'>

## FuncUnit

FuncUnit provides automated unit and 
functional testing on top of QUnit.  Like every other project, it can be used
independently or within JavaScriptMVC.  

### Unit Tests

To write a Unit test, create a QUnit page (ex taskmanager/qunit.html) that loads 
steal and your test script like:

    <script type='text/javascript'
            src='../../steal/steal.js?taskmanager/taskmanager/test/qunit.js'>

Then steal FuncUnit's qunit plugin, any files you want to test, and write your test:

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
QUnit page (ex taskmanager/funcunit.html) that loads a test script like:

    <script type='text/javascript'
            src='../../steal/steal.js?taskmanager/taskmanager/test/funcunit.js'>  

Then steal the funcunit plugin and write your test:

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

DocumentJS provides powerful JavaScript documenting capabilities.  
This whole website is built with it.  Document a 'class-like' object like:

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

'getstarted',
'install',
'creating',
'documenting',
'testing',
'compressing',
'api',
'download',
'learn',
'why',
'selenium',
'help',
'developingwithgit',
'folders',
'developingjmvc',
'rapidstart',
'//steal/rhino/docs')



