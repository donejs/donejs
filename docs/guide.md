@page Guide
@parent DoneJS
@hide sidebar
@outline 2 ol
@description In this guide you will learn about all of [DoneJS features]() by creating, testing, documenting, building and deploying [place-my-order.com](http://place-my-order.com), a restaurant menu and ordering application. The final result will look like this:


![DoneJS app](img/place-my-order.png)


After the initial application setup (including a server that hosts and pre-renders the application) we will create several custom elements and then bring them together using the application state and routes. Then we will learn how to retrieve data from the server using a RESTful API.

After that we will talk more about what a view-model is and how to identify, implement and test its functionality. Once we have unit tests running in the browser we will automate running them from the command line locally and also on a continuous integration server. In the subsequent chapters we will show how to easily import other existing modules into our application and how to set up a real-time connection.

Finally we will describe how to build and deploy your application for the web and also as a desktop application with nw.js and a mobile app with Cordova.

@body

## Setup the project

In this section we will create our DoneJS project and set up a REST API that the application can use.
You will need [NodeJS](http://www.meetup.com/yyc-js/events/222682935/?a=ra1_te) or [io.js](https://iojs.org/en/index.html) installed and your code editor of choice.

### Create the project

To get set up, create a new folder and in it initialize a [package.json](https://docs.npmjs.com/files/package.json) which will contain information about your project, its dependencies and configuration:

```
mkdir place-my-order
cd place-my-order
npm init
```

[npm init](https://docs.npmjs.com/cli/init) will ask a couple of questions which can all be answered by choosing the default.

Now we can install the DoneJS package and write it as a dependency into `package.json` so that a new copy of the application can be set up in the future by simply typing `npm install`:

```
npm install donejs --save
```

This will also install all of DoneJS's dependencies like:

- [StealJS](http://stealjs.com) - ES6, CJS, and AMD module loader and builder
- [CanJS](http://canjs.com) - Custom elements and Model-View-ViewModel utilities
- [jQuery](http://jquery.com) - DOM helpers
- [jQuery++](http://jquerypp.com) - Extended DOM helpers
- [QUnit](https://qunitjs.com/) or Mocha - Assertion library
- [FuncUnit](http://funcunit.com) - Functional tests
- Testee or Karma - Test runner
- [DocumentJS](http://documentjs.com) - Documentation
- [can-ssr](http://github.com/canjs/ssr) - Server-Side Rendering Utilities for CanJS

The initial folder structure then looks like this:

```
├── package.json
├── node_modules/
|   ├── can/
|   └── ...
```

### Setup a service API

Single page applications usually communicate with a RESTful API and a websocket connection for real-time updates. How to create an API will not part of this guide. Instead we just install and start an existing service API that can be used with our application:

```
npm install place-my-order-api --save
```

To start the API (here on port `7070`) add it as an NPM script to the `package.json`:

```js
"scripts": {
    "api": "place-my-order-api --port 7070",
```

Which allows to start the server with:

```
npm run api
```

At first startup, the server will initialize some default data (restaurants and orders). Once started, you can verify that the data has been created and the service is running by going to [http://localhost:7070/restaurants](http://localhost:7070/restaurants) to see a JSON list of restaurant data. Keep this server running during development.

## Setup server side rendering

In the following paragraphs we will:

- create the basic template
- create the main application file
- start a server which
  - hosts those static files
  - is responsible for pre-rendering the application
  - proxies REST API calls to avoid cross-origin issues

### Create a template and main file

Every DoneJS application consists of at least two files: A main template (`pmo/main.stache`) which contains the main template and links to the development or production assets and a `pmo/app.js` which is the main application file that initializes the application state and routes. Add `pmo/main.stache` to the project with the following content:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Place My Order</title>
    {{asset "css"}}
  </head>
  <body>
    <can-import from="pmo/app" [.]="{value}" />
    <h1>{{message}}</h1>
    {{asset "inline-cache"}}

    {{#isProduction}}
    <script src="/node_modules/steal/steal.production.js"
      main="pmo/main.stache!done-autorender"></script>
    {{else}}
    <script src="/node_modules/steal/steal.js"></script>
    {{/isProduction}}
  </body>
</html>
```

This is an HTML5 template that uses the [Handlebars syntax](http://handlebarsjs.com/) compatible [can.stache](http://canjs.com/docs/can.stache.html) as the view engine and renders a `message` property from the application state. The [asset]() helper provides assets like CSS styles, cached data and links to scripts based on the environment (development or production).

The application main file at `pmo/app.js` looks like this:

```
// pmo/app.js
import AppMap from "can-ssr/app-map";

const AppState = AppMap.extend({
  message: 'Hello World!'
});

export default AppState;
```

This initializes an `AppMap` which contains the application state (with a default `message` property) and is also responsible for caching data when rendering on the server so that it doesn't need to be requested again on the client.

The complete file structure of the application now looks like this:

```
├── node_modules/
├── package.json
├── pmo/
|   ├── app.js
|   └── main.stache
```

### Starting the application

With those two files available we can start the server which hosts and renders the application. We need to proxy the `place-my-order-api` server to `/api` on our server in order to avoid same origin issues. In the `scripts` section of `package.json` add:

```js
"scripts": {
    "start": "can-serve --proxy http://localhost:7070 --port 8080",
```

`main` in `package.json` (by default set to `index.js`) also needs to be changed to:

```js
"main": "pmo/main.stache!done-autorender",
```

Then we can start the application with

> npm start

Go to [http://localhost:8080](http://localhost:8080) to see the hello world message.

## Creating custom elements

One of the most important concepts in DoneJS is splitting up your application functionality into individual self-contained modules. In the following section we will create different components for the homepage, the restaurant list and the order history. After that we will glue them all together using routes and the global application state.

There are two ways of creating components. For smaller components we can define all templates, styles and functionality in a single `.component` file (to learn more see [system-component](https://github.com/stealjs/system-component))). Larger components can be split up into individual files.

### Creating a homepage element

The homepage element in `pmo/home.component` is very simple and just consists of a template:

```html
<can-component tag="pmo-home">
  <template>
     <div class="homepage">
       <img src="images/homepage-hero.jpg" width="250" height="380" />
       <h1>Ordering food has never been easier</h1>
       <p>We make it easier than ever to order gourmet food from your favorite local restaurants.</p>
       <p><a class="btn" href="/restaurants" role="button">Choose a Restaurant</a></p>
     </div>
  </template>
</can-component>
```

Here we created a [can.Component](http://canjs.com/docs/can.Component.html) named `pmo-home` using a [web-component](http://webcomponents.org/) style declaration. The component does not have any separate styles or functionality other than the template.

### Create the order history element

For now, the order history is very similar. In `pmo/order/history.component`:

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

The restaurant list will contain more functionality which is why we can split it into separate files for the template and the component logic. All files are put together into their own folder so that components can be easily re-used and tested individually. In `pmo/restaurant/list/list.js`:

```js
import Component from 'can/component/';
import Map from 'can/map/';
import template from './list.stache!';

export var ViewModel = Map.extend({});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  viewModel: ViewModel,
  template: template
});
```

And add a simple template at `pmo/restaurant/list/list.stache`:

```
<a can-href="{page='home'}">Homepage</a>
<h2>Restaurants</h2>
```

We will add more functionality to this element in a later chapter. Your folder structure should look like this:

```
├── node_modules
├── package.json
├── pmo/
|   ├── app.js
|   └── main.stache
|   ├── order/
|   |   ├── history.component
|   ├── restaurant/
|   |   ├── list/
|   |   |   ├── list.js
|   |   |   ├── list.stache
```

## Setting up routing

In this part, we will create routes and dynamically load and bring the custom elements we created together on the main page.

### Create Routes

Routing works slightly different than what you might be used to from other libraries. Instead of declaring routes and mapping those to actions, our application will use CanJS [can.route](http://canjs.com/docs/can.route.html) which allows to map property names from a URL string to properties in our application state. As a result, our routes will just be a different representation of the application state.

If you want to learn more about CanJS routing visit the CanJS guide on [Application State and Routing](http://canjs.com/2.3-pre/guides/AppStateAndRouting.html).

To add the routes, change `pmo/app.js` to:

```
// pmo/app.js
import AppMap from "can-ssr/app-map";
import route from 'can/route/';

const AppState = AppMap.extend({
  message: 'Hello World!'
});

export default AppState;

route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });

export default AppState;
```

Now we have three routes available:

- `:page` captures urls like [http://localhost:8080/home](http://localhost:8080/home) and sets the `page` property on `AppState` to `home` (which is also the default when visiting [http://localhost:8080/](http://localhost:8080/))
- `:page/:slug` which matches restaurant links like [http://localhost:8080/restaurants/spago](http://localhost:8080/restaurants/spago) which sets `page` and `slug` (a URL friendly restaurant short name)
- `:page/:slug/:action` which will be used to show the order page for a specific restaurant e.g. [http://localhost:8080/restaurants/spago/order](http://localhost:8080/restaurants/spago/order)

### Adding a header element

Now is also a good time to add a header element at `pmo/header.component` that links to the different routes we just defined.

```html
<can-component tag="pmo-header">
  <template>
     <can-import from="can/view/href/"/>
     <header>
       <nav>
         <h1>place-my-order.com</h1>
         <ul>
           <li class="{{#eq page 'home'}}active{{/eq}}">
             <a can-href="{page='home'}">Home</a>
           </li>
           <li class="{{#eq page 'restaurants'}}active{{/eq}}">
             <a can-href="{page='restaurants'}">Restaurants</a>
           </li>
           <li class="{{#eq page 'order-history'}}active{{/eq}}">
             <a can-href="{page='order-history'}">Order History</a>
           </li>
         </ul>
       </nav>
     </header>
  </template>
</can-component>
```

Here we use the `eq` helper to make the appropriate link active and then use [can-href]() to create links based on the the application state (e.g. by setting the `page` property to `home`) which will then create the proper links based on the route ([http://localhost:8080/home](http://localhost:8080/home) in this case).

### Switch between components

Now we can glue all those individual components together in `pmo/main.stache`. What we want to do is - based on the current page (`home`, `restaurants` or `order-history`) - load the correct components and then initialize it with the information from the application state it needs. Update `pmo/main.stache` to:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Place My Order</title>
    {{asset "css"}}
  </head>
  <body>
    <can-import from="pmo/app" [.]="{value}" />

    <can-import from="pmo/header.component!" />
    <pmo-header page="{page}"></pmo-header>

    {{#eq page "home"}}
      <can-import from="pmo/home.component!">
        <pmo-home></pmo-home>
      </can-import>
    {{/eq}}
    {{#eq page "restaurants"}}
      <can-import from="pmo/restaurant/list">
        <pmo-restaurant-list></pmo-restaurant-list>
      </can-import>
    {{/eq}}
    {{#eq page "order-history"}}
      <can-import from="pmo/order/history.component">
        <pmo-order-history></pmo-order-history>
      </can-import>
    {{/eq}}

    {{asset "inline-cache"}}

    {{#isProduction}}
    <script src="/node_modules/steal/steal.production.js"
      main="pmo/main.stache!done-autorender"></script>
    {{else}}
    <script src="/node_modules/steal/steal.js"></script>
    {{/isProduction}}
  </body>
</html>
```

Here we use the `eq` helper to check for the page, then progressively load the component with [can-import]() and initialize it. If you now reload [http://localhost:8080/](http://localhost:8080/) you should see the header and the home component and be able to navigate.

## Getting data from the server and showing it in the page.

[can-connect]() is a powerful data layer that allows our application to connect to the RESTful API that we set up with `place-my-order-api`.

### Creating a restaurants connection.

At the beginning of this guide we set up a REST API at [http://localhost:7070](http://localhost:7070) and told `can-serve` to proxy it to [http://localhost:8080/api](http://localhost:8080/api). To get the restaurant data from [http://localhost:8080/api/restaurants](http://localhost:8080/api/restaurants) we need to do two things:

1. Create a Restaurants [can.Map](http://canjs.com/docs/can.Map.html) and [can.List](http://canjs.com/docs/can.List.html)
2. Create a connection to `/api/restaurants`

We will put the connection in `pmo/models/restaurant.js`:

```js
import Map from 'can/map/';
import List from 'can/list/';
import superMap from 'can-connect/super-map';

export const Restaurant = can.Map.extend({});

export const restaurantConnection = superMap({
  resource: '/api/restaurants',
  idProp: '_id',
  Map: Restaurant,
  List: Restaurant.List,
  name: 'restaurants'
});
```

The connection is a can-connect [superMap]() and besides setting the `Map` and `List` type the connection should return we also define:

- `resource` - The URL of the REST endpoint
- `idProp` - The property name of the data unique identifier
- `name` - A short name used as an identifier when caching data

### Test the connection

To test the connection you can temporarily add the following to `pmo/app.js`:

```js
import { restaurantConnection } from './models/restaurant';

restaurantConnection.findAll({})
	.then(function(restaurants){
	  console.log(restaurants.attr());
	});
```

After reloading the homepage you should see the restaurant information logged in the console.

### Add to the page

Now that we know we get data from the server we can update the `ViewModel` in `pmo/restaurant/list.js` to use [can.Map.define](http://canjs.com/docs/can.Map.prototype.define.html) to load all restaurants from the restaurant connection:

```js
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import template from './list.stache!';

export var ViewModel = Map.extend({
  define: {
    restaurants: {
      value: function(){
        return restaurantConnection.findAll({});
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

And update the template at `pmo/restaurant/list.stache` to use the [Promise](http://canjs.com/docs/can.Deferred.html) returned for the `restaurants` property to render the template:

```html
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

      <a class="btn" can-href="{ page='restaurants' slug=slug }">Details</a>
      <br />
    </div>
  {{/each}}
{{/if}}
```

By checking for `restaurants.isPending` and `restaurants.isResolved` we are able to show a loading indicator while the data are being retrieved. Once resolved, the actual restaurant list is available at `restaurants.value`.

The current folder structure and files look like this:

```
├── node_modules
├── package.json
├── pmo/
|   ├── app.js
|   └── main.stache
|   ├── models/
|   |   ├── restaurant.js
|   ├── order/
|   |   ├── history.component
|   ├── restaurant/
|   |   ├── list/
|   |   |   ├── list.js
|   |   |   ├── list.stache
```

## Creating a unit-tested view model

Lets make the restaurants page let a user select a state and city and
finally see a list of restaurants for that state and city.

### Identify view model state

```js
{
 states: Promise<[State]>
 state: String "IL”,
 cities: Promise<[City]>,
 city: String "Chicago”,
 restaurants: Promise<[Restaurant]>
}
```

### Test the view model

#### Setup the test


```js
import {ViewModel as RestaurantListVM} from "./list";
import QUnit from 'steal-qunit';
import fixture from 'can/util/fixture/';

QUnit.module("pmo/restaurant/list");

QUnit.asyncTest("basics", function(){



});
```

#### Create fake data

```js
QUnit.asyncTest("basics", function(){

	var states = [{ name: "Calisota", short: "CA" }, 
                 { name: "New Troy", short: "NT"}];
	var caCities = [{state: "CA",name: "Casadina"}];
	var ntCities = [{state: "NT", name: "Alberny"}];
	var casadinaRestaurants = [{
     "_id":"1","name":
     "Cheese City","slug":"cheese-city”
    }];


});

```

#### Use fake data for Ajax requests

```js
QUnit.asyncTest("basics", function(){
	…
	var casadinaRestaurants = [{ … }];

    fixture({
	  "/api/states": ()=> ({data: states}),
	  "/api/cities": function(request){
		return request.data.state === "CA" ? caCities : ntCities;	  
      },
	  "/api/restaurants": ()=> ({data: casadinaRestaurants})
	})	


});
```

#### Create a view model instance and test its behavior

```
QUnit.asyncTest("basics", function(){
	…
	var casadinaRestaurants = [{ … }];
	fixture({…})	

    var rlVM = new RestaurantListVM();
	
	rlVM.attr("states").then(function(vmStates){
		QUnit.deepEqual(vmStates.attr(), states, "Got states");
		rlVM.attr("state","CA");
	});

   rlVM.one("cities", function( ev, citiesPromise ) {
		citiesPromise.then(function( vmCities ) {
			deepEqual(vmCities.attr(), caCities, "Got ca cities");
			rlVM.attr("city", "Casadina");
		});
	});
	
	rlVM.one("restaurants", function(ev, restaurantsPromise){
		restaurantsPromise.then(function(vmRestaurants){
			deepEqual(vmRestaurants.attr(), casadinaRestaurants);

			rlVM.attr("state","NT");			
			ok( !rlVM.attr("city"), "city selection removed" );
			rlVM.attr("cities").then(function(vmCities){
				deepEqual(vmCities.attr(), ntCities);
				start();
			});
		});
	});

});
```

### Write the view model

#### Make dependent models

State:

```
import Map from 'can/map/';
import List from 'can/list/';
import superMap from 'can-connect/super-map';

const State = Map.extend({});

State.List = List.extend({});

superMap({
  resource: '/api/states',
  idProp: 'short',
  Map: State,
  List: State.List,
  name: 'states'
});

export default State;
```

City:

```
import Map from 'can/map/';
import List from 'can/list/';
import superMap from 'can-connect/super-map';

const City = Map.extend({});

City.List = List.extend({});

superMap({
  resource: '/api/cities',
  idProp: 'name',
  Map: City,
  List: City.List,
  name: 'cities'
});

export default City;
```

#### Define stateful property behaviors

```js
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';

import City from 'pmo/models/city';
import State from 'pmo/models/state';
import Restaurant from 'pmo/models/restaurant';
import template from './list.stache!';

export const ViewModel = Map.extend({
  define: {
    states: {
      get() {
        return State.findAll({});
      }
    },
    state: {
      value: null,
      set() {
        // Remove the city when the state changes
        this.attr('city', null);
      }
    },
    cities: {
      get() {
        var state = this.attr('state');
        return state ? City.findAll({ state }) : null;
      }
    },
    city: {
      value: null
    },
    restaurants: {
      get: function(){
        var params = {},
          state = this.attr('state'),
          city = this.attr('city');

        return state && city ?
          Restaurant.findAll({
            'address.state': state,
            'address.city': city
          }) : null;
      }
    }
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  viewModel: ViewModel,
  template
});
```

#### Verify the test

Open some page.

### Create a demo page

- ¿ What fixtures should be used ?

```html
<script type='text/stache' can-autorender>
  <can-import from="pmo/restaurant/list/" />
  <can-import from="pmo/models/fixtures/" />
  <pmo-order slug="spago"></pmo-order>
</script>
<script src="../../node_modules/steal/steal.js"
        main="can/view/autorender/"></script>
```

### Write the template

- ¿ Are all the class names necessary ?
- ¿ Should we show creating a helper for a `<select>` ?

```
<h2 class="page-header">Restaurants</h2>
  <form class="form">
  <div class="form-group">
    <label>State</label>
    <select class="form-control" can-value="{state}" {{#if states.isPending}}disabled{{/if}}>
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
    <select class="form-control" can-value="city" {{^if state}}disabled{{/if}}>
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

    <a class="btn" can-href="{ page='restaurants' slug=slug }">Place My Order</a>
    <br />
  </div>
  {{/each}}
{{/if}}
```

### Verify the demo page and application works.

Open up the demo page.

Open up the app.

## Setup automated tests and continuous integration (CI)

## Nested routes

## Importing other projects

## Creating data

## Setup a real-time connection

## Production builds

### Bundling your app

To bundle your application create a build script. You could use [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/), but in this example let's simply create a `build.js` file:

#### build.js

```js
var stealTools = require("steal-tools");

stealTools.build({
  config: __dirname + "/package.json!npm"
});
```

Then run the script:

```
node build
```

This will build the application to a `dist/` folder in the project's base directory.

From here your application is ready to be used in production. You can enable production by setting the `NODE_ENV` variable:

```
export NODE_ENV=production
```

Restart your server to see the application load in production.

### Building to iOS and Android

Using [steal-cordova](https://www.npmjs.com/package/steal-cordova) you can easily turn your web application into a [Cordova](https://cordova.apache.org/) app that runs in iOS and Android.

First install steal-cordova as a devDependency in your project:

```shell
npm install steal-cordova --save-dev
```

Then update your build.js to make Cordova builds when you provide the **cordova** argument:

```js
var stealTools = require("steal-tools");

stealTools.build({
  config: __dirname + "/package.json!npm"
});
```

becomes:

```js
var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm"
});

var cordovaOptions = {
  buildDir: "./build/cordova",
  id: "com.hello.world",
  name: "HelloWorld",
  platforms: ["ios", "android"],
  index: __dirname + "/cordova.html"
};

var stealCordova = require("steal-cordova")(cordovaOptions);

// Check if the cordova option is passed.
var buildCordova = process.argv.indexOf("cordova") > 0;

if(buildCordova) {

  buildPromise = buildPromise.then(stealCordova.build);

}
```

This allows you to build a Cordova app with:

```shell
node build cordova
```

You can also use steal-cordova to launch an emulator after the build is complete, change:

```js
buildPromise.then(stealCordova.build);
```

to:

```js
buildPromise.then(stealCordova.build).then(stealCordova.ios.emulate);
```

Which will launch the iOS emulator.

#### AJAX

When not running in a traditional browser environment you'll need to make your AJAX requests
to an external URL. The module `steal-platform` aids in detecting environments like Cordova
so you can include special behavior.  Install the module:

```
npm install steal-platform --save
```

Create a file: `pmo/models/base-url.js` and place this code:

```js
import platform from "steal-platform";

let baseUrl = '';

if(platform.isCordova || platform.isNW) {
  baseUrl = 'http://place-my-order.com';
}

export default baseUrl;
```

This detects if the environment running your app is either Cordova or NW.js and if so sets the baseUrl to place-my-order.com so that all AJAX requests will be make there.

You'll also need to update your models to use the baseUrl in your superMaps. For example in pmo/models/state do:

```js
import baseUrl from './base-url';

superMap({
  resource: baseUrl + '/api/states',
  ...
});
```

### Building to NW.js

[steal-nw](https://github.com/stealjs/steal-nw) is a module that makes it easy to create [NW.js](http://nwjs.io/) applications.

Instead steal-nw as a devDependency:

```shell
npm install steal-nw --save-dev
```

Update your build.js [created above](#section_Bundlingyourapp) to include building a NW.js package:

```js
var nwOptions = {
  buildDir: "./build",
  platforms: ["osx"],
  files: [
    "package.json",
    "nw.html",

    "node_modules/steal/steal.production.js",
    "images/**/*"
  ]
};

var stealNw = require("steal-nw");

// Check if the cordova option is passed.
var buildNW = process.argv.indexOf("nw") > 0;

if(buildNW) {
  buildPromise = buildPromise.then(function(buildResult){
    stealNw(nwOptions, buildResult);
  });
}
```

You'll also need to create a nw.html (this is the entry point for your NW.js app):

```html
<html>
  <head><title>Place My Order</title></head>
  <body>
    <script src="node_modules/steal/steal.production.js" main="pmo/layout.stache!done-autorender"></script>
  </body>
</html>
```

And finally update your package.json. There are two things you'll want to change:

1. Your "main" must be "nw.html".

2. You can set "window" options to match the application layout. Let's update the size of the window:

```json
"window": {
  "width": 1060,
  "height": 625
}
```

Next, if using pushstate routing, you'll need to update your routes to use hash-based routing because NW.js runs within the file protocol. If you haven't already install `steal-platform`. Then in your pmo/app module add the following condition:

```js
import platform from 'steal-platform';

if(platform.isCordova || platform.isNW) {
  route.defaultBinding = "hashchange";
}
```

This will set can.route to use hash urls which is needed in both Cordova and NW.js environments.

Now you can build your NW.js with `node build nw`. Once the build is complete the binaries for each platform are available at `build/place-my-order/`.


## Deploying

