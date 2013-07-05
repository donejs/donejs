@page rapidstart Rapid Start
@parent tutorials 1

@body

This walks through the basics of JavaScriptMVC by building a 
smal todo app.  Check out the [getstarted Getting Started Guide] 
for a more in-depth overview.

## Get JavaScriptMVC

[installing Install JavaScriptMVC]. Once you have JavaScriptMVC, you should have a folder with:

    can            - lightweight MVC components
    documentjs     - documentation engine
    funcunit       - testing app
    jquerypp       - useful collections of jQuery plugins
    steal          - dependency management
    js             - JS command line for Linux/Mac
    js.bat         - JS command line for Windows
    stealconfig.js - configuration file for script loading


<b>Notice</b>: The folder that has these sub-projects is called the [rootfolder root folder].

## Get JavaScriptMVC running.

JMVC uses [steal steal/steal.js] for dependency 
management. Steal loads scripts, CSS and more.  To use JavaScriptMVC's 
features like [can.Control] and [can.view],
'steal' them like:

    steal('can/control','can/view/ejs',function(Control, view){
      //code that uses controller and view goes here
    })

To use steal, you need to add the steal script to 
your page. In the [rootfolder root folder] create a __todos__ folder
and empty __todos.html__ and __todos.js__ that look like:

    ROOT\
        can\
        documentjs\
        jquery\
        funcunit\
        steal\
        todos\
          todos.js
          todos.html

To load _steal.js_ and _todos.js_, make __todos.html__ look like:

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
      <ul id='todos'></ul>
      <input id='editor'/>
      <script src='../steal/steal.js?todos/todos.js'>
      </script>
    </body>
    </html>
    

Open the page in your browser.  Use a debugger like firebug to see _steal.js_ and _todos.js_ loading.

## steal `steal([paths])`

[steal] is used to load scripts, styles, even CoffeeScript, LESS
and templates into your application.  

Paths are assumed to be relative to 
the [rootfolder root folder]. This means that 
the following always loads `can/construct/construct.js` no 
matter which file is calling steal:

    steal('can/construct/construct.js');
    
You can load relative to the current file by adding `./` to the
start of your path like:

    steal('./helpers.js')
    
Steal also supports css, allowing you to steal `todos/todos.css` 
like:

    steal('./todos.css')

Because loading paths like `can/construct/construct.js` is so 
common, if you do not provide an extension like `.js`, steal 
will append the last folder name and `.js`. This makes
the following load `can/construct/construct.js`:

    steal('can/construct')

Steal is an asynchronous loader, so you can't do:

    steal('can/construct')
    can.Construct
    
Instead, do:

    steal('can/construct', function(Construct){
      Construct
    });

Steal calls back functions with the return value
of each module. For example:

    steal('can/control', 
          'can/model',
          function( Control, Model ){

    });

