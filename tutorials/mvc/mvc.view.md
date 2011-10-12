@page mvc.view View
@parent mvc 2


JavaScriptMVC's views are really just client side templates. Client side templates take data and return a string.  Typically, the strings are HTML intended to be inserted into the DOM. 

$.View is a templating interface that takes care of complexities using templates:

 - Convenient and uniform syntax
 - Template loading from html elements or external files
 - Synchronous or asynchronous template loading
 - Template preloading
 - Caching of processed templates
 - Bundling of processed templates in production builds
 - $.Deferred support

JavaScriptMVC comes pre-packaged with 4 different template engines:

 - EJS
 - JAML
 - Micro
 - Tmpl

This tutorial uses EJS templates, but all the following techniques will work with any template engine with minor syntax differences.

### Basic Use

When using views, you almost always want to insert the results of a rendered template into the page. jQuery.View overwrites the jQuery modifiers so using a view is as easy as:

    $("#foo").html('mytemplate.ejs',{message: 'hello world'})

This code:

 1. Loads the template in file 'mytemplate.ejs'. It might look like:

        <h2><%= message %></h2>

 2. Renders it with {message: 'hello world'}, resulting in:

        <h2>hello world</h2>

 3. Inserts the result into the foo element. Foo might look like:

        <div id='foo'><h2>hello world</h2></div>

### jQuery Modifiers

You can use a template with the following jQuery modifier methods:

    $('#bar').after('temp.ejs',{});
    $('#bar').append('temp.ejs',{});
    $('#bar').before('temp.ejs',{});
    $('#bar').html('temp.ejs',{});
    $('#bar').prepend('temp.ejs',{});
    $('#bar').replaceWith('temp.ejs',{});
    $('#bar').text('temp.ejs',{});

### Loading from a script tag

View can load from script tags or from files. To load from a script tag, create a script tag with a type attribute set to the template type (<code>text/ejs</code>) and an id to label the template:

    <script type='text/ejs' id='recipesEJS'>
    <% for(var i=0; i < recipes.length; i++){ %>
      <li><%=recipes[i].name %></li>
    <%} %>
    </script>

Render with this template like:

    $("#foo").html('recipesEJS', recipeData)

Notice we passed the id of the element we want to render.


### $.View and Sub-templates

Sometimes, you simply want the rendered string.  In this case, you can use <code>$.View(TEMPLATE , data )</code> directly.  Pass $.View the path to the template and the data you want to render:

    var html = $.View("template/items.ejs", items );

The most common use case is sub templates.  It's common practice to separate out an individual item's template from the items template.  We'll make <code>template/items.ejs</code> render an <code>&lt;LI&gt;</code> for each item, but use the template in <code>template/item.ejs</code> for the content of each item.
    
    <% for( var i = 0; i < this.length; i++){ %>
      <li>
        <%= $.View("template/item.ejs", this[i]);  
      </li>
    < % } %>

Notice, in the template <code>this</code> refers to the data passed to the template. In the case of <code>template/items.ejs</code>, <code>this</code> is the array of items.  In <code>template/item.ejs</code> it will be the individual item.

### Deferreds

It's extremely common behavior to make an Ajax request and use a template to render the result.  Using the Task model from the previous $.Model section, we could render tasks like:

    Task.findAll({}, function(tasks){
      $('#tasks').html("views/tasks.ejs" , tasks )
    })

$.View supports [$.Deferred](http://api.jquery.com/category/deferred-object/) allowing very powerful, terse, and high performance syntax.  If a deferred is found in the render data passed to $.View or the jQuery modifiers, $.View will load the template asynchronously and wait until all deferreds and the template are loaded before rendering the template.

The Model methods <code>findAll</code>, <code>findOne</code>, <code>save</code> or <code>destroy</code> return deferreds.  This allows us to rewrite the rendering of tasks into a one liner!

    $('#tasks').html("views/tasks.ejs" , Task.findAll() )

This works with multiple deferreds too:

    $('#app').html("views/app.ejs" , {
      tasks: Task.findAll(),
      users: User.findAll()
    })

### Packaging, Preloading, and Performance

By default, $.View loads templates synchronously.  This is because it's expected that you are either:

  - Putting templates in script tags,
  - Packaging templates with your JavaScript build, or
  - Preloading templates

JavaScriptMVC does not recommend putting templates in script tags.  Script tag templates make it hard to reuse templates across different JavaScript applications.  They can also reduce load performance if your app doesn't need the templates immediately.

JavaScriptMVC recommends packaging initially used templates with your application's JavaScript and preloading templates that will be used later.

StealJS, JavaScriptMVC's build system, can process and package templates, adding them to a minified production build.  Simply point <code>steal.views(PATH, ...)</code> to your template.  

    steal.views('tasks.ejs','task.ejs');

Later, when $.View looks for that template it will use a cached copy, saving an extra Ajax request.

For templates that are not used immediately, preload and cache template them with <code>jQuery.get</code>.  Simply provide the url to the template and provide a dataType of 'view'.  It's best to do this a short time after the inital page has loaded:

    $(window).load(function(){
      setTimeout(function(){
        $.get('users.ejs',function(){},'view');
        $.get('user.ejs',function(){},'view');
      },500)
    })
    
 Please continue to [mvc.controller Controller].