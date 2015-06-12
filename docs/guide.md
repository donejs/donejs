@page Guide
@parent DoneJS
@hide sidebar
@outline 2 ol
@description Learn how to create the [place-my-order](http://place-my-order.com) 
application with all of [Features DoneJS's features].

@body

## Install

Define a public folder for client code and a place for your server-side rendering code.

In your server:

> npm install done-server-side-render

In your public folder:

> npm install donejs --save

- ¿ Should we have two donejs, possibly not if it's only going to do server side rendering ?


## Setting up server side rendering

### Create a template

Create `public/pmo/main.stache`

```
<html>
  <head>
    <title>Place My Order</title>
    {{asset "css"}}
  </head>
  <body>
    <can-import from="pmo/app" as="@viewModel" />
    <h1>{{message}}</h1>
    {{asset "inline-cache"}}

    {{#isProduction}}
    <script src="/node_modules/steal/steal.production.js" main="pmo/main.stache!done-autorender"></script>
    {{else}}
    <script src="/node_modules/steal/steal.js"></script>
    {{/isProduction}}
  </body>
</html>
```

- ¿ DocType ?

### Create the application view model

```
// pmo/app.js
import AppMap from "can-ssr/app-map";

const AppState = AppMap.extend({
  message: "Hello World!"
});

export default AppState;
```

- ¿ pmo/pmo ?

### Render the template on the server.

```
var ssr = require("can-ssr");
var url = require("url");

var render = ssr({
  config: path.join(__dirname, "..", "/public/package.json!npm"),
  main: "pmo/layout.stache!done-autorender"
});

express.use("/", function(req, res){
    var pathname = url.parse(req.url).pathname;

    render(pathname).then(html => res.send(html))
}));
```

set package.json:

```
"scripts": {
    "start": "node lib/index.js",
```

### Start the Server

Run:

>  npm start

Open your browser.

Enjoy!


## Setting up routing

In this part, you will create routes, two pages that are managed by custom elements,
and then be able to navigate between pages.


### Create Routes

Add to _app.js_.

```
route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });
```

### Creating a homepage element

```html
<can-component tag='pmo-home'>
  <template>
     <div class="homepage">
	  <img src="images/homepage-hero.jpg" width="250" height="380" />
	  <h1>Ordering food has never been easier</h1>
	  <p>We make it easier than ever to order gourmet food from your favorite local restaurants.</p>
	  <p><a class="btn" can-href="{page='restaurants'}" role="button">Choose a Restaurant</a></p>
	</div>
  </template>
</can-component>
```

### Creating a restaruant list element

The compeonent:

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

The template:

```
<a can-href="{page='home'}">Homepage</a>
<h2>Restaurants</h2>
```

### Switch between pages

Update `main.stache`.

```html
{{#eq page "home"}}
  <can-import from="pmo/home/">
    <pmo-home></pmo-home>
  </can-import>
{{/eq}}
{{#eq page "restaurants"}}
  <can-import from="pmo/restaurant/list">
    <pmo-restaurant-list></pmo-restaurant-list>
  </can-import>
{{/eq}}
```

This progressively loads the modules

### Create the header.

```
<li class='{{eq page 'home'}}'>
	<a can-href='{page= "home"}'>Home</a>
</li>
```

### Create the order history page

As a partial?

### Switch between all three pages

Update `main.stache`

```html
<can-import from="pmo/header/" />
<pmo-header page="{page}"></pmo-header>

{{#eq page "home"}}
  <can-import from="pmo/home/">
    <pmo-home></pmo-home>
  </can-import>
{{/eq}}
{{#eq page "restaurants"}}
  <can-import from="pmo/restaurant/list">
    <pmo-restaurant-list></pmo-restaurant-list>
  </can-import>
{{/eq}}
{{#eq page "order-history"}}
  <can-import from="pmo/order/history">
    <pmo-order-history></pmo-order-history>
  </can-import>
{{/eq}}
```

## Getting data from the server and showing it in the page.

### Setting up a basic server.

```
npm install place-my-order-server
./node_modules/.bin/place-my-order-server --port 2200
```

### Proxy to that server

```
./node_modules/.bin/done-server --proxy 2200 --port 3030
```

### Creating a restaurants connection.

```js
import Map from 'can/map/';
import List from 'can/list/';
import connectSuperMap from 'can-connect/super-map';

export var Restaurant = can.Map.extend({});
Restaurant.List = can.List.extend({
  Map: Restaurant
});

export var restaurantConnection = superMap({
  resource: "/api/restaurants",
  idProp: '_id',
  Map: Restaurant,
  List: Restaurant.List,
  name: "restaurants"
});

window.restaurantConnection = restaurantConnection;
```

### Test the connection

```js
restaurantConnection.findAll({})
	.then(function(restaurants){
	  console.log( restaurants.attr() );
	});
```

### Add to the page

```js
export var ViewModel = Map.extend({
  define: {
    restaurants: function(){
      return restaurantConnection.findAll({});
    }
  }
});
```

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

## Setup continous integration (CI) and tests

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

  buildPromise.then(stealCordova.build);

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

### Building to NW.js

## Deploying

