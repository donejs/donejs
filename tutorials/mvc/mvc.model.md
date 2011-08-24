@page mvc.model Model
@parent mvc 1

JavaScriptMVC's model and its associated plugins provide lots of tools around organizing model data such as validations, associations, lists and more.  But the core functionality is centered around service encapsulation, type conversion, and events. 

### Attributes and Observables

Of absolute importance to a model layer is the ability to get and set properties on the modeled data and listen for changes on a model instance.  This is the Observer pattern and lies at the heart of the MVC approach - views listen to changes in the model.

Fortunately, JavaScriptMVC makes it easy to make any data observable.  A great example is pagination.  It's very common that multiple pagination controls exist on the page.  For example, one control might provide next and previous page buttons.  Another control might detail the items the current page is viewing (ex "Showing items 1-20").  All pagination controls need the exact same data:

  - offset - the index of the first item to display
  - limit - the number of items to display
  - count - the total number of items

We can model this data with JavaScriptMVC's $.Model like:

    var paginate = new $.Model({
      offset: 0,
      limit: 20,
      count: 200
    });

The paginate variable is now observable.  We can pass it to pagination controls that can read from, write to, and listen for property changes.  You can read properties like normal or using the <code>model.attr(NAME)</code> method:

    assertEqual( paginate.offset, 0 );
    assertEqual( paginate.attr('limit') , 20 );

If we clicked the next button, we need to increment the offset.  Change property values with <code>model.attr(NAME, VALUE)</code>.  The following moves the offset to the next page:

    paginate.attr('offset',20);  
 
When paginate's state is changed by one control, the other controls need to be notified.  You can bind to a specific attribute change with <code>model.bind(ATTR, success( ev, newVal ) )</code> and update the control:

    paginate.bind('offset', function(ev, newVal){
      $('#details').text( 'Showing items ' + (newVal+1 )+ '-' + this.count )
    })

You can also listen to any attribute change by binding to the <code>'updated.attr'</code> event:

    paginate.bind('updated.attr', function(ev, newVal){
      $('#details').text( 'Showing items ' + (newVal+1 )+ '-' + this.count )
    })

The following is a next-previous jQuery plugin that accepts paginate data:

    $.fn.nextPrev = function(paginate){
       this.delegate('.next','click', function(){
         var nextOffset = paginate.offset+paginate.limit;
         if( nextOffset < paginate.count){
           paginate.attr('offset', nextOffset );
         }
       })
       this.delegate('.prev','click', function(){
         var nextOffset = paginate.offset-paginate.limit;
         if( 0 < paginate.offset ){
           paginate.attr('offset', Math.max(0, nextOffset) );
         }
       });
       var self = this;
       paginate.bind('updated.attr', function(){
         var next = self.find('.next'),
             prev = self.find('.prev');
         if( this.offset == 0 ){
           prev.removeClass('enabled');
         } else { 
           prev.removeClass('disabled');
         }
         if( this.offset > this.count - this.limit ){
           next.removeClass('enabled');
         } else { 
           next.removeClass('disabled');
         }
         
       })
    };

There are a few problems with this plugin. First, if the control is removed from the page, it is not unbinding itself from paginate.  We'll address this when we discuss controllers. 

Second, the logic protecting a negative offset or offset above the total count is done in the plugin.  This logic should be done in the model. To fix this problem, we'll need to add additional constraints to limit what values limit, offset, and count can be.  We'll need to create a pagination class.

### Extending Model

JavaScriptMVC's model inherits from $.Class.  Thus, you create a model class by inheriting from <code>$.Model(NAME, [STATIC,] PROTOTYPE)</code>:

    $.Model('Paginate',{
      staticProperty: 'foo'
    },{
      prototypeProperty: 'bar'
    })

There are a few ways to make the Paginate model more useful.  First, by adding setter methods, we can limit what values count and offset can be set to.  

### Setters

Settter methods are model prototype methods that are named <code>setNAME</code>.  They get called with the val passed to <code>model.attr(NAME, val)</code> and a success and error callback.  Typically, the method should return the value that should be set on the model instance or call error with an error message.  Success is used for asynchronous setters.

The following paginate model uses setters to prevent negative counts the offset from exceeding the count by adding <code>setCount</code> and <codE>setOffset</code> instance methods.

    $.Model('Paginate',{
      setCount : function(newCount, success, error){
        return newCount < 0 ? 0 : newCount;
      },
      setOffset : function(newOffset, success, error){
        return newOffset < 0 ? 0 : Math.min(newOffset, !isNaN(this.count - 1) ? this.count : Infinity )
      }
    })

Now the nextPrev plugin can set offset with reckless abandon:

    this.delegate('.next','click', function(){
      paginate.attr('offset', paginate.offset+paginate.limit);
    })
    this.delegate('.prev','click', function(){
        paginate.attr('offset', paginate.offset-paginate.limit );
    });

### Defaults

