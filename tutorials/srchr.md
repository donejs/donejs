@page srchr Srchr
@parent examples 0

Srchr searches several data sources for content and displays it to the user.  See it in action [here](http://javascriptmvc.com/srchr/). This article covers:

- the ideas behind JavaScriptMVC
- how JavaScriptMVC enables code separation
- srchr's architecture

This article will talk about architecture of the Srchr application, and how evented architecture can help you build loosely coupled, scalable applications. You will also learn how to assemble small pieces of functionality into the full blown application.

## Installing the Srchr

You can install Srchr by using steal's [steal.get getjs] or via the [git repository](https://github.com/jupiterjs/srchr).

### 1. Installing with getjs

The simplest way to install Srchr is to use the built in getjs script:

    $ ./js steal/getjs srchr
    
It will download the whole application complete with dependencies.

### 2. Installing via git

You can also install the Srchr app by cloning the git repo:

    $ git clone https://github.com/jupiterjs/srchr
    $ cd srchr
    $ git submodule update --init
    
Srchr is now ready to be used.

## How was Srchr built

Srchr was built the 'JavaScriptMVC' way. It has a folder/file structure where:

* Code is logically separated and tested
* Code is easily assembled into higher-order functionality.
* Higher order functionality is tested.
* We are able to regression test.

## How to organize and separate code

Every JavaScript application implements different widgets to show and manipulate data. In JavaScriptMVC every one of these widgets is built as a standalone part that can be reused and tested. These widgets communicate to each other with events which results in a loosely coupled application. 

Srchr is broken into logically separated components: 

* Disabler - Listens for search messages and disables tab buttons. 
* History - A cookie saved list of items. 
* Search - Creates a search message when a search happens. 
* Search Result - Seaches for results and displays them. 
* Tabs - A Basic Tabs widget. 


@image tutorials/images/diagram.gif


@image tutorials/images/app_organization.png


By implementing each widget as loosely coupled to the rest of the application, we can easily organize code. Every widget is living in it's own directory complete with tests and resources.

That way we can test each of the widgets separately, and reuse the code across the projects.

### Srchr's workflow

Srchr's workflow can be outlined like this:

1. User selects (via checkboxes) services that should be searched
2. User enters search term and clicks search button
3. On tab activation search is performed and results are shown (since first enabled tab is active by default, these results will be shown immediately)
4. Search params are saved to the history (cookie)

### Search widget

All of these actions are bound to the search event that is triggered by the search widget. When the user performs a search these are the actions that get triggered:

1. Disabler widget listens to the search event and disables or enables tabs based on the checkboxes' states
2. Search results widget shows results for the first enabled tabs
3. History widget saves the search params to the cookie

### Tab widget

When the user clicks another tab it will trigger the activate event on that tab, which results in following actions:

1. Disabler widget listens to the activate event and checks if the tab is disabled. If it is it will prevent the activate event from bubbling.
2. Tabs widget listens to the activate event, and if it wasn't prevented from bubbling by the disabler widget, it will trigger the show event on the corresponding tab panel
3. Search results widget listens to the show event on the tab panel, and when triggered performs search and shows results to the user

Let's take a detailed look in to the tab widget:

#### 1. Disabler widget

Disabler widget has two event handlers. First one listens to the activate event on list items:

    "{activateSelector} activate": function( el, ev ) {
        if ( el.hasClass('disabled') ) {
    		ev.preventDefault();
    	}
    }

It looks if the element has the disabled class and if it does it will prevent bubbling of the activate event. 

Other event handler listens to the search event on the documentElement. This event gets triggered by the search widget

    "{listenTo} search": function( el, ev, data ) {
    	var types = {},
    		first = true;

    	// Fill the list of types to check against.
    	$.each(data.types, function( index, type ) {
		
    		// Model types come in as Srchr.Model.typeName, so just get the last part
    		types[type.split('.').pop()] = true;
    	});

    	this.element.find(this.options.activateSelector).each(function(){
    		var el = $(this);

    		// If the Model type we are iterating through is in the list, enable it.
    		// Otherwise, disable it.
    		if ( types[el.text()] ) {
    			el.removeClass("disabled");
    			if ( first ) {
    				el.trigger('activate');
    				first = false;
    			}
    		} else {
    			el.addClass("disabled");
    		}
    	});
    }


This method will get triggered on search. It will check which services are selected and based on that add or remove "disabled" class from the tab elements. It will also activate the first active tab.

#### 2. Tabs widget

Tabs widget has a simple task, it listens to the "click" event on the tab, and triggers the "activate" event:

    "li click": function( el, ev ) {
    	ev.preventDefault();
    	el.trigger("activate");
    }

It will also handle the "activate" event if it is not prevented by the disabler widget:

    activate: function( el ) {
        this.tab(this.find('.active').removeClass('active')).hide();
    	this.tab(el.addClass('active')).show().trigger("show");
    }

#### 3. Search results widget

Search results widget listens to the show event to load search results and show them in the tab panel:

    /**
     * Show the search results. 
     */
    "show": function(){
    	this.getResults();
    },

    /**
     * Get the appropriate search results that this Search Results container is supposed to show.
     */
    getResults: function(){
    	// If we have a search...
    	if (this.currentSearch){
		
    		// and our search is new ...
    		if(this.searched != this.currentSearch){
    			// put placeholder text in the panel...
    			this.element.html("Searching for <b>"+this.currentSearch+"</b>");
    			// and set a callback to render the results.
    			this.options.modelType.findAll({query: this.currentSearch}, this.callback('renderResults'));
    			this.searched = this.currentSearch;
    		}
		
    	}else{
    		// Tell the user to make a valid query
    		this.element.html("Enter a search term!");
    	}
	
    }


## Assembling the Srchr app

After the widgets were developed and tested in the isolation, they need to be assembled into the application. Here is a quick overview of the techniques used to assemble the widgets in to the Srchr app.

Srchr is a small application, so most of the assembling is done in the srchr.js file. When you generate the JavaScriptMVC application:

    ./js jquery/generate/app srchr

it will create the directory and file structure that will look like this:

@image tutorials/images/app_scaffold.png


srchr/srchr.js file is your main JavaScript file that should load all higher order widgets and bootstrap the application. If you open the srchr.js file you will see something similar to this:

    // Load all of the plugin dependencies
    steal('bunch/of/dependencies).then('srchr/srchr.less', function($){
      ....
    });
    
