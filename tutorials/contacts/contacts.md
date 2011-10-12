@page contacts Contacts
@parent examples 1

This is a tutorial application that introduces and explains step-by-step how to architect a JavascriptMVC 3.0 style application using a contacts application.  Contacts is a lightweight application that allows users to add and organize their friends' contact information.

This tutorial describes:

* Installing and running the application
* The application's structure and organization
* How the application's widgets were designed
* The anatomy of the application's widgets
* How we glued the application's widgets together using event-oriented-architecture

Using techniques we will cover in this tutorial, you will learn how to build an application that is modular, testable, and scaleable.

@image tutorials/images/contacts_preview.jpg

## Setup

The application source is hosted by [GitHub](https://github.com/jupiterjs/contacts). You can either download the application using [steal.get GetJS]
	
	./js steal/getjs contacts

or clone the code using the following commands:

	$ git clone https://github.com/jupiterjs/contacts
    $ cd contacts
    $ git submodule update --init

Once you get the application from GitHub you should have structure similar to below. 

	[top-level]
  		/jquery
  		/steal
  		/funcunit
    	/scripts
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

To run the application, open _contacts.html_ with your browser.  We will be using [jQuery.fixture fixtures] to simulate the AJAX requests so running it from a server isn’t necessary.

Once the application is displayed in your browser, continue to [contacts.dc Divide and Conquer] to learn how we split up the application.