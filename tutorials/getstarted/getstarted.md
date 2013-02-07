@page getstarted Get Started with JavaScriptMVC
@parent tutorials 2

This guide introduces the most important aspects of JavaScriptMVC (JMVC) by 
creating a simple cookbook application.

## Basics

Before jumping in, there are some things you should know:

### Purpose

Use JavaScriptMVC to develop client-side JavaScript apps. JMVC was 
created by [http://bitovi.com Bitovi], a JavaScript consulting 
company, to create quality, maintainable apps in the shortest 
amount of time. Since that time, JMVC has undergone 7 primary production releases
with over 100 outside contributors.

Unlike most JavaScript projects, JMVC is a 
true __framework__. It supplies best-of-bread solutions for things like:

 - DOM manipulation
 - MVC Architecture
 - Testing
 - Dependency management
 - Documentation
 
It tightly integrates these solutions so they
work together seemlessly. With repeatable development 
patterns, JMVC provides __direction to development__ making it easy
for teams to work together more 
effectively.


### Sub Projects

JavaScriptMVC is comprised of 5 sub projects:

  - [canjs CanJS] - A client side MVC framework
  - [jquerypp jQuery++] - A collection of useful DOM helpers and special events for jQuery
  - [stealjs StealJS] - A code manager: dependency management, code cleaning, building, etc.
  - [DocumentJS DocumentJS] - A documentation engine
  - [FuncUnit FuncUnit] - A web testing framework

### Plugins 

Sub-projects are futher broken down into plugins. Just [steal] the ones you need. Plugins load
their own dependencies and won't load duplicate files.  It looks like:

    steal('can/control', function( Control ) {
      Control // -> the Control API
      ...
    });


<div class='whisper'>
P.S. <code>steal('can/control')</code> adds <code>can/control/control.js</code> to your project.
</div>

## License

JavaScriptMVC is MIT with the following exceptions:

 - [http://www.mozilla.org/rhino/ Rhino] - JS command line ([http://www.mozilla.org/MPL/ MPL] 1.1)
 - [http://seleniumhq.org/ Selenium] - Browser Automation ([http://www.apache.org/licenses/LICENSE-2.0 Apache 2])

These exceptions, although permissive licenses themselves, are not linked in your final production build.

## Installing JavaScriptMVC

Before continuing, make sure you have [installing installed JavaScriptMVC]. Once you
have installed JavaScriptMVC, continue to [cookbook.creating Creating Cookbook].
