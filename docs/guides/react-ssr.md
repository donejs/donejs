@page ssr-react SSR - React
@parent Guides
@hide sidebar
@outline 2 ol
@description

In this guide you'll learn on using [done-ssr](https://github.com/donejs/done-ssr) to server render a React application. This guide walks through the technologies that make DoneJS server rendering special:

- Using [Zones](https://github.com/canjs/can-zone) to isolate rendering, allowing multiple requests to be served from the same application.
- Server virtual DOMs which common APIs, allowing you to use the same code that runs on the client, for rendering on the server.
- HTTP/2 support, and PUSH, to PUSH out API requests as they are fulfilled on the server.
- Incremental rendering using HTTP/2 PUSH and the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

@body

## Setting up

This app uses [create-react-app](https://github.com/facebookincubator/create-react-app) to scaffold a React application and for client development. We'll be swapping out the server for our own, to enable server-side rendering.

If you haven't already, install create-react-app:

```
npm install -g create-react-app
```

The, create the application:

```
create-react-app my-react-app
```

This will install the dependencies to a new folder `my-react-app/`. Once done you can cd into the folder and start the development server:

```
cd my-react-app/
npm start
```

This will start a development server and launch the browser. It looks like:

![react app dev server](https://user-images.githubusercontent.com/361671/31185277-92a89bfc-a8f9-11e7-9b02-d2899173ae4b.png)

## Adding a server

In order to use done-ssr for server-side rendering, we need to first set up a server. We'll use [Express](https://expressjs.com/) as our server framework. Install a few dependencies we need:

```shell
npm install express ignore-styles done-ssr@beta --save
```

Create a folder to put our server code:

```shell
mkdir server
```

Create `server/ignore-styles.js`. This file is used to make `.css` and `.svg` imports be ignored in Node.

```js
const path = require('path');
const register = require('ignore-styles').default;

register(undefined, (module, filename) => {
  if(['.svg'].some(ext => filename.endsWith(ext))) {
    module.exports = path.relative(process.cwd(), filename);
  }
});
```

And add the following to `server/index.js`:

```js
require('./ignore-styles');
require('babel-register')({
  ignore: /\/(build|node_modules)\//,
  plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
  presets: ['react-app']
});

const App = require('../src/App').default;
const React = require('react');
const ReactDOM = require('react-dom');
const Zone = require('can-zone');
const express = require('express');
const fs = require('fs');
const app = express();

const requests = require("done-ssr/zones/requests");
const dom = require("done-ssr/zones/can-simple-dom");

function render() {
  document.body.innerHTML = `
    <div id="one"></div>
    <div id="root"></div>
    <script src="path/to/main.js"></script>
  `;

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
}

const PORT = process.env.PORT || 8080;

app.use(express.static('build'));
app.use(express.static('.'));

app.get('*', async (request, response) => {
	var zone = new Zone([
		// Overrides XHR, fetch
		requests(request),

		// Sets up a DOM
		dom(request)
	]);

  const {html} = await zone.run(render);
  response.end(html);
});

require('http').createServer(app).listen(PORT);

console.error(`Server running at http://localhost:${PORT}`);
```

To run it, you need to add a `NODE_ENV` environment variable. For convenience add this to your package.json *scripts*:

```json
"scripts": {
  "server": "NODE_ENV=development node server/index.js"
}
```

And then launch it with:

```
npm run server
```

And navigate to http://localhost:8080.

Let's break down the interesting parts of this server.

### React

This server directly uses the entry point `src/App.js` React component in the Node application. Since React apps are written in such a way that they need bundling -- this application imports CSS, SVG, and uses JavaScript syntax not available in Node today -- we use a couple of dependencies (**ignore-styles** and **babel-register**) to compile them on-the-fly.

It's usually not recommended to do this in a production application. We are doing it here for convenience, since the meat of this guide is about the other parts of SSR, that comes next.

### Routing

We are using [Express](https://expressjs.com/) to provide routing for this application. In addition, it handles server static files:

```js
app.use(express.static('build'));
app.use(express.static('.'));
```

There is only one route defined:

```js
app.get('*', (request, response) => {
  // Stuff here
});
```

This means that the server will first check for a static file in either `build/` or `.`, and if not available, it will go to the wildcard route.

This allows us to handle routing for our app the same way as we would in the browser. We are only handling the `/` route in this application, but there are many choices for routing in React such as React-Route or [page.js](https://github.com/visionmedia/page.js).

### Zones

The rest of this guide will focus on the code contained within the `*` route. This uses [can-zone](https://github.com/canjs/can-zone) to act as a common context when calling into the client-side components (starting with `src/App.js`). You can read more about can-zone [here](https://davidwalsh.name/can-zone).

**done-ssr** provides a set of zone plugins (referred to hereafter as *zones*) that provide various capabilities. Right now we are using only 2 zones:

* **done-ssr/zones/requests**:
  * Provides polyfills for `XMLHttpRequest`, `fetch`, and `WebSocket`.
  * Allows domain-relative URLs like `/api/todos`.
* **done-ssr/zones/can-simple-dom**: Provides our DOM implementation, including `document`, `window`, and `location` objects. Serializes the document (when the zone is complete) as `zone.data.html`.

Later in the guide we'll add a couple of more, for HTTP/2 support.

Breaking down the steps here, first we have:

```js
var zone = new Zone([
  // Overrides XHR, fetch
  requests(request),

  // Sets up a DOM
  dom(request)
]);
```

Creates a new can-zone using the previously mentioned zone plugins.

```js
const {html} = await zone.run(render);
response.end(html);
```

Runs the `render` function within the zone and waits for it to asynchronously complete. Once completed extracts the `html` string and ends the `response` with that as the value.

The **render** function looks like:

```js
function render() {
  document.body.innerHTML = `
    <div id="one"></div>
    <div id="root"></div>
    <script src="path/to/main.js"></script>
  `;

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
}
```

Remember that this **render** function is called every time a request is rendered, and a new `document` is set for each request (by **done-ssr/zones/can-simple-dom**).

> *Note*: an easier way to do this would be to use a static *HTML* file. This is still under development under the can-zone-jsdom project.

## HTTP/2

Using done-ssr makes it very simple to support HTTP/1 applications, but we can do even better using HTTP/2 and [incremental rendering](https://www.bitovi.com/blog/utilizing-http2-push-in-a-single-page-application).