We can add default values to Paginate instances by setting the static <code>defaults</code> property.  When a new paginate instance is created, if no value is provided, it initializes with the default value.

    $.Model('Paginate',{
      defaults : {
        count: Infinity,
        offset: 0,
        limit: 100
      }
    },{
      setCount : function(newCount, success, error){ ... },
      setOffset : function(newOffset, success, error){ ... }
    })

    var paginate = new Paginate({count: 500});
    assertEqual(paginate.limit, 100);
    assertEqual(paginate.count, 500);


This is getting sexy, but the Paginate model can make it even easier to move to the next and previous page and know if it's possible by adding helper methods.

### Helper methods

Helper methods are prototype methods that help set or get useful data on model instances.  The following, completed, Paginate model includes a <code>next</code> and <code>prev</code> method that will move to the next and previous page if possible.  It also provides a <code>canNext</code> and <code>canPrev</code> method that returns if the instance can move to the next page or not.

    $.Model('Paginate',{
      defaults : {
        count: Infinity,
        offset: 0,
        limit: 100
      }
    },{
      setCount : function( newCount ){
        return Math.max(0, newCount  );
      },
      setOffset : function( newOffset ){
        return Math.max( 0 , Math.min(newOffset, this.count ) )
      },
      next : function(){
        this.attr('offset', this.offset+this.limit);
      },
      prev : function(){
        this.attr('offset', this.offset - this.limit )
      },
      canNext : function(){
        return this.offset > this.count - this.limit
      },
      canPrev : function(){
        return this.offset > 0
      }
    })

Thus, our jQuery widget becomes much more refined:

    $.fn.nextPrev = function(paginate){
       this.delegate('.next','click', function(){
         paginate.attr('offset', paginate.offset+paginate.limit);
       })
       this.delegate('.prev','click', function(){
         paginate.attr('offset', paginate.offset-paginate.limit );
       });
       var self = this;
       paginate.bind('updated.attr', function(){
         self.find('.prev')[paginate.canPrev() ? 'addClass' : 'removeClass']('enabled')
         self.find('.next')[paginate.canNext() ? 'addClass' : 'removeClass']('enabled');
       })
    };

### Service Encapsulation

We've just seen how $.Model is useful for modeling client side state.  However, for most applications, the critical data is on the server, not on the client.  The client needs to create, retrieve, update and delete (CRUD) data on the server.  Maintaining the duality of data on the client and server is tricky business.   $.Model is used to simplify this problem.  

$.Model is extremely flexible.  It can be made to work with all sorts of services types and data types.  This book covers only how $.Model works with the most common and popular type of service and data type: Representational State Transfer (REST) and JSON.

A REST service uses urls and the HTTP verbs POST, GET, PUT, DELETE to create, retrieve, update, and delete data respectively.  For example, a tasks service that allowed you to create, retrieve, update and delete tasks might look like:

<table>
  <tr>
    <th>ACTION</th><th>VERB</th><th>URL</th><th>BODY</th><th>RESPONSE</th>
  </tr>
  <tr>
   <td>Create a task</td><td>POST</td><td>/tasks</td><td>name=do the dishes</td><td><pre><code>{
  "id"       : 2,
  "name"     : "do the dishes",
  "acl"      : "rw" ,
  "createdAt": 1303173531164 // April 18 2011
}</code></pre></td>
  </tr>
  <tr>
   <td>Get a task</td><td>GET</td><td>/task/2</td><td></td><td><pre><code>{
  "id"       : 2,
  "name"     : "do the dishes",
  "acl"      : "rw" ,
  "createdAt": 1303173531164 // April 18 2011
}</pre></code></td>
  </tr>
  <tr>
   <td>Get tasks</td><td>GET</td><td>/tasks</td><td></td><td>
<pre><code>[{
  "id"       : 1,
  "name"     : "take out trash",
  "acl"      : "r",
  "createdAt": 1303000731164 // April 16 2011
},
{
  "id"       : 2,
  "name"     : "do the dishes",
  "acl"      : "rw" ,
  "createdAt": 1303173531164 // April 18 2011
}]</code>
</pre>
</td>
  </tr>
  <tr>
   <td>Update a task</td><td>PUT</td><td>/task/2</td><td>name=take out recycling</td><td><pre><code>{
  "id"       : 2,
  "name"     : "take out recycling",
  "acl"      : "rw" ,
  "createdAt": 1303173531164 // April 18 2011
}</pre></code></td>
  </tr>
  <tr>
   <td>Delete a task</td><td>DELETE</td><td>/task/2</td><td></td><td><pre><code>{}</pre></code></td>
  </tr>
</table>

TODO: We can label the urls

The following connects to task services, letting us create, retrieve, update and delete tasks from the server:

    $.Model("Task",{
      create  : "POST /tasks.json",
      findOne : "GET /tasks/{id}.json",
      findAll : "GET /tasks.json",
      update  : "PUT /tasks/{id}.json",
      destroy : "DELETE /tasks/{id}.json"
    },{ });

The following table details how to use the task model to CRUD tasks.

