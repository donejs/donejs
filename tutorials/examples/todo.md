@page todo Todo
@parent examples 2

## Introduction

In this article we will be learning the basics of [JavaScriptMVC](http://javascriptmvc.com/) and the [Model-View-Controller pattern](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) by installing and walking through a simple To-do list manager. The separation of the application's core logic from its user interface behavior is the hallmark of MVC. By working through this exercise you will understand how JavaScriptMVC's particular flavor of this pattern enables you to create more flexible and maintainable browser-based applications.

Let's get started!

## Setup

First, clone the application from our [repository](http://github.com/jupiterjs/todo) at GitHub, and initialize all the necessary submodules. The following commands will get you up and running:

    $ git clone https://github.com/jupiterjs/todo
    $ cd todo
    $ git submodule update --init

This bundle now contains everything you need to run the application locally. Since there is no server-side dependency, you can now open the `todo/todo.html` file in your browser and see it in action.

@image tutorials/images/todos.png

## Structure

Now let's take a look at the anatomy of our application:

    /todo [top-level, the GitHub repository]
      /jquery
      /steal
      /funcunit
      /todo
        /scripts
        /test
        funcunit.html
        qunit.html
        todo.css
        todo.html
        todo.js
        ...

Breaking it down:

* The `jquery` folder is where the [jQueryMX](http://github.com/jupiterjs/jquerymx) library lives. JavaScriptMVC consists of powerful abstractions like [jQuery.Class $.Class], [jQuery.Model $.Model], [jQuery.Controller $.Controller], and [jQuery.View $.View], as well as numerous helpful jQuery plugins like `resize`, `destroyed`, `closest`, `curStyles`, and `route` -- all designed to enhance your life as a JavaScript developer.
* The `steal` folder houses the [Steal](http://github.com/jupiterjs/steal) dependency management system, which is what makes it possible to keep your project organized during development, and compact and fast in production. Steal has two main responsibilities: As a JavaScript library, it facilitates on-demand loading of any resources (scripts, stylesheets, templates, or even user-defined content) your application requires. As a command line utility, it takes care of bundling, compressing, and optimizing your application for deployment.
* The [FuncUnit](http://github.com/jupiterjs/funcunit) testing framework lives in the `funcunit` folder -- think jQuery's excellent Qunit framework plus Selenium and headless (Env.js) support. Basically, qUnit on steroids.
* Lastly, our application files will live in the `todo` folder.

## MVC in JavaScript

MVC is a well-established architectural pattern in software engineering. Without going into too much detail, it states that there should be a clear separation of concerns between the part of the system that represents the application's core logic and state (Model), the part that renders the user interface (View), and the part that coordinates between the two (Controller). Since our application consists of only one model, one controller, and a handful of templates, we're going to keep all our code in the `todo.js` and `todo.html` files. (Ordinarily in a JavaScriptMVC application, we'd keep a single component in each file for ease of navigation, but you'll forgive us this time for keeping it simple.)

The diagram below shows how we've broken our application out into model, view, and controller layers:

@image tutorials/images/todo_arch.png

### Dependencies

If you look at `todo.js` the first thing you'll notice is that all the code is wrapped in a call to the `steal` function:

    steal('jquery/model/list',
          'jquery/controller',
          'jquery/view/ejs',
          'jquery/lang/json',
          './todo.css',
          function($){ ... })

In fact, this is true of every JavaScript file in a JavaScriptMVC application: we use `steal` to state our dependencies up-front, which tells the framework what libraries, plugins, stylesheets, etc. we need to load before we can begin. Typically, the final argument to `steal` will be a callback function, which will be executed when all the other dependencies (and _their_ dependencies, and so on...) have been loaded and executed as well. No more worrying whether you forgot any `<script>` tags, or whether you've got them in the right order!

> For our application, we can see that our script requires the [jQuery.Model.List $.Model.List] class (which itself requires the [jQuery.Model $.Model] class), the [jQuery.Controller $.Controller] class, a jQuery JSON helper, and our application's stylesheet.

### Model

All models in JavaScriptMVC extend the [jQuery.Model $.Model] class:

    $.Model('Todo', { /* static properties */ }, { /* instance/prototype properties */ })

> If you need a quick refresher on how to use JVMC's classes, see [jQuery.Class $.Class].

In the case of our application, the `Todo` model represents a single To-do item. Its job is simply to know about the name and completed state of the item, how to persist that information, and how to notify the rest of the application when the item is created, updated, or destroyed.

Since we want our To-do list manager to function without a server, we need some form of persistence in the browser. Sure, cookies are nice, but we're looking to the future -- so lets take advantage of HTML5's LocalStorage! We'll define a `Todo` model class with a static (i.e. shared across all instances), state-of-the-art HTML5 storage mechanism (don't worry too much about what this does). The `localStore` method accepts a callback function which will be invoked with an array of `Todo` object _properties_. All of our CRUD operations will use this helper in order to persist `Todo` items in the system:

    $.Model('Todo', {
      /**
       * Gets JSON data from localStorage.  Any changes that 
       * get made in cb get written back to localStorage.
       * 
       * This is unimportant for understanding JavaScriptMVC!
       */
      localStore: function(cb){
        var name = this.shortName,
          data = $.evalJSON(window.localStorage[name] || (window.localStorage[name] = "{}")),
          res = cb.call(this, data);
        if(res !== false){
          window.localStorage[name] = $.toJSON(data);
        }
      }

Given the `localStorage` helper we've created, we can now define a finder method that returns all `Todos` that the application knows about. Inside the callback, we just iterate over those objects, and create `Todo` models out of them:

      findAll: function(params, success){
        this.localStore(function(todos){
          var instances = [];
          for(var id in todos){
            instances.push(new this(todos[id]))
          }
          success && success(instances)
        })
      }

> _Tip_: Don't let that `new this( ... )` trip you up. Since we're in the static (class) context, `this` simply refers to the `Todo` class itself. Writing `new Todo( ... )` would have the same effect, but this way our code won't break if we ever decide to rename the class to something else.

The rest of the CRUD methods are similar enough, so we won't go through each one individually.

### Model Lists

One of the really great features of JavaScriptMVC is the [jQuery.Model.List $.Model.List]. A Model.List gives us a way to manage a collection of models as an aggregate, and (the cool part) be able to respond to and trigger events at the collection level. For our present purposes, we'd like to have a list of `Todo` items that can tell us which ones have been marked as completed:

    $.Model.List('Todo.List', {
      /**
       * Return a new Todo.List of only complete items
       */
      completed : function(){
        return this.grep(function(item){
          return item.complete === true;
        })
      }
    })

> The `grep` method is similar to `jQuery.grep` in that it applies a filter to the list and returns a new list of all items for which the filter is true.

We'll see how lists really make our lives easier when it comes time to do our view rendering below.

### Controller/View

Controllers in JavaScriptMVC get their mojo from the [jQuery.Controller $.Controller] class. Basically, you can think of Controller as a [factory for building jQuery plugins](http://jupiterjs.com/news/organize-jquery-widgets-with-jquery-controller): its job is to attach itself to a DOM element, and organize event handlers using event delegation.

Unlike models, controllers and views are inherently tied to the application's user interface, so before we dive into the JavaScript code, let's take a quick look at the basic HTML structure of the application:

    <div id='todos'>
      <h1>Todos</h1>
      <input type='text' class='create' /> 
      <ul id='list'>
      </ul>
      <div id='todo-stats'>
      </div>
    </div>

Not much to it! One wrapper element -- that's the element we're eventually going to attach the controller to -- and inside that wrapper, the following items:

* A title ("Todos")
* A text box where we're going to add new To-do items
* A list where we'll see all current To-do items
* Another container for "stats" where we'll show a count of what the user has selected, and give them a way to "finish"
  items

With this document structure in mind, let's create our controller:

    $.Controller('Todos', {
      // sets up the widget
      init : function(){
        // empties the create input element
        this.find(".create").val("")[0].focus();
        
        // fills this list of items (creates add events on the list)
        this.options.list.findAll();
      }

The `init` method will be called when we initialize the controller with `$( ... ).todos()`. Upon initialization, we first want to clear the text box and then "focus" it (that is, place the mouse cursor in it). Nothing too unusual here.

> In the context of a controller, the `find` method is like `jQuery.find` in that it searches for a selector underneath the element being managed by the controller.

Next, we want to fetch the current collection of To-do items and display them to the user. Now, fetching and rendering data is something we do all the time, and it is very common practice in JavaScript and jQuery programming to perform both of these actions in one place. If we had some helpers lying around for fetching and rendering To-dos, we might do something like this, for example:

    findAllTodos(function(todos){
      $('#list').html(renderTodosHTML(todos))
    })

What's wrong with this kind of approach? Well, nothing is _wrong_ with it, per se. In a simple example like this one, we could probably get away with it. The problem comes as the application scales up in complexity, and there become more and more scenarios that can trigger a refresh of this list. The user may be allowed to create new To-do items manually, or import them from another source -- or even synchronize with another application running in the cloud. If we use this approach, we duplicate this hard-wiring of fetching and rendering all over the application, and make it more brittle and difficult to change in the future.

JavaScriptMVC Controller takes a more scalable approach to this problem through its event mechanism. Rather than rendering the list explicitly in the fetch callback, we simply ask the `Todo.List` to perform a `findAll` on itself. When the fetch completes, the list fires its own "add" event, which we listen for in the Controller. Conveniently, the "add" event tells us everything we need to know: the list that published the event, the jQuery event that triggered the add, and the To-do items which were added. We use the list template ("todosEJS") to perform the render:

    // adds existing and created to the list
    "{list} add": function(list, ev, items) {

      // uses the todosEJS template (in todo.html) to render a list of items
      // then adds those items to #list
      this.find('#list').append("todosEJS",items)

      // calls a helper to update the stats info
      this.updateStats();
    }

Make note of something important here: the `{list}` which appears in the event descriptor is the same as the `this.options.list` which we saw earlier in our `init` method. When we bind our controller to its DOM element, we tell it about the [jQuery.Model.List $.Model.List] that we want it to manage:

    // create a todos widget with a list
    $("#todos").todos({ list: new Todo.List() })

> Any parameters passed into the controller's initialization object become available on the `options` property of the controller, and also via the {} syntax in event descriptors.

In a similar way, we will listen for the list's "remove" and "update" events. Upon removal of any To-do items, we want to remove it from the list also. Once again, the event gives us all the information we need to know:

    // when an item is removed from the list ...
    "{list} remove": function(list, ev, items) {
  
      // get the elements in the list and remove them
      items.elements(this.element).slideUp(function(){
        $(this).remove();
      });
  
      this.updateStats();
    }

The "update" event is fired for individual items. In this case, we want to render the single item template ("todoEJS") to replace the HTML of the item which was changed:

    // when an item is updated
    "{list} update": function(list, ev, item) {
      item.elements().html("todoEJS", item);
      this.updateStats();
    }

Now, let's look at how new To-do items are created. In a modern web interface, we no longer want to depend on fat forms and submit buttons -- we want to do small bits of work anytime the user performs an appropriate action. Rather than making the user constantly move between the keyboard and mouse, we listen for a press of the Enter key to trigger a save:

    // listens for key events and creates a new todo
    ".create keyup": function(el, ev) {
      if(ev.keyCode == 13){
        new Todo({
          text: el.val(),
          complete: false
        }).save(this.callback('created'));

        el.val("");
      }
    }

Remember our discussion above about decoupling fetching from rendering? It applies here, too: rather than simply rendering the newly created To-do item when the save completes, we call our `created` method, which adds the item to the `Todo.List`:

    // When a todo is created, add it to this list
    "created": function(todo) {
      this.options.list.push(todo); //triggers 'add' on the list
    }

This causes the "add" event to fire, which in turn triggers our `"{list} add"` handler above. We don't have to write any new code to handle this render: it's already happening automatically! Nowhere in the application have we explicitly bound any model callbacks to changes in the view: everything happens through events.

## That's It!

JavaScriptMVC enables you to write even the simplest application **the right way** from the start. With a Model that's completely independent from any knowledge of user interface behavior, and a Controller that's all ready to scale up to the complexities of modern Web experiences, you won't find yourself rewriting your app over and over again to deliver the goods.