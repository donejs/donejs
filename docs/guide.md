@page Guide
@parent DoneJS
@hide sidebar
@outline 2 ol
@description In this guide you will create [chat.donejs.com](http://chat.donejs.com) a simple real-time chat built with [DoneJS features](Features.html).

After installing DoneJS and generating our first application we will learn how to easily add Bootstrap and a tabs widget to the homepage, create new components and set up basic routing between two pages.

We will learn how to add a model that connects to a RESTful API and also how to make the application real-time. Finally we will build the application into optimized production bundles, deploy the static assets to a CDN and also run the chat as a mobile and desktop application.

@body

## Setup

In this section we will get set up with DoneJS, generate a new application and start it in development mode.

### Install donejs

To get started, let's install the DoneJS command line utility globally:

```
npm install -g donejs
```

Then we can create a new DoneJS application called `donejs-chat`:

```
donejs init donejs-chat
```

The initialization process will ask you questions like the name of your application (set to `donejs-chat`), the source folder etc. which we can all answer with the default settings by hitting enter. This will install all of DoneJS dependencies, among other things the main projects:

- [StealJS](http://stealjs.com) - ES6, CJS, and AMD module loader and builder
- [CanJS](http://canjs.com) - Custom elements and Model-View-ViewModel utilities
- [jQuery](http://jquery.com) - DOM helpers
- [jQuery++](http://jquerypp.com) - Extended DOM helpers
- [QUnit](https://qunitjs.com/) or Mocha - Assertion library
- [FuncUnit](http://funcunit.com) - Functional tests
- [Testee](https://github.com/bitovi/testee) - JavaScript Test runner
- [DocumentJS](http://documentjs.com) - Documentation

If we now go into the `donej-chat` folder with

```
cd donejs-chat
```

We can see the following files:

```
├── .yo-rc.json
├── documentjs.json
├── package.json
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

### Development mode

DoneJS comes with its own server which does both, host your development files and automatically pre-renders the application on the server. Development mode will also start a [live-reload](http://blog.bitovi.com/hot-module-replacement-comes-to-stealjs/) server that automatically reloads files in the browser as they change. You can start both by running:

```
donejs develop
```

The default port is 8080 so if we now go to [http://localhost:8080/](localhost:8080) we can see our application with a default homepage. If we change `src/index.stache` or `src/app.js` all changes will show up right away in the browser. Try it by changing the `message` property in `src/app.js`.

## Importing other projects

DoneJS makes it easy to import other projects that are published on [NPM](https://npmjs.org). In this section we will install and add the [Bootstrap](http://getbootstrap.com/) styles to the page and also import the [bit-tabs](https://github.com/bitovi-components/bit-tabs) widget on the homepage.

### Adding Bootstrap

Bootstrap is [available on NPM](https://www.npmjs.com/package/bootstrap) so we can install and save it as a dependency of our chat like this:

```
npm install bootstrap --save
```

To add it to the application we have to import it by changing `index.stache` to:

```html
<html>
  <head>
    <title>{{title}}</title>
    {{asset "css"}}
  </head>
  <body>
    <can-import from="bootstrap/less/bootstrap.less!" />
    <can-import from="donejs-chat/styles.less!" />
    <can-import from="donejs-chat/app" as="viewModel" />

    {{asset "inline-cache"}}

    {{#switch @env.NODE_ENV}}
      {{#case "production"}}
        <script src="http://donejs-chat.divshot.io/node_modules/steal/steal.production.js"  main="donejs-chat/index.stache!done-autorender"></script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

The only thing we added to the existing `src/index.stache` is the `<can-import from="bootstrap/less/bootstrap.less!" />` line which tells DoneJS to import the main Bootstrap LESS file. The `!` indicates it should be loaded with the LESS processor.

To test it and also see live-reload in action let's add some HTML that uses the Bootstrap styles by changing `src/index.stache` to this:

```html
<html>
  <head>
    <title>{{title}}</title>
    {{asset "css"}}
  </head>
  <body>
    <can-import from="bootstrap/less/bootstrap.less!" />
    <can-import from="donejs-chat/styles.less!" />
    <can-import from="donejs-chat/app" as="viewModel" />

    {{asset "inline-cache"}}

    <div class="container">
      <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
          <h1>Hello world</h1>
        </div>
      </div>
    </div>

    {{#switch @env.NODE_ENV}}
      {{#case "production"}}
        <script src="http://donejs-chat.divshot.io/node_modules/steal/steal.production.js"  main="donejs-chat/index.stache!done-autorender"></script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

### Tabs widget

The next module we want to import is [bit-tabs](https://github.com/bitovi-components/bit-tabs), a simple declarative tabs widget.

```
npm install bit-tabs --save
```

Normally `bit-tabs` automatically loads its own styles. Since we want to use the Bootstrap tabs styles we want will import `bit-tabs/unstyled` the same way as we did with Bootstrap already. Let's also add some markup with those tabs. `src/index.stache` then looks like this:

```html
<html>
  <head>
    <title>{{title}}</title>
    {{asset "css"}}
  </head>
  <body>
    <can-import from="bootstrap/less/bootstrap.less!" />
    <can-import from="donejs-chat/styles.less!" />
    <can-import from="donejs-chat/app" as="viewModel" />
    <can-import from="bit-tabs/unstyled" />

    {{asset "inline-cache"}}

    <div class="container">
      <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
          <h1>Hello world</h1>
          <bit-tabs tabs-class="nav nav-tabs">
            <bit-panel title="CanJS">
              CanJS provides the MV*
            </bit-panel>
            <bit-panel title="StealJS">
              StealJS provides the infrastructure.
            </bit-panel>
          </bit-tabs>
        </div>
      </div>
    </div>

    {{#switch @env.NODE_ENV}}
      {{#case "production"}}
        <script src="http://donejs-chat.divshot.io/node_modules/steal/steal.production.js"  main="donejs-chat/index.stache!done-autorender"></script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

To add a little more whitespace we will also add

```css
bit-panel {
    display: block;
    padding: 10px;
}
```

To `src/styles.less`.

## Custom elements and routing

In this part we will create two custom elements one for the homepage and another to display the chat messages. Then we will create routes to toggle between those two pages.

### Generate custom elements

Now we will create two different custom elements. The homepage (with the HTML tag name `chat-home`) won't be very big so we can put everything into a single file at `src/home.component`. To generate it we can run:

```
donejs generate component home.component chat-home
```

> donejs generate component messages chat-messages

### Navigate between pages

Routing works slightly different than what you might be used to from other libraries. Instead of declaring routes and mapping those to actions, our application will use CanJS's [can.route](http://canjs.com/docs/can.route.html) which allows mapping property names from a URL string to properties in our application state. As a result, our routes will just be a different representation of the application state.

If you want to learn more about CanJS routing visit the CanJS guide on [Application State and Routing](http://canjs.com/2.3-pre/guides/AppStateAndRouting.html).

```html
<can-component tag="chat-home">
  <style type="less">
    display: block;

    h1.page-header { margin-top: 0; }
  </style>
  <template>
    <can-import from="can/view/href/" />
    <h1 class="page-header text-center">
        <img src="http://donejs.com/static/img/donejs-logo-white.svg" alt="DoneJS logo" />
        <br>Chat
    </h1>

    <a can-href="{ page='chat' }" class="btn btn-primary btn-block btn-lg">Start chat</a>
  </template>
</can-component>
```


2. Add link on chat page (`messages/messages.stache`)

```html
<can-import from="can/view/href/" />
<h5><a can-href="{ page='home' }">Home</a></h5>
<p>{{message}}</p>
```

3. Add route in `app.js`

```js
route('/:page', { page: 'home' });
```

4. Load dynamically in `index.stache`


```html
<div class="container">
  <div class="row">
    <div class="col-sm-8 col-sm-offset-2">
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
  </div>
</div>
```

## Messages model

### Generate Message model

> donejs generate supermodel message

Set URL to `http://donejs-chat.herokuapp.com/api/messages`.

### Use Message model

In `src/messages/messages.stache`:

```html
<message-model get-list="{}">
  <h5><a can-href="{ page='home' }">Home</a></h5>
  <div class="list-group">
    {{#each ./value}}
      <a class="list-group-item">
        <h4 class="list-group-item-heading">{{name}}</h4>
        <p class="list-group-item-text">{{message}}</p>
      </a>
    {{/each}}
    {{^if ./value.length}}
    <a class="list-group-item">
      <h4 class="list-group-item-heading">No messages</h4>
    </a>
    {{/if}}
  </div>
</message-model>
```

alternate:

```html
<can-import from="donejs-chat/models/message" />
<h5><a can-href="{ page='home' }">Home</a></h5>
<message-model get-list="{}" class="list-group">
  {{#each ./value}}
    <a class="list-group-item">
      <h4 class="list-group-item-heading">{{name}}</h4>
      <p class="list-group-item-text">{{message}}</p>
    </a>
  {{else}}
    <a class="list-group-item">
      <h4 class="list-group-item-heading">No messages</h4>
    </a>
  {{/each}}
</message-model>
```

### Create messages

1. add html, and (enter) event handler

```html
<div class="row">
  <div class="col-sm-3">
    <input type="text" class="form-control" id="name" placeholder="Your name" can-value="{name}">
  </div>
  <div class="col-sm-9">
    <input type="text" class="form-control" id="message" placeholder="Your message" can-value="{message}" (enter)="{send}">
  </div>
</div>
```

2. import Message model in messages.js

```html
<can-import from="donejs-chat/models/message" />
```

3. Add send method in `src/messages/messages.js`

```js
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './messages.less!';
import template from './messages.stache!';
import Message from '../models/message';

export const ViewModel = Map.extend({
  send() {
    new Message({
      name: this.attr('name'),
      message: this.attr('message')
    }).save().then(msg => this.attr('message', ''));
  }
});

export default Component.extend({
  tag: 'chat-messages',
  viewModel: ViewModel,
  template
});
```

4. Talk about set logic


## Real-time connections

```
> npm install socket.io-client --save
```

Add to `src/models/message.js`

```js
import io from 'socket.io-client';

if(typeof io === 'function') {
  const socket = io('http://donejs-chat.herokuapp.com');

  socket.on('messages created', order => messageConnection.createInstance(order));
  socket.on('messages updated', order => messageConnection.updateInstance(order));
  socket.on('messages removed', order => messageConnection.destroyInstance(order));
}
```

### Add configuration. 

```js
"map": {
  "socket.io-client": "socket.io-client/socket.io"
},
"envs": {
  "server-development": {
    "map": {
      "socket.io-client/socket.io": "@empty"
    }
  },
  "server-production": {
    "baseURL": "https://donejs-chat.divshot.io/",
    "map": {
      "socket.io-client/socket.io": "@empty"
    }
  }
},
"meta": {
  "socket.io-client/socket.io": {
    "format": "global",
    "exports": "io"
  }
}
```

## Production build

### Run build

> node build

### Set to production.

Close the old server and run

> NODE_ENV=production donejs start

### Show bundles loading progressively

## Deploy

0. Create Divshot application, install the CLI tool and log in

```
> npm install -g divshot-cli
```

```
> divshot login
```

1. Paste config in 

```js
"donejs": {
  "deploy": {
    "root": "dist",
    "services": {
      "production": {
        "type": "divshot",
        "config": {
          "name": "donejs-chat",
          "headers": {
            "/**": {
              "Access-Control-Allow-Origin": "*"
            }
          }
        }
      }
    }
  }
}
```

1. Run `node build` again.
2. Run `donejs deploy`
3. Add http://donejs-chat.divshot.io to <script src and to envs.server-production.baseURL
4. Show off 

## Desktop and mobile apps

First create an `app.html` file that looks like:

```html
<html>
<head><title>DoneJS chat</title></head>
<body>
<script load-bundles env="cordova-production" src="node_modules/steal/steal.production.js" main="donejs-chat/index.stache!done-autorender"></script>
</body>
</html>
```

### Cordova

Make sure all platform SDKs like XCode (for iOS) and the Android SDK are installed.

Update `build.js` to:

```js
var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm"
}, {
  bundleAssets: true
});

var cordovaOptions = {
  buildDir: "./build/cordova",
  id: "com.donejs.chat",
  name: "DoneJS chat",
  platforms: ["ios"],
  plugins: ["cordova-plugin-transport-security"],
  index: __dirname + "/app.html",
  glob: [
    "node_modules/steal/steal.production.js"
  ]
};

var stealCordova = require("steal-cordova")(cordovaOptions);

// Check if the cordova option is passed.
var buildCordova = process.argv.indexOf("cordova") > 0;

if(buildCordova) {
  buildPromise.then(stealCordova.build).then(stealCordova.ios.emulate);
}
```

Then run

> npm install ios-sim -g

> node build cordova

### NW.js

Update your `package.json`:

```js
"main": "app.html",
...
"window": {
  "width": 1060,
  "height": 625,
  "toolbar": false
}
```

Add to `build.js`:

```js
var nwOptions = {
  buildDir: "./build",
  platforms: ["osx"],
  files: [
    "package.json",
    "app.html",
    "node_modules/steal/steal.production.js"
  ],
  version: "0.12.3"
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

Add to app.js

```
import platform from "steal-platform"
```

```
if(platform.isCordova || platform.isNW) {
 route.defaultBinding = "hashchange";
}
```

Then run

> node build nw

> cd build/donejs-chat/osx64

> open donejs-chat.app