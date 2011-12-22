@page rapidstart Rapid Start

This walks through the basics of JavaScriptMVC by building a 
smal todo app.  Check out the [getstarted Getting Started Guide] 
for a more in-depth overview.

## How to get JavaScriptMVC:

[download Download it] or [developwithgit pull it from Git].  JavaScriptMVC is a collection of 4 projects. 
Once you have JavaScriptMVC, you should have a folder with:

    documentjs - documentation engine
    funcunit   - testing app
    jquery     - jquery and jQueryMX plugins
    steal      - dependency management
    js         - JS command line for Linux/Mac
    js.bat     - JS command line for Windows

<b>Notice</b>: This folder, the one that has all the JMVC sub projects is called the [rootfolder ROOT FOLDER]</b>.

## How to get JavaScriptMVC running on my page:

JavaScriptMVC uses [steal steal/steal.js] for dependency 
management. Steal loads scripts.  To use JavaScriptMVC's 
features like [jQuery.Controller] and [jQuery.View],
you 'steal' them like:

    steal('jquery/controller','jquery/view/ejs',function(){
       //code that uses controller and view goes here
    })

To do this, you need to add the steal script to 
your page. Lets say you have a folder in the [rootfolder root folder] 
called <code>helloworld</code> that looks like:

    ROOT\
        documentjs\
        jquery\
        funcunit\
        steal\
        todos\
          todos.js
          todos.html

To load <code>steal.js</code> and <code>todos.js</code>, put a script tag in <code>todos.html</code> like:

    <script type='text/javascript'
            src='../steal/steal.js?todos/todos.js'>
    </script>

This loads the steal script and your `todos.js` 
script. Now you can use steal to load other scripts.

## steal `steal([paths])`

[steal] is used to load scripts, styles, even CoffeeScript, LESS
and templates into your application.  

Path are assumed to be relative to the [rootfolder root folder]. This
means that the following always loads `jquery/class/class.js`
no matter which file is calling steal:

    steal('jquery/class/class.js');
    
You can load relative to the current file by adding `./` to the
start of your path like:

    steal('./helpers.js')
    
By default, steal also support css, allowing you to `todos/todos.css` 
like:

    steal('./todos.css')

Because loading paths like `jquery/class/class.js` is so 
common, if you do not provide an extension like `.js`, steal 
will append the last folder name and `.js`. This makes
the following load `jquery/class/class.js`:

    steal('jquery/class')

Steal is an asynchronous loader, so you can't do something like:

    steal('jquery/class')
    $.Class
    
Instead, you have to do:

    steal('jquery/class', function(){
      $.Class
    })

Finally, for this application, we want to load jQueryMX's most
common plugins:

    steal('jquery/class',
          'jquery/controller',
          'jquery/model',
          'jquery/view/ejs',
          'jquery/dom/fixture',
          function($){
          
    })

## $.Class `$.Class([name,] [classProperties,] [prototypeProperties])`

[jQuery.Class] is used to create Constructor functions that create
instance's objects with shared properties. It's used by both
__$.Controller__ and __$.Model__.

To create a __Class__ class of your own, call __$.Class__ with the:

  - __name__ of the class which can be used for introspection,
  - __classProperties__ that are attached directly to the constructor, and
  - instance __prototypeProperties__.

__$.Class__ sets up the prototype chain so subclasses can be further 
extended and sub-classed as far as you like:

    steal('jquery/class', function(){
    
      $.Class("Todo",{
        init : function(){},
    
        author : function(){ ... },
    
        coordinates : function(){ ... },
    
        allowedToEdit: function(account) { 
         return true;
        }
      });
    
      Todo('PrivateTodo',{
        allowedToEdit: function(account) {
          return account.owns(this);
        }
      })
    
    });


_Brief aside on `super`.  $.Class provides a 
`_super` method to call the function of the same name higher 
on the prototype chain like:_


    var SecureNote = Todo({
      allowedToEdit: function(account) {
        return this._super(account) && 
           this.isSecure();
      }
    })


