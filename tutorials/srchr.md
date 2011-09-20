@page srchr Architecture of the Srchr app
@parent tutorials 0

# Srchr Application

The Srchr app makes searches using multiple services and saves the searches between page loads. It is an example of application organization with JavaScriptMVC. 

## The "JavaScriptMVC" way

Srchr was built the 'JavaScriptMVC' way (i.e. competently). It has a folder/file structure where:

* Code is logically separated and tested
* Code is easily assembled into higher-order functionality.
* Higher order functionality is tested.
* We are able to regression test.

## Code separation

Every JavaScript application implements different widgets to show and manipulate data. In JavaScriptMVC every one of these widgets is built as a standalone part that can be reused and tested. These widgets communicate between themselves by triggering events which allows us to build as loosely coupled application as possible. 

Srchr is broken into logically separated components: 

* Disabler - Listens for search messages and disables tab buttons. 
* History - A cookie saved list of items. 
* Search - Creates a search message when a search happens. 
* Search Result - Seaches for results and displays them. 
* Tabs - A Basic Tabs widget. 


@image tutorials/images/app_organization.png


Srchr's tab system is implemented with three widgets: tabs, search\_tabs and disabler. Each of these widgets can work completely separate from each other and each is responsible for the part of the functionality:

* search\_tabs widget is responsible for generating the HTML and drawing of tabs on the screen
* tabs widget adds "tabbing" functionality to the HTML elements. It listens for the click event and triggers the "activate" event. Tab switching is implemented by listening to the "activate" event.
* disabler widget listens to the "activate" event triggered by the tabs widget, and based on the selected services prevents the event. That way tabs widget's event listener to the "activate" event never gets triggered.


@image tutorials/images/tabs.png


## Code organization

By implementing each widget as loosely coupled to the rest of the application, we can easily organize code. Every widget is living in it's own directory complete with tests and resources.

That way we can test each of the widgets separately, and reuse the code across the projects. 

## Dependency management

JavaScriptMVC comes with the dependency manager called Steal. It allows every widget to list it's dependencies:

    steal('plugin/name', 'jquery/controller', './widget.css', function(){ ... })
    
Steal is smart enough to load resources only once even though multiple widgets may list the same resource. You can read more about steal in it's [own documentation](http://edge.javascriptmvc.com/jmvc/docs.html#!stealjs).

## Assembling higher order functionality

After you have developed your widgets in the isolation, they need to be assembled into the application. Srchr is a small application, so most of the assembling is done in the srchr.js file. When you generate the JavaScriptMVC application:

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

## Credits

The idea for srchr app came from a Rebecca Murphey's blog post as an crowd sourced exercise in collecting JavaScript wisdom. You can read more about this exercise in the [original blog post](http://blog.rebeccamurphey.com/2010/03/15/srchr-crowdsourcing-javascript-wisdom/).