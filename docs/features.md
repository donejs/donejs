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

#### Speed
A user sees their content immediately. No spinners necessary.

[[[TODO: image of loaded vs spinner from home page]]]

DoneJS brings server side rendering with an incredibly fast, single context virtual DOM.

Running a single context on the server (default, but optional), no additional processes or memory is used per request. You don't even have to reload the application. This eliminates all of the overhead baggage you used to expect from a server request, and gets it done as fast as possible.

#### SEO
While [Google can execute JavaScript](http://googlewebmastercentral.blogspot.ca/2014/05/understanding-web-pages-better.html), it's not perfect and there are many other search engines that want to scrape your site and drive traffic your way.

Rendering requests in DoneJS uses a virtual DOM that only implements the fundamental apis that jQuery needs to manipulate the DOM. That means the rendering here is *fast* and your markup is ready to serve with the SEO benefits a static page would have.

#### DoneJS compared to alternatives
Other solutions to server side rendering force you to get all the data manually, to know when the page is done loading, and make it difficult to have components load their own data. DoneJS takes care of all of this and makes it incredibly easy to make your most important components immediately visible to the user and to the bots crawling your site. And because DoneJS renders using a [virtual DOM](https://github.com/canjs/can-simple-dom), it's super fast and only carrying a fraction of the weight an approach using a full headless browser has.

#### How easy?
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

DoneJS applications load only the JavaScript and CSS they need, when they need it, in highly optimized and cachable bundles. That means your application will load *fast*.

Steal analyzes the dependencies of each page and bundle them in a way that has the lowest possible wasted size across page requests. Check it out:
<iframe width="560" height="315" src="https://www.youtube.com/embed/C-kM0v9L9UY" frameborder="0" allowfullscreen></iframe>

Our algorithm is VERY smart with the optimization and doesn't require you to configure your bundles like our competitors do. For example, should jQuery and Underscore be in some "core" library? StealJS makes these decisions for you, better than you could make for yourself.

#### And it's super easy to use!
Progressive loading is done simply by specifying it directly in your templates. Here, as the page changes, it will begin loading the additional JS needed and briefly show "Loading..." until it completes:

```
<div>
  {{#eq page 'chat'}}
    <can-import from="donejs-chat/messages/">
      {{#if isPending}}
        Loading...
      {{else}}
        <chat-messages/>
      {{/if}}
    </can-import>
  {{else}}
    <can-import from="donejs-chat/home.component!">
      {{#if isPending}}
        Loading...
      {{else}}
        <chat-home/>
      {{/if}}
    </can-import>
  {{/eq}}
</div>
```

That's it! No need for additional configuration in your JavaScript.


Project: 
Docs-link: done-autorender stache stealjs
Guide-link: 


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

For simple unit and integration assertions, DoneJS uses [QUnit](https://qunitjs.com/). For high level interaction/DOM tests someone in a QA role might define, DoneJS uses [FuncUnit](http://funcunit.com/).

FuncUnit enhances assertion libraries like QUnit and enables it to simulate user actions, easily test asynchronous behavior, and support black box testing. It uses a simple jQuery-like syntax to do the assertions:

```js
test('destroying todos', function() {
  F('#new-todo').type('Sweet. [enter]');
 
  F('.todo label:contains("Sweet.")').visible('basic assert');
  F('.destroy').click();
 
  F('.todo label:contains("Sweet.")').missing('destroyed todo');
});
```

Unit tests should be able to run by themselves without the need for an API server though, so

#### Creating fake data: Fixtures!

DoneJS does even more to make testing easy and more valuable by using fixtures. Fixtures allow us to mock requests to the REST API with data that we can use in the test or in demo pages. Some default fixtures will be provided for every generated model. It's easy to set up too:

```js
import fixture from 'can-connect/fixture/';

const store = fixture.store([
  { name: 'Calisota', short: 'CA' },
  { name: 'New Troy', short: 'NT'}
],{});

fixture({
  'GET /api/states': store.findAll,
  'GET /api/states/{short}': store.findOne,
  'POST /api/states': store.create,
  'PUT /api/states/{short}': store.update,
  'DELETE /api/states/{short}': store.destroy
});

export default store;
```

That's it! Now any calls to the states api url will return faked data automatically when the store is pulled into your app with StealJS! No need to change any of your code; It just works like you've already built the backend service.


### Documentation

DoneJS applications use [DocumentJS](http://documentjs.com) to produce multi-versioned documentation.
DocumentJS lets you:

- Write documentation inline or in markdown files.
- Specify your code's behavior precisely with JSDoc and Google Closure Compiler annotations.
- Customize your site's theme and layout.
- Generate multi-version documentation.

With DocumentJS's flexibility, themeability, and customizability you can generate extremely useful documentation sites. In fact, this site is generated from it!

### Continuous Integration & Deployment

TODO

### NPM Packages

Get more done faster by bringing other people's code into your client side project with StealJS's NPM Packages.

DoneJS applications can use packages published to NPM without configuration.  Automatically load dependencies installed with npm and import packages written in ES6 module syntax, AMD, or CommonJS.

It's fast and easy to do:
```
$ npm install jquery --save
```

then, in your javascript if you're using ES6 module syntax:
```
import $ from "jquery";
```

or if you're more comfortable going with steal's syntax:
```
steal( "jquery", function( $ ) {
  //...
});
```

You can also export your modules to other formats such as:
- CommonJS and Browserify
- AMD and r.js
- or even &lt;script&gt; and &lt;link&gt; tags if you're adding new ideas to old code

<iframe width="560" height="315" src="https://www.youtube.com/embed/eIfUsPdKF4A" frameborder="0" allowfullscreen></iframe>

If you publish your DoneJS [modlets](#section_Modlets), you'll be building things you can use and reuse across your projects for years to come.


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

One of the most important concepts in DoneJS is splitting up your application functionality into individual, self-contained modules based on custom HTML elements.

```html
<order-model findAll="{previousWeek}" [previousWeekData]="{value}"/>
<order-model findAll="{currentWeek}" [currentWeekData]="{value}"/>

<bit-graph title="Week over week">
  <bit-series data="{../previousWeekData}" />
  <bit-series data="{../currentWeekData}" color="Blue"/>
</bit-graph>
```

The functionality and content for the custom elements comes from identifying them as the tag for a component definition:
```
var Iheartdonejs = can.Component.extend({
  tag: 'i-heart-donejs',
  viewModel: can.Map.extend({
    define: {
      message: {
        value: 'I <3 DoneJS'
      },
      messages: {
        value: [
          'I <3 DoneJS',
          'DoneJS FTW',
          'Get it done, use DoneJS',
          'More time to pet the kitty!'
        ]
      }
    },
    changeMessage: function () {
      var msgs = this.attr( "messages" );
      this.attr( "message", msgs[ ~~( Math.random() * msgs.length ) ] );
    }
  }),
  template: "<div can-click='{changeMessage}'>{{message}}</div>"
});
```

DoneJS [Generators](#section_Generators) will help you get started on your components with just a few keystrokes!

Plus, if you've built something awesome, you can publish it to NPM and [use your component in other projects](#section_NPMPackages)!

Guide: http://donejs.com/Guide.html#section_Creatingcustomelements

Project: http://canjs.com/guides/Recipes.html#section_BuildWidgets_UIElements

### MVVM Reactive

DoneJS applications are architecturally [Model-View-ViewModel](https://en.wikipedia.org/wiki/Model_View_ViewModel) applications where all events and updates flow in a 
single direction. It's easy to define view models that derive their data from source data but in
a deterministic and synchronous flow. View updates happen only after all models and view models have been updated.

DoneJS uses [CanJS](http://canjs.com) for custom elements and a MVVM architecture. CanJS is small, fast, and powerful.

MVVM separates concerns in development in a few ways:

#### Views (Templates)
Templates have no complex calculations and will therefore be easier to change and update in the future. This is good because UI will often change late in the process as user feedback comes into play.

#### Models
Models are the bare-bones representation of the data as it's stored on a server. In CanJS the model will define its API endpoints too.

#### ViewModels
ViewModels are the glue between views and models; They will do the complex logic and provide simple values to check and render in templates, as well as any transformations of model data to view data. ViewModels are closely related to the idea of a current state so they'll handle reading, updating, deleting, and cancelling form information changes, for example.


### Architecture

TODO

### Hot Module Swapping & Live Reload

DoneJS applications keep developers focused because they enable super fast updates when code changes. Live-reload
listens to when source files change, and update only the modules that need to change. Developers speend less time
waiting for refreshes and builds.

When you save your work, Steal doesn’t refresh the page, but only re-imports modules that are marked as dirty. This is hot swapping with live-reload. The result is a blazing fast development experience:

<video name="media" class="animated-gif" style="width: 100%;" autoplay="" loop="" src="https://pbs.twimg.com/tweet_video/CDx8_5cW0AAzvqN.mp4"><source video-src="https://pbs.twimg.com/tweet_video/CDx8_5cW0AAzvqN.mp4" type="video/mp4" class="source-mp4" src="https://pbs.twimg.com/tweet_video/CDx8_5cW0AAzvqN.mp4"></video>

<br>
When you begin working on your DoneJS application, just run
```
donejs develop
```
in your terminal to start using live-reload!



### Generators

Hit the ground running ( in the right direction ) with DoneJS's generators. They'll set everything up to be written the right way and eliminate the boilerplate in getting started and adding components.

#### donejs init

Hello World! This will get you all set up, install the DoneJS projects, and take care of all the little details.

Pop open a terminal in your project's folder and run
```
donejs init
```
Give your project an name and answer the other basic info prompts. That's it! Ready to roll!

```
create package.json
create readme.md
create documentjs.json
create .gitignore
create build.js
create production.html
create development.html
create src/test.html
create src/app.js
create src/index.stache
create src/index.md
create src/styles.less
create src/test/test.js
create src/test/functional.js
create src/models/fixtures/fixtures.js
create src/models/test.js
```

#### donejs generate component

And once you're ready to work on a component, DoneJS will get you started quickly!

```
donejs generate component suchwin such-win
```

which gives you all of this organized as a modlet!

```
create src/suchwin/suchwin.html
create src/suchwin/suchwin.js
create src/suchwin/suchwin.md
create src/suchwin/suchwin.less
create src/suchwin/suchwin.stache
create src/suchwin/suchwin_test.js
create src/suchwin/test.html
```

#### There are other generators too!

For simple components:
```
donejs generate component soeasy.component so-easy
```

and you'll get a simple starter file like this:

```
<can-component tag="so-easy">
  <style>
    p { font-weight: bold; }
  </style>
  <template>
    <p>{{message}}</p>
  </template>
  <view-model>
    import Map from 'can/map/';
    import 'can/map/define/';

    export default Map.extend({
      define: {
        message: {
          value: 'This is the so-easy component'
        }
      }
    });
  </view-model>
</can-component>
```

that you can import into your templates!

```
  <can-import from="src/soeasy.component!">
    {{#if isPending}}
      Loading...
    {{else}}
      <so-easy/>
    {{/if}}
  </can-import>
```

But wait there's "[super models](/place-my-order.html#section=section_Creatingarestaurantsconnection)" too!

Plus, you can even customize these and add more as you see fit!
