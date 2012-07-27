/*
@page learn 3. Learn


JavaScriptMVC contains pretty much everything 
you need to develop, test, and maintain a 
JavaScript application.  Instead of learning 
an API, learning JavaScriptMVC is more
about learning <b>HOW</b> to build an application.

## The Basics

<a href='http://cdn.javascriptmvc.com/videos/2_0/2_0_demo.htm' id='video' class='big_button floatLeft'>
   <span>Watch</span>
   <span class='label'>2.0 Video</span>
</a>  Before you do anything, watch 
the <a href='http://javascriptmvc.s3.amazonaws.com/videos/2_0/2_0_demo.htm'>2.0 Video</a>.  
It's a 12 min brain dump that will highlight most of JMVC's features.

<div style='clear:left; margin-top: 5px;'></div>


You might be asking yourself a frequently asked question:


#### Who should use JMVC?

JMVC is designed for large, single-page JavaScript applications
that require lots of custom code (something like [http://gmail.com GMail]).
It fits between low-level libraries like jQuery and widget libraries like
jQueryUI. 
           
If you need to organize, test, maintain, or compress a JavaScript 
application, JavaScriptMVC will help.

#### How does JMVC fit into my project?

JMVC is based around the principles of Service Oriented Architecture (SOA) and
Thin Server Architecture (TSA).  This means your server 
produces raw (preferably REST) services and never sends data in HTML.

Read a [http://blog.javascriptmvc.com/?p=68 1.5 article]  how it looks
 from within a rails application:
 
<a href='http://blog.javascriptmvc.com/?p=68'><img src='http://wiki.javascriptmvc.com/wiki/images/d/db/Tsa.png' style="border: solid 1px gray"/></a>

For information on the benefits of TSA, watch [http://www.youtube.com/watch?v=XMkIZZ7dBng Practical Thin Server Architecture]. 
    
#### Does JMVC work with a Java/PHP/Rails/etc backend?</label>
    
Yes, JMVC will will work with any backend service.  It 
prefers to consume JSON Rest services, but it's flexible 
enough to work from
anything.

#### Do you have any example code?

We are trying to get move public source available, but for now check out: 

  - <a href='https://github.com/jupiterjs/srchr'>Srchr</a> - demo app
  - <a href='https://github.com/jupiterjs/mxui'>MXUI</a> - jQueryMX UI widgets.


#### How does JMVC compare to other JS Frameworks?</label>

JMVC has the gamut of features to support the most complex JS applications.  
But it's most important feature, and its most unique, 
is its event delegation support organized
via [jQuery.Controller controllers].  If you haven't used controllers to organize event handling in
JavaScript, you haven't really programmed JavaScript.


## Model View Controller

There are only 4 things you will ever do with JavaScript!  JMVC breaks these down into the
Model-View-Controller architecture.


  - Respond to events -> [jQuery.Controller Controller]
  - Get data and manipulate services (Ajax) ->  [jQuery.Model Model] Static functions
  - Wrap service data with domain specific information -> [jQuery.Model Model] Prototype functions
  - Update the page -> [jQuery.Controller Controller] and [jQuery.View View]


Here's how that flow looks:

<img src='http://wiki.javascriptmvc.com/wiki/images/3/3f/MVCMVC.png'/>

Think how this would work with the google auto-suggest.

<img src='http://wiki.javascriptmvc.com/wiki/images/c/cc/Autosuggest.png'/>

  - Respond to typing "JavaScriptMVC" -> [jQuery.Controller Controller].
  - Get search suggestions ->  [jQuery.Model Model] Static functions.
  - Wrap search data -> [jQuery.Model Model] Prototype functions. <span style='color: gray'>Not really important here!</span>
  - Draw suggestions -> [jQuery.Controller Controller] and [jQuery.Controller View].


## Development Tools?

JavaScriptMVC supplies a host of JS tools including:

  - [generators Code generators]
  - [steal Dependancy management]
  - [FuncUnit Testing]
  - [steal.build Compression]
  - [DocumentJS Documentation]

## How do I get help?

Write on our [http://forum.javascriptmvc.com/ forum].

## How do I report errors, or contribute code?

Submit patches or errors in [https://github.com/jupiterjs github].

 */

//break