### constructor / init `new Class(arg1, arg2)`

When a class instance is created, __$.Class__ creates the instance and 
calls [jQuery.Class.prototype.init $.Class.prototype.init] with 
the arguments passed to `new Class(...)`.

    $.Class('Todo',{
      init : function(text) {
        this.text = text
      },
      read : function(){
        console.log(this.text);
      }
    })

    var todo = new Todo("Hello World");
    todo.read()


_Brief aside on __init__.  $.Class actually calls 
[jQuery.Class.prototype.setup $.Class.prototype.setup] before 
init.  `setup` can be used to change the arguments passed to __init__._

## Model `$.Model(name, classProperties, prototypeProperties)`

Models are central to any application.  They 
contain data and logic surrounding it.  You 
extend [jQuery.Model $.Model] with your domain specific 
methods and $.Model provides a set of methods 
for managing changes.

To create a __Model__ class, call __$.Model__ with the:

  - __name__ of the class,
  - __classProperties__, including 
    [jQuery.Model.static.findAll findAll],
    [jQuery.Model.static.findAll findOne],
    [jQuery.Model.static.create create],
    [jQuery.Model.static.update update],
    [jQuery.Model.static.destroy destroy] properties, and
  - prototype instance properties.

Make a Todo model like the following:

    steal('jquery/class',
          'jquery/controller',
          'jquery/model',
          'jquery/view/ejs',
          'jquery/dom/fixture',
          function($){
          
      $.Model('Todo',{
        findAll : "GET /todos",
        findOne : "GET /todos/{id}",
        create  : "POST /todos",
        update  : "PUT /todos/{id}",
        destroy : "DELETE /todos/{id}"
      },
      {})
    });

### new $.Model(attributes)

Create a todo instance like:

    var todo = new Todo({name: "do the dishes"});
    
### attr `model.attr( name, [value] )`

[jQuery.Model.prototype.attr] reads or sets properties on model instances.

    todo.attr('name') //-> "do the dishes"
    
    todo.attr('name', "wash the dishes" );
    
    todo.attr() //-> {name: "wash the dishes"}
    
    todo.attr({name: "did the dishes"});
    
### Talking to the server

Model uses the static [jQuery.Model.static.findAll findAll],
[jQuery.Model.static.findAll findOne], [jQuery.Model.static.create create],
[jQuery.Model.static.update update], and [jQuery.Model.static.destroy destroy]
methods to create, read, update and delete 
model instances on the server.  



Now you can call methods on Todo that
make changes on the server.  For example, 
in your console, try:

    Todo.findAll({});

In the console, you'll see it make a request 
to `GET /todos`.

Assuming your server does not have a `/todos` service,
this won't work.  That's ok, we can simulate them with
[jQuery.fixture].

### $.fixture `$.fixture(url, fixture(original, settings, headers) )`

Fixtures simulate requests to a specific 
url.  The `fixture` function is called with:

  - __original__ - original settings passed to $.ajax
  - __settings__ - settings normalized by $.ajax
  - __headers__ - request headers
  
And, it's expected to return an array of the arguments
passed to jQuery's ajaxTransport `completeCallback` system:

    return [ status, statusText, responses, responseHeaders ];

This might look like:

    return [ 200, "success", {json: []}, {} ];
    
If the array only has one item, it's assumed to be the json
data.  

To simulate the todo services, add the following within the
steal callback:

    // findAll
    $.fixture("GET /todos", function(){
      return [[
        {id: 1, name: "wake up"},
        {id: 2, name: "take out trash"},
        {id: 3, name: "do dishes"}
      ]]
    });
    
    // findOne
    $.fixture("GET /todos/{id}", function(orig){
      return {
        id: orig.data.id, name: "some todo"
      }
    })
    
    // create
    var id= 4;
    $.fixture("POST /todos", function(){
      return {id: (id++)}
    })
    
    // update
    $.fixture("PUT /todos/{id}", function(){
      return {};
    })
    
    // destroy
    $.fixture("DELETE /todos/{id}", function(){
      return {};
    })

