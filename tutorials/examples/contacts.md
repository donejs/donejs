@page contacts Contacts 
@parent examples 3

In this article we will walk through installing and the ins-and-outs of Contacts. Contacts is a lightweight application that allows users to add and organize their friends' contact information.

This tutorial describes:

- Installing and running the application
- The application's structure and organization
- Dividing the application into modular widgets
- Tieing the widgets together

@image ../tutorials/images/contacts_preview.png

Let's get started!

## Setup

The application source is hosted by [GitHub](https://github.com/bitovi/contacts). You can download the application on github using the following commands:

	$ git clone https://github.com/bitovi/contacts
    $ cd contacts
    $ git submodule update --init

To run the application, open _contacts.html_ with your browser.  We will be using [can.fixture fixtures] to simulate the AJAX requests so running it from a server isn’t necessary.

This will run the application in development mode.  If you want to build and run the application in production, in the command line run:

	$ ./js contacts/scripts/build.js

then change the script tag in `contacts.html` to be in production mode:

	<script type='text/javascript' src='steal/steal.production.js?contacts'></script>

Additionally, the app can be found on [Github Pages](http://bitovi.github.io/contacts/) if you do not want to set it up.

## Folder Structure

The application resides in the `contacts` folder.  Steal, CanJS, and CanUI folders sit perpendicular to this for reuse in other projects.  The directory structure should mirror below.

	[top-level]
  		/can 
  		/steal 
  		/funcunit
  		/contacts
  			/form
    		/scripts 
    		/test 
			/models 
			/fixtures 
			/views 
			/less
    		funcunit.html 
    		qunit.html 
    		contacts.js
    		...
		contacts.html
		stealconfig.js

The contacts folder contains: 

- `models` AJAX end-point definitions and helpers
- `views` EJS/Mustache can.view templates
- `fixtures` simulated AJAX response
- `less` LESS stylesheet such as [Boostrap](http://twitter.github.io/bootstrap/) 3.0 and `contacts.less`
- `contacts/form` child components of contacts

Along with runners and scripts for building and tests.

## Division of Modules

The secret to building large applications is NEVER build large applications. Understanding how to divide and isolate modules in the application is the first step towards maintainable architecture.

The goal for dividing your application should be to create modules that are isolated.

Isolated modules are:

- Limited to one specific purpose, for example showing a list of data
- Rarely reference other modules and never their parents
- Have a simple generic API making them easy to swap out

Isolated modules are easily testable because they have a small, well defined scope.  Each piece can be worked on in parallel because the code is divided.  Reuse is easier because the modules are not coupled to each other.

### Dividing Contacts

The contacts app has 3 lists that filter the grid of contacts.  You can create additional categories and contacts by clicking the 'new' icon.
	
This application can be divided up into a few widgets:

* List - accepts a generic data source and layout, renders and updates the list.
* Grid - accepts a generic data source, renders a grid.
* Form - create a new instance from a data source.

Heres a visual representation of how this app is broken up into modules.

@image ../tutorials/images/contacts_design.png

## Tying it all together

`contacts/contacts.js` will be where the application starts: loading each module, initializing them, and gluing them together.

In the `init` method, we initalize all the base objects and inject the base view.

	init: function(){
		// initalize the lists and objects
		this.categoryList = new Models.Category.List;
		this.locationList = new Models.Location.List;
		this.companyList  = new Models.Company.List;
		this.contactsList = new Models.Contact.List;
		this.edited       = new Observe;
		this.total        = can.compute(0);
		this.isLoading    = can.compute(function(loading){
			loading ? loadingCounter++ : loadingCounter--;
			return loading > 0;
		});

		// Draw the view, setup helpers and partials
		this.element.html(initView({ ... });

		// Initalize each Form category
		can.each(['location', 'category', 
        'company', 'contact'], function(formType){
			new Form(this.element.find('#' + formType), {
				edited : this.edited,
				model  : Models[can.capitalize(formType)],
				list   : this[formType + 'List']
			});
		}.bind(this));

		this.setupScroll();
		this.loadFilters();
		this.loadContacts();
	}

From this point on, the application uses live-binding to update the lists/views based on the filter/offset.

	{{#contacts}}
		{{>contact}}
	{{/contacts}}

As the `contacts` list changes, the view automatically updates to reflect the new list.

## Wrapup

In this article, we explored:

- Installing and running the application
- The application's structure and organization
- Dividing the application into modular widgets
- Tieing the widgets together

If you're interested in other examples, check out the other application examples.