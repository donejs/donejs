# donejs


The fastest way to get your single page application DONE!

DoneJS is a combination of technologies that provide a nearly comprehensive solution
for building complex JavaScript applications.

If you are looking for the easist way to get a fully modern development environment setup
and produce a lightning fast application, you've come to the right place.

#### DoneJS Features

_Application features:_

- Isomorphic (same code on server and client).
- Pushstate routing
- Real Time
- Run everywhere ( IE9+, Andriod, iOS, node-webkit )

_Performance features:_

- Progressive loaded optimized production builds
- Caching and minimal data requests
- Minimal DOM updates
- Application logic in worker thread

_Maintainence features:_

- Modlet workflow - tests, docs, and demo pages
- Use and create NPM packages
- Custom HTML elements
- MVVM single direction architecture
- Multi Versioned Documentation
- Live reload
- Functional tests

#### DoneJS Technologies

- [StealJS](http://stealjs.com) - Module Loader
- [CanJS](http://canjs.com) - MVVM 
- [jQuery](http://jquery.com) - DOM helpers
- [jQuery++](http://jquerypp.com) - Extended DOM helpers
- [QUnit](https://qunitjs.com/) or Mocha - Assertion library
- [FuncUnit](http://funcunit.com) - Functional tests
- Testee or Karma - Test runner
- [DocumentJS](http://documentjs.com) - Documentation

#### DoneJS Getting Started Guide

The DoneJS Getting Started Guide walk you through creating a [PlaceMyOrder](http://place-my-order.com) application. 

1. Install
   1. Setup Server
   2. Setup Client
2. Setting up server side rendering
   1. Create the main template
   2. [Create the application view model](docs/getting_started_outline.md#create-the-application-view-model)
   3. Render the main template on the server
   4. [Start the server](docs/getting_started_outline.md#start-the-server)
3. Setting up routing
   1. Create routes
   2. Create a homepage element
   3. Create a restaurant list element
   4. Switch between pages
   5. Create a header element
   6. Create a order history element
   7. Switch between three pages
4. Getting data from the server and showing it in the page.
5. Creating a unit-tested view model and demo page
   1. Identify the view model state properties
   2. Test the view model
      1. Setup the test
      2. Create fake data
      3. Use fake data for ajax requests
      4. Create a view model instance and test its behavior
   3. Write the view model 
      1. Make dependent models
      2. Define stateful property behaviors
      3. Verify the test
   4. Create a demo page
   5. Write the template
      1. Verify the demo page and application works.
6. Setup continuous integration (CI) and tests. 
6. Nested routes
7. Importing other projects
8. Creating data
9. Settup up a real-time connection
10. Production Builds
    1. Bundling your app
    2. Building to iOS and Andriod
    3. Buliding to NW.js
11. Deploying
	


## Features

### Application Features

#### Isomorphic

DoneJS applications are written as [Single Page Applications](http://en.wikipedia.org/wiki/Single-page_application) (SPAs),
but are able to be rendered on the server.  This is known as [Isomorphic JavaScript](http://isomorphic.net/javascript)
and has the benefits of SPAs and server side rendering:

- Speed - A user can see their content immediately.  No loading bars necessary. 
- SEO - While [Google can execute JavaScript](http://googlewebmastercentral.blogspot.ca/2014/05/understanding-web-pages-better.html), 
  it's not perfect, Google isn't the only search engine, and you might want others to be able to scrape your site.
- User Experience - SPAs can provide a more fluid user experience. 
- Maintenence - Shift user interface logic to the client where it belongs.

#### Pushstate routing

DoneJS applications use [pushstate](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history#The_pushState()_method) to 
provide navigable and bookmarkable pages and links, while still keeping the user in a single page.

#### Real time

DoneJS applications use real-time connections to keep their users instantly up to
date with any changes to their model data.  Using set-logic, real-time behavior can be 
added very easily.

#### ¿Run everywhere

DoneJS applications can run everywhere.  They work in all modern browsers and 
Internet Explorer 9 and up.  And, using [Apache Cordova](https://cordova.apache.org/) or [NW.js](https://github.com/nwjs/nw.js), DoneJS can build your app
so it works as an iOS, Andriod or Desktop Mac or Windows app.


### Performance features

#### Progressive loaded optimized production builds

DoneJS applications load only the JavaScript and CSS they need, when they need it, in highly optimized and cachable 

<iframe width="560" height="315" src="https://www.youtube.com/embed/C-kM0v9L9UY" frameborder="0" allowfullscreen></iframe>

#### Caching and minimal data requests

DoneJS applications are able to do variety of performance improvements by intelligently managing the data 
layer.  Example techniques:

 - Fall through cache - Show data in localStorage cache immediately, but in the background, look for updates on the server.
 - Combine requests - Instead of making multiple, independent requests, combine them into a single request.
 - Request difference - Only request data that hasn't already loaded.
 - Inline cache - Provide response data for all initial JavaScript requests.
 - ¿Service worker background caching - Use a service worker to load and cache data in the background so it is ready when the
   user visits the page.


#### Minimal DOM updates

Update only the part of the DOM that needs to be updated, very quickly.

#### ¿Application logic in worker thread

Run all of your application's logic in a worker thread.  Leaving the main thread to only update the DOM.


### Maintainence features

#### Modlet workflows - tests, docs, and demo pages.

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


#### Use and create NPM packages

DoneJS applications can use packages published to NPM without configuration.  Import pacakges
written in ES6 module syntax, AMD, or CommonJS.

You can also export your modules to other formats.

<iframe width="560" height="315" src="https://www.youtube.com/embed/eIfUsPdKF4A" frameborder="0" allowfullscreen></iframe>

#### Custom HTML Elements

DoneJS applications use custom HTML elements to compose and orchestrate an application's behavior.

```html
<order-model findAll="{previousWeek}" [previousWeekData]="{value}"/>
<order-model findAll="{currentWeek}" [currentWeekData]="{value}"/>

<bit-graph title="Week over week">
  <bit-series data="{../previousWeekData}" />
  <bit-series data="{../currentWeekData}" color="Blue"/>
</bit-graph>
```

#### MVVM single direction architecture

DoneJS applications are architecturally Model-View-ViewModel applications where all events and updates flow in a 
single direction.  It's easy to define view models that derive their data from source data but in
a deterministic and synchronous flow.  View updates happen only after all models and view models have been updated.

DoneJS uses [CanJS](http://canjs.com) for custom elements and a MVVM architecture.  CanJS is small, fast, and powerful.

#### Multi Versioned Documentation

DoneJS applications use [DocumentJS](http://documentjs.com) to produce multi-versioned documentation.

#### Live reload

DoneJS applications keep developers focused because they enable super fast updates when code changes.  Live-reload
listens to when source files change, and update only the modules that need to change.  Developers speend less time
waiting for refreshes and builds.

#### Functional tests

DoneJS applications are functionally tested with highly accurate event simulation.



