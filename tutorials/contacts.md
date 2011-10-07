@page contacts Contacts
@parent examples 1

# Contacts

The contacts is a tutorial application that introduces and explains step-by-step how to architect a JavascriptMVC 3.0 style application.

This tutorial describes:

* Installing and running the application
* The application's structure and organization
* How the application's widgets were designed
* The anatomy of the application's widgets
* How we glued the application's widgets together using event-oriented-architecture

Using techniques we will cover in this tutorial, you will learn how to build an application that is very modular, testable, and easy to add-on to.

The contacts is a lightweight application that allows users to add and organize their friend's contact information.

@image tutorials/images/contacts-preview.jpg

## Setup

The application source is hosted by [GitHub](http://www.github.com); you can either download the application using GetJS
	
	./js steal/getjs contacts

or clone the code using the following commands:

	$ git clone https://github.com/jupiterjs/contacts
    $ cd contacts
    $ git submodule update --init

Once you get the application from GitHub you should have structure similar to below. 

	/todo [top-level, the GitHub repo]
  		/jquery
    		/class
    		/controller
    		/model
    		/view
    		jquery.js
    		...
  		/steal
    		/build
    		/generate
    		js
    		js.bat
    		steal.js
    		...
  		/funcunit
    		/qunit
      		qunit.js
      		...
    	/scripts
    		/test
    		funcunit.html
    		funcunit.js
    		qunit.html
    		...
  		/contacts
    		/scripts
    		/test
			/models
			/fixtures
			/views
    		funcunit.html
    		qunit.html
    		contacts.css
    		contacts.js
    		...
		contacts.html

To run the application, simply double click _contacts.html_ in the root folder.  We will be using fixtures to simulate the server responses so running it in a server configuration really isn’t necessary.