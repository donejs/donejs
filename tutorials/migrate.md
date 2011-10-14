@page migrate Migrating from 3.0 and 3.1
@parent tutorials 8

There are many new feature in JavaScriptMVC 3.2 that help you build great JavaScript applications.
Although 3.2 is not strictly backwards compatible it is possible to upgrade from
and earlier version. This guide outlines the things you have to look at when upgrading from
version 3.0 or 3.1.

## Steal

[stealjs | Steal] has experienced a major improvement, making it even easier to manage your dependencies.
Instead of defining what you want to steal like _steal.plugins_, _steal.controllers_ or _steal.views_ you
just steal the file and Steal will figure out what to do with it based on the extension.
So if your code used to look like this:

	steal('helper').plugins('jquery/controller', 'jquery/view/ejs', 'jquery/controller/view').views('init.ejs')
		.css('style').then(function($) {
		$.Controller('Test.Controller', {}, {
			init : function(el, ops)
			{
				this.element.html(this.view());
			}
		});
	});

The new Steal looks like this:

	steal('./helper.js', 'jquery/controller', 'jquery/view/ejs', './views/init.ejs', './style.css', function($) {
		$.Controller('Test.Controller', {}, {
			init : function(el, ops)
			{
				this.element.html(this.view());
			}
		});
	});
	
The rules when stealing a file:

* ./ refers to the path of the current file
* When stealing something without extension like _jquery/controller_ Steal will first look for the plugin
file _jquery/controller/controller.js_ and if not found _jquery/controller.js_ based on your applications
root path
* ./helper.js loads helper.js in the folder of the current file
* ./views/init.ejs loads the init.ejs [jQuery.EJS | EJS view] from views subfolder in the current folder
* ./style.css loads the style.css file in the current folder

Note that the new Steal runs asynchronously so you might have to be more careful using _steal.then()_
if there are dependencies that have to be loaded before another.

 
## Document controllers
 
There are no document controllers in 3.2 anymore (controllers that used have the default option _{ onDocument : true }_).
Instead initialize your controllers like any [jquery.controller.plugin | jQuery plugin] in the application file.
For document wide controllers initialize them on the document itself. 
An example how your main application file may look like:

	steal('my/controller', 'my/global/controller', function($) {
		$(document).ready(function($) {
			$(document).global_controller();
			$('.thing').my_controlller();
		});
	});

Note that unlike the old document controllers a global controller will not listen to a specific id.

## Listening to model and history changes
 
The notifications via OpenAJAX have been dropped in favor of the [jQuery.Observe Observable] mechanism.


## Controller History

Controller history was dropped in 3.2 in favor of [jQuery.route routes].