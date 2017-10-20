@page ssr-react SSR - React
@parent Guides
@hide sidebar
@outline 2 ol
@description

In this guide you'll learn about using [done-ssr](https://github.com/donejs/done-ssr) to server render a React application. This guide walks through the technologies that make DoneJS server rendering special:

- Using [Zones](https://github.com/canjs/can-zone) to isolate rendering, allowing multiple requests to be served from the same application
- Server-side virtual DOM with common APIs, allowing you to use the same code that runs on the client, for rendering on the server
- HTTP/2 support, and H/2 PUSH, to PUSH out API requests as they are fulfilled on the server
- Incremental rendering using HTTP/2 PUSH and the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

@body

## Setting up

This app uses [create-react-app](https://github.com/facebookincubator/create-react-app) to scaffold a React application and for client development. We'll be swapping out the server for our own, to enable server-side rendering.

If you haven't already, install create-react-app:

> **_note: if you are a `yarn` user, replace all the following npm commands with the appropriate yarn command_**  
> _if you are having any trouble with packages not appearing to have been installed, sometimes deleteing your `node_modules` directory and running `npm install` can sort things out, this generally only happens if you have yarn installed globally, but are using npm_

```
npm install -g create-react-app
```

Then, create the application:

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
npm install express ignore-styles can-zone-jsdom done-ssr@beta --save
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

const Zone = require('can-zone');
const express = require('express');
const app = express();

const dom = require('can-zone-jsdom');
const requests = require('done-ssr/zones/requests');

const PORT = process.env.PORT || 8080;

app.use(express.static('build', { index: false }));
app.use(express.static('.'));

app.get('*', async (request, response) => {
  var zone = new Zone([
    // Overrides XHR, fetch
    requests(request),

    // Sets up a DOM
    dom(request, {
      root: __dirname + '/../build',
      html: 'index.html'
    })
  ]);

  const { html } = await zone.run();
  response.end(html);
});

require('http')
  .createServer(app)
  .listen(PORT);

console.error(`Server running at http://localhost:${PORT}`);
```

To run it, you need to add a `NODE_ENV` environment variable. For convenience add this to your package.json *scripts*:

```json
"scripts": {
  "server": "NODE_ENV=development node server/index.js"
}
```

Then run the build step for your React app:

```
npm run build
```

And then launch it with:

```
npm run server
```

And navigate to http://localhost:8080.

Let's break down the interesting parts of this server.

### React

This server directly uses the entry point `build/index.html` in the Node application. Since React apps are written in such a way that they need bundling -- this application imports CSS, SVG, and uses JavaScript syntax not available in Node today -- we use a couple of dependencies (**ignore-styles** and **babel-register**) to compile them on-the-fly.

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
* **can-zone-jsdom**: Provides a DOM implementation, including `document`, `window`, and `location` objects. Serializes the document (when the zone is complete) as `zone.data.html`.

Later in the guide we'll add a couple of more, for HTTP/2 support.

Breaking down the steps here, first we have:

```js
var zone = new Zone([
  // Overrides XHR, fetch
  requests(request),

  // Sets up a DOM
  dom(request, {
    root: __dirname + '/../build',
    html: 'index.html'
  })
]);
```

This creates a new can-zone using the previously mentioned zone plugins.

```js
const { html } = await zone.run();
response.end(html);
```

Runs the contents of `index.html` within the zone and waits for it to asynchronously complete. Once completed extracts the `html` string and ends the `response` with that as the value.

Remember that the **index.html** is run every time a request is rendered, and a new `document` is set for each request (by **can-zone-jsdom**).

## HTTP/2

Using done-ssr makes it very simple to support HTTP/1 applications, but we can do even better using HTTP/2 and [incremental rendering](https://www.bitovi.com/blog/utilizing-http2-push-in-a-single-page-application).

Using the **done-ssr/zones/push-mutations** zone, we can add incremental rendering to this application.

### Setup

First, we need to install an HTTP/2 server. While HTTP/2 support is in Node 8.6.0 behind a flag, I've found it to be too buggy to use today. So use *donejs-spdy* instead:

```
npm install donejs-spdy --save
```

At this point you'll need to create a private key and certificate, as HTTP/2 requires SSL. If using a Unix operating system, you can use *openssl* for this:

```
openssl req  -nodes -new -x509  -keyout server.key -out server.cert
```

This will create *server.key* and *server.cert* files. I like to copy those to another folder so that they can be reused in other applications.

```shell
mkdir -p ~/.localhost-ssl
mv server.key server.cert ~/.localhost-ssl
```

Lastly, update your *package.json* so these files are available to use:

```js
"scripts": {
  "server": "NODE_ENV=development KEY=~/.localhost-ssl/server.key CERT=~/.localhost-ssl/server.cert node server/index.js"
}
```

### Update server

Now that you have SSL and an HTTP/2 server installed, update your `server/index.js` script to:

```js
require('./ignore-styles');
require('babel-register')({
  ignore: /\/(build|node_modules)\//,
  plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
  presets: ['react-app']
});

const Zone = require('can-zone');
const express = require('express');
const fs = require('fs');
const app = express();

const dom = require('can-zone-jsdom');
const requests = require('done-ssr/zones/requests');
const pushFetch = require('done-ssr/zones/push-fetch');
const pushMutations = require('done-ssr/zones/push-mutations');

const PORT = process.env.PORT || 8080;

app.use(express.static('build', { index: false }));
app.use(express.static('.'));

app.get('*', async (request, response) => {
  var zone = new Zone([
    // Overrides XHR, fetch
    requests(request),

    // Sets up a DOM
    dom(request, {
      root: __dirname + '/../build',
      html: 'index.html'
    }),

    // H2 push
    pushFetch(response),
    pushMutations(response)
  ]);

  const zonePromise = zone.run();

  response.write(zone.data.html);

  await zonePromise;
  response.end();
});

require('donejs-spdy')
  .createServer(
    {
      key: fs.readFileSync(process.env.KEY),
      cert: fs.readFileSync(process.env.CERT),
      spdy: {
        protocols: ['h2', 'http/1.1']
      }
    },
    app
  )
  .listen(PORT);

console.error(`Server running at https://localhost:${PORT}`);
```
@highlight 10,15-16,34-36,39-44,47-57,61,only

This adds two new zones to our arsenal:

* **done-ssr/zones/push-fetch**: Traps calls to the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and uses H2 PUSH to start pushing them to the browser. This way when the browser JavaScript tries to fetch this resource it's already available in the browser cache.
* **done-ssr/zones/push-mutations**: This is the zone that handles incremental rendering. It does a few things interesting:

  1. Listens to mutations in the document and serializes a *patch* that can be applied in the browser document.
  1. Adds a script to the `<head>` that will attach to a special URL where the mutations are being streamed. When this script runs in the browser it will fetch that URL and start applying the mutation patches as they come in.

If you start your server again with `npm run server`, you should be able to see the application running.

## Adding an API

Even though we have incremental server-side rendering set up, since we're not doing any `fetch` requests, there are no mutations to be applied. So let's add an API route and have our client code make a request.

### List component

To make this even better, we'll use `ReadableStream`, the advanced feature of `fetch` that allows you to stream in the request in chunks. When streaming in API requests, it's good to use the [ndjson](http://ndjson.org/) format.

ndjson is just JSON that is separated by newline characters. It looks like this:

```
{"item": "One"}
{"item": "Two"}
```

We'll use [can-ndjson-stream](https://github.com/canjs/can-ndjson-stream) to make it easier to work with this format. So install that first:

```js
npm install can-ndjson-stream --save
```

We'll use this in our client code. Create `src/List.js`:

```js
import React, { Component } from 'react';
import ndjsonStream from 'can-ndjson-stream';

export default class extends Component {
  constructor() {
    super();
    this.state = { items: [] };

    fetch('/api/items').then(resp => {
      return ndjsonStream(resp.body);
    }).then(stream => {
      let reader = stream.getReader();

      let read = result => {
        if (result.done) return;
        this.setState({
          items: this.state.items.concat(result.value)
        });
        return reader.read().then(read);
      }

      return reader.read().then(read);
    });
  }

  render() {
    let { items } = this.state;

    return (
      <section>
        <h2>List of stuff</h2>
        <ul>
          {items.map(item => (
            <li key={item.item}>
              {item.item}
            </li>
          ))}
        </ul>
      </section>

    );
  }
}
```

And then use it within `src/App.js`:


```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import List from './List.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <List />
      </div>
    );
  }
}

