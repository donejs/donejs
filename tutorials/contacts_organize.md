@page organizing_modules Organizing Modules
@parent contacts 0

# Organizing Modules

The application is organized in a sense that everything is a widget.  This is a slightly different approach than applications are typically organized, as a big application with widgets in them.  This pattern and organization technique allows us to get the most re-use out of the widgets.  As we continue to build on the application, we simply just add more widgets.   

As you begin to build your application, a common practice I use is to look at the application and start splitting up the UI elements into widgets.  Below is a layout of the contact's widgets with their respective widget names over them.

@image tutorials/images/contacts-widgets.jpg

Widgets are typically organized in two different categories; specific to the application your building or generic so they could be used in various other projects.  The widgets that are more generic and can be used in other applications, I create a folder titled the name of the organization I'm developing these widgets for.  Additionally, if I'm using a third-party widget library I would create another top-level folder for that repository.

This application is broken down into 3 main namespaces; these are: 

* MXUI
* jupiter
* contacts

## MXUI

MXUI, formally known as jQueryMX User Interface, is a widget library managed by Jupiter Consulting group.  It contains a set of low-level widgets that help you accomplish annoying things developers often have to face when building complex widgets.  It’s not intended to be another jQuery widget library but instead simple widgets and utilities to help you build the bigger picture.  

One example of a MXUI widget we are using in this application is: _MXUI.Data.List_.  List is a simple widget that given a model it will display the results.  Additionally, List will listen for update and destroy events to update the list accordingly.  In the next section, we will talk about developing highly reusable widgets like _List_.

This is just one of many widgets you will find the library including several others like: Grid, List, Menuable, and many more. This project is open source and available on [GitHub](https://github.com/jupiterjs/mxui).

## Jupiter

Jupiter is where independent widgets and utilities go that could be used in ANY application.  These widgets should NOT be coupled to the contacts widget and would be very generic in nature so that you might re-use them on another project.  

One example of a widget we are using in this application is the _jupiter/style/style.js_.  Style is a widget that will style headers and box elements using jQueryUI CSS classes.

	steal('jquery').then(function($){
		var style$ = jQuery.sub();
		style$.extend(style$.fn,{
			box : function(){
				return this.addClass('ui-widget ui-widget-content ui-corner-all')
				},
				header : function(){
					return this.addClass('ui-helper-reset ui-state-active')
					},
					$ : function(){
						return $(this);
					}
					});
					$.fn.style$ = function(){
						return style$(this)
					}
				})

As you can see this could be used in any application you might be leveraging the jQueryUI CSS themes.  

## Contacts

The contacts widget is the primary widget in the application.  This widget will be where the application starts and will act as a master controller gluing all the widgets together.  When this widget is added to the page it will bring all the secondary widgets with it and then begin initializing them with the appropriate settings for the application.

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

The contacts widget will also listen for events on the widgets it initialized using JavascriptMVC event delegation to help facilitate cross-widget communication.

	"#category .list_wrapper activate": function(el, ev, item){
		this.params.attr("categoryId", item.id);
	}, 
	"#category .list_wrapper deactivate": function(el, ev, item){
		this.params.attr("categoryId", null);
	}

In the _Gluing Modules Together_ section, we will touch more on the pattern used to facilitate this cross-widget communication.

Additionally in the contacts widget, you will find the building blocks of any JavascriptMVC application; models for communication with the server, fixtures for simulating AJAX responses from the server, and functional tests for testing the application.