Stealing the `'can'` module steals [canjs CanJS's] core files
and provides the `can` namespace to the callback function. For
example:

    steal('can', function(can){
      can.Model
      can.Control
      can.view
      can.route
    })

For this application, we will load CanJS's most
common plugins.  Add the following to __todos.js__:

    steal('can',
          'can/util/fixture',
          function(can){
          
    })

The following goes through each plugin while we build the todos app.

## can.Construct `can.Construct([name,] [staticProps,] [prototypeProps])`

Constructors made with [can.Construct] are used to create
objects with shared properties. It's used by both
__can.Control__ and __can.Model__.

To create a __Constructor function__ of your own, call __can.Construct__ with the:

  - __staticProperties__ that are attached directly to the constructor, and
  - instance __prototypeProperties__.

__can.Construct__ sets up the prototype chain so subclasses can be further extended and sub-classed as far as you like:

    steal('can/construct', function(Construct){
    
      var Todo = Construct({
        init : function(){},
    
        author : function(){ ... },
    
        coordinates : function(){ ... },
    
        allowedToEdit: function(account) { 
         return true;
        }
      });
    
      var PrivateTodo = Todo({
        allowedToEdit: function(account) {
          return account.owns(this);
        }
      })
    
    });


_Brief aside on `super`. If you steal the [super can.Construct.super] plugin,  can.Construct provides a `_super` method to call the function of the same name higher on the prototype chain like:_


    var SecureNote = Todo({
      allowedToEdit: function(account) {
        return this._super(account) && 
           this.isSecure();
      }
    })


### constructor / init `new ConstructorFunction(arg1, arg2)`

When a constructor is called with the `new` keyword, __can.Construct__ creates 
the instance and calls [can.Construct.prototype.init] with 
the arguments passed to `new ConstructorFunction(…)`.

    var Todo = can.Construct({
      init : function(text) {
        this.text = text
      },
      read : function(){
        console.log(this.text);
      }
    })

    var todo = new Todo("Hello World");
    todo.read()


_Brief aside on __init__.  can.Construct actually calls 
[can.Construct.prototype.setup can.Construct.prototype.setup] before 
init. `setup` can be used to change (or normalize) the arguments 
passed to __init__._

## Model `can.Model(staticProperties, prototypeProperties)`

Models are central to any application.  They 
contain data and logic surrounding it. Extend
[can.Model can.Model] with your domain specific 
methods and can.Model provides a set of methods 
for managing changes.

To create a __Model__ constructor, call __can.Model__ with the:

  - __staticProperties__, including 
    [can.Model.findAll findAll],
    [can.Model.findOne findOne],
    [can.Model.create create],
    [can.Model.update update],
    [can.Model.destroy destroy] properties, and
  - prototype instance properties.

Make a Todo model in __todos.js__ like the following:

    steal('can',
         'can/util/fixture',
          function(can){
          
      Todo = can.Model({
        findAll : "GET /todos",
        findOne : "GET /todos/{id}",
        create  : "POST /todos",
        update  : "PUT /todos/{id}",
        destroy : "DELETE /todos/{id}"
      },
      {});
      
    });
    
__Note:__ We're keeping Todo global so you can try the following commands in your browser:

### new can.Model(attributes)

Create a todo instance like:

    var todo = new Todo({name: "do the dishes"});
    
### attr `model.attr( name, [value] )`

[can.Observe.prototype.attr] reads or sets properties on model instances.

    todo.attr('name') //-> "do the dishes"
    
    todo.attr('name', "wash the dishes" );
    
    todo.attr() //-> {name: "wash the dishes"}
    
    todo.attr({name: "did the dishes"});
    
### Talking to the server

Model uses static [can.Model.findAll findAll],
[can.Model.findOne findOne], [can.Model.create create],
[can.Model.update update], and [can.Model.destroy destroy]
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
[can.fixture].

### can.fixture `can.fixture(url, fixture(request, response(...) ) )`

Fixtures simulate requests to a specific url.  The `fixture` function is called with:

  - __request__ - request object passed to $.ajax
  - __response__ - response callback that specifies the response
  
As a shortcut, if the `fixture` function returns a value, that value
is used as the response data. For example, the following
simulates a `GET` request to `/todos`:

    can.fixture("GET /todos", function(request, response){
    		return [
	        {id: 1, name: "wake up"},
	        {id: 2, name: "take out trash"},
	        {id: 3, name: "do dishes"}
	    ];
    });

`can.fixture(fixtures)` allows you to specify multiple fixtures
at once. To simulate the todo services, add the following within the
steal callback:

    // our list of todos
    var TODOS = [
        {id: 1, name: "wake up"},
        {id: 2, name: "take out trash"},
        {id: 3, name: "do dishes"}
    ]; 
    can.fixture({
      // findAll
      "GET /todos": function(){
        return TODOS
      },
      // findOne
      "GET /todos/{id}": function(orig){
        return TODOS[(+orig.data.id)-1];
      },
      // create
      "POST /todos": function(request){
        TODOS.push(request.data);
        return {id: TODOS.length}
      },
      // update
      "PUT /todos/{id}": function(){
        return {};
      },
      // destroy
      "DELETE /todos/{id}": function(){
        return {};
      }
    });
    

Now you can use Model's ajax methods to CRUD todos.

### findAll `findAll( params, success( todos ), error() )`

[can.Model.findAll findAll] retrieves multiple todos:

    Todo.findAll({}, function( todos ) {
      console.log( todos );
    })

### findOne `findOne( params, success( todo ), error() )`

[can.Model.findOne findOne] retrieves a single todo:

    Todo.findOne({}, function( todo ) {
      console.log( todo );
    })

### save `todo.save( success( todo ), error() )`

[can.Model::save Save] can __create__ 
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

[can.Model.prototype.destroy Destroy] deletes a 
record on the server.  You can do this like:

    var todo = new Todo({name: "mow lawn"});
    todo.save( function(todo){
      console.log("created", todo );
      
      todo.destroy( function( todo ) {
        console.log("destroyed", todo );
      })
    })

### bind `todo.bind( event, handler( ev, todo ) )`

Listening to changes in the Model is what MVC is about. Model 
lets you [can.Model::bind bind] to changes on an individual 
instance or [can.Model.bind all instances]. For example, you can listen to 
when an instance is __created__ on the server like:

    var todo = new Todo({name: "mow lawn"});
    todo.bind('created', function(ev, todo){
      console.log("created", todo );
    })
    todo.save()
    
You can listen to anytime an __instance__ is created on the server by binding on the model:

    Todo.bind('created', function(ev, todo){
      console.log("created", todo );
    })

Model produces the following events on the model constructor and instances whenever a model Ajax request completes:

  - __created__ - an instance is created on the server
  - __updated__ - an instance is updated on the server
  - __destroyed__ - an instance is destroyed on the server

## can.view `can.view( idOrUrl, data )`

[can.view] is used to easily create HTML with
JS templates. Pass it ...

  - the __id__ of a script tag to use as the content of the template
  - __data__ to pass to the template
  
... and it returns the rendered result of the template.  For
example, add the following to __todos.html__:

    <script type='text/ejs' id='todosEJS'>
      <% for(var i = 0; i < this.length; i++ ){ %>
        <li><%= this[i].name %></li>
      <% } %>
    </script>

Render a list of todos with:

     Todo.findAll( {}, function( todos ){
         console.log( can.view( 'todosEJS', todos ) );
     });

can.view also takes a __url__ for a template location.  __Create__ a _todos/todos.ejs_ file that 
contains the following:

    <% this.each(function(todo){ %>
      <li><%= todo.attr('name') %></li>
    <% }) %>

Render this with:

    Todo.findAll( {}, function( todos ){
      console.log( can.view( 'todos.ejs', todos ) );
    });

__can.view__ works with [can.EJS] and [can.Mustache].

### stealing templates

Use __steal__ to load and eventually package 
templates. Steal `todos.ejs` in `todos.js` like:

    steal('can',
          './todos.ejs',
          'can/util/fixture',
          function( can, todoEJS ) {

`todosEJS(data)` takes data to render the template and returns
a documentFragment. Render `todos.ejs` like:

    Todo.findAll( {}, function( todos ){
      $('#todos').html( todosEJS( todos ) );
    });

To make this work, make sure `todos.html` has a `#todos` element like:

    <ul id='todos'></ul>
    
### Hookup `<li <%= (el)-> CODE %> >`

[jQuery.fn.hookup can.view.hookup] lets you provide 
[ES5-style arrow function](http://wiki.ecmascript.org/doku.php?id=strawman:arrow_function_syntax)
callbacks on elements in your template.  These callback functions get called after the template has been 
inserted into the DOM. You can call jQuery methods on the element like:

    <li <%= ($el) -> $el.fadeIn() %> style='display:none'>
      <%= this[i].name %>
    </li>

In your code, add a __returning__  magic tag (`<%= %>`) that 
matches the _arrow function syntax_.  The argument passed to the 
function will be the jQuery-wrapped element.  

This lets you hookup model data to elements in EJS.  Change __todos.ejs__ to:

    <% this.each(function(todo){ %>
      <li <%= (el) -> el.data('todo', todo) %> class='todo'>
        <%= todo.attr('name') %>
        <a href="javascript://" class='destroy'>X</a>
      </li>
    <% }) %>

Here we're setting model instance in the element's data and 
adding classes which will allow us to select this element just by knowing model's id.

## can.Control `can.Control(staticProps, prototypeProps)`

[can.Control] creates organized, memory-leak free, 
rapidly performing, stateful controls. It is used to create 
UI controls like tabs, grids, and contextmenus and used 
to organize them into higher-order business rules 
with [can.route]. Its serves as both a traditional view 
and a traditional controller.
  
Let's make a basic todos widget that lists todos and lets 
us destroy them. Add the following to __todos.js__:

    var Todos = can.Control({
      init: function( element , options ){
        Todo.findAll({}, function(todos){
          element.html( todosEJS( todos ) );
        });
      }
    })

We can create this widget on the `#todos` element with:

    new Todos('#todos', {});

### init `can.Control.prototype.init(element, options)`

[Init](can.Control) is called when a
new Controller instance is created.  It's called with:

  - __element__ - The jQuery wrapped element passed to the 
                  controller. Control accepts a raw HTMLElement, a CSS selector, or a NodeList.  This is set as __this.element__ on the control instance.
  - __options__ - The second argument passed to new Control, extended with
                  the Control's static __defaults__. This is set as 
                  __this.options__ on the controller instance.

### Listening to events

Control automatically binds prototype methods that look
like event handlers.  Listen to __click__s on `<li>` elements like:

    var Todos = can.Control({
      init: function( element , options ){
        Todo.findAll({}, function(todos){
          element.html( todosEJS( todos ) );
        });
      },
      "li click": function(li, event){
        console.log("You clicked", li.text() )
        
        // let other controls know what happened
        li.trigger('selected', li.data('todo') );
      }
    });

When an `<li>` is clicked, `"li click"` is called with:

  - The NodeList of a single __element__ that was clicked
  - The __event__ data

Control uses event delegation, so you can add `<li>`s without needing to rebind event handlers.

To destroy a todo when it's `<a href='javascript:// class='destroy'>` link is clicked:

    var Todos = can.Control({
      init: function( element ){
        Todo.findAll({}, function(todos){
          element.html( todosEJS( todos ) );
        });
      },
      "li click": function(li){
        li.trigger('selected', li.data('todo') );
      },
      "li .destroy click": function(el, ev){
        // get the li element that has the model
        var li = el.closest('li');
        
        // get the model and destroy it
        li.data('todo').destroy();
      }
    })

Notice that when a todo instance is destroyed, it is
automatically removed from the page. This is live-binding
in action and it is AMAZING!

It works because [can.EJS] live-binds to [can.Observe can.Observe]s 
and [can.Observe.List can.Observe.List]s. When a List or
Observe changes, EJS will update the DOM to reflect the 
changes. `todos` is a [can.Model.List] which inherits from
[can.Observe.List] and each `todo` is a [can.Model] which
inherits from [can.Observe].

When the `todo` is destroyed, it removes that instance from
`todos`. When `todos` is updated, the page is updated.

### Templated Event Handlers `"{objectName}" event`

can.Control can bind to objects other than `this.element` with templated 
event handlers. This is __critical__
for avoiding memory leaks that are so common 
among MVC applications.  

When can.Control sees a method like `"{objectName} event"`, it looks 
for `objectName` on the control's options (`this.options`) and then 
the `window`.

For example `"{todo} updated"` listens to updated events on
the todo passed the following `Editor` control.


    Editor = can.Control({
      init: function(){
        this.setName();
      },
      setName : function(){
        this.element.val(this.options.todo.name);
      },
      "{todo} updated" : function(){
        this.setName();
      },
      // when the input changes
      // update the todo instance
      "change" : function(){
        var todo = this.options.todo
        todo.attr('name',this.element.val() )
        todo.save();
      }
    });
    
    var todo = new Todo({id: 6, name: "trash"});
    
    var editor = new Editor("#editor",{todo: todo});

To make this work, make sure `todos.html` has an "#editor" element:

    <input id='editor' type='text'/>

When the "#editor" element is removed, or `editor` is destroyed,
can.Control will stop listening to `todo`'s updated event, freeing memory
for garbage collection.


### destroy `controller.destroy()`

[can.Control.prototype.destroy] unbinds a control's
event handlers and releases its element, but does not remove 
the element from the page. 

    var editor = new Editor("#todos")
    editor.destroy();

When a controller's element is removed from the page
__destroy__ is called automatically.

    new Editor("#editor")
    $("#editor").remove();
    
All event handlers bound with can.Control are unbound when 
the control is destroyed (or its element is removed).

_Brief aside on destroy and templated event binding. Taken 
together, templated event binding, and control's automatic
clean-up make it almost impossible to write leaking applications. An application 
that uses only templated event handlers on controls within the body could free up all 
data by calling `$(document.body).empty()`._

### on `control.on()`

[can.Control.prototype.on] function rebinds 
all event handlers. The following adds a `todo` method to Editor that
allows it to switch which todo it edits:

    Editor = can.Control({
      todo: function(todo){
        this.options.todo =  todo;
        this.on();
        this.setName();
      },
      // a helper that sets the value of the input
      // to the todo's name
      setName: function(){
        this.element.val(this.options.todo.name);
      },
      // listen for changes in the todo
      // and update the input
      "{todo} updated" : function(){
        this.setName();
      },
      // when the input changes
      // update the todo instance
      "change" : function(){
        var todo = this.options.todo
        todo.attr('name',this.element.val() )
        todo.save();
      }
    });
    
    var todo1= new Todo({id: 6, name: "trash"}),
        todo2 = new Todo({id: 6, name: "dishes"});
    
    // create the editor;
    var editor = new Editor("#editor");
    
    // show the first todo
    editor.todo(todo1);
    
    // switch it to the second todo
    editor.todo(todo2);

## Routing

[can.route] is the core of CanJS's 
routing functionality. It is a [can.Observe] that
updates `window.location.hash` when its properties change
and updates its properties when `window.location.hash` 
changes. It allows very sophisticated routing behavior ... too
sophisticated for this guide. But, it also handles 
the basics with ease.  

Listen to routes in controls with special "route" events like:

    var Routing = can.Control({
      "route" : function(){
        // matches empty hash, #, or #!
      },
      "todos/:id route" : function(data){
        // matches routes like #!todos/5
      }
    })

    // create routing controller
    new Routing(document.body);

`route` methods get called back with 
route __data__.  The empty `"route"` will be called 
with no data. But, `"todos/:id route"` will be called 
with data like: `{id: 6}`.

We can update the route by changing can.route's data like:

    can.route.attr('id','6') // location.hash = #!todos/6
    
Or we can set the hash ourselves like

    var hash = can.route.url({id: 7}) // #!todos/7
    location.hash = hash;

The following enhances the Routing control to listen for
`".todo selected"` events and update `can.route`.  When the
can.route changes, it retrieves the todo from the server
and updates the editor widget.

    Routing = can.Control({
      init : function(){
        this.editor = new Editor("#editor")
        new Todos("#todos");
      },
      // the index page
      "route" : function(){
         $("#editor").hide();
      },
      "todos/:id route" : function(data){
        $("#editor").show();
        Todo.findOne(data, $.proxy(function(todo){
          this.editor.todo(todo);
        }, this))
      },
      ".todo selected" : function(el, ev, todo){
        can.route.attr('id',todo.id);
      }
    });
    
    // create routing controller
    new Routing(document.body);

The __Routing__ control is a traditional controller. It coordinates
between the `can.route`, `Editor` and `Todos`.  `Editor` and `Todos`
are traditional views, consuming models.

If you can understand this, you understand 
everything. Congrats!

## FuncUnit

JavaScriptMVC uses [FuncUnit] for testing.  FuncUnit provides an API 
for writing functional tests that simulate clicks and keypresses a user would make.

To create a FuncUnit test:

* Create a test file that steals funcunit and
* Create a test.html page that steals your test file

In the __todos__ directory, make test.html and add the following HTML:

    <html>
      <body>
        <script src='../steal/steal.js?todos/todos_test.js'></script>
      </body>
    </html>
    
Now make __todos_test.js__ and add the following:

    steal('funcunit', function(S){
      
      module('todos')
      
      test('todos test', function(){
        ok(true, "the test loads");
      })
    
    })

Open __test.html__ in your browser.  One test passes.

### Writing a test

`S` is FuncUnit.  FuncUnit's API is very similar to jQuery's (hence the S). Tell 
the test to open the todos page using [FuncUnit.open S.open]:

    S.open("//todos/todos.html");
    
Once the page is open, select the first todo and click it:

    S(".todo:first").click();
    
Selecting a todo will set the input element's value to the first todo's name. Wait 
for this using a [funcunit.waits wait] command:

    S("#editor").val("wake up", "First Todo added correctly");
    
The second parameter is an assertion message.

Replace the test code within the steal callback with the following:

    module('todos', {
      setup: function(){
        S.open("//todos/todos.html");
      }
    })
    
    test('edit first todo', function(){
      S(".todo:first").click();
      S("#editor").val("wake up", "First Todo added correctly");
    })
    
Reload test.html. You'll 
see the page open and run the test in a separate window.

### Test Coverage

You can see which parts of your app are covered by your tests and which 
parts need more testing using the [steal.instrument steal/instrument] plugin.

To add coverage, add the following code to the very bottom of stealconfig.js:

    steal('steal/instrument', function(instrument){
      instrument({
        ignores: ["jquery","can","funcunit","steal",
                "*/test","*_test.js","*funcunit.js"]
      })
    })

Reload test.html. When the tests are done, you'll see 
overall coverage stats.

@image tutorials/images/coverage1.png


Click the filename to see what lines did and didn't run.

@image tutorials/images/coverage2.png

### Automation

To run these tests automated, run the following from the console:

    ./js funcunit/open/selenium todos/test.html

FuncUnit supports [funcunit.integrations integration] with CI tools 
like [funcunit.jenkins Jenkins], build tools like [funcunit.maven maven], 
and running via the [funcunit.phantomjs PhantomJS] headless browser.
