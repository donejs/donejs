## Introduction

In this guide, we're going to be installing and walking through the simplest [JavaScriptMVC](http://javascriptmvc.com/)
application imaginable -- a TODO list manager.

Let's get started.

## Setup

First, [clone](https://github.com/jupiterjs/todo) the application from our repository at GitHub, and initialize all
the necessary submodules. The following commands will get you up and running:

    $ git clone https://github.com/jupiterjs/todo
    $ cd todo
    $ git submodule update --init

This bundle now contains everything you need to run the application locally. Since we have has no server-side
functionality, you should now be able to open the `todo/todo.html` file in your browser and see it in action. The
interface is extremely simple. Try adding a couple TODO items, and then clear them by checking the boxes and
clicking on the "Clear completed items" link. That's all there is to it.

## Structure

Let's take a look at the anatomy of our application:

    /todo [top-level, the GitHub repo]
      /jquery
        /class
        /controller
        /model
        /view
        jquery.js
        ...
      /steal
        /build
        /generate
        js
        js.bat
        steal.js
        ...
      /funcunit
        /qunit
          qunit.js
          ...
        /scripts
        /test
        funcunit.html
        funcunit.js
        qunit.html
        ...
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

- The `jquery` folder is where (unsurprisingly) the jQuery library and the JavaScriptMVC framework live. JavaScriptMVC
consists of powerful abstractions like [jQuery.Class $.Class], [jQuery.Model $.Model], [jQuery.Controller $.Controller],
and [jQuery.View $.View], as well as numerous helpful jQuery plugins like `resize`, `destroyed`, `closest`, `cur_styles`,
and `route` -- all designed to enhance your life as a JavaScript developer.
- The `steal` folder houses the Steal dependency management system, which is what makes it possible to keep your project
organized during development, and compact and fast in production. Steal has two main responsibilities: As a JavaScript
library, it facilitates on-demand loading of any resources (scripts, stylesheets, templates, or even user-defined
content) your application requires. As a command line utility, it takes care of bundling, compressing, and optimizing
your application for deployment.
- The FuncUnit testing framework lives in the `funcunit` folder -- think jQuery's excellent Qunit framework plus Selenium
and headless (Env.js) support. Basically, qUnit on steroids.
- Lastly, our application files will live in the `todo` folder.

## Architecture

The [Model-View-Controller Pattern]() (which we'll be referring to from here on out as MVC) is a well-established
architectural pattern in software engineering. Without going into too much detail, it states that there should be a clear
separation of concerns between the part of the system that represents the application domain (Model), the part that
renders the domain for user interaction (View), and the part that coordinates between the two (Controller).

Since our application consists of only one model, one controller, and a handful of templates, we're going to just keep all
our code in the `todo.js` and `todo.html` files. Ordinarily in a JavaScriptMVC application, to make our project easier to
navigate, we'd keep a single component in each file, but you'll forgive us this time for keeping it simple.

### Dependencies

If you look at `todo.js` the first thing you'll notice is that all the code is wrapped in a call to the `steal` function:

    steal('jquery/model/list',
          'jquery/controller',
          'jquery/view/ejs',
          'jquery/lang/json',
          './todo.css',
          function($){
    
    ...
    
    });

In fact, this is true of every JavaScript file in a JavaScriptMVC application. This is how we state our dependencies
up-front, and tell the framework what libraries, plugins, stylesheets, etc. we need before we can begin. Typically,
the final argument to steal will be a function, which will be executed when all the other dependencies (and _their_
dependencies, and so on...) have been loaded and executed as well. No more worrying whether you forgot any `<script>`
tags, or whether you've got them in the right order!

For our TODO app, we can see that our script requires the [jQuery.Model.List $.Model.List] class (which itself requires
the [jQuery.Model $.Model] class, the [jQuery.Controller $.Controller] class, a jQuery JSON helper, and our application's
stylesheet.

### Model

All models in JavaScriptMVC extend the [jQuery.Model $.Model] class, like so:

    $.Model('Todo', { /* static properties */ }, { /* instance/prototype properties */ });

(If you need a quick refresher on how to use JVMC's classes, see [jQuery.Class $.Class].)

Since we want our TODO list manager to function without a server (who said application domains require servers, anyway?),
we need some form of persistence in the browser. Sure, cookies are nice, but we're looking to the future, man -- so lets
take advantage of HTML5's LocalStorage!

    $.Model('Todo',{
      /**
       * Gets JSON data from localStorage.  Any changes that 
       * get made in cb get written back to localStorage.
       * 
       * This is unimportant for understanding JavaScriptMVC!
       */
      localStore: function(cb){
        var name = this.shortName,
          data = $.evalJSON( window.localStorage[name] || (window.localStorage[name] = "{}") ),
          res = cb.call(this, data);
        if(res !== false){
          window.localStorage[name] = $.toJSON(data);
        }
      },

Here, we've defined our `Todo` class with a static (shared across all instances), state-of-the-art HTML5 storage system
(don't worry too much about what this does). The `localStore` method accepts a function which it assumes is a callback.
Since HTML5 local storage is a JSON-store, that means we'll receive an array of `Todo` _properties_ when our callback
fires. All of our CRUD operations will use this helper in order to persist `Todo` items in the system.

      findAll: function(params, success){
        this.localStore(function(todos){
          var instances = [];
          for(var id in todos){
            instances.push( new this( todos[id]) )
          }
          success && success(instances)
        })
      },

Given our `localStorage` helper, we've now defined a finder method that returns all `Todos` that the application knows
about. Inside the callback, we just iterate over those objects, and create `Todo`s out of them. Simple!

> _Tip_: Don't let that `new this( ... )` trip you up. Since we're in the static (class) context, `this` simply refers to the
> `Todo` class itself. Writing `new Todo( ... )` would have the same effect, but this way our code won't break if we ever
> decide to rename the class to something else.

The rest of the CRUD methods are similar enough.

### Lists

One of the truly great features of JavaScriptMVC is the [jQuery.Model.List $.Model.List]. A Model.List gives us a way
to manage a collection of models as an aggregate, and (the cool part) be able to respond to and trigger events at the
collection level. For our present purposes, we'd like to have a list of `Todo` items that can tell us which ones have
been marked as completed:

    $.Model.List('Todo.List',{
      /**
       * Return a new Todo.List of only complete items
       */
      completed : function(){
        return this.grep(function(item){
          return item.complete === true;
        })
      }
    });
    
Keep an eye out for this below when we're implementing the controller.

## Controller

Unlike models, controllers and views are inherently tied to the application's user interface, so before we dive into the
JavaScript code, let's take a quick look at the basic HTML structure of the application:

    <div id='todos'>
      <h1>Todos</h1>
      <input type='text' class='create' /> 
      <ul id='list'>
      </ul>
      <div id='todo-stats'>
      </div>
    </div>

Not much to it, is there! We can see that we have one wrapper element -- make a note of that, because that's the element
we're eventually going to attach the controller to.

Inside that wrapper, we have the following items:

- A title ("Todos")
- A text box where we're going to add new Todo items
- A list where we'll see all current Todo items
- Another container for "stats" where we'll show a count of what the user has selected, and give them a way to "finish"
  items

With that document structure in mind, let's look at the code:

    $.Controller('Todos',{
      
      // sets up the widget
      init : function(){
        
        // empties the create input element
        this.find(".create").val("")[0].focus();
        
        // fills this list of items (creates add events on the list)
        this.options.list.findAll();
      },

The `init` method is what will be called when we initialize the controller. The `find` method here is like `jQuery.find`
in that it searches for a selector underneath an element -- in this case, the element being managed by the controller. We
want to look up the `.create` selector (the text box we saw above), set its text value to the empty string, and then
cause the browser to "focus," or place the mouse cursor in the box.

The second statement is the interesting one: because `this.options` always refers to the properties that were passed in to
the controller upon initialization, we can see here that we are expecting to be initialized with a list -- a `Todo.List`
to be exact. Another great thing about [jQuery.Model.List $.Model.List]s is that they steal most of their default behavior
from the underlying model, so basically we've gotten a free implementation of `findAll`, simply because `Todo` has a
`findAll` method. Pretty nice!

We also saw that [jQuery.Model.List $.Model.List]s trigger their own events which we can listen on in. Keep an eye out
for that below.

