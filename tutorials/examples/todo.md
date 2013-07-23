@page todo Todo
@parent examples 2

## Introduction

In this article we will be learning the basics of [JavaScriptMVC](http://javascriptmvc.com/) and 
the [Model-View-Controller pattern](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) by installing 
and walking through a simple Todo list manager. The separation of the 
application's core logic from its user interface behavior is the hallmark of MVC. By 
working through this exercise you will understand how JavaScriptMVC's particular flavor of this pattern 
enables you to create more flexible and maintainable browser-based applications.

Let's get started!

## Setup

First, clone the application from our [repository](http://github.com/bitovi/todomvc-javascriptmvc) at GitHub, 
and initialize all the necessary submodules. The following commands will get you up and running:

    $ git clone http://github.com/bitovi/todomvc-javascriptmvc
    $ cd todomvc-javascriptmvc
    $ git submodule update --init

Open `todomvc-javascriptmvc/todo/index.html` in your browser. You might have to host it
under a static server.

## Structure

Now let's take a look at the anatomy of our application:

    /todo [top-level, the GitHub repository]
      /can
      /funcunit
      /jquerypp
      /steal
      /todo
        /scripts
        /test
        funcunit.html
        qunit.html
        todo.css
        todo.ejs
        index.html
        todo.js

Breaking it down:

* The `can` folder is where the [CanJS](http://github.com/jupiterjs/canjs) library lives. JavaScriptMVC consists of powerful abstractions like [can.Construct Construct], [can.Model Model], [can.Control Control], and [can.view view]. The `jquerypp` folder contains the [jQuery++](http://github.com/jupiterjs/jquerypp), which provides numerous helpful jQuery plugins like `resize`, `destroyed`, `fastfix`, `json`, and `hover` -- all designed to enhance your life as a JavaScript developer.
* The `steal` folder houses the [Steal](http://github.com/jupiterjs/steal) dependency management system, which is what makes it possible to keep your project organized during development, and compact and fast in production. Steal has two main responsibilities: As a JavaScript library, it facilitates on-demand loading of any resources (scripts, stylesheets, templates, or even user-defined content) your application requires. As a command line utility, it takes care of bundling, compressing, and optimizing your application for deployment.
* The [FuncUnit](http://github.com/jupiterjs/funcunit) testing framework lives in the `funcunit` folder -- think jQuery's excellent Qunit framework plus Selenium and headless (Env.js) support. Basically, qUnit on steroids.
* Lastly, our application files will live in the `todo` folder.

## MVC in JavaScript

MVC is a well-established architectural pattern in software engineering. Without going into too much detail, it states that there should be a clear separation of concerns between the part of the system that represents the application's core logic and state (Model), the part that renders the user interface (View), and the part that coordinates between the two (Control). Since our application consists of only one model, one control, and a handful of templates, we're going to keep all our code in the `todo.js`, `todo.html`, and `todo.ejs` files. (Ordinarily in a JavaScriptMVC application, we'd keep a single component in each file for ease of navigation, but you'll forgive us this time for keeping it simple.)

The diagram below shows how we've broken our application out into model, view, and control layers:

@image ../tutorials/images/todo_arch.png

### Dependencies

If you look at `todo.js` the first thing you'll notice is that all the code is wrapped in a call to the `steal` function:

	steal('todo/models/todo.js', 'todo/controls/todos',
  './todo.less')

In fact, this is true of every JavaScript file in a JavaScriptMVC application: we use `steal` to state our dependencies up-front, which tells the framework what libraries, plugins, stylesheets, etc. we need to load before we can begin. Typically, the final argument to `steal` will be a callback function, which will be executed when all the other dependencies (and _their_ dependencies, and so on...) have been loaded and executed as well. No more worrying whether you forgot any `<script>` tags, or whether you've got them in the right order!

> For our application, we can see that our script requires the [can.Model Model] class (which itself requires the [can.Model.List Model.List] class), the [can.Control Control] class, the EJS [can.view view] templating, a jQuery JSON helper, and our application's stylesheet.

### Model

All models in JavaScriptMVC extend the [can.Model Model] class:

    can.Model('Todo', { /* static properties */ }, 
      { /* instance/prototype properties */ })

> If you need a quick refresher on how to use JVMC's classes, see [can.Construct Construct].

In the case of our application, the `Todo` model represents a single To-do item. Its job is simply to know about the name and completed state of the item, how to persist that information, and how to notify the rest of the application when the item is created, updated, or destroyed.

Since we want our To-do list manager to function without a server, we need some form of persistence in the browser. Sure, cookies are nice, but we're looking to the future -- so lets take advantage of HTML5's LocalStorage! We'll define a `Todo` model class with a static (i.e. shared across all instances), state-of-the-art HTML5 storage mechanism (don't worry too much about what this does). The `localStore` method accepts a callback function which will be invoked with an array of `Todo` object _properties_. All of our CRUD operations will use this helper in order to persist `Todo` items in the system:

	  can.Model('Todo', {
    
	    /**
	     * Gets JSON data from localStorage.  Any changes that 
	     * get made in cb get written back to localStorage.
	     * 
	     * This is unimportant for understanding JavaScriptMVC!
	     */
	    localStore: function(cb){
	      var name = 'todos-jmvc',
	        data = $.evalJSON( window.localStorage[name] || 
            (window.localStorage[name] = '[]') ),
	        res = cb.call(this, data);
	      if(res !== false){
	        can.each(data, function(i, todo) {
	          delete todo.editing;
	        });
	        window.localStorage[name] = $.toJSON(data);
	      }
	    }

Given the `localStorage` helper we've created, we can now define a finder method that returns all `Todos` that the application knows about. Inside the callback, we just iterate over those objects, and create `Todo` models out of them:

    findAll: function(params){
      var def = new can.Deferred();
      this.localStore(function(todos){
        var instances = [],
          self = this;
        can.each(todos, function(todo, i) {
          instances.push(new self(todo));
        });
        def.resolve({data: instances});
      })
      return def;
    }

> _Tip_: Don't let that `new self( ... )` trip you up. Since we're in the static (class) context, `self` simply refers to the `Todo` class itself. Writing `new Todo( ... )` would have the same effect, but this way our code won't break if we ever decide to rename the class to something else.

The static `create` and `update` methods may be called directly, but are most often invoked automatically by the model layer when an instance is saved. The `create` method expects an `attrs` argument to describe the properties of the To-do item we want to create:

      create: function(attrs){
        var def = new can.Deferred();
        this.localStore(function(todos){
          attrs.id = attrs.id || parseInt(100000 *Math.random());
          todos.push(attrs);
        });
        def.resolve({id : attrs.id});
        return def
      }

`Update` is similar to `create`, but rather than adding a new object to local storage, an existing object is looked up and modified in place with `can.extend`:

      update: function(id, attrs){
        var def = new can.Deferred();
        this.localStore(function(todos){
          for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
              var todo = todos[i];
              break;
            }
          }
          can.extend(todo, attrs);
        });
        def.resolve({});
        return def
      }

### Model Lists

One of the really great features of JavaScriptMVC is the [can.Model.List Model.List]. A Model.List gives us a way to manage a collection of models as an aggregate, and (the cool part) be able to respond to and trigger events at the collection level. For our present purposes, we'd like to know how many `Todo` items have been marked as completed:

	  can.Model.List('Todo.List', {
		
			/**
			 * Returns the number of completed todos
			 */
	    completed: function() {
	      // Ensure this triggers on length change
	      this.attr('length');

	      var completed = 0;
	      this.each(function(todo, i) {
	        completed += todo.attr('complete') ? 1 : 0
	      });
	      return completed;
	    }

We'll see how lists really make our lives easier when it comes time to do our view rendering below.

### Control and View

Controls in JavaScriptMVC get their mojo from the [can.Control Control] class. Its job is to attach itself to a DOM element, and organize event handlers using event delegation.

Unlike models, controls and views are inherently tied to the application's user interface, so before we dive into the JavaScript code, let's take a quick look at the basic HTML structure of the application:

	  <div id="todoapp">
	    <header>
	      <h1>Todos</h1>
	      <input id="new-todo" type="text" placeholder="What needs to be done?">
	    </header>
	  </div>
	  
Not much to it! One wrapper element, `#todoapp`, along with a text input for entering new todos.

Now let's take a look at the HTML template of the application in `todo.ejs`:

	<section id="main" class="<%= todos.attr("length") > 0 ? "show" : "" %>">
		<input id="toggle-all" type="checkbox" <%= todos.allComplete() ? "checked" : "" %>>
		<label for="toggle-all">Mark all as complete</label>
		<ul id="todo-list">
			<% list(todos, function( todo ) { %>
				<li class="todo 
					<%= todo.attr("complete") ? "done" : "" %> 
					<%= todo.attr("editing") ? "editing" : "" %>" 
					<%= (el)-> el.data('todo', todo) %>>
					<div class="view">
						<input class="toggle" type="checkbox" <%= todo.attr("complete") ? "checked" : "" %>>
						<label><%= todo.attr("text") %></label>
						<a class="destroy"></a>
					</div>
					<input class="edit" type="text" value="<%= todo.attr("text") %>">
				</li>
			<% }) %>
		</ul>
	</section>
	<footer id="stats" class="<%= todos.attr("length") > 0 ? "show" : "" %>">
		<a id="clear-completed">Clear <%= todos.completed() %> 
			completed item<%= todos.completed() == 1 ? "" : "s" %></a>
		<div id="todo-count"><span><%= todos.remaining() %></span> 
			item<%= todos.remaining() == 1 ? "" : "s" %> left</div>
	</footer>

We've set up the entirety of the HTML along with the data bindings directly in the template! Inside the template, we've included the following items:

* A todo list section that hides itself when there are no todos
* A _Mark all as complete_ checkbox that automatically updates its `checked` value based on whether all of the todos are complete
* A list displaying all todo list items
* A statistics section displaying the current completion state of the todo list

With this document structure in mind, let's create our control:


    can.Control('Todos', {

      // Initialize the Todos list
      init : function(){
        // Render the Todos
        this.element.append(can.view('//todo/todo.ejs', {
          todos: this.options.todos
        }));

        // Clear the new todo field
        $('#new-todo').val('').focus();
      },
      
      // More methods...
      
    });
    
    // Initialize the app
    Todo.findAll({}, function(todos) {
      new Todos('#todoapp', {
        todos: todos
      });
    }); 
    
The `init` method will be called when we initialize the control with `new Todos('#todoapp', ...)`. Upon initialization, we first want to clear the text box and then "focus" it (that is, place the mouse cursor in it). Nothing too unusual here.        

Next, we want to fetch the current collection of To-do items and display them to the user. Now, fetching and rendering data is something we do all the time, and it is very common practice in JavaScript and jQuery programming to perform both of these actions in one place. If we had some helpers lying around for fetching and rendering To-dos, we might do something like this, for example:

    findAllTodos(function(todos){
      $('#list').html(renderTodosHTML(todos))
    })

What's wrong with this kind of approach? Well, nothing is _wrong_ with it, per se. In a simple example like this one, we could probably get away with it. The problem comes as the application scales up in complexity, and there become more and more scenarios that can trigger a refresh of this list. The user may be allowed to create new To-do items manually, or import them from another source -- or even synchronize with another application running in the cloud. If we use this approach, we duplicate this hard-wiring of fetching and rendering all over the application, and make it more brittle and difficult to change in the future.

JavaScriptMVC Control takes a more scalable approach to this problem through its event mechanism. Rather than rendering the list explicitly in the fetch callback, we simply ask the `Todo.List` to perform a `findAll` on itself. When the fetch completes, the control will be initialized via the callback.

Let's look at how new To-do items are created. In a modern web interface, we no longer want to depend on fat forms and submit buttons -- we want to do small bits of work anytime the user performs an appropriate action. Rather than making the user constantly move between the keyboard and mouse, we listen for a press of the Enter key to trigger a save:

    // Listen for when a new Todo has been entered
    '#new-todo keyup' : function(el, ev){
      if(ev.keyCode == 13){
        new Todo({
          text : el.val(),
          complete : false
        }).save(function() {
          el.val('');
        });
      }
    }

Rather than simply rendering the newly created To-do item when the save completes, the `{Todo} created` method will fire, which adds the item to the `Todo.List`:

    // Handle a newly created Todo
    '{Todo} created' : function(list, ev, item){
      this.options.todos.push(item);
    }

Adding the new todo to the existing list will automatically update the list on the page, thanks to our live updating template:

    <% list(todos, function( todo ) { %>
      <li class="todo 
        <%= todo.attr("complete") ? "done" : "" %> 
        <%= todo.attr("editing") ? "editing" : "" %>" 
        <%= (el)-> el.data('todo', todo) %>>
        <div class="view">
          <input class="toggle" type="checkbox" <%= todo.attr("complete") ? "checked" : "" %>>
          <label><%= todo.attr("text") %></label>
          <a class="destroy"></a>
        </div>
        <input class="edit" type="text" value="<%= todo.attr("text") %>">
      </li>
    <% }) %>

You may be wondering what that strange syntax is doing on the second line: `<li class="todo <%= todo.attr("complete") ? "done" : "" %>">`. This little bit of magic is what is known as a hookup. What's happening here is that each Todo model is being bound to its respective list item HTML element. This little binding provides some very important functionality. First, it allows you to easily include variable values within your template. Second, that value will automatically be updated on the page whenever the Todo model changes with no extra effort necessary!

A little note on templated event handlers: the `{Todo}` which appears in the event descriptor references the Todo class and listens to any events that it triggers. Similarly, you can create a templated event handler for `{todos}`, which is the same as the `this.options.todos`. When we bind our control to its DOM element, we tell it about the [can.Model.List Model.List] that we want it to manage:

    new Todos('#todoapp', {
      todos: new Todo.List()
    });

> Any parameters passed into the control's initialization object become available on the `options` property of the control, and also via the {} syntax in event descriptors.

In a similar way, we will listen for the list's "remove" and "update" events. Upon removal of any To-do items, we want to remove it from the list also. Live binding with templates will automatically remove the corresponding DOM elements for any removed To-do items. However, this could also be handled manually:

    // when an item is removed from the list ...
    "{Todo} removed": function(list, ev, items) {
      // handle the removed item
    }

Likewise, the list is automatically updated whenever a To-do item is updated. This can be handled manually as well:

    // when an item is updated
    "{Todo} updated": function(list, ev, item) {
      // handle the updated item
    }
        
## That's It!

JavaScriptMVC enables you to write even the simplest application **the right way** from the start. With a Model that's completely independent from any knowledge of user interface behavior, and a Control that's all ready to scale up to the complexities of modern Web experiences, you won't find yourself rewriting your app over and over again to deliver the goods.