Now you can use Model's ajax methods to CRUD todos.

### findAll `findAll( params, success( todos ), error() )`

Use __findAll__ to request todos like:

    Todo.findAll({}, function( todos ) {
      console.log( todos );
    })

### findOne `findOne( params, success( todo ), error() )`

    Todo.findOne({}, function( todo ) {
      console.log( todo );
    })

### save `todo.save( success( todo ), error() )`

[jQuery.Model.prototype.save Save] can __create__ 
or __update__ instances depending if the 
instance has already been created or not.

To __create__ a todo on the server, create a
todo instance and call __save__ like the following:

    var todo = new Todo({name: "mow lawn"})
    todo.save(function(todo){
      console.log( todo );
    })

To __update__ a todo on the server, change the attributes
and call __save__ again like the following:

    var todo = new Todo({name: "mow lawn"});
    todo.save( function(todo){
      console.log("created", todo );
      
      todo.attr("name", "mow my lawn")
      todo.save( function( todo ) {
        console.log("updated", todo );
      })
    })

### destroy `todo.destroy( success( todo ), error() )`

[jQuery.Model.prototype.destroy Destroy] deletes a 
record on the server.  You can do this like:

    var todo = new Todo({name: "mow lawn"});
    todo.save( function(todo){
      console.log("created", todo );
      
      todo.destroy( function( todo ) {
        console.log("destroyed", todo );
      })
    })

### bind `todo.bind( event, handler(ev, todo ) )`

Listening to changes in the Model is what MVC 
is about.  Model lets you __bind__ to changes 
on an individual instance or all 
instances. For example, you can listen to 
when an instance is __created__ like:

    var todo = new Todo({name: "mow lawn"});
    todo.bind('created', function(ev, todo){
      console.log("created", todo );
    })
    todo.save()
    
You can listen to anytime a __Model__ is created by 
__bind__ing on the model:

    Todo.bind('created', function(ev, todo){
      console.log("created", todo );
    })

Model produces the following events on 
the model class an instances because of Ajax requests:

  - __created__ - an instance is created on the server
  - __updated__ - an instance is updated on the server
  - __destroyed__ - an instance is destroyed on the server

## View `$.View( idOrUrl, data )`

[jQuery.View $.View] is used to easily create HTML with
JS templates. Pass it:

  - the __id__ of a script tag to use as the content of the template
  - __data__ to pass to the template
  
It returns the rendered result of the template.  For
example, add the following html to your page:

    <script type='text/ejs' id='todosEJS'>
      <% for(var i = 0; i < this.length; i++ ){ %>
        <li><%= this[i].name %></li>
      <% } %>
    </script>

Render a list of todos with:

     Todo.findAll( {}, function( todos ){
         console.log( $.View( 'todosEJS', todos ) );
     });

$.View also takes a __url__ for a template location.  For
example, create a _todos/todos.ejs_ template that 
contains the following:

    <% for(var i = 0; i < this.length; i++ ){ %>
      <li><%= this[i].name %></li>
    <% } %>

Render this with:

    Todo.findAll( {}, function( todos ){
      console.log( $.View( 'todos.ejs', todos ) );
    });

__$.View__ works with any template language, such
as JAML, jQuery-tmpl, Mustache and super-powers them with:

  - Loading from scripts and external files 
  - using templates with jQuery __modifiers__ like html
  - Template caching
  - Deferred support
  - Bundling processed templates in production builds

### Modifiers - <code>el.<i>modifier</i>( idOrUrl, data )</code>

__$.View__ overwrites the jQuery's html modifiers
after, append, before, html, prepend, replaceWith, and text,
allowing you to write:

    Todo.findAll( {}, function( todos ){
      $('#todos').html( 'todos.ejs', todos );
    });

To make this work, add a `#todos` element to `todos.html` like:

    <ul id='todos'></ul>

### Deferreds 