<table>
  <tr>
    <th>ACTION</th><th>CODE</th><th>DESCRIPTION</th>
  </tr>
  <tr>
   <td>Create a task</td>
   <td><pre><code>new Task({ name: 'do the dishes'})
  .save( 
    success( task, data ), 
    error( jqXHR) 
  ) -> taskDeferred</code></pre></td>
   <td><p>To create an instance of a model on the server, first create an instance with <code>new Model(attributes)</code>.  Then call <code>save()</code>.</p>
<p>Save checks if the task has an id.  In this case it does not so save makes a create request with the task's attributes.  Save takes two parameters:</p>
   <ul>
     <li><code>success</code> - a function that gets called if the save is successful.  Success gets called with the <code>task</code> instance and the <code>data</code> returned by the server.</li>
     <li><code>error</code> - a function that gets called if there is an error with the request.  It gets called with jQuery's wrapped XHR object.</li>
   </ul>
   
   Save returns a deferred that resolves to the created task.
   </td>
  </tr>
  <tr>
   <td>Get a task</td>
   <td><pre><code>Task.findOne(params, 
  success( task ), 
  error( jqXHR) 
) -> taskDeferred</code></pre></td>
   <td>Retrieves a single task from the server. It takes three parameters:
   <ul>
     <li><code>params</code> - data to pass to the server.  Typically an id like: <code>{id: 2}</code>.</li>
     <li><code>success</code> - a function that gets called if the request is succesful.  Success gets called with the <code>task</code> instance.</li>
     <li><code>error</code> - a function that gets called if there is an error with the request.</li>
   </ul>
   
   findOne returns a deferred that resolves to the task.
   </td>
  </tr>
   <td>Get tasks</td>
   <td><pre><code>Task.findAll(params, 
  success( tasks ), 
  error( jqXHR) 
) -> tasksDeferred</code></pre></td>
   <td>Retrieves an array of tasks from the server. It takes three parameters:
   <ul>
     <li><code>params</code> - data to pass to the server.  Typically, it's an empty object (<code>{}</code>) or filters: <code>{limit: 20, offset: 100}</code>.</li>
     <li><code>success</code> - a function that gets called if the request is succesful.  Success gets called with an array of task instances.</li>
     <li><code>error</code> - a function that gets called if there is an error with the request.</li>
   </ul>
   findOne returns a deferred that resolves to an array of tasks.
   </td>
  </tr>
  <tr>
   <td>Update a task</td>
   <td><pre><code>task.attr('name','take out recycling');
task.save( 
  success( task, data ), 
  error( jqXHR) 
) -> taskDeferred</code></pre></td>
   <td><p>To update the server, first change the attributes of a model instance with  <code>attr</code>.  Then call <code>save()</code>.</p>
       <p>Save takes the same arguments and returns the same deferred as the create task case.</p>
   </td>
  </tr>
  <tr>
   <td>Destroy a task</td>
   <td><pre><code>task.destroy( 
  success( task, data ), 
  error( jqXHR) 
) -> taskDeferred</code></pre></td>
   <td><p>Destroys a task on the server. Destroy takes two parameters:</p>
   <ul>
     <li><code>success</code> - a function that gets called if the save is successful.  Success gets called with the <code>task<code> instance and the <code>data</code> returned by the server.</li>
     <li><code>error</code> - a function that gets called if there is an error with the request.</li>
   </ul>
   
   Destroy returns a deferred that resolves to the destroyed task.
   </td>
  </tr>
</table>

The <code>Task</code> model has essentially become a contract to our services!

### Type Conversion

Did you notice how the server responded with createdAt values as numbers like <code>1303173531164</code>.  This number is actually April 18th, 2011.  Instead of getting a number back from <code>task.createdAt</code>, it would be much more useful if it returns a JavaScript date created with <code>new Date(1303173531164)</code>.  We could do this with a <code>setCreatedAt</code> setter.  But, if we have lots of date types, this will quickly get repetitive.  

To make this easy, $.Model lets you define the type of an attribute and a converter function for those types.  Set the type of attributes on the static <code>attributes</code> object and converter methods on the static <code>convert</code> object.

    $.Model('Task',{
      attributes : {
        createdAt : 'date'
      },
      convert : {
        date : function(date){
          return typeof date == 'number' ? new Date(date) : date;
        }
      }
    },{});

Task now converts createdAt to a Date type.  To list the year of each task, write:

    Task.findAll({}, function(tasks){
      $.each(tasks, function(){
        console.log( "Year = "+this.createdAt.fullYear() )
      })
    });


### CRUD Events

Model publishes events when an instance has been created, updated, or destroyed. You can listen to these events globally on the Model or on an individual model instance. Use <code>MODEL.bind(EVENT, callback( ev, instance ) )</code> to listen for created, updated, or destroyed events.

Lets say we wanted to know when a task is created and add it to the page. After it's been added to the page, we'll listen for updates on that task to make sure we are showing its name correctly.  We can do that like:

    Task.bind('created', function(ev, task){
      var el = $('<li>').html(todo.name);
      el.appendTo($('#todos'));
      
      task.bind('updated', function(){
        el.html(this.name)
      }).bind('destroyed', function(){
        el.remove()
      })

    })