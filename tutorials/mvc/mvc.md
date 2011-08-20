@page mvc The MVC in JavaScriptMVC
@parent tutorials 1

JavaScriptMVC (JMVC) is an open-source jQuery-based JavaScript framework.  It is nearly a comprehensive (holistic) front-end development framework, packaging utilities for testing, dependency management, documentation, and a host of useful jQuery plugins.  

Yet every part of JavaScriptMVC can be used without every other part, making the library lightweight.  Its Class, Model, View, and Controller combined are only 7k minified and compressed, yet even they can be used independently.  JavaScriptMVC's independence lets you start small and scale to meet the challenges of the most complex applications on the web.

This tutorial covers __only__ JavaScriptMVC's $.Class, $.Model, $.View, and $.Controller.  The following describes each component:

  - <code>$.Class</code> - JavaScript based class system
  - <code>$.Model</code> - traditional model layer
  - <code>$.View</code> - client side template system
  - <code>$.Controller</code> - jQuery widget factory

JavaScriptMVC's naming conventions deviate slightly from the 
traditional [Model-View-Controller](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller#Concepts) design pattern. $.Controller is used to create traditional view controls, like pagination buttons and list, as well as traditional controllers, which coordinate between the traditional views and models.

## Setup

JavaScriptMVC can be used as a single download that includes the entire framework.  But since 
this chapter covers only the MVC parts, go to 
the [download builder](http://javascriptmvc.com/builder.html), check Controller, Model, 
and View's EJS templates and click download.  

The download will come with minified and unminified versions of jQuery and the plugins you selected.  Load these with script tags in your page:

    <script type='text/javascript' src='jquery-1.6.1.js'></script>  
    <script type='text/javascript' src='jquerymx-1.0.custom.js'></script> 


