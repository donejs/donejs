@page migrate Upgrading to 3.2
@parent tutorials 10

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
if there are dependencies that have to be loaded before another. This is also important when putting code
outside of steal. Because jQuery hasn't been loaded you can not use the jQuery object. So instead of
$(document).ready use this:

    steal.then(function() {
		$('body').my_plugin();
    });


## Organizing your application

Starting with version 3.1 and fully encouraged in 3.2 JavaScriptMVC follows a new approach in organizing your application structure.
Read the complete guide on [organizing | organizing your app] to get an idea. For migrating from the old structure
the following things are important:

* The use of the _controllers_ folder is discouraged. You still can use it but organizing each controller in
their own folder with a views subfolder is the preferred way as it is a lot more obvious how your application
is split up and easier to test.
* Models reside in their own folder as they might be application wide and not controller specific
(e.g. a recipe model will be used in a recipe\_edit and a recipe\_list controller)

 
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

## Listening to model changes
 
The notifications via OpenAJAX have been dropped in favor of the [jQuery.Observe Observable] mechanism.
Check out the documentation on [jquery.model.events | Model events] for detailed information on how use it for Models. 

## Controller History

Controller history using OpenAjax has been removed in 3.2. Use [jQuery.route] for full history and routing support.

## Wrap Removed

The AJAX response converter 'wrap' and 'wrapMany' have been removed in favor of a [native jQuery converter http://api.jquery.com/extending-ajax/#Converters].

Before, you would do a _this.callback_ on the success like:

	findAll : function(params, success, error ){
		return $.ajax({
			url: '/services/recipes.json',
			type: 'get',
			data: params
			dataType : 'json',
			success: this.callback(['wrapMany',success])
		});
	}

now becomes:

	findAll : function(params, success, error ){
		return $.ajax({
			url: '/services/recipes.json',
			type: 'get',
			data: params
			dataType : 'json recipe.models',
			success: success
			});
		}
		
## Callback Renamed to Proxy

The _this.callback_ method has been deprecated and the preferred method is now _this.proxy_.

## steal.browser.rhino removed

The _steal.browser.rhino_ has been removed. We are using _steal.browsers_ namespace for the browser drivers.  If you were using this to have rhino skip files in the build process, you can now use: _steal.isRhino_.

## Associations

Associations were removed in favor of [jQuery.Model.static.attributes].  Attribute type values can also represent the name of a function which is used is for associated data now.

## Upgrade Process and Advice

The changes listed above require significant adaptation of your code base.

1) The word 'controllers' is no longer good for JMVC. If you have controllers in a directory of that name, change the name to something else. JMVC has new, automatic behavior that will break your system if you don't. 

Controller names must also be changed to the new directory name. Eg,

	jQuery.Controller.extend('Appname.Controllers.Controllername')

becomes

	jQuery.Controller.extend('Appname.NewName.Controllername')

and, the instantiation,

	appname_controllers_controllername()

becomes

	appname_newname_controllername()

2) The suffix "_controller" is no longer valid. Remove it from your controller names.

3) Steal() has changed completely. It no longer has specific methods for different kinds of files. Eg,

	steal.plugins(
			'jquery/controller',
			'jquery/controller/view'
	)

Becomes

	steal(
			'jquery/controller',
			'jquery/controller/view'
	)

As do all the rest of the type-specific loaders: .resources(), .models(), .controllers(), .views() & .css()

4) The base directory steal() looks in has changed. Instead of referring to the directory containing the steal() build file, it refers to the directory containing the *call*, ie, if you have 

	foo/index.html containing <script src='steal/steal.js?appName'>

Steal() will find your build file:

	foo/appName/appName.js

Previously, an unqualified reference, eg,

	steal.resource('someJqueryPlugin');

would find 

	foo/appName/someJqueryPlugin.js

now you must use:

	steal('appName/someJqueryPlugin.js');

Where appName/ is in the same directory as index.html.

Note that both the application directory and extension are now necessary for most files (except controllers which refer to a directory structure).

5) Steal() no longer makes assumptions about your directory structure. It no longer assumes, for example, a 'models' directory. File paths must, therefore be fully specified. 

Instead of 

	steal.models( 'session');

Use

	steal('appDir/models/session');

5) Steal() now defaults to asynchronous loading. You must insure that your dependencies are loaded in the correct order using steal.then().

If you have nested controller directories, eg

parentController/
--------parentController.js
--------subordinateController/
----------------subordinateController.js
----------------views/
------------------------subordinateController.ejs
--------views
----------------parentController.ejs

Make sure that you have them in the correct order

steal('parentController')
.then('subordinateController')

If they are* reversed*, the creation of parentController will overwrite the pre-existing directory containing subordinateController.

(Note also, different from other components, controllers are *not* called as files. They are referred by their directory and assumed to have a javascript file of the same name inside.)

It is also possible for controllers to be instantiated and views executed before loading is finished. CSS files must be appropriately sequenced, too.

6) Initialization of the system has changed. The "unload" controller is no longer valid and does not run. $.ready() might run before components are all loaded.

Remove "onDocument: true". Change the controller method load() to init() (ie, make it like other controllers).

Add an instantiation of the initial controller to steal(). (Steal() now allows the final parameter of any of its methods to be a function.) Eg,

steal(
	'appName/initializingController'
)
.then(
	'appName/someOtherController',
	function(){
		appName_initializingController(); //run initializing controller
		//any $.ready() code goes here, too
	}
);

7) With asynchronous loading, it is possible for dom elements to be queued but not rendered by the time they are needed by system code. For example, it is possible to get wrong values from jquery, for DOM elements that have been sent to the browser by code but not yet written to the DOM. It may be necessary to wrap initializing code in a timeout() of tenth of a second or so.

8) this.publish() no longer works in models.

You must now use:

	$([this]).trigger(eventName, data); //where this is the model with the call

To receive the event in a controller, the old syntax no longer works.

Instead of

	'modelName.eventName subscribe':function(eventName, data){}

use

	'{appName.models.modelName} eventName': function(sourceObject, eventObject, data){}

Note that the parameters to the receiving function have changed completely.

9) In views rendered with EJS, the output delimiter:

	<%=varName%>

now produces html that is escaped.

When this is undesirable (eg, when the variable contains html), you must use:

	<%==varName%>

To send the variable data unchanged.

10) formParams() now produces an array for radio buttons. You must add 

	radioVarName=this.element.formParams().radioVarName.pop();

To extract a scalar value.

11) formParams() no longer evaluates form values by default. Boolean variables containing the value 'true' or 'false' are not x===true or x===false, they are typeof(x)=='string'. Similarly with numbers. To return to the previous behavior, you must change the call to formParams(true). This will tell the method to evaluate parameters.
