@page srchr Srchr
@parent examples 0

Srchr searches several data sources for content and displays it to the user.  See it in action [here](http://javascriptmvc.com/srchr/). This article covers:

- Installing Srchr
- The ideas behind JavaScriptMVC (JMVC)
- How JMVC enables code separation
- Srchr's architecture

This article will talk about the architecture of the Srchr application, and how event oriented architecture can help you build loosely coupled, scalable applications. You will also learn how to assemble small pieces of functionality into the full blown application.

## Installing Srchr

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
    
Once you get the application you should have a structure similar to below

    /srchr [top-level directory]
        /jquery
        /steal
        /funcunit
        /scripts
        /srchr
            /scripts
            /test
            /models
            /fixtures
            /views
            funcunit.html
            qunit.html
            srchr.css
            srchr.js
            srchr.html
            ...
            
Srchr is now ready to be used. To run the Srchr application simply open _srchr/srchr.html_ in your browser. We will be using [jQuery.fixture fixtures] to simulate AJAX requests so running it in a server isn't necessary ([googlefilesystem unless you're using Chrome])

## How Srchr was built

Srchr was built the 'JavaScriptMVC' way. It has a folder/file structure where:

* Code is logically separated and tested
* Code is easily assembled into higher-order functionality.
* Higher order functionality is tested.

## How to organize and separate code

Every JavaScript application implements widgets to show and manipulate data. In JavaScriptMVC every one of these widgets is built as an isolated part that can be reused and tested. These widgets communicate to each other with events, which results in a loosely coupled application. 

Srchr is broken into logically separated components: 

* Disabler - Listens for search messages and disables tab buttons. 
* History - A cookie saved list of items. 
* Search - Creates a search message when a search happens. 
* Search Result - Seaches for results and displays them. 
* Tabs - A basic tabs widget. 


This is the event diagram of Srchr:

@image tutorials/images/diagram.png



This is the widget organization in Srchr:

@image tutorials/images/app_organization.png



By creating dumb, isolated widgets with a loose coupling to the rest of the application, we can easily organize code. Every widget is living in it's own directory complete with tests and resources.  This allows us to test each of the widgets separately and reuse the code across projects.

### Srchr's workflow

Srchr's workflow can be outlined like this:

1. User selects (via checkboxes) services that should be searched
2. User enters search term and clicks the search button
3. On tab activation a search is performed and results are shown (since first enabled tab is active by default, these results will be shown immediately)
4. Search params are saved to the history (via cookie)

### Search behavior

When the user performs a search, these are the actions that get triggered:

1. Disabler widget listens to the search event and disables or enables tabs based on the checkboxes' states
2. Search results widget shows results for the first enabled tab
3. History widget saves the search params to the cookie

This is the event architecture of the search:

@image tutorials/images/diagram_search.png


### Tab behavior

When the user clicks another tab it will trigger the activate event on that tab, which results in the following actions:

1. Disabler widget listens to the activate event and checks if the tab is disabled. If it is, it will call preventDefault on the activate
2. Tabs widget listens to the activate event, and if it wasn't prevented, it will trigger the show event on the corresponding tab panel
3. Search results listens to the show event on the tab panel, and when triggered performs a search and shows results to the user

This is the event architecture of the tabs:

@image tutorials/images/diagram_tabs.png


Let's take a detailed look at the tab behavior:

#### 1. Disabler widget

Disabler widget has two event handlers. The first one listens to the activate event on list items:

    "{activateSelector} activate": function( el, ev ) {
      if ( el.hasClass('disabled') ) {
        ev.preventDefault();
      }
    }

It looks if the element has the disabled class and if it does it will preventDefault on the activate event. 

