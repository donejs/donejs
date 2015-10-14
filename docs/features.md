@page Features
@parent DoneJS
@hide sidebar
@outline 2 ol

@description Learn what DoneJS can do for your application and developers.

@body

## Performance Features

DoneJS is configured for maximum performance right out of the box.

### Server Side Rendered

DoneJS applications are written as [Single Page Applications](http://en.wikipedia.org/wiki/Single-page_application),
and are able to be rendered on the server by running the same code. This is known as [Isomorphic JavaScript](http://isomorphic.net/javascript) aka [Universal JavaScript](https://medium.com/@mjackson/universal-javascript-4761051b7ae9). Server side rendering comes with great benefits:

#### Speed
A user sees their content immediately. No spinners necessary.

<img src="./static/img/donejs-server-render-diagram.svg" alt="donejs-server-render-diagram.svg" />

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
this.attr( "%root" ).waitFor( promise );
```
and the component will be rendered with its data from the resolved promise before it's served up!

```
can.Component.extend({
  tag: "user-name",
  template: can.stache( "{{user.name}}" ),
  viewModel: {
    init: function () {
      var promise = User.getOne( { id: this.attr( "id" ) } );
      this.attr( "%root" ).waitFor( promise );
      promise.then( ( user ) => { this.attr( "user", user ); } );
    }
  }
});
```

View the documentation for can-ssr [here](https://github.com/canjs/can-ssr).

[Follow the Guide](./place-my-order.html) to see how to set up server side rendering in your app!


### Progressive Loading

When you first load a single page app, you're typically downloading all the JavaScript and CSS for every part of the application. These megabytes of extra weight slow down page load performance, especially on mobile devices.

DoneJS applications load only the JavaScript and CSS they need, when they need it, in highly optimized and cachable bundles. That means your application will load *fast*.

There is no configuration needed to enable this feature, and wiring up progressively loaded sections of your app is simple.

#### How it works

<iframe width="560" height="315" src="https://www.youtube.com/embed/C-kM0v9L9UY" frameborder="0" allowfullscreen></iframe>

Other build tools require you to manually configure bundles, which doesn't scale with large applications.

In a DoneJS application, you simply mark a section to be progressively loaded by wrapping it in your template with `<can-import>`.

```
{{#eq location 'home'}}
<can-import from="components/home">
  <my-home/>
</can-import>
{{/eq}}
{{#eq location 'away'}}
<can-import from="components/chat">
  <my-chat/>
</can-import>
{{/eq}}
```

Then you run the build. A build time algorithm analyzes the application's dependencies and groups them into bundles, optimizing for minimal download size.

That's it! No need for additional configuration in your JavaScript.

<a class="btn" href="http://stealjs.com/docs/steal-tools.guides.progressive_loading.html"><span>View the Documentation</span></a>
<a class="btn" href="/Guide.html#section=section_Switchbetweenpages"><span>View the Guide</span></a>

_Progressive Loading is a feature of [StealJS](http://stealjs.com/) with additional support via the [`<can-import>` tag](http://canjs.com/2.3-pre/docs/can%7Cview%7Cstache%7Csystem.import.html) of [CanJS](http://canjs.com/)_

### Caching and Minimal Data Requests

DoneJS applications are able to do variety of performance improvements by intelligently managing the data
layer.  Example techniques:

 - Fall through cache - Show data in localStorage cache immediately, but in the background, look for updates on the server.
 - Combine requests - Instead of making multiple, independent requests, combine them into a single request.
 - Request difference - Only request data that hasn't already loaded.
 - Inline cache - Provide response data for all initial JavaScript requests.
 - Service worker background caching - Use a service worker to load and cache data in the background so it is ready when the
   user visits the page.

### Minimal DOM Updates

The rise of templates, data binding, and MV* separation, while boosting maintainability, has come at the cost of performance. Many frameworks are not careful or smart with DOM updates, leading to performance problems as apps scale in complexity and data size.

DoneJS' view engine touches the DOM more minimally and specifically than competitor frameworks, providing better performance in large apps and a "closer to the metal" feel.

#### How it works

Consider the following template:

```html
{{#rows}}
<div>{{name}}</div>
{{/rows}}
```

And the following change to its data:

```
rows[0].attr('name', 'changed'); // change the first row's name
```

In DoneJS, which uses the [can.stache](http://canjs.com/docs/can.stache.html) view engine, that would:

 1. Synchronously trigger a `change` event (because of the [can.Map](http://canjs.com/docs/can.Map.html) synchronous object observe API)
 1. The `change` would invoke a data binding event handler in the template layer
 1. The handler would immediately result in the following code being run:
```
textNode.nodeValue = 'changed';
```

In Backbone, you would need to manually re-render the template or roll your own rendering library.

In Angular, at the end of the current $digest cycle, that would result in an expensive comparison between the old rows array and the new one to see what properties have changed. After the changed property is discovered, the specific DOM node would be updated.

In React, that would result in the virtual DOM being re-rendered. A diff algorithm comparing the new and old virtual DOM would discover the changed node, and then the specific DOM node would be updated.

Of these four approaches, DoneJS knows about the change the quickest, and updates the DOM the most minimally.

With synchronously observable objects and data bindings that change mimimal pieces of the DOM, DoneJS aims to provide the best possible mix between powerful, yet performant, templates.

To learn more about this, read about the [can.stache](http://canjs.com/docs/can.stache.html) view engine and [can.Map](http://canjs.com/docs/can.Map.html) observable objects.

### Worker Thread Rendering

Worker thread rendering increases the performance of your application. It essentially allows your application to run entirely within a Web Worker, freeing the main thread to only update the DOM. Your templates first render in a lightweight Virtual DOM on the worker side and changes are diffed and sent to the window side to be applied to the actual DOM.  Only changes are ever applied to the window and the most expensive part of a web application, DOM updates, are separated from application logic, which means your application can continue to run while paints occur.

<img src="/static/img/donejs-single-thread.gif" srcset="/static/img/donejs-single-thread.gif 1x, /static/img/donejs-single-thread-2x.gif 2x" alt="A traditional single threaded javascript application">
_With a single thread only one operation can occur at a time_

<img src="/static/img/donejs-multi-thread.gif" srcset="/static/img/donejs-multi-thread.gif 1x, /static/img/donejs-multi-thread-2x.gif 2x" alt="A javascript application using a worker thread">
_Using a worker thread application logic can still occur while the DOM is rendered. This can nearly double the number of operations._

Due to this parallelization your application doesn’t have to worry so much about being doing things performantly as long as it is performant enough not to block the worker thread. For your users this means the application will always feel snappy.

If you’re already using done-autorender you only need to update one line:
```
<script src=”node_modules/steal/steal.js” main=”my-app!done-autorender”></script>
```
to
```
<script src=”node_modules/steal/steal.js” main=”my-app!done-worker-autorender”></script>
```

### Deploy to a CDN

DoneJS makes it simple to deploy your static assets to a CDN (content delivery network).

CDNs are distributed networks of servers that serve static assets (CSS, JS, and image files). You only push your files to one service, and the CDN takes care of pushing and updating your assets on different servers across the country and globe. As your app scales CDNs will keep up with the demand, and help support users regardless if they are in New York or Melbourne.

<img src="./static/img/DoneJS-Animated-No-CDN.gif" alt="User request across the globe with out a CDN." />
_Without a CDN requests will take longer to fulfill if the user is located further away from your servers._
<hr />


<img src="./static/img/DoneJS-Animated-With-CDN.gif" alt="User request across the globe with a CDN." />
_With a CDN requests can be fulfilled much quicker. Users are served content from the servers located nearest to them._

#### How it works

It's widely known that CDNs offer the best performance for static assets, but most apps don't use them, mainly because its annoying: annoying to automate, configure, and integrate with your build process.

DoneJS comes with integrations with S3 and Divshot (popular CDN services) that make configuring and deploying to a CDN dirt simple.

 1. You sign up for S3 or Divshot.
 1. You paste a few lines of config into your package.json that point to the right CDN service.
 1. You paste a few more lines that tell your production server to serve static assets from the CDN.
 1. You run `donejs deploy`.

That's it. Now when you run your server in production mode, all static assets (CSS, JS, images, etc) are served from the CDN.

Even better, you can set up [continuous deployment](./place-my-order.html#section=section_ContinuousDeployment), so that TravisCI or other tools will deploy your code, including pushing out your latest static files to the CDN, automatically.

For more information, read the [deployment utility docs](https://github.com/donejs/deploy), follow the [deployment section](./Guide.html#section=section_Deploy) in the quick start guide, or the [CDN configuration](./place-my-order.html#section=section_DeploytoaCDN) section in the in depth guide.

## Usability features

DoneJS is used to make beautiful, real-time user interfaces that can be exported to run on every platform.

### iOS, Android, and Desktop Builds

Write your application once, then run it natively on every device and operating system. You can make iOS, Android, and desktop builds of your DoneJS application with no extra effort, expanding your potential audience without having to build separate applications.

<img src="./static/img/desktop-mobile.gif" />
_Our DoneJS Chat App running as a OS X desktop app and inside an iOS emulator._

#### How it works

For iOS and Android builds, DoneJS integrates with [Apache Cordova](https://cordova.apache.org/) to generate an "app" version that is ready to be uploaded to the App Store/Google Play.

For native desktop applications, DoneJS integrates with [NW.js](https://github.com/nwjs/nw.js) to create an native OSX, Windows, or Linux application.

Adding this integration is as simple as running

```
donejs add cordova
donejs add nw
donejs build
```

[Follow the guide](./Guide.html#section_Desktopandmobileapps) to see an example in action.

### Supports All Browsers, Even IE8

DoneJS applications support Internet Explorer 8 without any additional effort. You can even write applications using [most ES6 features](http://babeljs.io/docs/advanced/caveats/) that run on IE8, using the built-in babel integration.

Many people don't care about this because IE8 is on its way out, which is a very good thing!

But its not quite dead yet, at still [over 3%](http://gs.statcounter.com/#browser_version_partially_combined-ww-monthly-201508-201509-bar) of the browser market in September 2015. For many mainstream websites, banks, and ecommerce applications, IE8 continues to hang around the browser stats.

And while other frameworks like AngularJS and EmberJS don't support IE8, DoneJS makes it easy to write one app that runs everywhere.

### Real Time Connected

DoneJS is designed to make it easy to build applications that connects users in real-time.

[Socket.io](https://socket.io) provides the basics to add real-time capabilities to any JavaScript application, but the challenge of integrating real-time updates into your code remains. DoneJS makes weaving Socket.io backends into your UI simple and automatic.

#### How it works

<iframe width="560" height="315" src="https://www.youtube.com/embed/w4mp4oSb6BQ" frameborder="0" allowfullscreen></iframe>

DoneJS' model layer uses set logic to maintain lists of data represented by certain rules, like a list of todos with `{'owner_id': 2}`. These lists are rendered to the UI via data bound templates.

When server-side updates are sent to the client, items are automatically removed or added to any lists they belong to. They also automatically show up in the UI because of the data bindings.

All of this happens with about 4 lines of code.

```
const socket = io('http://chat.donejs.com');
socket.on('messages created',
  order => messageConnection.createInstance(order));
socket.on('messages updated',
  order => messageConnection.updateInstance(order));
socket.on('messages removed',
  order => messageConnection.destroyInstance(order));
```

[Follow the guide](./Guide.html#section=section_Real_timeconnection) to see an example in action. View the can-connect real-time documentation [here](http://connect.canjs.com/doc/can-connect%7Creal-time.html).

### Pretty URLs with Pushstate

DoneJS applications use [pushstate](https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method) to provide navigable, bookmarkable pages that support the back and refresh buttons, while still keeping the user in a single page.

The use of pushstate allows your apps to have "Pretty URLs" like `myapp.com/user/1234` instead of uglier hash based URLs like `myapp.com#page=user&userId=1234` or `myapp.com/#!user/1234`.

Wiring up these pretty URLs in your code is simple and intuitive.

#### How it works

Routing works a bit differently than other libraries. In other libraries, you might declare routes and map those to controller-like actions.

DoneJS application [routes](http://canjs.com/docs/can.route.html) map URL patterns, like `/user/1`, to properties in our application state, like `{'userId': 1}`. In other words, our routes will just be a representation of the application state.

This architecture simplifies routes so that they can be managed entirely in simple data bound templates, like the following example:

```
{{#switch page}}
  {{#case "home"}}
      <pmo-home></pmo-home>
  {{/case}}
  {{#case "restaurants"}}
      <pmo-restaurant-list></pmo-restaurant-list>
  {{/case}}
  {{#case "order-history"}}
      <pmo-order-history></pmo-order-history>
  {{/case}}
{{/switch}}
```

To learn more about routing and setting up Pretty URLs visit the CanJS guide on [Application State and Routing](http://canjs.com/2.3-pre/guides/AppStateAndRouting.html) or follow along in [the guide](./place-my-order.html#section=section_Settinguprouting).

## Maintainable features

DoneJS helps developers get things done quickly with an eye toward maintenance.

### Comprehensive Testing

Nothing increases the maintainability of an application more than good automated testing. DoneJS includes a comprehensive test layer that makes writing, running, and maintaining tests intuitive and easy.

DoneJS provides tools for the entire testing lifecycle:

* **Generators** - create boilerplate tests to get started quickly
* **Unit testing** - assertion libraries to test your module interfaces
* **Functional testing** - an API for scripting the browser, simulating user actions, and testing your UI modules
* **User action event simulation** - accurate event simulation for clicks, types, drags, and other user actions
* **A command line test runner** - invoke the same tests from the CLI
* **A browser launcher** - launch several browsers and target your tests against them
* **A reporting tool** - report results to the CLI or other forms, including coverage
* **Simple integration with continuous integration tools** - one step to hook into TravisCI or other CI systems
* **A mock layer** - an API to mock out your server APIs so you can test your app in isolation from a server

<video name="media" class="animated-gif" style="width: 100%;" autoplay="" loop="" src="/static/img/donejs-testing.mp4"><source video-src="/static/img/donejs-testing.mp4" type="video/mp4" class="source-mp4" src="/static/img/donejs-testing.mp4"></video>

#### How it works

Testing JavaScript apps is complex unto itself. To do it right, you need many tools that have to work together seamlessly. DoneJS provides everything you need - the whole stack - so you can spend less time messing with test infrastructure, and more time [mud ridin'](https://youtu.be/s4faD0fox_s?t=261).

##### Generators

The DoneJS app generator command `donejs init` creates a working project-level test HTML and JS file. Component generators via `donejs generate component cart` create a test script and individual test page for each test.

##### Unit tests

Unit tests are used to test the interface for modules like models and view models. You can choose between BDD style unit tests with Jasmine or Mocha, or more functional unit tests with QUnit.

##### Functional tests

Functional tests are used to test UI components by simulating user behavior. The syntax for writing functional tests is jQuery-like, chainable, and asynchronous, simulating user actions and waiting for page elements to change asynchronously.

```js
test('destroying todos', function() {
  F('#new-todo').type('Sweet. [enter]');

  F('.todo label:contains("Sweet.")').visible('basic assert');
  F('.destroy').click();

  F('.todo label:contains("Sweet.")').missing('destroyed todo');
});
```

##### Event simulation accuracy

User action methods, like click, type, and drag, simulate exactly the sequence of events generated by a browser when a user performs that action. For example this:
```
F( ".menu" ).click();
```

is not just a click event. It triggers a mousedown, then blur, then focus, then mouseup, then click. The result is more accurate tests that catch bugs early.

Even further, there are differences between how IE and Safari handle a click. DoneJS tests take browser differences into account when running functional tests.

##### Running tests from the command line

DoneJS comes with a command line test runner, browser launcher, and reporting tool that integrates with any [continuous integration](#section=section_ContinuousIntegration_Deployment) environment.

No setup required, running a DoneJS project's test is as simple as running:

```
donejs test
```

You can run launch your unit and functional tests from the cli, either in headless browser mode, or via multiple real browsers. You can even launch browserstack virtual machines to test against any version of Android, Windows, etc.

The reporting tool gives detailed information about coverage statistics, and lets you choose from many different output formats, including XML or JSON files.

##### Mocking server APIs

Automated frontend testing is most useful when it has no external dependencies on API servers or specific sets of data. Thus a good mock layer is critical to write resilient tests.

DoneJS apps use fixtures to emulate REST APIs. A default set of fixtures are created by generators when a new model is created. Fixtures are very flexible, and can be used to simulate error states and slow performing APIs.

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

##### More information

The DoneJS testing layer involves many pieces, so if you want to learn more:

 * follow along in the [Unit testing view model and fixtures](./place-my-order.html#section=section_Creatingaunit_testedviewmodel) section of the guide
 * see how to run tests and set up CI automation in the [CI section](./place-my-order.html#section=section_Automatedtestsandcontinuousintegration) of the guide
 * read about [FuncUnit](http://funcunit.com/), the functional testing and asynchronous user action simulating library
 * read about [syn](https://github.com/bitovi/syn) - the synthetic event library
 * read about the [Testee.js](https://github.com/bitovi/testee) browser launcher, test runner, and reporting tool
 * read the [can.fixture](http://canjs.com/docs/can.fixture.html) docs

### Documentation

Documentation is critical for maintainability of any complex application. When key team members leave, docs ensure minimal ramp up time and knowledge loss - this applies for code and styles.

Yet most teams either don't write docs, or they'll do it "later" - a utoptian future period that is always just out of reach. Why? Because its extra work to set up a tool, configure it, create and maintain separate documentation files, etc.

DoneJS comes with a documentation tool built in, and it generates multi-versioned documentation from inline code comments. It eliminates the barrier to producing docs, since all you have to do is comment your code (which most people already do) and run `donejs document`.

You spend less time messing with Documentation generators, and more time [painting your truck camo](https://www.youtube.com/watch?v=DpJ_oPJgyPg).

<video name="media" class="animated-gif" style="width: 100%;" autoplay="" loop="" src="/static/img/donejs-documentation.mp4"><source video-src="/static/img/donejs-documentation.mp4" type="video/mp4" class="source-mp4" src="/static/img/donejs-documentation.mp4"></video>

#### How it works

You write comments above the module, method, or object that you want to document:

```js
/**
 * @module {function} utils/add
 * @parent utils
 * 
 * The module's description is the first paragraph.
 * 
 * The body of the module's documentation.
 * 
 * @param {Number} first This param's description.
 * @param {Number} second This param's description.
 * @return {Number} This return value's description.
 */
export default function(){ ... };
```

Then run `donejs document`. A browsable documentation website will be generated.

DoneJS applications use [DocumentJS](http://documentjs.com) to produce multi-versioned documentation. It lets you:

- Write docs inline or in markdown files.
- Specify your code's behavior precisely with JSDoc and [Google Closure Compiler annotations](https://developers.google.com/closure/compiler/docs/js-for-compiler?hl=en) - a well known documentation syntax.
- Customize your site's theme and layout.
- Generate multi-versioned documentation.
- Document CSS alongside JavaScript. You can even make a [live style guide](http://documentjs.com/examples/styles/index.html).

You can keep it simple like the example above, or you can customize your docs with many powerful features. In fact, this entire site and the [CanJS](http://canjs.com/docs/index.html) site are generated using DocumentJS.

<a class="btn" href="http://documentjs.com/docs/index.html"><span>View the Documentation</span></a>
<a class="btn" href="/place-my-order.html#section=section_Createdocumentation"><span>View the Guide</span></a>

_DoneJS Documentation is a feature of [DocumentJS](http://documentjs.com/)_

### Continuous Integration & Deployment

Continuous Integration (CI) and Continuous Deployment (CD) are amazing tools. With CI pull requests will trigger tests and builds to insure any new code won’t break your application. CD means that any release or merges to your release branch will trigger tests, builds and deployment. All of this is automated and can be tightly integrated into git. Popular services for continuous integration and deployment include TravisCI and Jenkins.

<img src="/static/img/git-failed.gif" srcset="/static/img/git-failed.gif 1x, /static/img/git-failed-2x.gif 2x" alt="A pull request that breaks the build or fails tests">
_Example of a GitHub pull request with Travis CI integrated. Warns users in advance of merges if their changes will break builds or fail tests._

<img src="/static/img/git-passed.gif" srcset="/static/img/git-passed.gif 1x, /static/img/git-passed-2x.gif 2x" alt="A pull request that successfully builds in CI">
_Example of a GitHub pull request with Travis CI integrated. Let's users know that a PR can safely be merged._


DoneJS helps you with the most important aspect of CI and CD -- Tests! (link to test feature) Our generators add tests so you can start every component of your app with proper testing. No more excuses. This is often the biggest hurdle for projects to move to CI and CD. Without proper tests and CI merging new code is risky, and automatically deploying code is just silly -- but not with DoneJS!

[Checkout our guide](./place-my-order.html#section=section_Setupautomatedtestsandcontinuousintegration_CI_) to learn how to set up testing and CI with TravisCI for your DoneJS app.

### NPM Packages

DoneJS applications can use packages published to NPM without configuration thanks to StealJS. Get more done faster by incorporating other people's code into your client side project!

It's fast and easy to install a package from the terminal:
```
npm install jquery --save
```

The dependencies for packages installed with npm are automatically loaded.

Import packages written in ES6 module syntax, AMD, or CommonJS easily:
```
import $ from "jquery";
```

#### You can create and share your own too!

DoneJS supports exporting your modules to other formats such as:
- CommonJS and Browserify
- AMD and r.js
- or even &lt;script&gt; and &lt;link&gt; tags if you're adding new ideas to old code

This makes reuse across an organization much easier! If you publish your DoneJS [modlets](#section_Modlets), you'll be building things you can use and reuse across your projects for years to come.

Just create your [export script](http://stealjs.com/docs/steal-tools.export.html), *myexport.js*:
```js
var stealTools = require("steal-tools");
stealTools.export({
  system: {
    config: __dirname+"/package.json!npm"
  },
  outputs: {
    amd: {
      format: "amd",
      graphs: true,
      dest: __dirname+"/dist/amd"
    }
});
```

and execute it from your termnial:
```
node myexport.js
```

#### Watch our demonstration video for more
<iframe width="560" height="315" src="https://www.youtube.com/embed/eIfUsPdKF4A" frameborder="0" allowfullscreen></iframe>

### ES6 Modules

DoneJS supports the compact and powerful [ES6 module](http://www.2ality.com/2014/09/es6-modules-final.html) syntax, even for browsers that don't support it yet. Besides future proofing your application, writing ES6 modules makes it easier to write modular, maintainable code.

````
import { add, subtract } from "math";

export function subtract(a, b) {
  return a - b;
}
````

#### How it works

DoneJS applications are actually able to import or export any module type: ES6, AMD and CommonJS. This means you can slowly phase in ES6, while still using your old code. You can also use any of the many exciting [ES6 language features](https://github.com/lukehoban/es6features).

A compiler is used to convert ES6 syntax to ES5 in browsers that don't yet support ES6. The build step will handle this conversion so your production code will run native ES5. You can even run your [ES6 application in IE8](#section=section_SupportsAllBrowsers_EvenIE8)!

To learn more about ES6 and other module support, read the StealJS [ES6 docs](http://stealjs.com/docs/syntax.es6.html
), the project [exporting docs](http://stealjs.com/docs/StealJS.project-exporting.html
), and check out the [stealjs/transpile](https://github.com/stealjs/transpile) project.

### Modlets

The secret to building large apps is never build large apps. Break up your application into small pieces. Then, assemble.

DoneJS encourages use of the modlet file organization pattern. Modlets are small, decoupled, reusable, testable mini applications.

#### How it works

Large apps have a lot of files. There are two ways to organize them: by type or by module.

<img src="/static/img/donejs-modlet-diagram.png" srcset="/static/img/donejs-modlet-diagram.png 1x, /static/img/donejs-modlet-diagram-2x.png 2x" alt="DoneJS Modlet Organization Diagram" />

Organization by module - or modlets - make large applications easier to maintain by encouraging good architecture patterns.

DoneJS generators create modlets to get you started quickly. Creating isolated test and demo pages for your modlet is simple and doesn't require any extra configuration.

To learn more about the modlet pattern, read this [blog post](http://blog.bitovi.com/modlet-workflows/), watch [this video](https://youtu.be/eIfUsPdKF4A?t=97), and [follow in the guide](http://donejs.com/Guide.html#section=section_Generatecustomelements) where generators are used to create modlets.

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

### MVVM Architecture

DoneJS applications employ a [Model-View-ViewModel](https://en.wikipedia.org/wiki/Model_View_ViewModel) architecture pattern, provided by [CanJS](http://canjs.com/).

<img src="/static/img/mvvm.png" srcset="/static/img/mvvm.png 1x, /static/img/mvvm-2x.png 2x" alt="MVVM Architecture Diagram" />

The introduction of a strong ViewModel has some key advantages for maintaining large applications:

 * **Decouples the presentation from its business logic** - A ViewModel is essentially an object and methods representing the state of a View. This separation of concerns lets the View powerfully express behavior with just HTML and data, while the ViewModel manages the complexities of business logic.
 * **Enables designer/developer cooperation** - Because the view is stripped of code and business logic, designers can safely and comfortably change the View without fear of breaking things.
 * **Enables easier testing** - ViewModels can be unit tested easily. Since they represent the view's state without any knowledge of the DOM, they provide a simple interface for testing.

#### How it works

DoneJS has a uniquely strong ViewModel layer compared to other frameworks. The foundation for this is three important layers: computed properties, data bound templates, and an observable data layer.

##### Computed properties

Properties in ViewModels often compute their value from other properties.

```
fullName: {
    get () {
       return this.attr("first") + " " + this.attr("last");
     }
}
```

##### Data bound templates

Those properties are then rendered in the view.

```
<div>{{fullName}}</div>
```

##### Observable data layer

When a dependent property is changed, this sets off a cascade of events.

```
person.attr('first', 'Brian');

---> // triggers 'change'

fullName: {
    get () {
       return this.attr("first") + " " + this.attr("last");
     }
}

---> // knows its dependent property changed, re-computes

<div>{{fullName}}</div>

---> // changes value in the DOM
```
 1. `firstName` changes (could be due to a user entering data in an input field or a socket.io update).
 1. Because of the observable data layer, changes to `firstName` triggers a `change` event.
 1. Because of computed properties, that `change` event tells `fullName` to recompute its value.
 1. Because of data bound templates, when `fullName` changes its value, that change is reflected in the DOM.

##### Computed properties + Data bound templates + Observable data layer = Expressive Power

The interplay of these three layers provides amazing power to developers. ViewModels express complex relationships between data, without regard to its display. Views express properties from the ViewModel, without regard to their origin. The app then comes alive with rich functionality.

Without these layers, achieving the fullName functionality would require code that communicates changes between modules, removing the isolation achieved above. Any change to `first` would need to notify `fullName` of a change. Any change to `fullName` would need to tell the view to re-render itself. These dependencies grow and quickly lead to unmaintainable code.

##### An example

DoneJS ViewModels have special per-property hooks to define type, initial value, get, set, remove, and serialize behavior. The result is expressive ViewModels:

```
export var ViewModel = Map.extend({
  define: {
    // Our list of states
    states: {
      get() {
        return State.getList({});
      }
    },
    // The selected state
    state: {
      type: 'string',
      value: null,
      set() {
        // Remove the city when the state changes
        this.attr('city', null);
      }
    },
    // The list of cities
    cities: {
      get() {
        let state = this.attr('state');

        if(!state) {
          return null;
        }

        return City.getList({ state });
      }
    },
    // The selected city
    city: {
      type: 'string',
      value: null
    }
  }
});
```

The example above defines the behavior in the state, city, restaurant selector seen in this page:

<img src="./static/img/pmo-picker.gif" alt="The place my order city and state picker." />

A simple unit test for this ViewModel would look like:

```
QUnit.asyncTest('setting a state loads its cities', function() {
  var vm = new ViewModel();
  var expectedCities = cityStore.findAll({data: {state: "CA"}}).data;

  QUnit.equal(vm.attr('cities'), null, '');
  vm.attr('state', 'CA');
  vm.attr('cities').then(cities => {
    QUnit.deepEqual(cities.attr(), expectedCities);
    QUnit.start();
  });
});
```

For a more detailed walk through of this code, follow the [in depth guide](./place-my-order.html).

##### Views

DoneJS Views are templates. Specifically, templates that use handlebars syntax, but with data bindings and rewritten for better performance. Handlebars templates are designed to be logic-less.

The View corresponding to the ViewModel example from above:

```
<label>State</label>
<select can-value="{state}" {{#if states.isPending}}disabled{{/if}}>
  {{#if states.isPending}}
    <option value="">Loading...</option>
  {{else}}
    {{^if state}}
    <option value="">Choose a state</option>
    {{/if}}
    {{#each states.value}}
    <option value="{{short}}">{{name}}</option>
    {{/each}}
  {{/if}}
</select>
<label>City</label>
<select can-value="city" {{^if state}}disabled{{/if}}>
  {{#if cities.isPending}}
    <option value="">Loading...</option>
  {{else}}
    {{^if city}}
    <option value="">Choose a city</option>
    {{/if}}
    {{#each cities.value}}
    <option>{{name}}</option>
    {{/each}}
  {{/if}}
</select>
```

##### Models

DoneJS Models wrap data services. They can be reused across ViewModels. They often perform data validation and sanitization logic. Their main function is to represent data sent back from a server.

DoneJS models are built with intelligent set logic that enables [real time](#section=section_RealTimeConnected) integration and [caching](#section=section_CachingandMinimalDataRequests) techniques.

##### More information

The MVVM architecture in DoneJS is provided by [CanJS](http://canjs.com/). To learn more:

 * Models - read about [can.connect](http://connect.canjs.com/)
 * Computed properties - read about [can.compute](http://canjs.com/docs/can.compute.html)
 * Observable data layer - read about [can.Map](http://canjs.com/docs/can.Map.html) and [can.List](http://canjs.com/docs/can.List.html)
 * ViewModels - read about [can.component](http://canjs.com/docs/can.Component.html), [can.Component.viewModel](http://canjs.com/docs/can.Component.prototype.viewModel.html), and [can.Map.define](http://canjs.com/docs/can.Map.prototype.define.html)
 * Views - read about [can.stache](http://canjs.com/docs/can.stache.html)
 * [Create a unit tested ViewModel](./place-my-order.html#section=section_Creatingaunit_testedviewmodel) in the in depth guide

### Live Reload

Getting and staying in [flow](https://en.wikipedia.org/wiki/Flow_(psychology)) is critical while writing complex apps. In DoneJS, whenever you change JavaScript, CSS, or a template file, the change is automatically reflected in your browser, without a browser refresh. You spend less time waiting for refreshes and builds, and more time [sharpening your chainsaw](https://www.youtube.com/watch?v=PxrhQv6hyfY).

<video name="media" class="animated-gif" style="width: 100%;" autoplay="" loop="" src="/static/img/donejs-live-reload.mp4"><source video-src="/static/img/donejs-live-reload.mp4" type="video/mp4" class="source-mp4" src="/static/img/donejs-live-reload.mp4"></video>

#### How it works

Other live reload servers watch for file changes and force your browser window to refresh.

DoneJS live reload doesn’t refresh the page, it re-imports modules that are marked as dirty, in real-time. It is more like hot swapping than traditional live reload. The result is a blazing fast development experience.

There is no configuration needed to enable this feature. Just start the dev server and begin:

```
donejs develop
```

To learn more about live reload, read the [StealJS docs](http://stealjs.com/docs/steal.live-reload.html).

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
