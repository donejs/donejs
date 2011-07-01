@page getstarted Getting Started
@parent index 4

This guide introduces the most important aspects of JavaScriptMVC (JMVC) by 
creating a simple cookbook application.  There's also a [rapidstart Rapid Start] if 
you want a few quick how-tos.  Or for an in depth example, 
read [http://jupiterjs.com/news/organizing-a-jquery-application Organizing a jQuery Application].


##  The Video

<a href='http://cdn.javascriptmvc.com/videos/2_0/2_0_demo.htm' id='video' class='big_button floatLeft'>
     <span>Watch</span>
     <span class='label'>2.0 Video</span>
 </a>  Check out the <a href='http://javascriptmvc.s3.amazonaws.com/videos/2_0/2_0_demo.htm'>
 JavaScriptMVC 2.0</a> video that walks you through much of the getting started guide.  
 It's an older treatment, but still touches on JMVC's strong points.

<h2 class='spaced'>Basics</h2>

Before jumping in, there are some things you should know:

### Purpose

JavaScriptMVC is for client side JavaScript development.  JavaScriptMVC is our way
of making quality, maintainable applications in the shortest amount of time.


### Folder Structure

JMVC logically separates a basic app into following folder structure:

@codestart
appname            - your app files
    \controllers   - organized event handlers
    \models        - manage data
    \resources     - helper scripts
    \test          - test files
        \funcunit  - funcunit tests
        \qunit     - qunit tests
    \views         - html templates
documentjs         - documentation engine
funcunit           - testing tool
jquery             - jquery and jQuery plugins (like $.Controller)
steal              - compression and build
@codeend

<div class='whisper'>P.S. Don't worry about creating an 'appname' folder yet.  We'll do that in a second.</div>

### Sub Projects

JavaScriptMVC is comprised of 4 sub projects:

  - [DocumentJS] - A documentation engine
  - [FuncUnit] - A web testing framework
  - jQueryMX - jQuery MVC eXtensions.
  - [stealjs StealJS] - A code manager : dependency management, code cleaning, building, etc.

### Plugins 

Everything is a plugin.  Just [steal.static.plugins steal] the ones you need. 
Plugins load their own dependencies and won't load duplicate files.  It looks like:

@codestart
steal.plugins('jquery/model',
  'jquery/view',
  'jquery/controller');
@codeend

<div class='whisper'>
  P.S. <code>steal.plugins('a/b')</code> adds <code>a/b/b.js</code>
 to your project. </div>

## License

JavaScriptMVC is MIT with the following exceptions:

 - [http://www.mozilla.org/rhino/ Rhino] - JS command line ([http://www.mozilla.org/MPL/ MPL] 1.1)
 - [http://seleniumhq.org/ Selenium] - Browser Automation ([http://www.apache.org/licenses/LICENSE-2.0 Apache 2])

These exceptions, although permissive licenses themselves, are not linked in your final production build.

## Making a Cookbook

Lets get started by [install installing JavaScriptMVC].
