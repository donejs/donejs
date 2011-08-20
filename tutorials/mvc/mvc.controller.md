@page mvc.controller Controller
@parent mvc 3

JavaScriptMVC's controllers are many things.  They are a jQuery plugin factory.  They can be used as a traditional view, making pagination widgets and grid controls.  Or, they can be used as a traditional controller, initializing and controllers and hooking them up to models.  Mostly, controller's are a really great way of organizing your application's code.

Controllers provide a number of handy features such as:

 - jQuery plugin creation
 - automatic binding
 - default options
 - automatic determinism

But controller's most important feature is not obvious to any but the most hard-core JS ninjas.  The following code creates a tooltip like widget that displays itself until the document is clicked.

    $.fn.tooltip = function(){
      var el = this[0];

      $(document).click(function(ev){
        if(ev.target !== el){
          $(el).remove()
        }
      })
    
      $(el).show();
      return this;
    })

To use it, you'd add the element to be displayed to the page, and then call tooltip on it like:

    $("<div class='tooltip'>Some Info</div>")
        .appendTo(document.body)
        .tooltip()
 
But, this code has a problem.  Can you spot it?  Here's a hint. What if your application is long lived and lots of these tooltip elements are created?  

The problem is this code leaks memory!  Every tooltip element, and any tooltip child elements, are kept in memory forever.  This is because the click handler is not removed from the document and has a closure reference to the element.  

This is a frighteningly easy mistake to make.  jQuery removes all event handlers from elements that are removed from the page so developers often don't have to worry about unbinding event handlers.  But in this case, we bound to something outside the widget's element, the document, and did not unbind the event handler.

But within a Model-View-Controller architecture, Controllers listen to the View and Views listen to the Model.  You are constantly listening to events outside the widget's element.  For example, the <code>nextPrev</code> widget from the <code>$.Model</code> section listens to updates in the paginate model:

    paginate.bind('updated.attr', function(){
      self.find('.prev')[this.canPrev() ? 'addClass' : 'removeClass']('enabled')
      self.find('.next')[this.canNext() ? 'addClass' : 'removeClass']('enabled');
    })

But, it doesn't unbind from paginate!  Forgetting to remove event handlers is potentially a source of errors.  However, both the tooltip and nextPrev would not error.  Instead both will silently kill an application's performance.  Fortunately, $.Controller makes this __easy__ and __organized__.  We can write tooltip like:

    $.Controller('Tooltip',{
      init: function(){
        this.element.show()
      },
      "{document} click": function(el, ev){
        if(ev.target !== this.element[0]){
          this.element.remove()
        }
      }
    })

When the document is clicked and the element is removed from the DOM, $.Controller will automatically unbind the document click handler.  

$.Controller can do the same thing for the nextPrev widget binding to the the paginate model:

    $.Controller('Nextprev',{
      ".next click" : function(){
        var paginate = this.options.paginate;
        paginate.attr('offset', paginate.offset+paginate.limit);
      },
      ".prev click" : function(){
        var paginate = this.options.paginate;
        paginate.attr('offset', paginate.offset-paginate.limit );
      },
      "{paginate} updated.attr" : function(ev, paginate){
        this.find('.prev')[paginate.canPrev() ? 'addClass' : 'removeClass']('enabled')
        this.find('.next')[paginate.canNext() ? 'addClass' : 'removeClass']('enabled');
      }
    })
    
    // create a nextprev control
    $('#pagebuttons').nextprev({ paginate: new Paginate() })

If the element <code>#pagebuttons</code> is removed from the page, the Nextprev controller instance will automatically unbind from the paginate model. 

Now that your appetite for error free code is properly whetted, the following details how $.Controller works.

### Overview

$.Controller inherits from $.Class.  To create a Controller class, call <code>$.Controller( NAME, classProperties, instanceProperties )</code> with the name of your controller, static methods, and instance methods.  The following is the start of a reusable list widget:

    $.Controller("List", {
      defaults : {}
    },{
      init : function(){  },
      "li click" : function(){  }
    })

When a controller class is created, it creates a jQuery helper method of a similar name.  The helper method is primarily use to create new instances of controller on elements in the page.  The helper method name is the controller's name underscored, with any periods replaced with underscores.  For example, the helper for <code>$.Controller('App.FooBar')</code> is <code>$(el).app_foo_bar()</code>.

### Controller Instantiation 

To create a controller instance, you can call <code>new Controller(element, options)</code> with a HTMLElment or jQuery-wrapped element and an optional options object to configure the controller.  For example:

    new List($('ul#tasks'), {model : Task});

You can also use the jQuery helper method to create a List controller instance on the <code>#tasks</code> element like:

    $('ul#tasks').list({model : Task})

When a controller is created, it calls the controller's prototype init method with:

  - <code>this.element</code> set to the jQuery-wrapped HTML element 
  - <code>this.options</code> set to the options passed to the controller merged with the class's <code>defaults</code> object. 

The following updates the List controller to request tasks from the model and render them with an optional template passed to the list:

    $.Controller("List", {
      defaults : {
        template: "items.ejs"
      }
    },{
      init : function(){
        this.element.html( this.options.template, this.options.model.findAll() ); 
      },
      "li click" : function(){  }
    })

We can now configure Lists to render tasks with a template we provide.  How flexible!

    $('#tasks').list({model: Task, template: "tasks.ejs"});
    $('#users').list({model: User, template: "users.ejs"})

