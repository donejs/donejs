@page mvc Get Started with jQueryMX
@parent tutorials 2

[jquerymx jQueryMX] is JavaScriptMVC's collection 
of useful jQuery extensions.  Every part of jQueryMX can be used without
every other part, making the library extremely lightweight. Its Class, Model, View, 
and Controller combined are only 7k minified and compressed, yet 
even they can be used independently. jQueryMX's independence 
lets you start small and scale to meet the challenges of the most 
complex applications on the web.

This tutorial covers __only__ jQueryMX's $.Class, 
$.Model, $.View, and $.Controller.  The following describes each component:

  - [jQuery.Class $.Class] - JavaScript based class system
  - [jQuery.Model $.Model] - traditional model layer
  - [jQuery.View $.View] - client side template system
  - [jQuery.Controller $.Controller] - jQuery widget factory

jQueryMX's naming conventions deviate slightly from the 
traditional [Model-View-Controller](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller#Concepts) 
design pattern. $.Controller is used to create traditional 
view controls, like pagination buttons and list, as well as 
traditional controllers, which coordinate between the 
traditional views and models.

## Setup

JavaScriptMVC can be used as a single download that includes the entire framework.  But since 
this chapter covers only the MVC parts, go to 
the [download builder](http://javascriptmvc.com/builder.html), check Controller, Model, 
and View's EJS templates and click download.  

The download will come with minified and unminified versions of jQuery and 
the plugins you selected.  Load these with script tags in your page:

    <script type='text/javascript' src='jquery-1.6.1.js'></script>  
    <script type='text/javascript' src='jquerymx-1.0.custom.js'></script> 

Please continue to [mvc.class Class].
