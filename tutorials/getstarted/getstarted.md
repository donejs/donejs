@page getstarted Get Started with JMVC
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


> _P.S. `steal('can/control')` adds `can/control/control.js` to your project._


## License

JavaScriptMVC is MIT with the following exceptions:

 - [Rhino](http://www.mozilla.org/rhino/) - JS command line ([MPL 1.1](http://www.mozilla.org/MPL/))
 - [Selenium](http://seleniumhq.org/) - Browser Automation ([Apache 2](http://www.apache.org/licenses/LICENSE-2.0))

These exceptions, although permissive licenses themselves, are not linked in your final production build.

## Installing JavaScriptMVC

Before continuing, make sure you have [installing installed JavaScriptMVC]. Once you
have installed JavaScriptMVC, continue to [cookbook.creating Creating Cookbook].