If we don't provide a template, List will default to using items.ejs.

### Event Binding

As mentioned in $.Controller's introduction, it's most powerful feature is it's ability to bind and unbind event handlers.  

When a controller is created, it looks for action methods.  Action methods are methods that look like event handlers.  For example, <code>"li click"</code>.  These actions are bound using <code>jQuery.bind</code> or <code>jQuery.delegate</code>.  When the controller is destroyed, by removing the controller's element from the page or calling destroy on the controller, these events are unbound, preventing memory leaks.

The following are examples of actions with descriptions of what the listen for:

  - <code>"li click"</code> - clicks on or within <code>li</code> elements within the controller element.
  - <code>"mousemove"</code> - mousemoves within the controller element.
  - <code>"{window} click"</code> - clicks on or within the window.

Action functions get called back with the jQuery-wrapped element or object that the event happened on and the event.  For example:

    "li click": function( el, ev ) {
      assertEqual(el[0].nodeName, "li" )
      assertEqual(ev.type, "click")
    }

### Templated Actions

$.Controller supports templated actions.  Templated actions can be used to bind to other objects, customize the event type, or customize the selector.

Controller replaces the parts of your actions that look like <code>{OPTION}</code> with a value in the controller's options or the window. 

The following is a skeleton of a menu that lets you customize the menu to show sub-menus on different events:

    $.Controller("Menu",{
      "li {openEvent}" : function(){
        // show subchildren
      }
    });

    //create a menu that shows children on click
    $("#clickMenu").menu({openEvent: 'click'});
    
    //create a menu that shows children on mouseenter
    $("#hoverMenu").menu({openEvent: 'mouseenter'});

We could enhance the menu further to allow customization of the menu element tag:

    $.Controller("Menu",{
      defaults : {menuTag : "li"}
    },{
      "{menuTag} {openEvent}" : function(){
        // show subchildren
      }
    });

    $("#divMenu").menu({menuTag : "div"})

Templated actions let you bind to elements or objects outside the controller's element.  For example, the Task model from the $.Model section produces a "created" event when a new Task is created.  We can make our list widget listen to tasks being created and automatically add these tasks to the list like:

    $.Controller("List", {
      defaults : {
        template: "items.ejs"
      }
    },{
      init : function(){
        this.element.html( this.options.template, this.options.model.findAll() ); 
      },
      "{Task} created" : function(Task, ev, newTask){
        this.element.append(this.options.template, [newTask])
      }
    })

The <code>"{Task} create"</code> gets called with the Task model, the created event, and the newly created Task. The function uses the template to render a list of tasks (in this case there is only one) and add the resulting html to the element.

But, it's much better to make List work with any model.  Instead of hard coding tasks, we'll make controller take a model as an option:

    $.Controller("List", {
      defaults : {
        template: "items.ejs",
        model: null
      }
    },{
      init : function(){
        this.element.html( this.options.template, this.options.model.findAll() ); 
      },
      "{model} created" : function(Model, ev, newItem){
        this.element.append(this.options.template, [newItem])
      }
    });

    // create a list of tasks
    $('#tasks').list({model: Task, template: "tasks.ejs"});

## Putting it all together - an abstract CRUD list.

Now we will enhance the list to not only add items when they are created, but update them and remove them when they are destroyed.  To do this, we start by listening to updated and destroyed:

    "{model} updated" : function(Model, ev, updatedItem){
      // find and update the LI for updatedItem
    },
    "{model} destroyed" : function(Model, ev, destroyedItem){
      // find and remove the LI for destroyedItem
    }

You'll notice here we have a problem.  Somehow, we need to find the element that represents particular model instance.  To do this, we need to label the element as belonging to the model instance.  Fortunately, $.Model and $.View make labeling an element with an instance and finding that element very easy.  

To label the element with a model instance within an EJS view, you simply write the model instance to the element.  The following might be <code>tasks.ejs</code>

    <% for(var i =0 ; i < this.length; i++){ %>
      <% var task = this[i]; %>
      <li <%= task %> > <%= task.name %> </li>
    <% } %>

<code>tasks.ejs</code> iterates through a list of tasks.  For each task, it creates an <code>li</code> element with the task's name.  But, it also adds the task to the element's jQuery data with: <code>&lt;li &lt;%= task %&gt; &gt;</code>.

To later get that element given a model instance, you can call <code>modelInstance.elements([CONTEXT])</code>.  This returns the jQuery-wrapped elements the represent the model instance.  

Putting it together, list becomes:

    $.Controller("List", {
      defaults : {
        template: "items.ejs",
        model: null
      }
    },{
      init : function(){
        this.element.html( this.options.template, this.options.model.findAll() ); 
      },
      "{model} created" : function(Model, ev, newItem){
        this.element.append(this.options.template, [newItem])
      },
      "{model} updated" : function(Model, ev, updatedItem){
        updatedItem.elements(this.element)
          .replaceWith(this.options.template, [updatedItem])
      },
      "{model} destroyed" : function(Model, ev, destroyedItem){
        destroyedItem.elements(this.element)
          .remove()
      }
    });

    // create a list of tasks
    $('#tasks').list({model: Task, template: "tasks.ejs"});

It's almost frighteningly easy to create abstract, reusable, memory safe widgets with JavaScriptMVC.

Boo!