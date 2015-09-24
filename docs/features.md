@page Features
@parent DoneJS
@hide sidebar
@outline 2 ol

@description Learn what DoneJS can do for your application and developers.

@body

## Application Features

### Isomorphic

DoneJS applications are written as [Single Page Applications](http://en.wikipedia.org/wiki/Single-page_application) (SPAs),
and are able to be rendered on the server by running the same code. This is known as [Isomorphic JavaScript](http://isomorphic.net/javascript). SPAs and server side rendering come with great benefits:

#### **Speed**
A user can see their content immediately. No spinners necessary.

[[[TODO: image of loaded vs spinner from home page]]]

#### **SEO**
While [Google can execute JavaScript](http://googlewebmastercentral.blogspot.ca/2014/05/understanding-web-pages-better.html), it's not perfect and there are many other search engines that want to scrape your site and drive traffic your way.

#### **User Experience**
SPAs can provide a more fluid user experience.

#### **Maintenence**
Shift user interface logic to the client where it belongs.

DoneJS brings server side rendering with an incredibly fast, single context virtual DOM.
With a single context on the server (default, but optional), no additional process or memory is used per request. You don't even have to reload the application, throwing out all of the overhead baggage you used to expect from a server request, and getting it done as fast as possible.

To render those requests, DoneJS uses a virtual DOM that only implements the fundamental apis that jQuery needs to manipulate the DOM. That means the rendering here is *fast* and we're only carrying a fraction of the weight an approach using a full headless browser has.

Other solutions to server side rendering force you to get all the data manually, to know when the page is done loading, and make it difficult to have components load their own data. DoneJS takes care of all of this and makes it incredibly easy to make your most important components immediately visible to the user and to the bots crawling your site:

```
var promise = Recipe.getList();
this.attr("@root").waitFor( promise );

<html>
  <can-import from="model/recipes" />
  <recipe-model get-list="{ rating: 5 }">
    {{#each dish}}
      * * * * * {{title}}
    {{/each}}
  </recipe-model>
</html>
```

Project: https://github.com/canjs/can-ssr

Docs-link: https://github.com/canjs/can-ssr

Guide-link: 


### Pushstate routing

DoneJS applications use [pushstate](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history#The_pushState()_method) to 
provide navigable and bookmarkable pages and links, while still keeping the user in a single page.

### Real time

DoneJS applications use real-time connections to keep their users instantly up to
date with any changes to their model data.  Using set-logic, real-time behavior can be 
added very easily.

### Run everywhere

DoneJS applications can run everywhere.  They work in all modern browsers and 
Internet Explorer 9 and up.  And, using [Apache Cordova](https://cordova.apache.org/) or [NW.js](https://github.com/nwjs/nw.js), DoneJS can build your app
so it works as an iOS, Andriod or Desktop Mac or Windows app.


## Performance features

### Progressive loaded optimized production builds

DoneJS applications load only the JavaScript and CSS they need, when they need it, in highly optimized and cachable 

<iframe width="560" height="315" src="https://www.youtube.com/embed/C-kM0v9L9UY" frameborder="0" allowfullscreen></iframe>

### Caching and minimal data requests

DoneJS applications are able to do variety of performance improvements by intelligently managing the data 
layer.  Example techniques:

 - Fall through cache - Show data in localStorage cache immediately, but in the background, look for updates on the server.
 - Combine requests - Instead of making multiple, independent requests, combine them into a single request.
 - Request difference - Only request data that hasn't already loaded.
 - Inline cache - Provide response data for all initial JavaScript requests.
 - Service worker background caching - Use a service worker to load and cache data in the background so it is ready when the
   user visits the page.


### Minimal DOM updates

Update only the part of the DOM that needs to be updated, very quickly.

### Application logic in worker thread

Run all of your application's logic in a worker thread.  Leaving the main thread to only update the DOM.


## Maintainence features

### Modlet workflows - tests, docs, and demo pages.

DoneJS applications are built so every module is treated as its own application.  Every module
is given its own folder.  Instead of organizing a project by grouping files based on type like:

```
project/
  js/
     moduleA.js
     moduleB.js
  templates/
     moduleA.handlebars
     moduleB.handlebars
  css/
     moduleA.css
     moduleB.less
  test/
     moduleA_test.js
     moduleB_test.js
  docs/
     moduleA.markdown
     moduleB.markdown

```

A DoneJS application is organized into modlets.  Every module is given its own folder which
contains the module's code, supporting files (CSS and templates), tests, and documentation like:

```
project/
  moduleA/
     moduleA.js          - module's code
     moduleA.handlebars  - supporting file
     moduleA.css         - supporting file
     moduleA_test.js     - tests
     moduleA.markdown    - docs
     test.html           - test page
     moduleA.html        - demo page
```

Modelets include pages that run just that module's tests and a demo page that shows off just that
module's functionality.


### Use and create NPM packages

DoneJS applications can use packages published to NPM without configuration.  Import pacakges
written in ES6 module syntax, AMD, or CommonJS.

You can also export your modules to other formats.

<iframe width="560" height="315" src="https://www.youtube.com/embed/eIfUsPdKF4A" frameborder="0" allowfullscreen></iframe>

### Custom HTML Elements

DoneJS applications use custom HTML elements to compose and orchestrate an application's behavior.

```html
<order-model findAll="{previousWeek}" [previousWeekData]="{value}"/>
<order-model findAll="{currentWeek}" [currentWeekData]="{value}"/>

<bit-graph title="Week over week">
  <bit-series data="{../previousWeekData}" />
  <bit-series data="{../currentWeekData}" color="Blue"/>
</bit-graph>
```

### MVVM single direction architecture

DoneJS applications are architecturally Model-View-ViewModel applications where all events and updates flow in a 
single direction.  It's easy to define view models that derive their data from source data but in
a deterministic and synchronous flow.  View updates happen only after all models and view models have been updated.

DoneJS uses [CanJS](http://canjs.com) for custom elements and a MVVM architecture.  CanJS is small, fast, and powerful.

### Multi Versioned Documentation

DoneJS applications use [DocumentJS](http://documentjs.com) to produce multi-versioned documentation.

### Live reload

DoneJS applications keep developers focused because they enable super fast updates when code changes.  Live-reload
listens to when source files change, and update only the modules that need to change.  Developers speend less time
waiting for refreshes and builds.

### Functional tests

DoneJS applications are functionally tested with highly accurate event simulation.