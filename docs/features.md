@page Features
@parent DoneJS
@hide sidebar
@outline 2 ol

@description Learn what DoneJS can do for your application and developers.

@body

## Performance Features

### Server Side Rendered

DoneJS applications are written as [Single Page Applications](http://en.wikipedia.org/wiki/Single-page_application),
and are able to be rendered on the server by running the same code. This is known as [Isomorphic JavaScript](http://isomorphic.net/javascript) aka [Universal JavaScript](https://medium.com/@mjackson/universal-javascript-4761051b7ae9). Server side rendering comes with great benefits:

#### **Speed**
A user sees their content immediately. No spinners necessary.

[[[TODO: image of loaded vs spinner from home page]]]

DoneJS brings server side rendering with an incredibly fast, single context virtual DOM.

Running a single context on the server (default, but optional), no additional processes or memory is used per request. You don't even have to reload the application. This eliminates all of the overhead baggage you used to expect from a server request, and gets it done as fast as possible.

#### **SEO**
While [Google can execute JavaScript](http://googlewebmastercentral.blogspot.ca/2014/05/understanding-web-pages-better.html), it's not perfect and there are many other search engines that want to scrape your site and drive traffic your way.

Rendering requests in DoneJS uses a virtual DOM that only implements the fundamental apis that jQuery needs to manipulate the DOM. That means the rendering here is *fast* and your markup is ready to serve with the SEO benefits a static page would have.

#### **DoneJS compared to alternatives**
Other solutions to server side rendering force you to get all the data manually, to know when the page is done loading, and make it difficult to have components load their own data. DoneJS takes care of all of this and makes it incredibly easy to make your most important components immediately visible to the user and to the bots crawling your site. And because DoneJS renders using a [virtual DOM](https://github.com/canjs/can-simple-dom), it's super fast and only carrying a fraction of the weight an approach using a full headless browser has.

#### **How easy?**
Just add one line to your most important components:
```
this.attr( "@root" ).waitFor( promise );
```
and the component will be rendered with its data from the resolved promise before it's served up!

```
can.Component.extend({
  tag: "user-name",
  template: can.stache( "{{user.name}}" ),
  viewModel: {
    init: function () {
      var promise = User.getOne( { id: this.attr( "id" ) } );
      this.attr( "@root" ).waitFor( promise );
      promise.then( ( user ) => { this.attr( "user", user ); } );
    }
  }
});
```

Project: https://github.com/canjs/can-ssr

Docs-link: https://github.com/canjs/can-ssr

Guide-link: 


### Progressive loading

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

### Worker Thread Rendering

Run all of your application's logic in a worker thread.  Leaving the main thread to only update the DOM.


### Deploy to a CDN

content delivery network


## Usability features

### iOS, Android, and Desktop Builds

TODO: Links are on the homepage

### Supports All Browsers, Even IE8

DoneJS applications can run everywhere.  They work in all modern browsers and 
Internet Explorer 9 and up.  And, using [Apache Cordova](https://cordova.apache.org/) or [NW.js](https://github.com/nwjs/nw.js), DoneJS can build your app
so it works as an iOS, Andriod or Desktop Mac or Windows app.

### Real Time Connected

DoneJS applications use real-time connections to keep their users instantly up to
date with any changes to their model data.  Using set-logic, real-time behavior can be 
added very easily.

### Pretty URL's with Pushstate

DoneJS applications use [pushstate](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history#The_pushState()_method) to 
provide navigable and bookmarkable pages and links, while still keeping the user in a single page.




## Maintainable features

### Unit and Functional Tests

DoneJS applications are functionally tested with highly accurate event simulation.

### Documentation

DoneJS applications use [DocumentJS](http://documentjs.com) to produce multi-versioned documentation.

### Continuous Integration & Deployment

TODO

### NPM Packages

DoneJS applications can use packages published to NPM without configuration.  Import pacakges
written in ES6 module syntax, AMD, or CommonJS.

You can also export your modules to other formats.

<iframe width="560" height="315" src="https://www.youtube.com/embed/eIfUsPdKF4A" frameborder="0" allowfullscreen></iframe>

### ES6 Modules

TODO

### Modlets

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

### MVVM Reactive

DoneJS applications are architecturally Model-View-ViewModel applications where all events and updates flow in a 
single direction.  It's easy to define view models that derive their data from source data but in
a deterministic and synchronous flow.  View updates happen only after all models and view models have been updated.

DoneJS uses [CanJS](http://canjs.com) for custom elements and a MVVM architecture.  CanJS is small, fast, and powerful.

### Architecture

TODO

### Hot Module Swapping & Live Reload

DoneJS applications keep developers focused because they enable super fast updates when code changes.  Live-reload
listens to when source files change, and update only the modules that need to change.  Developers speend less time
waiting for refreshes and builds.

### Generators

TODO