__$.Model__'s ajax methods return a deffered and __$.View__
accepts deferreds, making this hotness possible:

    $('#todos').html('todos.ejs', Todo.findAll() )
    
## Controller `$.Controller(name, classProperties, prototypeProperties)`

[jQuery.Controller] creates organized, memory-leak free, 
rapidly performing jQuery widgets. Its extreme flexibility 
allows it to serve as both a traditional View and a 
traditional Controller.

It is used to create things like 
tabs, grids, and contextmenus as well as organizing them 
into higher-order business rules.
  
Lets start by making a basic todos widget that 
lists todos and lets us destroy them.

    $.Controller("Todos",{
      "init" : function( element , options ){
        this.element.html('todos.ejs', Todo.findAll() )
      }
    })

We can create this widget on the `#todos` element with:

    new Todos('#todos', {} );

### init `$.Controller.prototype.init(element, options)`

[jQuery.Controller.prototype.init Init] is called when a
new Controller instance is created.  It's called with:

  - __element__ - The jQuery wrapped element passed to the 
                  controller.  Controller accepts a jQuery element, a
                  raw HTMLElement, or a css selector.  This is
                  set as __this.element__ on the controller instance.
  - __options__ - The 2nd arguments passed to new Controller, extended with
                  the Controller's static defaults. This is set as 
                  __this.options__ on the controller instance.

and any other arguments passed to `new Controller()`.  For example:

    $.Controller("Todos",
    {
      defaults : {template: 'todos.ejs'}
    },
    {
      "init" : function( element , options ){
        element.html(options.template, Todo.findAll() )
      }
    })
    
    new Todos( document.body.firstElementChild );
    new Todos( $('#todos'), {template: 'specialTodos'})

### element `this.element`

[jQuery.Controller.prototype.element this.element] is the jQuery-wrapped
element the controller is created on. 

### options `this.options`

[jQuery.Controller.prototype.options this.options] is the 2nd argument passed to 
new Controller merged with the controller's static defaults property.

### Listening to events

Controller is awesome at listening to events.  

### element `this.element`

The element

### options `this.options`

Merged.

## How to test:

JavaScriptMVC uses [FuncUnit] for testing.  FuncUnit supports two types of testing:

  - functional - simulate clicks and keypresses a user would make.
  - unit - call directly to JS methods and test the results.

But you start creating these tests in the same way - by making a test page
and a test script. Lets say you wanted to
test <code>helloworld.js</code> and <code>helloworld.html</code>.  Without code generators,
you add 4 files to make helloworld look like:

    helloworld\
        helloworld.html
        helloworld.js
        funcunit.html
        funcunit.js
        qunit.html
        qunit.js

Put the following in qunit.html:

    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="../funcunit/qunit/qunit.css" />
        <script type='text/javascript' src='../steal/steal.js?helloworld\qunit.js'></script>
      </head>
      <body>
        <h1 id="qunit-header">Hello World Unit Test Suite</h1>
    	<h2 id="qunit-banner"></h2>
    	<div id="qunit-testrunner-toolbar"></div>
    	<h2 id="qunit-userAgent"></h2>
		<div id="test-content"></div>
        <ol id="qunit-tests"></ol>
		<div id="qunit-test-area"></div>
      </body>
    </html>

funcunit.html will look the same except change <code>qunit.js</code> to <code>funcunit.js</code>.

qunit.js might look like:

    steal.plugins('funcunit/qunit').then('//helloworld/helloworld', function(){
      
      module('helloworld')
      
      test('something is there', function(){
        ok(helloworld, "there's an object called helloworld");
      })
    
    })

funcunit.js might look like:

    steal.plugins('funcunit').then( function(){
      
      module('helloworld',{
        setup : function(){
          S.open('//helloworld/helloworld.html');
        }
      })
      
      test('The page says hello world', function(){
        ok(S(':contains(hello world)').size(), "The page says hello world");
      })
    
    })

To run these tests, you can either open the test page with your browser, or with envjs:

    funcunit\envjs helloworld\funcunit.html
    funcunit\envjs helloworld\qunit.html

