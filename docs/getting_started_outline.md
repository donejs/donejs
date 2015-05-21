## 1. Install

Define a public folder for client code and a place for your server-side rendering code.

In your server:

> npm install done-server-side-render

In your public folder:

> npm install donejs --save



- ¿ Should we have two donejs, possibly not if it's only going to do server side rendering ?


## 2. Setting up server side rendering

#### Create a template

Create `public/pmo/main.stache`

```
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
    <script src="/node_modules/steal/steal.production.js" main="pmo/main.stache!done-autorender"></script>
    {{else}}
    <script src="/node_modules/steal/steal.js"></script>
    {{/isProduction}}
  </body>
</html>
```

- ¿ DocType ?

#### Create the application view model

```
// pmo/app.js
import AppMap from "can/map/app/";

const AppState = AppMap.extend({
  message: "Hello World!"
});

export default AppState;
```

- ¿ pmo/pmo ?

#### Render the template on the server.

```
var ssr = require("done-server-side-render");
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

#### Start the Server

Run:

>  npm start

Open your browser.

Enjoy!


## 3. Setting up routing

In this part, you will create routes, two pages that are managed by custom elements,
and then be able to navigate between pages.


#### Create Routes

Add to _app.js_.

```
route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });
```

#### Creating a homepage element

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

#### Creating a restaruant list element

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

#### Switch between pages

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

#### Create the header.

```
<li class='{{eq page 'home'}}'>
	<a can-href='{page= "home"}'>Home</a>
</li>
```

#### Create the order history page

As a partial?

#### Switch between all three pages

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

## 4. Getting data from the server and showing it in the page.
## 5. Settup up a real-time connection.