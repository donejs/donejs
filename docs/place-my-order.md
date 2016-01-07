@page place-my-order In depth guide
@parent DoneJS
@hide sidebar
@outline 2 ol
@description In this guide you will learn about all of [DoneJS' features]() by creating, testing, documenting, building and deploying [place-my-order.com](http://place-my-order.com), a restaurant menu and ordering application. The final result will look like this:


<img src="/static/img/place-my-order.png" srcset="/static/img/place-my-order.png 1x, /static/img/place-my-order-2x.png 2x">


After the initial application setup, which includes a server that hosts and pre-renders the application, we will create several custom elements and bring them together using the application state and routes. Then we will learn how to retrieve data from the server using a RESTful API.

After that we will talk about what a view model is and how to identify, implement and test its functionality. Once we have unit tests running in the browser, we will automate running them locally from the command line and also on a continuous integration server. In the subsequent chapters, we will show how to easily import other modules into our application and how to set up a real-time connection.

Finally, we will describe how to build and deploy our application to the web, as a desktop application with nw.js, and as a mobile app with Cordova.


@body

## Set up the project

In this section we will create our DoneJS project and set up a RESTful API for the application to use.
You will need [NodeJS](http://nodejs.org) or [io.js](https://iojs.org/en/index.html) installed and your code editor of choice.

### Create the project

To get started, let's install the DoneJS command line utility globally:

```
npm install -g donejs
```

Then we can create a new DoneJS application:

```
donejs init place-my-order
```

The initialization process will ask you questions like the name of your application (set to `place-my-order`) and the source folder (set to `src`). The other questions can be skipped by hitting enter. This will install all of DoneJS' dependencies. The main project dependencies include:

- [StealJS](http://stealjs.com) - ES6, CJS, and AMD module loader and builder
- [CanJS](http://canjs.com) - Custom elements and Model-View-ViewModel utilities
- [jQuery](http://jquery.com) - DOM helpers
- [jQuery++](http://jquerypp.com) - Extended DOM helpers
- [QUnit](https://qunitjs.com/) or Mocha - Assertion library
- [FuncUnit](http://funcunit.com) - Functional tests
- [Testee](https://github.com/bitovi/testee) - Test runner
- [DocumentJS](http://documentjs.com) - Documentation

If we now go into the `place-my-order` folder with

```
cd place-my-order
```

We can see the following files:

```
├── .yo-rc.json
├── build.js
├── development.html
├── documentjs.json
├── package.json
├── production.html
├── readme.md
├── src/
|   ├── app.js
|   ├── index.stache
|   ├── models/
|   |   ├── fixtures
|   |   |   ├── fixtures.js
|   |   ├── test.js
|   ├── styles.less
|   ├── test.html
|   ├── test/
|   |   ├── test.js
|   |   ├── functional.js
├── node_modules/
```

Let's have a quick look at the purpose of each:

- `.yo-rc.json` contains information for running the generators.
- `development.html`, `production.html` those pages can run the DoneJS application in development or production mode without a server
- `package.json` is the main configuration file that defines all our application dependencies and other settings.
- `test.html` is used to run all our tests.
- `documentjs.json` is the configuration file for generating documentation.
- `readme.md` is the readme file for your repository.
- `src` is the folder where all our development assets live in their own modlets (more about that later).
- `src/app.js` is the main application file, which exports the main application state.
- `src/index.stache` is the main client template that includes server-side rendering.
- `src/models/` is the folder where models for the API connection will be put. It currently contains `fixtures/fixtures.js` which will reference all the specific models fixtures files (so that we can run model tests without the need for a running API server) and `test.js` which will later gather all the individual model test files.
- `src/styles.less` is the main application styles.
- `src/test/test.js` collects all individual component and model tests we will create throughout this guide and is loaded by `test.html`.
- `src/test/functional.js` will contain functional smoke tests for our application.

### Development mode

DoneJS comes with its own server, which hosts your development files and takes care of server-side rendering. DoneJS' development mode will also enable [hot module swapping](http://blog.bitovi.com/hot-module-replacement-comes-to-stealjs/) which automatically reloads files in the browser as they change. You can start it by running:

```
donejs develop
```

The default port is 8080, so if we now go to [http://localhost:8080/](localhost:8080) we can see our application with a default homepage. If we change `src/index.stache` or `src/app.js` all changes will show up right away in the browser. Try it by changing the `message` property in `src/app.js`.

### Setup a service API

Single page applications usually communicate with a RESTful API and a websocket connection for real-time updates. This guide will not cover how to create a REST API. Instead, we'll just install and start an existing service API created specifically for use with this tutorial:

**Note**: Kill the server for now while we install a few dependencies (ctrl+c on Windows, cmd+c on Mac).

```
npm install place-my-order-api --save
```

Now we can add an API server start script into the `scripts` section of our `package.json` like this:

```js
"scripts": {
    "api": "place-my-order-api --port 7070",
```

Which allows us to start the server like:

```
donejs api
```

The first time it starts, the server will initialize some default data (restaurants and orders). Once started, you can verify that the data has been created and the service is running by going to [http://localhost:7070/restaurants](http://localhost:7070/restaurants), where we can see a JSON list of restaurant data.

### Starting the application

Now our application is good to go and we can start the server. We need to proxy the `place-my-order-api` server to `/api` on our server in order to avoid violating the same origin policy. This means that we need to modify the `start` script in our `package.json` from:

```js
"scripts": {
  "api": "place-my-order-api --port 7070",
  "test": "testee src/test.html --browsers firefox --reporter Spec",
  "start": "can-serve --port 8080",
  "develop": "can-serve --develop --port 8080",
```

To:

```js
"scripts": {
  "api": "place-my-order-api --port 7070",
  "test": "testee src/test.html --browsers firefox --reporter Spec",
  "start": "can-serve --proxy http://localhost:7070 --port 8080",
  "develop": "can-serve --develop --proxy http://localhost:7070 --port 8080",
```

Then we can start the application with

```
donejs develop
```

Go to [http://localhost:8080](http://localhost:8080) to see the "hello world" message with the application styles loaded.

### Loading assets

Before we get to the code, we also need to install the `place-my-order-assets` package which contains the images and styles specifically for this tutorial's application:

```
npm install place-my-order-assets --save
```

Every DoneJS application consists of at least two files:

 1. **A main template** (in this case `src/index.stache`) which contains the main template and links to the development or production assets
 1. **A main application view-model** (`src/app.js`) that initializes the application state and routes

`src/index.stache` was already created for us when we ran `donejs init`, so we can update it to reflect the below content:

```handlebars
<html>
  <head>
    <title>{{title}}</title>
    {{asset "css"}}
    {{asset "html5shiv"}}
  </head>
  <body>
    <can-import from="place-my-order-assets" />
    <can-import from="place-my-order/styles.less!" />
    <can-import from="place-my-order/app" export-as="viewModel" />

    <h1>{{message}}</h1>

    {{asset "inline-cache"}}

    {{#switch env.NODE_ENV}}
      {{#case "production"}}
        <script
          src="{{joinBase 'node_modules/steal/steal.production.js'}}"  
          main="place-my-order/index.stache!done-autorender">
        </script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

This is an HTML5 template that uses [can.stache](http://canjs.com/docs/can.stache.html) - a [Handlebars syntax](http://handlebarsjs.com/)-compatible view engine. It renders a `message` property from the application state.

`can-import` loads the template's dependencies:
 1. The `place-my-order-assets` package, which loads the LESS styles for the application
 1. `place-my-order/app`, which is the main application file

The [asset](http://canjs.github.io/can-ssr/doc/can-ssr.helpers.asset.html) helper loads assets like CSS, cached data, and scripts, regardless of the current environment (development or production).

The main application file at `src/app.js` looks like this:

```
// src/app.js
import AppMap from "can-ssr/app-map";
import route from "can/route/";
import 'can/map/define/';
import 'can/route/pushstate/';

const AppViewModel = AppMap.extend({
  define: {
    message: {
      value: 'Hello World!',
      serialize: false
    },
    title: {
      value: 'place-my-order',
      serialize: false
    }
  }
});

export default AppViewModel;
```

This initializes an [AppMap](http://canjs.github.io/can-ssr/doc/can-ssr.AppMap.html): a special object that acts as the application global state (with a default `message` property) and also plays a key role in enabling server side rendering.

## Creating custom elements

One of the most important concepts in DoneJS is splitting up your application functionality into individual, self-contained modules. In the following section we will create separate components for the homepage, the restaurant list, and the order history page. After that, we will glue them all together using routes and the global application state.

There are two ways of creating components. For smaller components we can define all templates, styles and functionality in a single `.component` file (to learn more see [done-component](https://github.com/donejs/done-component)). Larger components can be split up into several separate files.

### Creating a homepage element

To generate a new component run:

```
donejs add component home.component pmo-home
```

This will create a file at `src/home.component` containing the basic ingredients of a component. We will update it to reflect the below content:

```html
<can-component tag="pmo-home">
  <template>
     <div class="homepage">
      <img src="{{joinBase 'node_modules/place-my-order-assets/images/homepage-hero.jpg'}}"
          width="250" height="380" />
      <h1>Ordering food has never been easier</h1>
      <p>
        We make it easier than ever to order gourmet food
        from your favorite local restaurants.
      </p>
      <p><a class="btn" href="/restaurants" role="button">Choose a Restaurant</a></p>
     </div>
  </template>
</can-component>
```

Here we created a [can.Component](http://canjs.com/docs/can.Component.html) named `pmo-home` using a [web-component](http://webcomponents.org/) style declaration. This particular component is just a basic template, it does not have much in the way of styles or functionality.

### Create the order history element

We'll create an initial version of order history that is very similar.

```
donejs add component order/history.component pmo-order-history
```

And update `src/order/history.component`:

```
<can-component tag="pmo-order-history">
  <template>
    <div class="order-history">
      <div class="order header">
        <address>Name / Address / Phone</address>
        <div class="items">Order</div>
        <div class="total">Total</div>
        <div class="actions">Action</div>
      </div>
    </div>
  </template>
</can-component>
```

### Creating a restaurant list element

The restaurant list will contain more functionality, which is why we will split its template and component logic into separate files.

We can create a basic component like that by running:

```
donejs add component restaurant/list pmo-restaurant-list
```

The component's files are collected in a single folder so that components can be easily tested, moved, and re-used. The folder structure looks like this:

```
├── node_modules
├── package.json
├── src/
|   ├── app.js
|   └── index.stache
|   ├── models
|   ├── order/
|   |   ├── history.component
|   ├── restaurant/
|   |   ├── list/
|   |   |   ├── list.html
|   |   |   ├── list.js
|   |   |   ├── list.less
|   |   |   ├── list.md
|   |   |   ├── list.stache
|   |   |   ├── list_test.js
|   |   |   ├── test.html
```

We will learn more about those files and add more functionality to this element later, but it already contains a fully functional component with a demo page (see [localhost:8080/src/restaurant/list/list.html](http://localhost:8080/src/restaurant/list/list.html)), a basic test (at [localhost:8080/src/restaurant/list/test.html](http://localhost:8080/src/restaurant/list/test.html)) and documentation placeholders.

## Setting up routing

In this part, we will create routes - URL patterns that load specific parts of our single page app. We'll also dynamically load the custom elements we created and integrate them in the application's main page.

### Create Routes

Routing works a bit differently than other libraries. In other libraries, you might declare routes and map those to controller-like actions.

DoneJS application [routes](http://canjs.com/docs/can.route.html) map URL strings (like /user/1) to properties in our application state. In other words, our routes will just be a representation of the application state.

To learn more about routing visit the CanJS guide on [Application State and Routing](http://canjs.com/guides/AppStateAndRouting.html).

To add our routes, change `src/app.js` to:

```js
import AppMap from 'can-ssr/app-map';
import route from 'can/route/';
import 'can/route/pushstate/';
import 'can/map/define/';

const AppViewModel = AppMap.extend({
  define: {
    title: {
      serialize: false,
      value: 'place-my-order'
    }
  }
});

route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });

export default AppViewModel;
```

Now we have three routes available:

- `:page` captures urls like [http://localhost:8080/home](http://localhost:8080/home) and sets the `page` property on `AppViewModel` to `home` (which is also the default when visiting [http://localhost:8080/](http://localhost:8080/))
- `:page/:slug` matches restaurant links like [http://localhost:8080/restaurants/spago](http://localhost:8080/restaurants/spago) and sets `page` and `slug` (a URL friendly restaurant short name)
- `:page/:slug/:action` will be used to show the order page for a specific restaurant e.g. [http://localhost:8080/restaurants/spago/order](http://localhost:8080/restaurants/spago/order)

Its important to note that if any of these URLs are matched, AppViewModel, which is the application's global state, will contain these properties, even though they aren't present in the AppViewModel definition directly. Properties can be set on AppViewModel that aren't explicitly defined.

### Adding a header element

Now is also a good time to add a header element that links to the different routes we just defined. We can run

```
donejs add component header.component pmo-header
```

and update `src/header.component` to:

```html
<can-component tag="pmo-header">
  <template>
    <header>
      <nav>
       <h1>place-my-order.com</h1>
       <ul>
         <li class="{{#eq page 'home'}}active{{/eq}}">
           <a href="{{routeUrl page='home'}}">Home</a>
         </li>
         <li class="{{#eq page 'restaurants'}}active{{/eq}}">
           <a href="{{routeUrl page='restaurants'}}">Restaurants</a>
         </li>
         <li class="{{#eq page 'order-history'}}active{{/eq}}">
           <a href="{{routeUrl page='order-history'}}">Order History</a>
         </li>
       </ul>
      </nav>
    </header>
  </template>
</can-component>
```

Here we use [can-href](http://canjs.com/docs/can.view.href.html) to create links that will set values in the application state. For example, the first usage of can-href above will create a link based on the current routing rules ([http://localhost:8080/home](http://localhost:8080/home) in this case) that sets the `page` property to `home` when clicked.

We also use the Handlebars `eq` helper to make the appropriate link active.

### Create a loading indicator

To show that something is currently loading, let's create a `pmo-loading` component:

```
donejs add component loading.component pmo-loading
```

Change `src/loading.component` to:

```html
<can-component tag="pmo-loading">
  <template>
    {{#eq state "resolved"}}
      <content></content>
    {{else}}
      <div class="loading"></div>
    {{/eq}}
  </template>
</can-component>
```

### Switch between components

Now we can glue all those individual components together in `src/index.stache`. What we want to do is - based on the current page (`home`, `restaurants` or `order-history`) - load the correct component and then initialize it.

Update `src/index.stache` to:

```html
<html>
  <head>
    <title>{{title}}</title>
    {{asset "css"}}
    {{asset "html5shiv"}}
  </head>
  <body>
    <can-import from="place-my-order-assets" />
    <can-import from="place-my-order/styles.less!" />
    <can-import from="place-my-order/app" export-as="viewModel" />

    <can-import from="place-my-order/loading.component!" />
    <can-import from="place-my-order/header.component!" />
    <pmo-header page="{page}"></pmo-header>

    {{#switch page}}
      {{#case "home"}}
        <can-import from="place-my-order/home.component!"
            can-tag="pmo-loading">
          <pmo-home></pmo-home>
        </can-import>
      {{/case}}
      {{#case "restaurants"}}
        <can-import from="place-my-order/restaurant/list/"
            can-tag="pmo-loading">
          <pmo-restaurant-list></pmo-restaurant-list>
        </can-import>
      {{/case}}
      {{#case "order-history"}}
        <can-import from="place-my-order/order/history.component!"
            can-tag="pmo-loading">
          <pmo-order-history></pmo-order-history>
        </can-import>
      {{/case}}
    {{/switch}}

    {{asset "inline-cache"}}

    {{#switch env.NODE_ENV}}
      {{#case "production"}}
        <script
          src="{{joinBase 'node_modules/steal/steal.production.js'}}"  
          main="place-my-order/index.stache!done-autorender">
        </script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

Here we make a `switch` statement that checks for the current `page` property (part of the AppViewModel that makes up the scope object of this template) then progressively loads the component with [can-import](http://canjs.com/docs/can%7Cview%7Cstache%7Csystem.import.html) and initializes it.

Setting `can-tag="pmo-loading"` inserts a `<pmo-loading>` loading indicator while the import is in progress. A can-import's view model is a promise object, so once it is done loading, it sets its `state` property to `resolved`.

Now we can see the header and the home component and be able to navigate to the different pages through the header.

## Getting Data from the Server

In this next part, we'll connect to the RESTful API that we set up with `place-my-order-api`, using the powerful data layer provided by [can-connect](http://connect.canjs.com/).

### Creating a restaurants connection

At the beginning of this guide we set up a REST API at [http://localhost:7070](http://localhost:7070) and told `can-serve` to proxy it to [http://localhost:8080/api](http://localhost:8080/api).

To manage the restaurant data located at [http://localhost:8080/api/restaurants](http://localhost:8080/api/restaurants), we'll create a restaurant supermodel:

```js
donejs add supermodel restaurant
```

Answer the question about the URL endpoint with `/api/restaurants` and the name of the id property with `_id`.

We have now created a model and fixtures (for testing without an API) with a folder structure like this:

```
├── node_modules
├── package.json
├── src/
|   ├── app.js
|   └── index.stache
|   ├── models/
|   |   ├── fixtures/
|   |   |   ├── restaurant.js
|   |   ├── fixtures.js
|   |   ├── restaurant.js
|   |   ├── restaurant_test.js
|   |   ├── test.js
```

### Test the connection

To test the connection you can temporarily add the following to `src/app.js`:

```js
import Restaurant from './models/restaurant';

Restaurant.getList({}).then(restaurants => console.log(restaurants.attr()));
```

After reloading the homepage you should see the restaurant information logged in the console. Once you've verified, you can remove the test code.

### Add data to the page

Now we can update the `ViewModel` in `src/restaurant/list/list.js` to use [can.Map.define](http://canjs.com/docs/can.Map.prototype.define.html) to load all restaurants from the restaurant connection:

```js
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import template from './list.stache!';
import Restaurant from 'place-my-order/models/restaurant';

export var ViewModel = Map.extend({
  define: {
    restaurants: {
      value() {
        return Restaurant.getList({});
      }
    }
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  viewModel: ViewModel,
  template: template
});
```

And update the template at `src/restaurant/list/list.stache` to use the [Promise](http://canjs.com/docs/can.Deferred.html) returned for the `restaurants` property to render the template:

```html
<div class="restaurants">
  <h2 class="page-header">Restaurants</h2>
  {{#if restaurants.isPending}}
    <div class="restaurant loading"></div>
  {{/if}}
  {{#if restaurants.isResolved}}
    {{#each restaurants.value}}
      <div class="restaurant">
        <img src="{{joinBase images.thumbnail}}"
          width="100" height="100">
        <h3>{{name}}</h3>
        {{#address}}
        <div class="address">
          {{street}}<br />{{city}}, {{state}} {{zip}}
        </div>
        {{/address}}

        <div class="hours-price">
          $$$<br />
          Hours: M-F 10am-11pm
          <span class="open-now">Open Now</span>
        </div>

        <a class="btn" href="{{routeUrl page='restaurants' slug=slug}}">
          Details
        </a>
        <br />
      </div>
    {{/each}}
  {{/if}}
</div>
```

By checking for `restaurants.isPending` and `restaurants.isResolved` we are able to show a loading indicator while the data are being retrieved. Once resolved, the actual restaurant list is available at `restaurants.value`. When navigating to the restaurants page now we can see a list of all restaurants.

Note the usage of `can-href` to set up a link that points to each restaurant. `slug=slug` is not wrapped in quotes because the helper will populate each restaurant's individual `slug` property in the URL created.

## Creating a unit-tested view model

In this section we will create a view model for the restaurant list functionality.

We'll show a dropdown of all available US states. When the user selects a state, we'll show a list of cities. Once a city is selected, we'll load a list of all restaurants for that city. The end result will look like this:

![Restaurant list](static/img/restaurant-list.png)

### Identify view model state

First we need to identify the properties that our view model needs to provide. We want to load a list of states from the server and let the user select a single state. Then we do the same for cities and finally load the restaurant list for that selection.

All asynchronous requests return a Promise, so the data structure will look like this:

```js
{
 states: Promise<[State]>
 state: String "IL”,
 cities: Promise<[City]>,
 city: String "Chicago”,
 restaurants: Promise<[Restaurant]>
}
```

### Create dependent models

The API already provides a list of available [states](http://localhost:8080/api/states) and [cities](http://localhost:8080/api/cities) (`api/cities`). To load them we can create the corresponding models like we already did for Restaurants.

```
donejs add supermodel state
```

When prompted, set the URL to `/api/states` and the id property to `short`.

```
donejs add supermodel city
```

For city the URL is `/api/cities` and the id property is `name`. Now we can load a list of states and cities.

### Implement view model behavior

Now that we have identified the view model properties needed and have created the models necessary to load them, we can [define](http://canjs.com/docs/can.Map.prototype.define.html) the `states`, `state`, `cities` and `city` properties in the view model at `src/restaurant/list/list.js`:

```js
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import template from './list.stache!';
import Restaurant from 'place-my-order/models/restaurant';
import State from 'place-my-order/models/state';
import City from 'place-my-order/models/city';

export var ViewModel = Map.extend({
  define: {
    states: {
      get() {
        return State.getList({});
      }
    },
    state: {
      type: 'string',
      value: null,
      set() {
        // Remove the city when the state changes
        this.attr('city', null);
      }
    },
    cities: {
      get() {
        let state = this.attr('state');

        if(!state) {
          return null;
        }

        return City.getList({ state });
      }
    },
    city: {
      type: 'string',
      value: null
    },
    restaurants: {
      get() {
        let state = this.attr('state');
        let city = this.attr('city');

        if(state && city) {
          return Restaurant.getList({
            'address.state': state,
            'address.city': city
          });
        }

        return null;
      }
    }
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  viewModel: ViewModel,
  template: template
});
```

Let's take a closer look at those properties:

- `states` will return a list of all available states by calling `State.getList({})`
- `state` is a string property set to `null` by default (no selection). Additionally, when `state` is changed we will remove the dependent `city` selection.
- `cities` will return `null` if no state has been selected. Otherwise, it will load all the cities for a given state by sending `state` as a query paramater (which will make a request like [http://localhost:8080/api/cities?state=IL](ttp://localhost:8080/api/cities?state=IL))
- `city` is a simple string, set to `null` by default
- `restaurants` will always be `null` unless both a `city` and a `state` are selected. If both are selected, it will set the `address.state` and `address.city` query parameters which will return a list of all restaurants whose address matches those parameters.

### Create a test

View models that are decoupled from the presentation layer are easy to test. We will use [QUnit](http://qunitjs.com/) as the testing framework by loading a StealJS-friendly wrapper (`steal-qunit`). The component generator created a fully working test page for the component, which can be opened at [http://localhost:8080/pmo/restaurant/list/test.html](http://localhost:8080/src/restaurant/list/test.html). Currently, the tests will fail because we changed the view model, but in this section we will create some unit tests for the new functionality.

#### Fixtures: Create fake data

Unit tests should be able to run by themselves without the need for an API server. This is where [fixtures](http://canjs.com/docs/can.fixture.html) come in. Fixtures allow us to mock requests to the REST API with data that we can use tests or demo pages. Default fixtures will be provided for every generated model. Now we'll add more realistic fake data by updating `src/models/fixtures/state.js` to:

```js
import fixture from 'can-fixture';

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

Update `src/models/fixtures/city.js` to look like:

```js
import fixture from 'can-fixture';

const store = fixture.store([
  { state: 'CA', name: 'Casadina' },
  { state: 'NT', name: 'Alberny' }
],{});

fixture({
  'GET /api/cities': store.findAll,
  'GET /api/cities/{name}': store.findOne,
  'POST /api/cities': store.create,
  'PUT /api/cities/{name}': store.update,
  'DELETE /api/cities/{name}': store.destroy
});

export default store;
```

And we also need to provide a restaurant list according to the selected city and state in `src/models/fixtures/restaurant.js`:

```js
import fixture from 'can-fixture';

const store = fixture.store([{
  _id: 1,
  name: 'Cheese City',
  slug:'cheese-city',
  address: {
    city: 'Casadina',
    state: 'CA'
  },
  images: {
    banner: "node_modules/place-my-order-assets/images/1-banner.jpg",
    owner: "node_modules/place-my-order-assets/images/2-owner.jpg",
    thumbnail: "node_modules/place-my-order-assets/images/3-thumbnail.jpg"
  }
}, {
  _id: 2,
  name: 'Crab Barn',
  slug:'crab-barn',
  address: {
    city: 'Alberny',
    state: 'NT'
  },
  images: {
    banner: "node_modules/place-my-order-assets/images/2-banner.jpg",
    owner: "node_modules/place-my-order-assets/images/3-owner.jpg",
    thumbnail: "node_modules/place-my-order-assets/images/2-thumbnail.jpg"
  }
}],{
  "address.city": function(restaurantValue, paramValue, restaurant){
    return restaurant.address.city === paramValue;
  },
  "address.state": function(restaurantValue, paramValue, restaurant){
    return restaurant.address.state === paramValue;
  }
});

fixture({
  'GET /api/restaurants': store.findAll,
  'GET /api/restaurants/{id}': store.findOne,
  'POST /api/restaurants': store.create,
  'PUT /api/restaurants/{id}': store.update,
  'DELETE /api/restaurants/{id}': store.destroy
});

export default store;
```

#### Test the view model

With fake data in place, we can test our view model by changing `src/restaurant/list/list_test.js` to:

```
import QUnit from 'steal-qunit';
import cityStore from 'place-my-order/models/fixtures/city';
import stateStore from 'place-my-order/models/fixtures/state';
import restaurantStore from 'place-my-order/models/fixtures/restaurant';
import { ViewModel } from './list';

QUnit.module('place-my-order/restaurant/list', {
  beforeEach() {
    localStorage.clear();
  }
});

QUnit.asyncTest('loads all states', function() {
  var vm = new ViewModel();
  var expectedSates = stateStore.findAll({});

  vm.attr('states').then(states => {
    QUnit.deepEqual(states.attr(), expectedSates.data, 'Got all states');
    QUnit.start();
  });
});

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

QUnit.asyncTest('changing a state resets city', function() {
  var vm = new ViewModel();
  var expectedCities = cityStore.findAll({data: {state: "CA"}}).data;

  QUnit.equal(vm.attr('cities'), null, '');
  vm.attr('state', 'CA');
  vm.attr('cities').then(cities => {
    QUnit.deepEqual(cities.attr(), expectedCities);
    vm.attr('state', 'NT');
    QUnit.equal(vm.attr('city'), null);
    QUnit.start();
  });
});

QUnit.asyncTest('setting state and city loads a list of its restaurants', function() {
  var vm = new ViewModel();
  var expectedRestaurants = restaurantStore.findAll({
    data: {"address.city": "Alberny"}
  }).data;

  vm.attr('state', 'NT');
  vm.attr('city', 'Alberny');

  vm.attr('restaurants').then(restaurants => {
    QUnit.deepEqual(restaurants.attr(), expectedRestaurants);
    QUnit.start();
  });
});
```

These unit tests are comparing expected data (what we we defined in the fixtures) with actual data (how the view model methods are behaving). Visit [http://localhost:8080/src/restaurant/list/test.html](http://localhost:8080/src/restaurant/list/test.html) to see all tests passing.

### Write the template

Now that our view model is implemented and tested, we'll update the restaurant list template to support the city/state selection functionality.

Update `src/restaurant/list/list.stache` to:

```
<div class="restaurants">
  <h2 class="page-header">Restaurants</h2>
  <form class="form">
    <div class="form-group">
      <label>State</label>
      <select {($value)}="state" {{#if states.isPending}}disabled{{/if}}>
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
    </div>
    <div class="form-group">
      <label>City</label>
      <select {($value)}="city"{{^if state}}disabled{{/if}}>
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
    </div>
  </form>

  {{#if restaurants.isPending}}
  <div class="restaurant loading"></div>
  {{/if}}

  {{#if restaurants.isResolved}}
    {{#each restaurants.value}}
    <div class="restaurant">
      <img src="/{{images.thumbnail}}" width="100" height="100">
      <h3>{{name}}</h3>
      {{#address}}
      <div class="address">
        {{street}}<br />{{city}}, {{state}} {{zip}}
      </div>
      {{/address}}

      <div class="hours-price">
        $$$<br />
        Hours: M-F 10am-11pm
        <span class="open-now">Open Now</span>
      </div>

      <a class="btn" href="{{routeUrl page='restaurants' slug=slug}}">
        Place My Order
      </a>
      <br />
    </div>
    {{/each}}
  {{/if}}
</div>
```

Some things worth pointing out:

- Since `states` and `cities` return a promise, we can check the promise's status via `isResolved` and `isPending` and once resolved get the actual value with `states.value` and `cities.value`. This also allows us to easily show loading indicators and disable the select fields while loading data.
- The `state` and `city` properties are two-way bound to their select fields via [{($value)}](http://canjs.com/docs/can.view.bindings.can-value.html)

Now we have a component that lets us select state and city and displays the appropriate restaurant list.

### Update the demo page

We already have an existing demo page at [src/restaurant/list/list.html](http://localhost:8080/src/restaurant/list/list.html). We'll update it to load fixtures so it can demonstrate the use of the pmo-restaurnt-list component:

```html
<script type="text/stache" can-autorender>
  <can-import from="place-my-order-assets" />
  <can-import from="place-my-order/models/fixtures/" />
  <can-import from="place-my-order/restaurant/list/" />
  <pmo-restaurant-list></pmo-restaurant-list>
</script>
<script src="../../../node_modules/steal/steal.js"
        main="can/view/autorender/"></script>
```

View the demo page at [http://localhost:8080/src/restaurant/list/list.html](http://localhost:8080/src/restaurant/list/list.html) .

## Automated tests and continuous integration

In this chapter we will automate running the tests so that they can be used in a [continuous integration]() environment. We will use [TravisCI](https://travis-ci.org/) as the CI server.

### Using the global test page

We already worked with an individual component test page in [src/restaurant/list/test.html](http://localhost:8080/src/restaurant/list/test.html) but we also have a global test page available at [src/test.html](http://localhost:8080/src/test.html). All tests are being loaded in `src/test/test.js`. Since we do not tests our models at the moment, let's remove the `import 'src/models/test'` part so that `src/test/test.js` looks like this:

```js
import QUnit from 'steal-qunit';

import 'place-my-order/test/functional';

import 'place-my-order/restaurant/list/list_test';
```

If you now go to [http://localhost:8080/src/test.html](http://localhost:8080/src/test.html) we still see all restaurant list tests passing but we will add more here later on.

### Using a test runner

The tests can be automated with any test runner that supports running QUnit tests. We will use [Testee]() which makes it easy to run those tests in any browser from the command line without much configuration. In fact, everything needed to automatically run the `src/test.html` page in Firefox is already set up and we can launch the tests by running:

```
donejs test
```

To see the tests passing on the command line.

### Setting up continuous integration (Travis CI)

The way our application is set up, all a continuous integration server has to do is clone the application repository, run `npm install`, and then run `npm test`. There are many open source CI servers, the most popular one probably [Jenkins](https://jenkins-ci.org/), and many hosted solutions like [Travis](https://travis-ci.org/).

We will use TravisCI as our hosted solution because it is free for open source projects. After signing up with GitHub, we have to enable the place-my-order repository in the Travis CI account settings and add the following `.travis.yml` to our project root:

```
language: node_js
node_js: node
before_install:
  - "export DISPLAY=:99.0"
  - "sh -e /etc/init.d/xvfb start"
```

By default Travis CI runs `npm tests` for NodeJS projects which is what we want. `before_install` sets up a window system to run Firefox. Now every time we push to our repository on GitHub, the tests will be run automatically.

## Nested routes

Until now we've used three top level routes: `home`, `restaurants` and `order-history`. We did however also define two additional routes in `src/app.js` which looked like:

```js
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });
```

We want to use those routes when we are in the `restaurants` page. The relevant section in `src/index.stache` currently looks like this:

```html
{{#case "restaurants"}}
  <can-import from="src/restaurant/list/">
    <pmo-restaurant-list></pmo-restaurant-list>
  </can-import>
{{/case}}
```

We want to support two additional routes:

- `restaurants/:slug`, which shows a details page for the restaurant with `slug` being a URL friendly short name for the restaurant
- `restaurants/:slug/order`, which shows the menu of the current restaurant and allows us to make a selection and then send our order.

### Create additional components

To make this happen, we need two more components. First, the `pmo-restaurant-details` component which loads the restaurant (based on the `slug`) and then displays its information.

```
donejs add component restaurant/details.component pmo-restaurant-details
```

And change `src/restaurant/details.component` to:

```html
<can-import from="place-my-order/models/restaurant"/>
<can-component tag="pmo-restaurant-details">
  <template>
    <restaurant-model get="{ _id=slug }">
      {{#if isPending}}
        <div class="loading"></div>
      {{else}}
      {{#value}}
      <div class="restaurant-header"
          style="background-image: url(/{{images.banner}});">
        <div class="background">
          <h2>{{name}}</h2>

          {{#address}}
          <div class="address">
            {{street}}<br />{{city}}, {{state}} {{zip}}
          </div>
          {{/address}}

          <div class="hours-price">
            $$$<br />
            Hours: M-F 10am-11pm
            <span class="open-now">Open Now</span>
          </div>

          <br />
        </div>
      </div>

      <div class="restaurant-content">
        <h3>The best food this side of the Mississippi</h3>

        <p class="description">
          <img src="/{{images.owner}}" />
          Description for {{name}}
        </p>
        <p class="order-link">
          <a class="btn" href="{{routeUrl page='restaurants' slug=slug action='order'}}">
            Order from {{name}}
          </a>
        </p>
      </div>
      {{/value}}
      {{/if}}
    </restaurant-model>
  </template>
</can-component>
```

The order component will be a little more complex, which is why we will put it into its own folder:

```
donejs add component order/new pmo-order-new
```

For now, we will just use placeholder content and implement the functionality in
the following chapters.

### Add to the main template

Now we can add those components to the main template (at `src/index.stache`) with conditions based on the routes that we want to match. Change the section which contains

```html
{{#case "restaurants"}}
  <can-import from="place-my-order/restaurant/list/">
    <pmo-restaurant-list></pmo-restaurant-list>
  </can-import>
{{/case}}
```

To:

```html
{{#case "restaurants"}}
  {{#if slug}}
    {{#switch action}}
      {{#case 'order'}}
        <can-import from="place-my-order/order/new/"
            can-tag="pmo-loading">
          <pmo-order-new slug="{slug}"></pmo-order-new>
        </can-import>
      {{/case}}

      {{#default}}
        <can-import from="place-my-order/restaurant/details.component!"
            can-tag="pmo-loading">
          <pmo-restaurant-details></pmo-restaurant-details>
        </can-import>
      {{/default}}
    {{/switch}}
  {{else}}
    <can-import from="place-my-order/restaurant/list/"
        can-tag="pmo-loading">
      <pmo-restaurant-list></pmo-restaurant-list>
    </can-import>
  {{/if}}
{{/case}}
```

Here we are adding some more conditions if `page` is set to `restaurants`:

- When there is no `slug` set, show the original restaurant list
- When `slug` is set but no `action`, show the restaurant details
- When `slug` is set and `action` is `order`, show the order component for that restaurant

## Importing other projects

The NPM integration of StealJS makes it very easy to share and import other components. One thing we want to do when showing the `pmo-order-new` component is have a tab to choose between the lunch and dinner menu. The good news is that there is already a [bit-tabs](https://github.com/bitovi-components/bit-tabs) component which does exactly that. Let's add it as a project dependency with:

```
npm install bit-tabs --save
```

And then integrate it into `src/order/new/new.stache`:

```html
<div class="order-form">
  <h2>Order here</h2>
  <can-import from="bit-tabs/unstyled"/>

  <bit-tabs tabs-class="nav nav-tabs">
    <bit-panel title="Lunch menu">
      This is the lunch menu
    </bit-panel>
    <bit-panel title="Dinner menu">
      This is the dinner menu
    </bit-panel>
  </bit-tabs>
</div>
```

Here we just import the `unstyled` module from the `bit-tabs` package using `can-import` which will then provide the `bit-tabs` and `bit-panel` custom elements.

## Creating data

In this section, we will update the order component to be able to select restaurant menu items and submit a new order for a restaurant.

### Creating the order model

First, let's look at the restaurant data we get back from the server. It looks like this:

```js
{
  "_id": "5571e03daf2cdb6205000001",
  "name": "Cheese Curd City",
  "slug": "cheese-curd-city",
  "images": {
    "thumbnail": "images/1-thumbnail.jpg",
    "owner": "images/1-owner.jpg",
    "banner": "images/2-banner.jpg"
  },
  "menu": {
    "lunch": [
      {
        "name": "Spinach Fennel Watercress Ravioli",
        "price": 35.99
      },
      {
        "name": "Chicken with Tomato Carrot Chutney Sauce",
        "price": 45.99
      },
      {
        "name": "Onion fries",
        "price": 15.99
      }
    ],
    "dinner": [
      {
        "name": "Gunthorp Chicken",
        "price": 21.99
      },
      {
        "name": "Herring in Lavender Dill Reduction",
        "price": 45.99
      },
      {
        "name": "Roasted Salmon",
        "price": 23.99
      }
    ]
  },
  "address": {
    "street": "1601-1625 N Campbell Ave",
    "city": "Green Bay",
    "state": "WI",
    "zip": "60045"
  }
}
```

We have a `menu` property which provides a `lunch` and `dinner` option (which will show later inside the tabs we set up in the previous chapter later). We want to be able to add and remove items from the order, check if an item is in the order already, set a default order status (`new`), and be able to calculate the order total. For that to happen, we need to create a new `order` model:

```
donejs add supermodel order
```

Like the restaurant model, the URL is `/api/orders` and the id property is `_id`. To select menu items, we need to add some additional functionality to `src/models/order.js`:

```js
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import List from 'can/list/';
import Map from 'can/map/';
import 'can/map/define/';

const ItemsList = List.extend({}, {
  has: function(item) {
    return this.indexOf(item) !== -1;
  },

  toggle: function(item) {
    var index = this.indexOf(item);

    if (index !== -1) {
      this.splice(index, 1);
    } else {
      this.push(item);
    }
  }
});

let Order = Map.extend({
  define: {
    status: {
      value: 'new'
    },
    items: {
      Value: ItemsList
    },
    total: {
      get() {
        let total = 0.0;
        this.attr('items').forEach(item =>
            total += parseFloat(item.attr('price')));
        return total.toFixed(2);
      }
    }
  },

  markAs(status) {
    this.attr('status', status);
    this.save();
  }
});

export const connection = superMap({
  url: '/api/orders',
  idProp: '_id',
  Map: Order,
  List: Order.List,
  name: 'orders'
});

tag('order-model', connection);

export default Order;
```

Here we define an `ItemsList` which allows us to toggle menu items and check if they are already in the order. We set up ItemsList as the Value of the items property of an order so we can use its has function and toggle directly in the template. We also set a default value for status and a getter for calculating the order total which adds up all the item prices. We also create another `<order-model>` tag to load orders in the order history template later.

### Implement the view model

Now we can update the view model in `src/order/new/new.js`:

```js
import Component from 'can/component/component';
import Map from 'can/map/';
import 'can/map/define/';
import template from './new.stache!';
import Restaurant from 'place-my-order/models/restaurant';
import Order from 'place-my-order/models/order';

export const ViewModel = Map.extend({
  define: {
    slug: {
      type: 'string'
    },
    order: {
      Value: Order
    },
    saveStatus: {
      Value: Object
    },
    canPlaceOrder: {
      get() {
        let items = this.attr('order.items');
        return items.attr('length');
      }
    }
  },

  placeOrder() {
    let order = this.attr('order');
    order.attr('restaurant', this.attr('restaurant._id'));
    this.attr('saveStatus', order.save());
    return false;
  },

  startNewOrder() {
    this.attr('order', new Order());
    this.attr('saveStatus', null);
    return false;
  }
});

export default Component.extend({
  tag: 'pmo-order-new',
  viewModel: ViewModel,
  template
});
```

Here we just define the properties that we need: `slug`, `order`, `canPlaceOrder` - which we will use to enable/disable the submit button - and `saveStatus`, which will become a Deferred once the order is submitted. `placeOrder` updates the order with the restaurant information and saves the current order. `startNewOrder` allows us to submit another order.

### Write the template

First, let's implement a small order confirmation component with

```
donejs add component order/details.component pmo-order-details
```

and changing `src/order/details.component` to:

```html
<can-component tag="pmo-order-details">
  <template>
    {{#order}}
      <h3>Thanks for your order {{name}}!</h3>
      <div><label class="control-label">
        Confirmation Number: {{_id}}</label>
      </div>

      <h4>Items ordered:</h4>
      <ul class="list-group panel">
        {{#each items}}
          <li class="list-group-item">
            <label>
              {{name}} <span class="badge">${{price}}</span>
            </label>
          </li>
        {{/each}}

        <li class="list-group-item">
          <label>
            Total <span class="badge">${{total}}</span>
          </label>
        </li>
      </ul>

      <div><label class="control-label">
        Phone: {{phone}}
      </label></div>
      <div><label class="control-label">
        Address: {{address}}
      </label></div>
    {{/order}}
  </template>
</can-component>
```

Now we can import that component and update `src/order/new/new.stache` to:

```html
<can-import from="bit-tabs/unstyled"/>
<can-import from="place-my-order/order/details.component!" />

<div class="order-form">
  <restaurant-model get="{ _id=slug }">
    {{#if isPending}}
      <div class="loading"></div>
    {{else}}
      {{#value}}
        {{#if saveStatus.isResolved}}
          <pmo-order-details order="{saveStatus.value}"></pmo-order-details>
          <p><a href="javascript://" ($click)="startNewOrder">
            Place another order
          </a></p>
        {{else}}
          <h3>Order from {{name}}</h3>

          <form ($submit)="placeOrder">
            <bit-tabs tabs-class="nav nav-tabs">
              <p class="info {{^if order.items.length}}text-error{{else}}text-success{{/if}}">
                {{^if order.items.length}}
                  Please choose an item
                {{else}}
                  {{order.items.length}} selected
                {{/if}}
              </p>
              <bit-panel title="Lunch menu">
                <ul class="list-group">
                  {{#each menu.lunch}}
                    <li class="list-group-item">
                      <label>
                        <input type="checkbox"
                          ($change)="order.items.toggle(.)"
                          {{#if order.items.has(.)}}checked{{/if}}>
                        {{name}} <span class="badge">${{price}}</span>
                      </label>
                    </li>
                  {{/each}}
                </ul>
              </bit-panel>
              <bit-panel title="Dinner menu">
                <ul class="list-group">
                  {{#each menu.dinner}}
                    <li class="list-group-item">
                      <label>
                        <input type="checkbox"
                          ($change)="order.items.toggle(this)"
                          {{#if order.items.has(.)}}checked{{/if}}>
                        {{name}} <span class="badge">${{price}}</span>
                      </label>
                    </li>
                  {{/each}}
                </ul>
              </bit-panel>
            </bit-tabs>

            <div class="form-group">
              <label class="control-label">Name:</label>
              <input name="name" type="text" class="form-control"
                {($value)}="order.name">
              <p>Please enter your name.</p>
            </div>
            <div class="form-group">
              <label class="control-label">Address:</label>
              <input name="address" type="text" class="form-control"
                {($value)}="order.address">
              <p class="help-text">Please enter your address.</p>
            </div>
            <div class="form-group">
              <label class="control-label">Phone:</label>
              <input name="phone" type="text" class="form-control"
                {($value)}="order.phone">
              <p class="help-text">Please enter your phone number.</p>
            </div>
            <div class="submit">
              <h4>Total: ${{order.total}}</h4>
              {{#if saveStatus.isPending}}
                <div class="loading"></div>
              {{else}}
                <button type="submit"
                    {{^if canPlaceOrder}}disabled{{/if}} class="btn">
                  Place My Order!
                </button>
              {{/if}}
            </div>
          </form>
        {{/if}}
      {{/value}}
    {{/if}}
  </restaurant-model>
</div>
```

This is a longer template so lets walk through it:

- `<can-import from="place-my-order/order/details.component!" />` loads the order details component we previously created
- `<restaurant-model get="{ _id=slug }">` loads a restaurant based on the slug value passed to the component
- If the `saveStatus` deferred is resolved we show the `pmo-order-details` component with that order
- Otherwise we will show the order form with the `bit-tabs` panels we implemented in the previous chapter and iterate over each menu item]
- `(submit)="{placeOrder}"` will call `placeOrder` from our view model when the form is submitted
- The interesting part for showing a menu item is the checkbox `<input type="checkbox" (change)="{order.items.toggle this}" {{#if order.items.has}}checked{{/if}}>`
  - `(change)` binds to the checkbox change event and runs `order.items.toggle` which toggles the item from `ItemList`, which we created in the model
  - `order.item.has` sets the checked status to whether or not this item is in the order
- Then we show form elements for name, address, and phone number, which are bound to the order model using [can-value](http://canjs.com/docs/can.view.bindings.can-value.html)
- Finally we disable the button with `{{^if canPlaceOrder}}disabled{{/if}}` which calls `canPlaceOrder` from the view model and returns false if no menu items are selected.

## Set up a real-time connection

can-connect makes it very easy to implement real-time functionality. It is capable of listening to notifications from the server when server data has been created, updated, or removed. This is usually accomplished via [websockets](https://en.wikipedia.org/wiki/WebSocket), which allow sending push notifications to a client.

### Adding real-time events to a model

The `place-my-order-api` module uses the [Feathers](http://feathersjs.com/) NodeJS framework, which in addition to providing a REST API, sends those events in the form of a websocket event like `orders created`. To make the order page update in real-time, all we need to do is add listeners for those events to `src/models/order.js` and in the handler notify the order connection.

```
npm install steal-socket.io --save
```

In `src/models/order.js` add:

```js
import io from 'steal-socket.io';

const socket = io();

socket.on('orders created', order => connection.createInstance(order));
socket.on('orders updated', order => connection.updateInstance(order));
socket.on('orders removed', order => connection.destroyInstance(order));
```

### Update the template

That's all the JavaScript we need to implement real-time functionality. All the rest can be done by creating the `pmo-order-list` component with:

```
donejs add component order/list.component pmo-order-list
```

Changing `src/order/list.component` to:

```html
<can-component tag="pmo-order-list">
  <template>
    <h4>{{listTitle}}</h4>

    {{#if orders.isPending}}
     <div class="loading"></div>
    {{else}}
      {{#each orders.value}}
      <div class="order {{status}}">
        <address>
          {{name}} <br />{{address}} <br />{{phone}}
        </address>

        <div class="items">
          <ul>
            {{#each items}}<li>{{name}}</li>{{/each}}
          </ul>
        </div>

        <div class="total">${{total}}</div>

        <div class="actions">
          <span class="badge">{{statusTitle}}</span>
          {{#if action}}
            <p class="action">
              Mark as:
              <a href="javascript://" ($click)="markAs(action)">
                {{actionTitle}}
              </a>
            </p>
          {{/if}}

          <p class="action">
            <a href="javascript://"  ($click)="destroy()">Delete</a>
          </p>
        </div>
      </div>
      {{else}}
        <div class="order empty">{{emptyMessage}}</div>
      {{/each}}
    {{/if}}
  </template>
</can-component>
```

And in the order history template by updating `src/order/history.component` to:

```html
<can-component tag="pmo-order-history">
  <template>
    <can-import from="place-my-order/models/order" />

    <div class="order-history">
      <div class="order header">
        <address>Name / Address / Phone</address>
        <div class="items">Order</div>
        <div class="total">Total</div>
        <div class="actions">Action</div>
      </div>

      <can-import from="place-my-order/order/list.component!" />
      <order-model getList="{status='new'}">
        <pmo-order-list
          {orders}="."
          list-title="New Orders"
          status="new"
          status-title="New Order!"
          action="preparing"
          action-title="Preparing"
          empty-message="No new orders"/>
      </order-model>

      <order-model getList="{status='preparing'}">
        <pmo-order-list
          {orders}="."
          list-title="Preparing"
          status="preparing"
          status-title="Preparing"
          action="delivery"
          action-title="Out for delivery"
          empty-message="No orders preparing"/>
      </order-model>

      <order-model getList="{status='delivery'}">
        <pmo-order-list
          {orders}="."
          list-title="Out for delivery"
          status="delivery"
          status-title="Out for delivery"
          action="delivered"
          action-title="Delivered"
          empty-message="No orders are being delivered"/>
      </order-model>

      <order-model getList="{status='delivered'}">
        <pmo-order-list
          {orders}="."
          list-title="Delivered"
          status="delivered"
          status-title="Delivered"
          empty-message="No delivered orders"/>
      </order-model>
    </div>
  </template>
</can-component>
```

First we import the order model and then just call `<order-model getList="{status='<status>'}">` for each order status. That's it. If we now open the order page we see some already completed default orders. Keeping the page open and placing a new order from another browser or device will update our order page automatically.

## Create documentation

Documenting our code is very important to quickly get other developers up to speed. [DocumentJS](http://documentjs.com/) makes documenting code easier. It will generate a full documentation page from Markdown files and code comments in our project.

### Configuring DocumentJS

When we initialized the application all the infrastructure necessary to generate the documentation has already been set up. New modlet components will be added automatically. We can generate the documentation with:

```
donejs document
```

### Documenting a module

Let's add the documentation for a module. Let's use `src/order/new/new.js` and update it with some inline comments that describe what our view model properties are supposed to do:

```js
import Component from 'can/component/component';
import Map from 'can/map/';
import 'can/map/define/';
import template from './new.stache!';
import Restaurant from 'place-my-order/models/restaurant';
import Order from 'place-my-order/models/order';

/**
 * @add place-my-order/order/new
 */
export const ViewModel = Map.extend({
  define: {
    /**
     * @property {String} slug
     *
     * The restaurants slug (short name). Will
     * be used to request the actual restaurant.
     */
    slug: {
      type: 'string'
    },
    /**
     * @property {place-my-order/models/order} order
     *
     * The order that is being processed. Will
     * be an empty new order inititally.
     */
    order: {
      Value: Order
    },
    /**
     * @property {can.Deferred} saveStatus
     *
     * A deferred that contains the status of the order when
     * it is being saved.
     */
    saveStatus: {
      Value: Object
    },
    /**
     * @property {Boolean} canPlaceOrder
     *
     * A flag to enable / disable the "Place my order" button.
     */
    canPlaceOrder: {
      get() {
        let items = this.attr('order.items');
        return items.attr('length');
      }
    }
  },

  /**
   * @function placeOrder
   *
   * Save the current order and update the status Deferred.
   *
   * @return {boolean} false to prevent the form submission
   */
  placeOrder() {
    let order = this.attr('order');
    this.attr('saveStatus', order.save());
    return false;
  },

  /**
   * @function startNewOrder
   *
   * Resets the order form, so a new order can be placed.
   *
   * @return {boolean} false to prevent the form submission
   */
  startNewOrder: function() {
    this.attr('order', new Order());
    this.attr('saveStatus', null);
    return false;
  }
});

export default Component.extend({
  tag: 'pmo-order-new',
  viewModel: ViewModel,
  template
});
```

If we now run `donejs document` again, we will see the module show up in the menu bar and will be able to navigate through the different properties.

## Production builds

Now we're ready to create a production build; go ahead and kill your development server, we won't need it from here on.

### Progressive loading

Our `index.stache` contains a can-import tag for each of the pages we have implemented. These can-imports which have nested html will be progressively loaded; the restaurant list page's JavaScript and CSS will only be loaded when the user visits that page.

### Bundling your app

To bundle our application for production we use the build script in `build.js`. We could also use [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/), but in this example we just run it directly with Node. Everything is set up already so we run:

```
donejs build
```

This will build the application to a `dist/` folder in the project's base directory.

From here your application is ready to be used in production. Enable production mode by setting the `NODE_ENV` variable:

```
NODE_ENV=production donejs start
```

Refresh your browser to see the application load in production.

## Desktop and mobile apps

### Building to iOS and Android

To build the application as a Cordova based mobile application, you need to have each platform's SDK installed.
We'll be building an iOS app if you are a Mac user, and an Android app if you're a Windows user.

Mac users should download XCode from the AppStore and install the `ios-sim` package globally with:

```
npm install -g ios-sim
```

We will use these tools to create an iOS application that can be tested in the iOS simulator.

Windows users should install the [Android Studio](https://developer.android.com/sdk/index.html), which gives all of the tools we need.

Now we can install the DoneJS Cordova tools with:

```
donejs add cordova
```

Depending on your operating system you can accept most of the defaults, unless you would like to build for Android, which needs to be selected from the list of platforms.

To run the Cordova build and launch the simulator we can now run:

```
donejs build cordova
```

If everything went well, we should see the emulator running our application.

### Building to NW.js

To set up the desktop build, we have to add it to our application like this:

```
donejs add nw
```

We can answer most prompts with the default except for the version which needs to be set to the latest **stable version**. Set the version prompt to `0.12.3`.

Then we can run the build like this:

```
donejs build nw
```

The OS X application can be opened with

```
cd build/place-my-order/osx64
open place-my-order.app
```

The Windows application can be opened with

```
.\build\donejs-chat\win64\place-my-order.exe
```

## Deploy

Now that we verified that our application works in production, we can deploy it to the web. In this section, we will use [Firebase](https://www.firebase.com/), a service that provides static file hosting and [Content Delivery Network](https://en.wikipedia.org/wiki/Content_delivery_network) (CDN) support, to automatically deploy and serve our application's static assets from a CDN.

### Static hosting on Firebase

Sign up for free at [Firebase](https://www.firebase.com/). After you have an account go to [the account page](https://www.firebase.com/account/) and create an app called `place-my-order-<user>` where `<user>` is your GitHub username. Write down the name of your app because you'll need it in the next section.

> You'll get an error if your app name is too long, so pick something on the shorter side.

When you deploy for the first time it will ask you to authorize, but first we need to configure the project.

#### Configuring DoneJS

Now we can add the Firebase deployment configuration to our `package.json` like this:

```js
"donejs": {
  "deploy": {
    "root": "dist",
    "services": {
      "production": {
        "type": "firebase",
        "config": {
          "firebase": "<appname>",
          "public": "./dist",
          "headers": [{
            "source": "/**",
            "headers": [{
              "key": "Access-Control-Allow-Origin",
              "value": "*"
            }]
          }]
        }
      }
    }
  }
}
```

Change the `<appname>` to the name of the application created when you set up the Firebase app.

And also update the production `baseURL` in the `system` section:

```
...
"system": {
  ...
  "envs": {
    "server-production": {
      "baseURL": "https://<appname>.firebaseapp.com/"
    }
  }
}
```

Again, make sure to replace the URL with your Firebase application name.

#### Run deploy

we can deploy the application by running:

```
donejs build
donejs deploy
```

Static files are deployed to Firebase and verify that the application is loading from the CDN by loading it after running:

```
NODE_ENV=production donejs start
```

> If you're using Windows, set the NODE_ENV variable as you did previously in the Production section.

We should now see our assets being loaded from the Firebase CDN.

### Deploy your Node code

At this point your application has been deployed to a CDN. This contains StealJS, your production bundles and CSS, and any images or other static files. You still need to deploy your server code in order to gain the benefit of server-side rendering.

Download the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command) which will be used to deploy.

After you've installed it, login by running:

```
heroku login
```

Create a new app by running:

```
heroku create
```

This will return the url where your app can be viewed. Before you open it you'll need to update the NODE_ENV variable:

```
heroku config:set NODE_ENV=production
```

Add a new `Procfile` that tells Heroku what to launch as the app's server. Since we are using can-serve our Procfile just looks like this:

```
web: node_modules/.bin/can-serve --proxy http://place-my-order.com/api
```

Since Heroku needs the build artifacts we need to commit those before pushing to Heroku, I always do this in a separate branch:

```
git checkout -b deploy
git add -f dist
git commit -m "Deploying to Heroku"
```

And finally do an initial deploy.

```
git push heroku deploy:master
```

Any time in the future you want to deploy simply push to the heroku remote.

### Continuous Deployment

Previously we set up Travis CI [for automated testing](http://donejs.com/Guide.html#section_Settingcontinuousintegration_TravisCI_) of our application code as we developed, but Travis (and other CI solutions) can also be used to deploy your code to production once tests have passed.

Open your `.travis.yml` file and add a new `deploy` key that looks like this:

```yaml
before_deploy:
  - "git config --global user.email \"me@example.com\""
  - "git config --global user.name \"PMO deploy bot\""
  - "node build"
  - "git add dist/ --force"
  - "git commit -m \"Updating build.\""
  - "node_modules/.bin/donejs-deploy"
deploy:
  skip_cleanup: true
  provider: "heroku"
  app: my-app
```

You can find the name of the app by running `heroku apps:info`.

In order to deploy to Heroku you need to provide Travis with your Heroku API key. Install the [TravisCI cli](https://github.com/travis-ci/travis.rb#readme) which will generated encrypted environment variables that can be set on Travis and then:

```
travis encrypt $(heroku auth:token) --add deploy.api_key
```

To automate the deploy to Firebase you need to provide the Firebase token which can be found in the `Secret` section of your Firebase app. Copy it and use it as the `token` in the following command:

```
travis encrypt FIREBASE_TOKEN=token --add
```

Now any time a build succeeds when pushing to `master` the application will be deployed to Heroku and static assets to Divshot's CDN.
