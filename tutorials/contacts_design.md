@page designing_modules Designing Modules
@parent contacts 1

# Designing Modules

Widgets in general should be dumb to whats going on around them. They should encapsulate all the logic that revolves around making them work internally and a provide a easy-to-use API for developers to use.  The first step in designing a widget is to define the input/outputs.

* Inputs - the parameters you pass the widget for it to initialize.  They can be required or optional based on your implementation. In jQuery's sense, these could be some of the default options you pass to your widget.  For example, a grid widget might have inputs such as: paging, sorting, and columns.

* Outputs - result of the widget's interaction.  Since widget's don't typical return a output directly; instead they typically wait for user input.  Therefore, we leverage callback parameters and/or listen for events to be triggered on the widget for our output.  Examples of widget output include: changed, created, destroyed.

Let's examine the inputs the _MXUI.Data.Grid_ uses for its input/outputs.

@image tutorials/images/inputs-outputs.jpg

## Anatomy of the List Module

The category, location, and company are all filters for primary contacts grid.  Upon clicking one of these filters, the grid is then filtered using the selection.  These 3 filter all leverage _MXUI.Data.List_. 

We slightly touched on the list in the _Organizing Modules_ section when talking about the MXUI library but to reiterate, the List is a simple widget that given a model it will list the results and listen for updates to the items to update and/or destroy the UI. 

	$("#category .list_wrapper").mxui_data_list({
		model : Contacts.Models.Category,
		show : "//contacts/views/categoryList",
		create: "//contacts/views/categoryCreate"
	})

When initialized, you pass the List your model to which it will be listing the items from.  Since JMVC stresses models have a standard API designed after a _RESTful_ architecture for CRUD operations, we can leverage that generically and execute a _findAll_.

	this.options.model.findAll(this.options.params, this.callback('list'))

If you look in our models, you won’t see any code since we encapsulated all this into the base model for you.  If you dig through _jquery/model/model.js_ you will find this code.

	return function(params, success, error){
		return ajax(str || this.shortName+"s.json", 
			params, 
			success, 
			error, 
			fixture.call(this,"s"),
			get",
			"json "+this._shortName+".models");

Also in the initialization code, you will find we pass a 'show' view.  After the model has completed its _findAll_, we will take those results and draw the UI from them.

	this.element.html(this.options.list,{
		items : this.options.sort ? items.sort(this.options.sort) : items,
		options: this.options
	});

Rarely ever after you draw a list will it stay the same.  Fortunately, List will listen for updates and deletes items using the model via options to keep its list up-to-date as the application is used.

	"{model} updated" : function(model, ev, item){
    	var el = item.elements(this.element).html(this.options.show, item);
    	if(this.options.updated){
        	this.options.updated(this.element, el, item)
    	}
	},

In the _Gluing Modules Together_ section, we will discuss using this type of observer architecture so don’t fret if you’re not sure about the last bit of code.

As items are clicked in the list, we listen for these events using event delegation and apply a selected visual state to the item.

    ".item {activateEvent}" : function(el, ev){
		if(el.hasClass("activated")){
			this._deactivate(el)
		} else {
			var old = this.find(".activated");
			this._deactivate(old);
			this._activate(el);
		}
	},
	_deactivate: function(el){
		el.removeClass("activated");
		el.trigger("deactivate", el.model());
	},
	_activate: function(el){
		el.addClass("activated");
		el.trigger("activate", el.model());
	}
	
You might notice in the above code, we trigger a _activate_ event rather than a _click_ event when we call the activate method.  We want to create a abstraction layer and trigger one event since multiple events such as _click_ and _keydown_ will essentially do the same thing, activate an item.  For more information on this you can read the [Controller](http://edge.javascriptmvc.com/jmvc/docs.html#!mvc.controller) documentation.  The contacts master widget listens for this _activate_ event and reacts accordingly on.  In the next topic _Gluing Modules Together_ section, I will discuss this type of event-oriented-architecture more in-depth.

The mission of this widget was simple; create a list of things that updates itself as the items change.  Yet you and I have probably wrote this a dozen times in our applications we have created ourselves.  The key to unlocking the unlimited potential of re-use is to create a widget with the simplest and most generic API as possible.  This exemplifies these traits by only passing a model and view.  The widget does the rest of the magic, making for a very elegant implementation in your application.

Another example that leverages List is our [Todo Application](http://javascriptmvc.com/todo/).