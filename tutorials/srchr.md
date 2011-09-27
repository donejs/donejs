@page srchr Srchr
@parent examples 0

Srchr searches several data sources for content and displays it to the user.  See it in action [here](http://javascriptmvc.com/srchr/). This article covers:

- the ideas behind JavaScriptMVC
- how JavaScriptMVC enables code separation
- srchr's architecture

## Installing the Srchr

You can install Srchr by using steal's [steal.get getjs] or via the [git repository](https://github.com/jupiterjs/srchr).

### 1. Installing with getjs

The simplest way to install Srchr is to use the built in getjs script:

    > ./js steal/getjs srchr
    
It will download the whole application complete with dependencies.

### 2. Installing via git

You can also install the Srchr app by cloning the git repo:

    > git clone git@github.com:jupiterjs/srchr.git
    > cd srchr
    > git submodule init
    > git submodule update
    > cd documentjs && git checkout master && cd ..
    > cd funcunit && git checkout master
    > git submodule init
    > git submodule update
    > cd syn && checkout master && cd ..
    > cd ..
    > cd jquery && git checkout master && cd ..
    > cd steal && git checkout master && cd ..
    
Srchr is now ready to be used.

## The "JavaScriptMVC" way

Srchr was built the 'JavaScriptMVC' way. It has a folder/file structure where:

* Code is logically separated and tested
* Code is easily assembled into higher-order functionality.
* Higher order functionality is tested.
* We are able to regression test.

## Code organization and separation

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

Srchr's workflow can be outlined like this:

1. User selects (via checkboxes) services that should be searched
2. User enters search term and clicks search button
3. On tab activation search is performed and results are shown (since first enabled tab is active by default, these results will be shown immediately)
4. Search params are saved to the history (cookie)

All of these actions are bound to the search event that is triggered by the search widget. When the user performs a search these are the actions that get triggered:

1. Disabler widget listens to the search event and disables or enables tabs based on the checkboxes' states
2. Search results widget shows results for the first enabled tabs
3. History widget saves the search params to the cookie

When the user clicks another tab it will trigger the activate event on that tab, which results in following actions:

1. Disabler widget listens to the activate event and checks if the tab is disabled. If it is it will prevent the activate event from bubbling.
2. Tabs widget listens to the activate event, and if it wasn't prevented from bubbling by the disabler widget, it will trigger the show event on the corresponding tab panel
3. Search results widget listens to the show event on the tab panel, and when triggered performs search and shows results to the user


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

## Credits

The idea for srchr app came from a Rebecca Murphey's blog post as an crowd sourced exercise in collecting JavaScript wisdom. You can read more about this exercise in the [original blog post](http://blog.rebeccamurphey.com/2010/03/15/srchr-crowdsourcing-javascript-wisdom/).