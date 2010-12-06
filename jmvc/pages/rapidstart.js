/**
@page rapidstart Rapid Start

So, you're too lazy for the [getstarted Getting Started Guide] and want something even quicker.  Here's
a cheat sheet of 'how-tos' with JavaScriptMVC.

## How to get JavaScriptMVC:

[download Download it] or [developwithgit pull it from Git].  JavaScriptMVC is a collection of 4 projects. 
Once you have JavaScriptMVC, you should have a folder with:

    documentjs - documentation engine
    funcunit   - testing app
    jquery     - jquery and jQueryMX plugins
    steal      - dependency management
    js         - JS command line for Linux/Mac
    js.bat     - JS command line for Windows

<b>Notice</b>: This folder, the one that has all the JMVC sub projects is called the [rootfolder ROOT FOLDER]</b>.

## How to get JavaScriptMVC running on my page:

Well, typically, the first thing you'd do is use the [steal.generate Generators] to
create an application folder, complete with testing, build scripts, and documentation scripts.  But,
we're doing things the no-magic way!

JavaScriptMVC uses [steal steal/steal.js] for dependency management.  It allows you to load scripts that
might load other scripts and so forth.  To use JavaScriptMVC's features like [jQuery.Controller] and [jQuery.View],
you 'steal' them like:

    steal.plugins('jquery/controller','jquery/view').then(function(){
       //code that uses controller and view goes here
    })

To start 'stealing' JMVC, you need to add the steal script to your page.
Lets say you have a folder in the [rootfolder root folder] called <code>helloworld</code> that looks like:

    ROOT\
        documentjs\
        jquery\
        funcunit\
        steal\
        helloworld\
          helloworld.js
          helloworld.html

To load <code>steal.js</code> and <code>helloworld.js</code>, put a script tag in <code>helloworld.html</code> like:

    <script type='text/javascript'
            src='../steal/steal.js?helloworld.js'>
    </script>

This loads the steal script and your helloworld script.  Now you can use steal to load whatever you want!

## How to create a jQuery plugin / organize code:

[jQuery.Controller] is used to 
make [http://jupiterjs.com/news/writing-the-perfect-jquery-plugin perfect widget plugins].  

The following makes a tab plugin:

    steal.plugins('jquery/controller').then(function(){
    
    $.Controller("Tabs",{
      
      // initialize widget
      init : function(el){
        
        // activate the first tab
        $(el).children("li:first").addClass('active')
        
        // hide the other tabs
        var tab = this.tab;
        this.element.children("li:gt(0)").each(function(){
          tab($(this)).hide()
        })
      },
  
      // helper function finds the tab for a given li
      tab : function(li){
        return $(li.find("a").attr("href"))
      },
  
      // hides old active tab, shows new one
      "li click" : function(el, ev){
        ev.preventDefault();
        this.tab(this.find('.active').removeClass('active')).hide()
        this.tab(el.addClass('active')).show();
      }
    })
    
    });

You can see this in action [http://javascriptmvc.com/jquery/controller/controller.html here].  There are a few things to 
notice about controller:

  - It creates a jQuery plugin for you.  In this case, you can
    make a tabs like:
     
        $('#myTabsElement').tabs() // ==> new Tabs( $("#myTabsElement") ) 
  
  - The element you add the controller to (#myTabsElement), becomes <code>this.element</code> in the controller.
         
  - It automatically [http://api.jquery.com/delegate/ delegates] event handlers named like: "li click" on
    <code>this.element</code>.

## How to use a template:

Lets say you have an [jQuery.EJS] template in the root folder named <code>mytemplate.ejs</code> that looks like:

    <ul>
        <% for( var i =0; i < items.length; i++ ){ %>
          <li><%= item[i] %>
        <% } %>
    </ul>
    
And you wanted to draw a list of items in an element with id <code>itemslist</code>.  You do it like:

    steal.plugins('jquery/view/ejs').then(function(){
      
      $('#itemslist').html('//mytemplate.ejs', {items:["apple","orange"]});
      
    })

## How to organize services:

Your server is producing a list of pizza topings at <code>GET /toppings</code>.  The data that comes back
looks like:

    [{'id' : 1, 'name': 'cheese'},
     {'id' : 2, 'name': 'mushrooms'}]

You want to be able to get a list of topings and know if they are tasty (ie, is not mushrooms).  To do this, 
create a Model like:

    steal.plugins('jquery/model').then(function(){
    
      $.Model('Topping',
      {
        findAll : '/toppings'
      },
      {
        isTasty : function(){
          return this.name != 'mushroom'
        }
      });
    
    });
    
Now you can get a list of toppings wrapped with additional 
helper functions like <code>isTasty</code>:

    Topping.findAll({},function(toppings){
      alert('the first is ' + 
              toppings[0].isTasty() ? 'tasty' : 'gross' )
    });

## How to test:

JavaScriptMVC uses [FuncUnit] for testing.  FuncUnit supports two types of testing:

  - functional - simulate clicks and keypresses a user would make.
  - unit - call directly to JS methods and test the results.

But you start creating these tests in the same way - by making a test page
and a test script. Lets say you wanted to
test <code>helloworld.js</code> and <code>helloworld.html</code>.  Without code generators,
you add 4 files to make helloworld look like:

    helloworld\
        helloworld.html
        helloworld.js
        funcunit.html
        funcunit.js
        qunit.html
        qunit.js

Put the following in qunit.html:

    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="../funcunit/qunit/qunit.css" />
        <script type='text/javascript' src='../steal/steal.js?helloworld\qunit.js'></script>
      </head>
      <body>
        <h1 id="qunit-header">Hello World Unit Test Suite</h1>
    	<h2 id="qunit-banner"></h2>
    	<div id="qunit-testrunner-toolbar"></div>
    	<h2 id="qunit-userAgent"></h2>
		<div id="test-content"></div>
        <ol id="qunit-tests"></ol>
		<div id="qunit-test-area"></div>
      </body>
    </html>

funcunit.html will look the same except change <code>qunit.js</code> to <code>funcunit.js</code>.

qunit.js might look like:

    steal.plugins('funcunit/qunit').then('//helloworld/helloworld', function(){
      
      module('helloworld')
      
      test('something is there', function(){
        ok(helloworld, "there's an object called helloworld");
      })
    
    })

funcunit.js might look like:

    steal.plugins('funcunit').then( function(){
      
      module('helloworld',{
        setup : function(){
          S.open('//helloworld/helloworld.html');
        }
      })
      
      test('The page says hello world', function(){
        ok(S(':contains(hello world)').size(), "The page says hello world");
      })
    
    })

To run these tests, you can either open the test page with your browser, or with envjs:

    funcunit\envjs helloworld\funcunit.html
    funcunit\envjs helloworld\qunit.html

 */
//
/**
@page rootfolder
The root folder is the folder where JavaScriptMVC is installed (the folder which has
funcunit, jquery, steal, documentjs, etc).  

Typically, the root folder should be a public folder that serves static content.

steal.plugins references files from the root folder.  Also, paths that begin with "//" also reference the root folder:

    steal('//foo/bar') //-> ROOTFOLDER/foo/bar
    $('#foo').html('//views/bar.ejs',{}) // uses ROOTFOLDER/views/bar.ejs
 */
// 