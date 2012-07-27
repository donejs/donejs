@page rapidstart Rapid Start
@parent tutorials 1

This walks through the basics of JavaScriptMVC by building a 
smal todo app.  Check out the [getstarted Getting Started Guide] 
for a more in-depth overview.

## Get JavaScriptMVC

[http://javascriptmvc.com/builder.html Download it] or 
[developwithgit pull it from Git].  JavaScriptMVC (JMVC) is a collection of 5 sub-projects. 
Once you have JavaScriptMVC, you should have a folder with:

    can        - lightweight MVC components
    documentjs - documentation engine
    funcunit   - testing app
    jquery     - [jQuery++](http://jquerypp.com) project, useful collections of jQuery plugins
    steal      - dependency management
    js         - JS command line for Linux/Mac
    js.bat     - JS command line for Windows

<b>Notice</b>: This folder, the one that has the sub-projects, is called the [rootfolder ROOT FOLDER]</b>.

## Get JavaScriptMVC running.

JMVC uses [steal steal/steal.js] for dependency 
management. Steal loads scripts.  To use JavaScriptMVC's 
features like [can.Control] and [can.view],
'steal' them like:

    steal('can/control','can/view/ejs',function(){
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
      <script type='text/javascript'
              src='../steal/steal.js?todos/todos.js'>
      </script>
    </body>
    </html>
    

Open the page in your browser.  Use a debugger like firebug to see _steal.js_ and _todos.js_ loading.

## steal `steal([paths])`

[steal] is used to load scripts, styles, even CoffeeScript, LESS
and templates into your application.  

Path are assumed to be relative to the [rootfolder root folder]. This means that the following always loads `can/construct/construct.js` no matter which file is calling steal:

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

    steal('can/construct', function(){
      can.Construct
    })

For this application, we will load CanJS' most
common plugins.  Add the following to __todos.js__:

    steal('can/util',
         'can/construct/super',
         'can/model',
         'can/util/fixture',
         'can/view/ejs',
         'can/view/modifiers',
         'can/control',
         'can/control/route'
          function(can){
          
    })

The following goes through each plugin while we build the todos app.

## can.Construct `can.Construct([name,] [classProps,] [prototypeProps])`

Constructors made with [can.Construct] are used to create
objects with shared properties. It's used by both
__can.Control__ and __can.Model__.

To create a __Constructor function__ of your own, call __can.Construct__ with the:

  - __name__ of the class which can be used for introspection,
  - __classProperties__ that are attached directly to the constructor, and
  - instance __prototypeProperties__.

__can.Construct__ sets up the prototype chain so subclasses can be further extended and sub-classed as far as you like:

    steal('can/construct', function(){
    
      can.Construct("Todo",{
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


_Brief aside on `super`. If you steal the `can/construct/super` plugin,  can.Construct provides a `_super` method to call the function of the same name higher on the prototype chain like:_


    var SecureNote = Todo({
      allowedToEdit: function(account) {
        return this._super(account) && 
           this.isSecure();
      }
    })


### constructor / init `new Class(arg1, arg2)`

When a constructor is called with the `new` keyword, __can.Construct__ creates the instance and calls [can.Construct.prototype.init] with 
the arguments passed to `new ConstructorFunction(…)`.

    can.Construct('Todo',{
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
[can.Construct.prototype.setup can.Construct.prototype.setup] before init. `setup` can be used to change (or normalize) the arguments passed to __init__._

## Model `can.Model(name, classProperties, prototypeProperties)`

Models are central to any application.  They 
contain data and logic surrounding it.  You 
extend [can.Model can.Model] with your domain specific 
methods and can.Model provides a set of methods 
for managing changes.

To create a __Model__ class, call __can.Model__ with the:

  - __name__ of the class,
  - __classProperties__, including 
    [can.Model.findAll findAll],
    [can.Model.findAll findOne],
    [can.Model.create create],
    [can.Model.update update],
    [can.Model.destroy destroy] properties, and
  - prototype instance properties.

Make a Todo model in __todos.js__ like the following:

    steal('can/util/exports.js',
          'can/construct/super',
          'can/model',
          'can/model/elements',
          'can/util/fixture',
          'can/view/ejs',
          'can/view/modifiers',
          'can/control',
          'can/control/route',
          'can/control/plugin',
          function(){
          
      can.Model('Todo',{
        findAll : "GET /todos",
        findOne : "GET /todos/{id}",
        create  : "POST /todos",
        update  : "PUT /todos/{id}",
        destroy : "DELETE /todos/{id}"
      },
      {})
    });
    
__Note:__ Try the following commands in your browser:

### new can.Model(attributes)

Create a todo instance like:

    var todo = new Todo({name: "do the dishes"});
    
### attr `model.attr( name, [value] )`

[can.Model.prototype.attr] reads or sets properties on model instances.

    todo.attr('name') //-> "do the dishes"
    
    todo.attr('name', "wash the dishes" );
    
    todo.attr() //-> {name: "wash the dishes"}
    
    todo.attr({name: "did the dishes"});
    
### Talking to the server

Model uses static [can.Model.findAll findAll],
[can.Model.findAll findOne], [can.Model.create create],
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

### can.fixture `can.fixture(url, fixture(original, settings, headers) )`

Fixtures simulate requests to a specific url.  The `fixture` function is called with:

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

  // our list of todos
  var TODOS = [
        {id: 1, name: "wake up"},
        {id: 2, name: "take out trash"},
        {id: 3, name: "do dishes"}
    ];
    // findAll
    can.fixture("GET /todos", function(){
      return [TODOS]
    });
    
    // findOne
    can.fixture("GET /todos/{id}", function(orig){
      return TODOS[(+orig.data.id)-1];
    })
    
    // create
    var id= 4;
    can.fixture("POST /todos", function(){
      return {id: (id++)}
    })
    
    // update
    can.fixture("PUT /todos/{id}", function(){
      return {};
    })
    
    // destroy
    can.fixture("DELETE /todos/{id}", function(){
      return {};
    })

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

### bind `todo.bind( event, handler(ev, todo ) )`

Listening to changes in the Model is what MVC is about.  Model lets you [can.Model::bind bind] to changes on an individual instance or [can.Model.bind all instances]. For example, you can listen to when an instance is __created__ on the server like:

    var todo = new Todo({name: "mow lawn"});
    todo.bind('created', function(ev, todo){
      console.log("created", todo );
    })
    todo.save()
    
You can listen to anytime an __instance__ is created on the server by binding on the model:

    Todo.bind('created', function(ev, todo){
      console.log("created", todo );
    })

Model produces the following events on the model class and instances whenever a model Ajax request completes:

  - __created__ - an instance is created on the server
  - __updated__ - an instance is updated on the server
  - __destroyed__ - an instance is destroyed on the server

## View `can.view( idOrUrl, data )`

[can.view can.view] is used to easily create HTML with
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

can.view also takes a __url__ for a template location.  __Create__ a _todos/todos.ejs_ file that contains the following:

    <% for(var i = 0; i < this.length; i++ ){ %>
      <li><%= this[i].name %></li>
    <% } %>

Render this with:

    Todo.findAll( {}, function( todos ){
      console.log( can.view( 'todos.ejs', todos ) );
    });

__can.view__ works with any template language, such
as JAML, jQuery-tmpl, Mustache and superpowers them with:

  - Loading from scripts and external files 
  - using templates with jQuery __modifiers__ like html
  - Template caching
  - Deferred support
  - Bundling processed templates in production builds

### Modifiers - <code>el.<i>modifier</i>( idOrUrl, data )</code>

__can.view__ overwrites the jQuery's html modifiers
after, append, before, html, prepend, replaceWith, and text,
allowing you to write:

    Todo.findAll( {}, function( todos ){
      $('#todos').html( 'todos.ejs', todos );
    });

To make this work, make sure `todos.html` has a `#todos` element like:

    <ul id='todos'></ul>

### Deferreds 

__can.Model__'s ajax methods return a deffered. __can.view__
accepts deferreds, making this hotness possible:

    $('#todos').html('todos.ejs', Todo.findAll() )
    
This syntax will render todos.ejs with the todo instances in the AJAX request made by Todo.findAll, whenever its completed.
You will need to steal the [can.view.modifiers] plugin to enable this functionality.
    
### Hookup `<li <%= (el)-> CODE %> >`

[can.view.hookup] lets you provide 
[http://wiki.ecmascript.org/doku.php?id=strawman:arrow_function_syntax ES5-style arrow function] 
callbacks on elements in your template.  These callback functions get called after the template has been 
inserted into the DOM. You can call jQuery methods on the element like:

    <li <%= ($el) -> $el.fadeIn() %> style='display:none'>
      <%= this[i].name %>
    </li>

In your code, add a __returning__  magic tag (`<%= %>`) that 
matches the _arrow function syntax_.  The argument passed to the function will be the jQuery-wrapped element.  

This lets you hookup model data to elements in EJS.  Change __todos.ejs__ to:

    <% $.each(this, function(i, todo){ %>
      <li <%= ($el) -> $el.data('model', todo).addClass('todo todo_' + todo.id) %>>
        <%= todo.name %>
        <a href="javascript://" class='destroy'>X</a>
      </li>
    <% }) %>

Here we're setting model instance in the element's data and adding classes which will allow us to select this element just by knowing model's id.

## Controller `can.Control(name, classProps, prototypeProps)`

[can.Control] creates organized, memory-leak free, 
rapidly performing, stateful jQuery widgets. It is used to create UI controls like tabs, grids, and contextmenus and used to organize them into higher-order business rules with [can.route]. Its serves as both a traditional view and a traditional controller.
  
Let's make a basic todos widget that lists todos and lets 
us destroy them. Add the following to __todos.js__:

    can.Control("Todos",{
      "init" : function( element , options ){
        this.element.html('todos.ejs', Todo.findAll() )
      }
    })

We can create this widget on the `#todos` element with:

    new Todos('#todos', {});

### init `can.Control.prototype.init(element, options)`

[can.Control::init Init] is called when a
new Controller instance is created.  It's called with:

  - __element__ - The jQuery wrapped element passed to the 
                  controller. Control accepts a raw HTMLElement, a CSS selector, or a NodeList.  This is set as __this.element__ on the controller instance.
  - __options__ - The second argument passed to new Control, extended with
                  the Control's static __defaults__. This is set as 
                  __this.options__ on the controller instance.

and any other arguments passed to `new Control()`.  For example:

    can.Control("Todos",
    {
      defaults : {template: 'todos.ejs'}
    },
    {
      "init" : function( element , options ){
        element.html(options.template, Todo.findAll() )
      }
    })
    
    new Todos( document.body.firstElementChild );
    new Todos( '#todos', {template: 'specialTodos.ejs'})

### element `this.element`

[can.Control.prototype.element this.element] this.element is the NodeList of a single element, the element the control is created on.

Each library wraps the element differently. If you are using jQuery, the element is wrapped with jQuery( element ).

### options `this.options`

[can.Control.prototype.options this.options] is the second argument passed to `new Control()` merged with the controller's static __defaults__ property.

### Listening to events

Control automatically binds prototype methods that look
like event handlers.  Listen to __click__s on `<li>` elements like:

    can.Control("Todos",{
      "init" : function( element , options ){
        this.element.html('todos.ejs', Todo.findAll() )
      },
      "li click" : function(li, event){
        console.log("You clicked", li.text() )
        
        // let other controls know what happened
        li.trigger('selected');
      }
    })

When an `<li>` is clicked, `"li click"` is called with:

  - The NodeList of a single __element__ that was clicked (each library will wrap this node differently)
  - The __event__ data

Control uses event delegation, so you can add `<li>`s without needing to rebind event handlers.

To destroy a todo when it's `<a href='javascript:// class='destroy'>` link is clicked:

    can.Control("Todos",{
      "init" : function( element , options ){
        this.element.html('todos.ejs', Todo.findAll() )
      },
      "li click" : function(li){
        li.trigger('selected', li.model() );
      },
      "li .destroy click" : function(el, ev){
        // get the li element that has the model
        var li = el.closest('li');
        
        // get the model
        var todo = li.data('model')
        
        //destroy it
        todo.destroy(function(){
          // remove the element
          li.remove();
        });
      }
    })

### Templated Event Handlers Pt 1 `"{optionName}"`

Customize event handler behavior with `"{NAME}"` in
the event handler name.  The following allows customization 
of the event that destroys a todo:

    can.Control("Todos",{
      "init" : function( element , options ){ ... },
      "li click" : function(li){ ... },
      
      "li .destroy {destroyEvent}" : function(el, ev){ 
        // previous destroy code here
      }
    })
    
    // create Todos with this.options.destroyEvent
    new Todos("#todos",{destroyEvent: "mouseenter"})

Values inside `{NAME}` are looked up on the controller's `this.options` and then the `window`.  For example, we could customize it instead like:

    can.Control("Todos",{
      "init" : function( element , options ){ ... },
      "li click" : function(li){ ... },
      
      "li .destroy {Events.destroy}" : function(el, ev){ 
        // previous destroy code here
      }
    })
    
    // Events config
    Events = {destroy: "click"};
    
    // Events.destroy is looked up on the window.
    new Todos("#todos")

The selector can also be templated.

### Templated Event Handlers Pt 2 `"{objectName}"`

Controller can also bind to objects other than `this.element` with templated event handlers.  This is __especially critical__
for avoiding memory leaks that are so common among MVC applications.  

If the value inside `{NAME}` is an object, that object will be 
bound to.  For example, the following tooltip listens to 
clicks on the window:

    can.Control("Tooltip",{
      "{window} click" : function(el, ev){
        // hide only if we clicked outside the tooltip
        if(! this.element.has(ev.target ) {
          this.element.remove();
        }
      }
    })
    
    // create a Tooltip
    new Tooltip( $('<div>INFO</div>').appendTo(el) )
    
This is convenient when needing to 
listen to model updates.  Instead of adding a callback
to `todo.destroy(cb)`, we should be listening to 
__destroyed__ events.  We'll handle __updated__ too:

    can.Control("Todos",{
      "init" : function( element , options ){
        this.element.html('todos.ejs', Todo.findAll() )
      },
      "li click" : function(li){
        li.trigger('selected', li.model() );
      },
      "li .destroy click" : function(el, ev){
        el.closest('.todo')
          .data('model')
          .destroy();
        ev.stopPropagation();
      },
      "{Todo} destroyed" : function(Todo, ev, destroyedTodo){
        this.element.find('.todo_' + destroyedTodo.id).remove();
      },
      "{Todo} updated" : function(Todo, ev, updatedTodo){
        this.element.find('.todo_' + updatedTodo.id)
                    .replaceWith('todos.ejs',[updatedTodo]);
      }
    })
    
    new Todos("#todos");

This is better because it removes the todo's element from the page even if another widget destroyed the todo. Also, this works very well with real-time architectures.

### destroy `controller.destroy()`

[can.Control.prototype.destroy] unbinds a controller's
event handlers and releases its element, but does not remove 
the element from the page. 

    var todo = new Todos("#todos")
    todo.destroy();

When a controller's element is removed from the page
__destroy__ is called automatically.

    new Todos("#todos")
    $("#todos").remove();
    
All event handlers bound with Controller are unbound when the controller is destroyed (or its element is removed).

_Brief aside on destroy and templated event binding. Taken 
together, templated event binding, and controller's automatic
clean-up make it almost impossible to write leaking applications. An application that usesonly templated event handlers on controllers within the bodycould free up all 
data by calling `$(document.body).empty()`._

### on `control.on()`

[can.Control.prototype.on] function rebinds all event handlers. We can use it to make controller listen to a specific model by creating the `update` function that will update controller's `this.options` and then call `this.on()`:

    can.Control('Editor',{
      update : function(options){
        can.extend(this.options, options);
        this.on();
        this.setName();
      },
      // a helper that sets the value of the input
      // to the todo's name
      setName : function(){
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
    editor.update({todo: todo1})
    
    // switch it to the second todo
    editor.update({todo: todo2});

## Routing

[can.route] is the core of JavaScriptMVC's 
routing functionality. It is a [can.Observe] that
updates `window.location.hash` when it's properties change
and updates its properties when `window.location.hash` 
changes. It allows very sophisticated routing behavior ... too
sophisticated for this guide. But, it also handles 
the basics with ease.  

Listen to routes in controller's with special "route" events like:

    can.Control("Routing",{
      "route" : function(){
        // matches empty hash, #, or #!
      },
      "todos/:id route" : function(data){
        // matches routes like #!todos/5
      }
    })

    // create routing controller
    new Routing(document.body);

The `route` methods get called back with the route __data__.  The empty `"route"` will be called with no data. But, `"todos/:id route"`will be called with data like: `{id: 6}`.

We can update the route by changing $.route's data like:

    can.route.attr('id','6') // location.hash = #!todos/6
    
Or we can set the hash ourselves like

    var hash = can.route.url({id: 7}) // #!todos/7
    location.hash = hash;

The following enhances the Routing controller to listen for
`".todo selected"` events and change the `can.route`.  When the
can.route changes, it retrieves the todo from the server
and updates the editor widget.

    can.Control("Routing",{
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
          this.editor.update({todo: todo});
        }, this))
      },
      ".todo selected" : function(el, ev, todo){
        can.route.attr('id',todo.id);
      }
    });
    
    // create routing controller
    new Routing(document.body);

The __Routing__ controller is a traditional controller. It coordinates
between the `$.route`, `Editor` and `Todos`.  `Editor` and `Todos`
are traditional views, consuming models.

If you can understand this, you understand 
everything. Congrats!  [//tutorials/rapidstart/todos.html See it in action].

## FuncUnit

JavaScriptMVC uses [FuncUnit] for testing.  FuncUnit provides an API for writing functional 
tests that simulate clicks and keypresses a user would make.

To create a FuncUnit test:

* Create a test file that steals funcunit and
* Create a funcunit.html page that steals your test file

In the __todos__ directory, make funcunit.html and add the following HTML:

    <html>
      <head>
        <link rel="stylesheet" type="text/css" 
          href="../funcunit/qunit/qunit.css" />
        <script type='text/javascript' 
          src='../steal/steal.js?todos/funcunit.js'></script>
      </head>
      <body>
        <h1 id="qunit-header">Todos Test Suite</h1>
      <h2 id="qunit-banner"></h2>
      <div id="qunit-testrunner-toolbar"></div>
      <h2 id="qunit-userAgent"></h2>
    <div id="test-content"></div>
        <ol id="qunit-tests"></ol>
    <div id="qunit-test-area"></div>
      </body>
    </html>
    
Now make __funcunit.js__ and add the following:

    steal('funcunit', function(FuncUnit){
      
      module('todos')
      
      test('todos test', function(){
        ok(true, "the test loads");
      })
    
    })

Open __funcunit.html__ in your browser.  One test passes.

### Writing a test

We tell the test to open the todos page using [FuncUnit.open S.open]:

    S.open("//todos/todos.html");
    
Once the page is open, we select the first todo and click it:

    S(".todo:first").click();
    
S is a copy of jQuery's $ that adds FuncUnit's API. The editor input will 
now appear.  Tell FuncUnit to wait for this using a [funcunit.waits wait] command:

    S("#editor").val("wake up", "First Todo added correctly");
    
The second parameter is an assertion message.

Replace the test code within the steal callback with the following:

    module('todos', {
      setup: function(){
        S.open("//todos/todos.html");
      }
    })
    
    test('open first todo', function(){
      S(".todo:first").click();
      S("#editor").val("wake up", "First Todo added correctly");
    })
    
Reload __funcunit.html__.  You'll see the page open and run the test in a separate window.

FuncUnit has the ability to provide code coverage stats.  <a href='http://javascriptmvc.com/tutorials/rapidstart/funcunit.html?steal[instrument]=jquery%2Cfuncunit%2Csteal%2Cdocumentjs%2C*%2Ftest%2C*_test.js%2Cmxui%2C*funcunit.js'>Click</a> 
the checkbox next to coverage to 
see a coverage report.  81% isn't bad!  Click Todos.js to see a line by line breakdown.

### Automation

To run these tests automated, run the following from the console:

    ./js funcunit/run selenium todos/funcunit.html

FuncUnit supports [funcunit.integrations integration] with CI tools 
like [funcunit.jenkins Jenkins], build tools like [funcunit.maven maven], 
and running via the [funcunit.phantomjs PhantomJS] headless browser.
