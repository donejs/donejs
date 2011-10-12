@page contacts.designing Designing Modules
@parent contacts 1

Widgets should be dumb to whats going on around them. They should be self contained and provide an easy to use API for developers.  The first step in designing a widget is to define the input and outputs.

## Defining Inputs and Outputs

Inputs are anything a widget consumes from the outside world.  This can include parameters passed (optional or required) or DOM events expected.  For example, a grid widget consumes parameters like page offset, initial sort, and column names.

Outputs are anything a widget visibly produces for the outside world.  This can include DOM created, events triggered, callback functions executed, data changed, etc.  For example, a grid widget might produce "pageChanged" or "columnSorted" events.

Let's examine the inputs and outputs of the _MXUI.Data.Grid_ widget.

@image tutorials/images/inputs_outputs.jpg

## Anatomy of the List Module

One of the reusable modules in the Contacts app is List. The List is a simple widget that takes a model, gets and lists data, and listens for updates to the items to update and/or destroy rows.

	$("#category .list_wrapper").mxui_data_list({
		model : Contacts.Models.Category,
		show : "//contacts/views/categoryList",
		create: "//contacts/views/categoryCreate"
	})

In this app, the category, location, and company sections are all filters for the contacts grid. Upon clicking one of these rows, the grid is filtered with the selection. These lists are all managed using _MXUI.Data.List_.  We'll walk through how this widget works to illustrate creating reusable, self contained modules.

### Getting the List Data

When initialized, you pass the List a [jQuery.model model] class.  JavaScriptMVC models have a standard API to perform CRUD operations.  Every model implements a [jQuery.Model.static.findAll findAll] method, which we can leverage to fetch data.

	this.options.model.findAll(this.options.params, this.callback('list'))

If you look at the models in _contacts/models_, you'll notice findAll is missing. By default, models will request data using REST standards, as described in [jquery.model.encapsulate Service Encapsulation]. Every model has a findAll method, implemented in the based [jquery.model jQuery.Model] class.

### Drawing the List

One of List's parameters is a 'list' template.  After the model has completed its _findAll_, we will take its results and draw the UI.

	this.element.html(this.options.list,{
		items : this.options.sort ? items.sort(this.options.sort) : items,
		options: this.options
	});
	
### Capturing Updates

In a live application, data changes.  The List should be aware of these changes and update its UI accordingly.  List listens for updates for its given model and refreshes UI with the latest data.

	"{model} updated" : function(model, ev, item){
    	var el = item.elements(this.element).html(this.options.show, item);
    	if(this.options.updated){
        	this.options.updated(this.element, el, item)
    	}
	},

In the [contacts.glue Gluing Modules Together] section, we will discuss using this type of observer architecture.

### Responding to Clicks

As items are clicked in the list, a "selected" visual state is applied to the item.

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
	
In the above code, we  trigger an _activate_ event.  This event is one of List's outputs that we listen to using [jquery.controller.listening event delegation].  As opposed to applications listening for "click" events, we use activate to provide a level of abstraction.  This allows the widget to provide other ways to activate a row, such as keyboard navigation or clicking.  We could even expand this widget to use touch events for mobile devices, and applications wouldn't have to change.  For more information on this you can read the [mvc.controller Controller] documentation. 

The mission of this widget was simple: create a list of data that updates itself as the items change.  You and I have probably written this a dozen times in our applications.  This List widget provides a reusable API because it has generic and well defined inputs and outputs.

Next up, we will discuss how to [contacts.glue glue] our isolated modules into a full application.