Steal will first load all of the dependencies, and then run the function which is usually defined as a last argument. You can think of this function as of application controller. It's responsibilities usually are:

* render base application view on the page
* find elements and initialize higher order widgets

Srchr is a small application so all bootstrapping is done in the srchr.js file. When you have a bigger application that handles multiple resources you should create resource based higher order widgets that take care of bootstrapping and assembling of that part of application. You can read more about this [here](http://edge.javascriptmvc.com/jmvc/docs.html#!organizing)

## Dependency management - Steal

JavaScriptMVC comes with the dependency manager called Steal. It allows every widget to list it's dependencies:

    steal('plugin/name', 'jquery/controller', './widget.css', function(){ ... })
    
Steal is smart enough to load resources only once even though multiple widgets may list the same resource. You can read more about steal in it's [own documentation](http://edge.javascriptmvc.com/jmvc/docs.html#!stealjs).

## Use JavaScriptMVC to test and build application

After your modules are built and assembled to the application there are some steps left before your application is ready.

### How to test your application with JavaScriptMVC

JavaScriptMVC comes with two test frameworks built in. QUnit is used to unit test your models and FuncUnit functionally tests your whole application.

If you open srchr/qunit.html in your browser, it will run unit tests, and for functional testing open srchr/funcunit.html. Read more about [FuncUnit](http://javascriptmvc.com/docs.html#&who=FuncUnit) and [QUnit](http://docs.jquery.com/Qunit).

### How to build a production version

JavaScriptMVC comes with the build script for your applications. That way you can have everything separated and isolated in the development mode, but in production it gets compiled to two files: production.js and production.css. 

You can build the srchr application by running:

    $ ./js srchr/scripts/build.js
    
## Conclusion

Successful building of frontend applications depends on many things, but one of the most important is the architecture. In this article we've seen how to us evented architecture to build loosely coupled and isolated modules that are assembled to bigger parts and finally to the application.

For instance, we could take out the disabler widget and rest of the app would continue working without problems. That is the power we need if we want to build applications that are testable, and most important maintainable. You can read more about application organization in [this article](http://edge.javascriptmvc.com/docs.html#!organizing).