Other event handler listens to the search event. This event gets triggered by the search widget

    "{Srchr.Models.Search} search": function( el, ev, data ) {
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


The event handler checks which services are selected and adds or removes the "disabled" class from tab elements. It will also activate the first active tab.

#### 2. Tabs widget

Tabs widget has a simple task: listen to the "click" event on the tab, and trigger the "activate" event:

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


## Assembling an application

After the widgets are developed and tested in isolation, they need to be assembled into an application. Here is a quick overview of the techniques used to assemble the widgets in to the Srchr app.

Srchr is a small application, so most of the assembling is done in the srchr.js file. When you generate a JavaScriptMVC application:

    ./js jquery/generate/app srchr

it will create the directory and file structure that look like this:

@image tutorials/images/app_scaffold.png


srchr/srchr.js file is your main JavaScript file that should load all higher order widgets and bootstrap the application. If you open the srchr.js file you will see something similar to this:

    // Load all of the plugin dependencies
    steal('bunch/of/dependencies).then('srchr/srchr.less', function($){
      ....
    });
    
Steal will first load all of the dependencies, and then run the function which is usually defined as a last argument. This function is where the application bootstrapping logic lives. It's responsibilities usually are:

* render application skeleton on the page
* find elements and initialize higher order widgets

Srchr is a small application so all bootstrapping is done in the srchr.js file. When you have a bigger application that handles multiple resources you should create resource based higher order widgets that take care of bootstrapping and assembling that part of application. You can read more about this [here](http://edge.javascriptmvc.com/jmvc/docs.html#!organizing).

## Testing your application

JavaScriptMVC comes with two testing frameworks built in. QUnit is used to unit test your models and FuncUnit functionally tests your whole application.

If you open srchr/qunit.html in your browser, it will run unit tests. For functional testing open srchr/funcunit.html. Read more about [FuncUnit](http://javascriptmvc.com/docs.html#&who=FuncUnit) and [QUnit](http://docs.jquery.com/Qunit).

In this article we already covered the separation of code, but another aspect of code separation is test isolation. In every module folder you will have a test file that should test only that widget. The usual module folder structure looks like this:

    funcunit.html
    funcunit/
        tabs_test.js
        funcunit.js
    tabs.js
    tabs.html
    
Every module has a demo page that helps you develop and test that module in isolation. In the case of the tabs widget this file is called tabs.html. If you open that file you will see this code:

    <h1>Srchr.Tabs</h1>
    <p>A very basic tabs widget that creates 'activate' events.</p>
    <h2>Demo</h2>
    <p>Click the different tabs.</p>
      <ul id='resultsTab'>
      <li><a href='#flickr'>Flickr</a></li>
      <li><a href='#yahoo'>Yahoo</a></li>
      <li><a href='#upcoming'>Upcoming</a></li>
    </ul>

    <div id='flickr' class='tab'>one</div>
    <div id='yahoo' class='tab'>two</div>
    <div id='upcoming' class='tab'>three</div>

    <script type='text/javascript' src='../../steal/steal.js'></script>

    <script type='text/javascript' >
      steal('srchr/tabs', function(){
        $('#resultsTab').srchr_tabs();
      })
    </script>


As you can see this page bootstraps the tabs widget. This is the minimum needed for the tabs widget to run. You should always use the demo page to develop your widgets because you can also use that page to test that widget. In the case of the tabs widget that code is in tabs/funcunit/tabs_test.js:

    module("srchr/tabs",{
      setup : function(){
        S.open('//srchr/tabs/tabs.html')
      }
    });


    test("Proper hiding and showing", function() {
      S("li:eq(1)").click();
      S("div:eq(1)").visible(function() {
        equals(S("div:eq(0)").css('display'), 'none', "Old tab contents are hidden");
        ok(!S("li:eq(0)").hasClass('active'), 'Old tab is not set to active');
        equals(S("div:eq(1)").css('display'), 'block', "New tab contents are visible");
        ok(S("li:eq(1)").hasClass('active'), 'New tab is set to active');
      });
    });

    test("Clicking twice doesn't break anything", function() {
      S("li:eq(2)").click();
      S("li:eq(2)").click();

      S("div:eq(2)").visible(function() {
        equals(S("div:eq(2)").css('display'), 'block', "New tab contents are visible");
        ok(S("li:eq(2)").hasClass('active'), 'New tab is set to active');
      });
    });

What this code does is:

- Opens the tabs' widget demo page (tabs.html). That sets up the tabs widget
- Simulates the user interaction necessary to test the widget.

The first test ("Proper hiding and showing") does the following:

- Find the second list element and click on it
- Wait until the second div is visible
- Check if the first div is hidden
- Ensure that first list item doesn't have an "active" class
- Check if the second div is shown
- Ensure that second list item has an "active" class

FuncUnit allows you to write high fidelity tests, that resemble user's interaction as close as possible. 

This is the pattern you should use when you develop your applications. Every widget should have it's own set of tests. You should also have application level tests that test how the widgets work together. You can find this file in test/funcunit/srchr_test.js. This file tests all of the higher level srchr's functionality. 

Test example from the application level test file:

    test('Search shows results in selected service', function(){
  
      S('input[value=Srchr\\.Models\\.Twitter]').click();
      S('#query').click().type('Dogs\r');
  
      // wait until there are 2 results
      S("#twitter li").exists( function(){
    
        ok(true, "We see results in twitter");
        // make sure we see dogs in the history
    
        var r = /Dogs\st/;
    
        ok(r.test(S("#history .search .text").text()), "we see dogs correctly");
    
        // make sure flickr and everyone else is diabled
        ok(S('#resultsTab li:eq(1)').hasClass('disabled'), "Flickr is disabled.");
        ok(S('#resultsTab li:eq(2)').hasClass('disabled'), "Upcoming is disabled.");
      }); 
  
    })

This code tests multiple widgets at once:

- (Search widget) It finds the input (checkbox) with the value "Srchr.Models.Twitter" and clicks it
- (Search widget) It enters "Dogs" into the search input and submits the search
- (Search result widget) Waits until results are visible
- (History widget) Checks if "Dogs" is added to the history
- (Tabs widget) Checks if Flickr and Upcoming tabs are disabled

You can find all of the srchr tests here:

- Disabler widget: [test code](https://github.com/jupiterjs/srchr/blob/master/srchr/disabler/funcunit/disabler_test.js), [test page](http://javascriptmvc.com/srchr/disabler/funcunit.html)
- History widget: [test code](https://github.com/jupiterjs/srchr/blob/master/srchr/history/funcunit/history_test.js), [test page](http://javascriptmvc.com/srchr/history/funcunit.html)
- Search widget: [test code](https://github.com/jupiterjs/srchr/blob/master/srchr/search/funcunit/search_test.js), [test page](http://javascriptmvc.com/srchr/search/funcunit.html)
- Search result widget: [test code](https://github.com/jupiterjs/srchr/blob/master/srchr/search_result/funcunit/search_result_test.js), [test page](http://javascriptmvc.com/srchr/search_result/funcunit.html)
- Search tabs widget: [test code](https://github.com/jupiterjs/srchr/blob/master/srchr/search_tabs/funcunit/search_tabs_test.js), [test page](http://javascriptmvc.com/srchr/search_tabs/funcunit.html)
- Tabs widget: [test code](https://github.com/jupiterjs/srchr/blob/master/srchr/tabs/funcunit/tabs_test.js), [test page](http://javascriptmvc.com/srchr/tabs/funcunit.html)
- Application tests: [test code](https://github.com/jupiterjs/srchr/blob/master/srchr/test/funcunit/srchr_test.js), [test page](http://javascriptmvc.com/srchr/funcunit.html)



## Building a production version

To build scalable and maintainable JavaScript applications, you should keep your code separated and isolated, but when you want to deploy you want as few files as possible, and you want your scripts minified. JMVC uses Steal to build a minified production version of your code. You can build your app by running the build.js script available in every JMVC project. You can build Srchr by running:

    $ ./js srchr/scripts/build.js
    
This will compile and minify all of your JS code into the production.js and all of your CSS code in the production.css file.
    
## Conclusion

Successful completion of frontend applications depends on many things, but one of the most important is architecture. In this article we've seen how to use event oriented architecture to build loosely coupled and isolated modules that are assembled into an application.

For instance, we could take out the disabler widget and rest of the app would continue working without problems. That is the power we need to build applications that are testable and maintainable. You can read more about application organization in [this article](http://edge.javascriptmvc.com/docs.html#!organizing).

