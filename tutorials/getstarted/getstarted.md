@page getstarted Get Started with JavaScriptMVC
@parent tutorials 1

This guide introduces the most important aspects of JavaScriptMVC (JMVC) by 
creating a simple cookbook application.

<h2 class='spaced'>Basics</h2>

Before jumping in, there are some things you should know:

### Purpose

JavaScriptMVC is for client side JavaScript development.  JavaScriptMVC is our way
of making quality, maintainable applications in the shortest amount of time.

### Sub Projects

JavaScriptMVC is comprised of 4 sub projects:

  - [DocumentJS] - A documentation engine
  - [FuncUnit] - A web testing framework
  - [jquerymx jQueryMX] - jQuery _M_VC e_X_tensions.
  - [stealjs StealJS] - A code manager : dependency management, code cleaning, building, etc.

### Plugins 

Sub-projects are futher broken down into plugins.  Just [steal] the ones you need.  Plugins load 
their own dependencies and won't load duplicate files.  It looks like:

    steal('jquery/model',
          'jquery/view/ejs',
          'jquery/controller',
          function($){
          ...
          });


<div class='whisper'>
  P.S. <code>steal('jquery')</code> adds <code>jquery/jquery.js</code>
 to your project. </div>

## License

JavaScriptMVC is MIT with the following exceptions:

 - [http://www.mozilla.org/rhino/ Rhino] - JS command line ([http://www.mozilla.org/MPL/ MPL] 1.1)
 - [http://seleniumhq.org/ Selenium] - Browser Automation ([http://www.apache.org/licenses/LICENSE-2.0 Apache 2])

These exceptions, although permissive licenses themselves, are not linked in your final production build.

## Installing JavaScriptMVC

Before continuing, make sure you have [installing installed JavaScriptMVC].  Once you
have installed JavaScriptMVC, continue to [creating Creating Cookbook].
