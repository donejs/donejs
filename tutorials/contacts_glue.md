@page glue_modules Gluing Modules Together
@parent contacts 2

# Gluing Modules Together

The contacts application is broken down into 4 main modules: 

* Category
* Company
* Locations
* Contacts

These main modules were designed in a sense they could all operate independently from each other, so now to finish off the application we have to glue them all together.  To accomplish this feat, we are going to leverage event-oriented-architecture to integrate them into the application but at the same time keep them decoupled from each other.

## Event-oriented-architecture

Traditional widget architecture often involves passing around callbacks.  

	$('div').modal({
		closeCallback: windowClosed,
		showCallback: windowOpened
	});

This type of architecture in not desirable for many reasons, such as:

* The widget should be as dumb as possible.  Therefore, when you pass a callback your widget becomes coupled to its parent widget because it becomes aware of the context it’s used.

* When you pass callbacks, only one other widget can listen for that callback.  It creates a 1-to-1 architecture, which limits the scalability of the application.

* Passing callbacks clutters the API and becomes a burdensome for new developers trying to learn all the callbacks available for the widget.

Another approach that traditional widget architecture uses is triggering DOM events when actions are completed.  This is also not desirable because:

* The widget should be as dumb as possible.  If you have your widget listening for various DOM events from child widgets, you are coupling it.

* DOM Events can introduce an extra communication point with the controller layer that isn’t always necessary.  Sometimes, you might want to simply talk directly to the model layer.  For instance, in our grid in the contacts application when you page to the next page, we want update the model directly passing the new filter.

Events are defined as significant change in state.  EOA is a pattern that is defined by the detection and consumption of these changes in state.   Rather than taking the traditional architecture approach that I slated above and inheriting its flaws, we decided to craft the contacts application using this EOA architecture. 

## Examples of EOA

As items are clicked in the list, the list bubbles the activate event to the master contact widget passing an instance of the item’s model that was selected.  

	el.trigger("activate", el.model());

_Pro Tip:  Because we bound instances of models using EJS, in our controller code we can call .model() on the element that was bound to retrieve the model._

	<% for(var i =0 ; i < items.length;i ++){ %>
  		<li <%= items[i]%> >

The contacts widget then observes this change in state using event delegation and updates the grid parameters.

	"#category .list_wrapper activate": function(el, ev, item){
		this.params.attr("categoryId", item.id);
	}
	
@image tutorials/images/eoa-diagram1.jpg

The grid parameters are a model instance that is defined in _MXUI.Data_.  This model model has some preset attributes, defaults, and helper methods for using when listing items in widgets such as a grid.  It defines things such as: 

* limit - the maximum number of items to come back
* offset – the current “page” we might be on
* count – the total number of items

In the sample code above you see we do _attr_ on this model object to updates the model instance’s current parameters.  The JavascriptMVC Model implements an observer pattern so as changes are made to its attributes, widgets can listen for the _updated_ event to be trigger and react accordingly.  

In our case, the grid is listening for changes of the attributes.  When we triggered the activate above and changes the _categoryId_ of the params object the grid observes this change and consequently executes a new AJAX request to update its view. 

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

## Model Events

Model events are events that are fired when CRUD operations (create/update/delete) occur on a model instance.

Earlier in the article, I teased you with a glimpse of the model events used in the List design section.  We were mentioning how the list would keep itself up-to-date listening for created, updated, and destroyed events from the model.

	"{model} updated" : function(model, ev, item){
    	var el = item.elements(this.element).html(this.options.show, item);
    	if(this.options.updated){
        	this.options.updated(this.element, el, item)
    	}
	}

In this example, as model changes are made, such as an update to a contact name; we listen for these changes in the List and update the UI accordingly.

# Wrap-up

In this article, we peeled back some of the layers that comprise the contacts application and JavascriptMVC.  By now, you should have a good understanding of how the contacts application works.  

Additionally, we explored how you can structure and organize your application for making the most of widget re-use. How to design widgets that are very modular, testable, and have easy-to-use APIs.  Finally, we covered how to glue your new found widgets together without coupling them using event-oriented-architecture.