export default App;
```
@highlight 4,14

What is happening in *src/List.js*:

1. A component is created with an `items` Array in the state.
2. A *fetch* request is made to `/api/items`.
3. `can-ndjson-stream` is called with the response body.
4. Each item comes through the stream as a JavaScript object and appended to `this.state.items`.
5. `render()` is recalled and a new `<li>` is created for each item.

### API route

Now that we have the client code we need to set up the route to handle it. Create `server/api.js` with the following:

```js
const Readable = require('stream').Readable;

module.exports = function(app){
  app.get('/api/items', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })

    var chunks = [
      {item:'One'},
      {item:'Two'},
      {item:'Three'},
      {item:'Four'},
      {item:'Five'},
      {item:'Six'},
      {item:'Seven'},
      {item:'Eight'},
      {item:'Nine'},
      {item:'Ten'}
    ];

    var r = new Readable({
      read() {
        setTimeout(() => {
          var item = chunks.shift();
          if(item) {
            this.push(JSON.stringify(item) + "\n");
          } else {
            this.push(null);
          }
        }, 500);
      }
    });

    r.pipe(response);
  });
};
```

This route is very simple, it returns an ndjson stream that emits a row every *500* milliseconds. Since there are 10 rows it takes 5 seconds for this to complete. This is just enough time to see incremental rendering in action.

To use it, update `server/index.js`:

```js
require('./ignore-styles');
require('babel-register')({
  ignore: /\/(build|node_modules)\//,
  plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
  presets: ['react-app']
});

