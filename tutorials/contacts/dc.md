@page contacts.dc Divide and Conquer
@parent contacts 0

The secret to building large applications is never build large applications.  Understanding how to divide your application is the first step towards maintainable architecture.  This section covers why and how to divide up your app and uses contacts as an example.

## Isolation

The goal for dividing your application should be to create modules that are isolated.

Isolated modules are dumb, lonely, and replaceable.  Dumb because they are limited to one specific purpose, for example showing a list of data.  Lonely because they rarely reference other modules.  Replaceable because they have a simple API, making them easy to swap out.

Isolated modules are easily testable because they have a small, well defined scope.  Each piece can be worked on in parallel because the code is divided.  Reuse is easier because the modules are not coupled to each other.

## Dividing Contacts

The contacts app has 3 lists that filter the grid of contacts.  You can create additional categories and contacts by clicking the 'new' icon.
	
The application can be divided up into a few widgets:

* List - accepts a generic data source and layout, renders and updates the list.
* Grid - accepts a generic data source, renders a grid.
* Sort - sorts the grid items.
* Create - renders a form to create a new instance from a data source.

Heres a visual representation of how this app is broken up into modules.

@image tutorials/images/contacts-widgets.jpg

## Folder Structure

The code for these widgets is divided into three top level folders: MXUI, Jupiter, and Contacts.

### MXUI

[https://github.com/jupiterjs/mxui MXUI]  (jQueryMX User Interface) is a JavaScriptMVC widget library. The Grid and List widgets from MXUI are used in Contacts.

### Jupiter

Each isolated module lives in its own directory.  Those directories are then grouped in a namespace, for example _Jupiter_ or the name of your company.  These modules are intended to be reused across applications.

The Jupiter folder contains:

* create - renders a form to create a new instance from a data source.
* style - attaches jQuery UI styles to elements.
* scrollable_grid - creates a infinitely scrollable grid using the MXUI grid.  

### Contacts

Finally, we need a widget that loads the modules and ties them together into a application.  In this application, the contacts folder contains this 'application widget'.

This widget will be where the application starts, loading each module, initializing them, and gluing them together.

	$.Controller("Contacts.Controller", {
		init: function(){
			
			this.params = new Mxui.Data();
			
			$("#category .list_wrapper").mxui_data_list({
				model : Contacts.Models.Category,
				show : "//contacts/views/categoryList",
				create: "//contacts/views/categoryCreate"
			});
				
			$("#location .list_wrapper").mxui_data_list({
				model : Contacts.Models.Location,
				show : "//contacts/views/categoryList",
				create: "//contacts/views/categoryCreate"
			});

The contacts widget listens for events using event delegation and communicates with cousin widgets.

	"#category .list_wrapper activate": function(el, ev, item){
		this.params.attr("categoryId", item.id);
	}, 
	"#category .list_wrapper deactivate": function(el, ev, item){
		this.params.attr("categoryId", null);
	}

In the [contacts.glue Gluing Modules Together] section, we will touch more on the pattern used to facilitate this cross-widget communication.

Additionally in the contacts folder, you will find the building blocks of any JavascriptMVC application: models for communication with the server, fixtures for simulating AJAX responses from the server, and functional tests for testing the application.

In the next section, we will get into more detail about [contacts.designing how to design each module].