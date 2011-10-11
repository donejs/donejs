@page contacts.glue Gluing Modules Together
@parent contacts 2

Now that we have learned how to create dumb, lonely, replaceable widgets, we need to glue them together into a smart app.

## Changes in State

Events are significant changes in state, and EOA is a pattern that detects and consumes these changes in state.  EOA is an elegant way to tie decoupled modules together.

### Cons of Callback Architecture

Traditionally widgets accept callbacks.  

	$('div').modal({
		closeCallback: windowClosed,
		showCallback: windowOpened
	});

This type of architecture in not desirable for many reasons:

* The widget should be as dumb as possible.  When you pass a callback your widget becomes coupled to its parent widget because it becomes aware of the context in which its used.

* When you pass callbacks, only one widget can provide that callback.  It creates a 1-to-1 architecture, which limits the scalability of the application.

* Callbacks clutter the API and make it difficult for new developers to learn.

### Event Oriented Architecture

Rather than using callbacks, the contacts application uses EOA.  One good example is how the grid is filtered from a user clicking an item in a list.

As items are clicked in the list, it triggers an "activate" event, including the selected row’s model instance in the event.  

	el.trigger("activate", el.model());

_Pro Tip:  Because we bound instances of models using EJS as shown below, in our controller code we can call .model() on the element that was bound to retrieve the model as shown above._

	<% for(var i =0 ; i < items.length;i ++){ %>
  		<li <%= items[i]%> >

The contacts widget then observes this state change using event delegation and updates the grid parameters.

	"#category .list_wrapper activate": function(el, ev, item){
		this.params.attr("categoryId", item.id);
	}
	
The contacts widget listens for events high in the DOM, so it can capture any events triggered by child widgets.

@image tutorials/images/eoa-diagram1.jpg


Grid parameters are a JavaScriptMVC Model instance, used to define common data attributes like limit, offset, and count.  The JavascriptMVC Model implements an observer pattern. As changes are made to attributes, widgets can listen for the _updated_ event and react accordingly.

In the sample code above we call _attr_ on this model instance to update the parameters.  The grid is listening for changes in the attributes.  Above, when activate is triggered, _categoryId_ is changed.  The grid observes this change and executes an AJAX request to get data for the current parameter set. 

	"{params} updated.attr" : function(params, ev, attr, val){
		if(attr !== 'count'){
			//want to throttle for rapid updates
			clearTimeout(this.newRequestTimer,100)
			this.newRequestTimer = setTimeout(this.callback('newRequest', attr, val))
		}
	},
	
	newRequest : function(attr, val){
		var clear = true; 
		if(!this.options.newPageClears && attr == "offset"){ // if offset changes and we have newPageClears false
			clear = false;
		} 
		this.options.model.findAll(this.options.params.attrs(), this.callback('list', clear))
	}


@image tutorials/images/eoa-diagram2.jpg

## Changes in Data

[jquery.model.events Model events] are events that are fired when CRUD operations (create/update/delete) occur on a model instance.  Widgets can bind to these events to automatically update when data changes.

### Cons of Custom Events

A common widget communication pattern is triggering custom events when actions are completed.  For example, when a user clicks "next page" in a pagination widget, the paginator could trigger "nextPage" and the grid could listen and reload with new data.  This is also not desirable because:

* The widget should be as dumb as possible.  If a widget is listening to custom events from child widgets, you are coupling it to the parent widget.  We don't want the grid widget depending on a specific "nextPage" event from the paginator, making the paginator not easily replaceable.

* In some cases, the same state needs to be represented across multiple widgets. The grid, paginator, and possibly other widgets need to know about the current pagination data.  Rather than complicate the design by adding unnecessary layers, it makes more sense to maintain this state once (in the model), and let widgets listen to changes in that state.

### Listening to Model Events

The List widget provides a good example of binding directly to model updates.

	"{model} updated" : function(model, ev, item){
    	var el = item.elements(this.element).html(this.options.show, item);
    	if(this.options.updated){
        	this.options.updated(this.element, el, item)
    	}
	}

As model changes are made, such as an update to a contact's name, we listen for these changes in the List and update the UI accordingly.

## Wrap-up

In this article, we explored:

* The layers of the contacts application
* How to structure your application into modules, optimizing for widget reuse
* Designing widgets that are modular, testable, and have easy to use APIs
* How to glue your widgets together using event oriented architecture

If you're interested in other examples, check out the other [examples application examples].