const Zone = require('can-zone');
const express = require('express');
const fs = require('fs');
const app = express();

const dom = require('can-zone-jsdom');
const requests = require('done-ssr/zones/requests');
const pushFetch = require('done-ssr/zones/push-fetch');
const pushMutations = require('done-ssr/zones/push-mutations');

const PORT = process.env.PORT || 8080;

app.use(express.static('build', { index: false }));
app.use(express.static('.'));
require('./api')(app);

app.get('*', async (request, response) => {
  var zone = new Zone([
    // Overrides XHR, fetch
    requests(request),

    // Sets up a DOM
    dom(request, {
      root: __dirname + '/../build',
      html: 'index.html'
    }),

    // H2 push
    pushFetch(response),
    pushMutations(response)
  ]);

  const zonePromise = zone.run();

  response.write(zone.data.html);

  await zonePromise;
  response.end();
});

require('donejs-spdy')
  .createServer(
    {
      key: fs.readFileSync(process.env.KEY),
      cert: fs.readFileSync(process.env.CERT),
      spdy: {
        protocols: ['h2', 'http/1.1']
      }
    },
    app
  )
  .listen(PORT);

console.error(`Server running at https://localhost:${PORT}`);
```
@highlight 22,only

And then run the build:

```js
npm run build
```

Now, if you restart your server you should see the list incrementally updating.

![rendering gif](https://user-images.githubusercontent.com/361671/31230099-f3ada73c-a9b0-11e7-85f6-2ac9a4cf0a9f.gif)

## Conclusion

In this guide we've discussed:

* Using [can-zone](https://github.com/canjs/can-zone) to provide context to rendering a React application.
* Setting up an HTTP/2 server.
* Enabling incremental rendering, so that the application can be updated as changes occur on the server.

To see this guide as a fully working example, check out the [done-ssr-react-example](https://github.com/donejs/done-ssr-react-example) repository.
