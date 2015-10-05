@page Guide
@parent DoneJS
@hide sidebar
@outline 2 ol
@description In this guide you will create [chat.donejs.com](http://chat.donejs.com), a simple real-time chat built with [DoneJS features](Features.html).

![DoneJS chat](static/img/donejs-chat.png)

After installing DoneJS and generating the application we will learn how to add Bootstrap and a tabs widget to the homepage, create custom elements and set up basic routing between two pages.

We will learn how to add a model that connects to a RESTful API and also how to make the application real-time. Finally we will build the application into optimized production bundles, deploy the static assets to a CDN and also run it as a mobile and desktop application.


@body

## Setup

In this section we will install DoneJS, generate a new application and start a development server.

### Install donejs

To get started, let's install the DoneJS command line utility globally:

```
npm install -g donejs
```

Then we create a new DoneJS application called `donejs-chat`:

```
donejs init donejs-chat
```

The initialization process will ask questions like the name of your application the source folder etc. which we can answer with the default settings by hitting enter. This will install all of DoneJS dependencies, including the following:

- [StealJS](http://stealjs.com) - ES6, CJS, and AMD module loader and builder
- [CanJS](http://canjs.com) - Custom elements and Model-View-ViewModel utilities
- [jQuery](http://jquery.com) - DOM helpers
- [jQuery++](http://jquerypp.com) - Extended DOM helpers
- [QUnit](https://qunitjs.com/) or Mocha - Assertion library
- [FuncUnit](http://funcunit.com) - Functional tests
- [Testee](https://github.com/bitovi/testee) - JavaScript Test runner
- [DocumentJS](http://documentjs.com) - Documentation

### Development mode

DoneJS comes with its own development server which hosts your development files and automatically [renders](ssr-feature) the application on the server. Development mode will also start a [live-reload](feature/) server that automatically reloads files in the browser as they change. First, let's go into the `donejs-chat` application directory:

```
cd donejs-chat
```

Then we can start the development and live-reload server by running:

```
donejs develop
```

The default port is 8080 so if we now go to [http://localhost:8080/](localhost:8080) we can see our application with a default homepage. If we change `src/index.stache` or `src/app.js` all changes will show up right away in the browser. This server needs to stay open at all times so we recommend opening a new terminal window for the other commands.

## Importing other projects

DoneJS makes it easy to import other projects that are published on [NPM](https://npmjs.org). In this section we will install and add the [Bootstrap](http://getbootstrap.com/) styles to the page and also use the [bit-tabs](https://github.com/bitovi-components/bit-tabs) widget on the homepage.

### Adding Bootstrap

Since Bootstrap is [available on NPM](https://www.npmjs.com/package/bootstrap) we can install and save it as a dependency of our application like this:

```
npm install bootstrap --save
```

Let's update `src/index.stache` with `<can-import from="bootstrap/less/bootstrap.less!" />` which tells DoneJS to import the main Bootstrap LESS file and also add some HTML that uses the Bootstrap styles:

```html
<html>
  <head>
    <title>{{title}}</title>
    {{asset "css"}}
    {{asset "html5shiv"}}
  </head>
  <body>
    <can-import from="bootstrap/less/bootstrap.less!" />
    <can-import from="donejs-chat/styles.less!" />
    <can-import from="donejs-chat/app" as="viewModel" />

    <div class="container">
      <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
          <h1 class="page-header text-center">
            <img src="http://donejs.com/static/img/donejs-logo-white.svg" alt="DoneJS logo" style="width: 100%;" />
            <br>Chat
          </h1>
        </div>
      </div>
    </div>

    {{asset "inline-cache"}}

    {{#switch env.NODE_ENV}}
      {{#case "production"}}
        <script src="/node_modules/steal/steal.production.js"  main="donejs-chat/index.stache!done-autorender"></script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

If you have the page still open in the browser you should already see the updated styles and content.

### Tabs widget

The next module we want to import is [bit-tabs](https://github.com/bitovi-components/bit-tabs), a simple declarative tabs widget.

```
npm install bit-tabs --save
```

We will import the tabs custom elements without the styles from `bit-tabs/unstyled` the same way as we did with Bootstrap already. Let's also add some markup using those tabs. `src/index.stache` then looks like this:

```html
<html>
  <head>
    <title>{{title}}</title>
    {{asset "css"}}
    {{asset "html5shiv"}}
  </head>
  <body>
    <can-import from="bootstrap/less/bootstrap.less!" />
    <can-import from="donejs-chat/styles.less!" />
    <can-import from="donejs-chat/app" as="viewModel" />
    <can-import from="bit-tabs/unstyled" />

    <div class="container">
      <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
          <h1 class="page-header text-center">
            <img src="http://donejs.com/static/img/donejs-logo-white.svg" alt="DoneJS logo" style="width: 100%;" />
            <br>Chat
          </h1>

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

    {{asset "inline-cache"}}

    {{#switch env.NODE_ENV}}
      {{#case "production"}}
        <script src="/node_modules/steal/steal.production.js"  main="donejs-chat/index.stache!done-autorender"></script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

To add a little more whitespace we can update `src/styles.less` with:

```css
bit-panel {
  display: block;
  padding: 10px;

  &:empty {
    display: none;
  }
}
```

## Custom elements and routing

In this part we will create our own custom elements similar to the `bit-tabs` we just used. One for the homepage and another to display the chat messages. Then we will create routes to toggle between those two pages.

### Generate custom elements

The homepage custom element (with the HTML tag name `chat-home`) won't be very big so we can put everything into a single file. To generate it we can run:

```
donejs generate component home.component chat-home
```

We can now copy most of the content from the homepage into this component so that `src/home.component` looks like this:

```html
<can-component tag="chat-home">
  <style type="less">
    display: block;

    h1.page-header { margin-top: 0; }
  </style>
  <template>
    <can-import from="bit-tabs/unstyled" />
    <h1 class="page-header text-center">
      <img src="http://donejs.com/static/img/donejs-logo-white.svg" alt="DoneJS logo" style="width: 100%;" />
      <br>Chat
    </h1>

    <bit-tabs tabs-class="nav nav-tabs">
      <bit-panel title="CanJS">
        CanJS provides the MV*
      </bit-panel>
      <bit-panel title="StealJS">
        StealJS provides the infrastructure.
      </bit-panel>
    </bit-tabs>
  </template>
</can-component>
```

And update `src/index.stache` to dynamically load and initialize this component instead:

```html
<html>
  <head>
    <title>{{title}}</title>
    {{asset "css"}}
    {{asset "html5shiv"}}
  </head>
  <body>
    <can-import from="bootstrap/less/bootstrap.less!" />
    <can-import from="donejs-chat/styles.less!" />
    <can-import from="donejs-chat/app" as="viewModel" />

    <div class="container">
      <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
          <can-import from="donejs-chat/home.component!">
            {{#if isPending}}
              Loading...
            {{else}}
              <chat-home/>
            {{/if}}
          </can-import>
        </div>
      </div>
    </div>

    {{asset "inline-cache"}}

    {{#switch env.NODE_ENV}}
      {{#case "production"}}
        <script src="/node_modules/steal/steal.production.js"  main="donejs-chat/index.stache!done-autorender"></script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

The messages component (with the tag `chat-messages`) will be a little more complex which is why we generate it into several files according to the modlet pattern.

```
donejs generate component messages chat-messages
```

Later we will update those files with the chat messages functionality.

### Navigate between pages

Routing works slightly different than what you might be used to from other libraries. Instead of declaring routes and mapping those to actions, our application will use CanJS's [can.route](http://canjs.com/docs/can.route.html) which allows mapping property names from a URL string to properties in our application state. As a result, our routes will just be a different representation of the application state.

If you want to learn more about CanJS routing visit the CanJS guide on [Application State and Routing](http://canjs.com/2.3-pre/guides/AppStateAndRouting.html).

First, let's update `src/home.component` with a link to the chat messages page:

```html
<can-component tag="chat-home">
  <style type="less">
    display: block;

    h1.page-header { margin-top: 0; }
  </style>
  <template>
    <can-import from="bit-tabs/unstyled" />
    <h1 class="page-header text-center">
      <img src="http://donejs.com/static/img/donejs-logo-white.svg" alt="DoneJS logo" style="width: 100%;" />
      <br>Chat
    </h1>

    <bit-tabs tabs-class="nav nav-tabs">
      <bit-panel title="CanJS">
        CanJS provides the MV*
      </bit-panel>
      <bit-panel title="StealJS">
        StealJS provides the infrastructure.
      </bit-panel>
    </bit-tabs>

    <a can-href="{ page='chat' }" class="btn btn-primary btn-block btn-lg">Start chat</a>
  </template>
</can-component>
```

When the "Start chat" button is clicked, `can-href="{ page='chat' }"` will make sure that our application state gets updated with that property. This state will also be reflected in the route.

Next we add a link to go back to the chat page (`messages/messages.stache`):

```html
<h5><a can-href="{ page='home' }">Home</a></h5>
<p>{{message}}</p>
```

Then, to get a pretty route we add a mapping for the `page` property in `src/app.js` which then looks like this:

```js
import AppMap from "can-ssr/app-map";
import route from "can/route/";
import 'can/map/define/';
import 'can/route/pushstate/';

const AppViewModel = AppMap.extend({
  define: {
    title: {
      value: 'donejs-chat',
      serialize: false
    }
  }
});

route('/:page', { page: 'home' });

export default AppViewModel;
```

### Switch between pages

Finally we can glue both components together as separate pages in `src/index.stache`. This is done by adding another dynamic import for the `chat/messages/` component and showing each import based on the `page` property (which we set in the route):


```html
<html>
  <head>
    <title>{{title}}</title>
    {{asset "css"}}
    {{asset "html5shiv"}}
  </head>
  <body>
    <can-import from="bootstrap/less/bootstrap.less!" />
    <can-import from="donejs-chat/styles.less!" />
    <can-import from="donejs-chat/app" as="viewModel" />

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

    {{asset "inline-cache"}}

    {{#switch env.NODE_ENV}}
      {{#case "production"}}
        <script src="/node_modules/steal/steal.production.js"  main="donejs-chat/index.stache!done-autorender"></script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

Now we dynamically load both components while navigating between the home and messages page.

## Message connection

In this part we will create a messages model that connects to a remote RESTful API and then make the message list receive real-time updates from other clients.

### Generate Message model

To create a connection for our mesages we will use [can-connect supermodel](http://connect.canjs.com/doc/can-connect%7Ccan%7Csuper-map.html) which we can generate like this:

```
donejs generate supermodel message
```

When asked for the URL endpoint we have to make sure to set it to our remote API at [http://chat.donejs.com/api/messages](http://chat.donejs.com/api/messages). The other prompt can be answered with the default by hitting enter.

### Using the connection

This was all we needed to create a connection to our REST endpoint. We can go ahead and use it, for example by importing it in `src/messages/messages.stache` and requesting a list of all mesages with the `message-model` custom element:

```html
<can-import from="donejs-chat/models/message" />
<h5><a can-href="{ page='home' }">Home</a></h5>
<message-model get-list="{}">
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

If we now open [localhost:8080/chat](http://localhost:8080/chat) we can see the list of messages from the server or the text that there are no messages.

### Creating messages

Now can add the form to create new messages. The form simply binds the `name` and `message` property to the components view model and calls `send` when hitting the enter key in the message input. With that `src/messages/messages.stache` looks like this:

```html
<h5><a can-href="{ page='home' }">Home</a></h5>
<message-model get-list="{}">
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
<div class="row">
  <div class="col-sm-3">
    <input type="text" class="form-control" id="name" placeholder="Your name" {($value)}="name">
  </div>
  <div class="col-sm-9">
    <input type="text" class="form-control" id="message" placeholder="Your message" {($value)}="message" ($enter)="send">
  </div>
</div>
```

Next we have to implement the `send` method that is being called when pressing enter in `src/messages/messages.js`:

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

It simply takes the `name` and `message` properties which are bound to the input fields from the view-model and creates and saves a new `Message` instance. Once completed successfully we can set the message back to empty the input field. If we now put in our name and send a new message it will show up automatically in our messages list.

### Real-time connection

Right now our chat updates automatically with our own new messages but not with messages from other clients. The API server ([chat.donejs.com/api/messages](http://chat.donejs.com/api/messages)) does provide a [Socket.io](http://socket.io/) server that sends out real-time updates for new, updated and deleted chat messages. To connect to it we need to install a [Socket.io client wrapper](https://github.com/stealjs/steal-socket.io):

```
npm install steal-socket.io --save
```

And update `src/models/message.js` to look like this:

```js
import can from 'can';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';
import io from 'steal-socket.io';

export const Message = can.Map.extend({
  define: {}
});

Message.List = can.List.extend({
  Map: Message
}, {});

export const messageConnection = superMap({
  url: 'http://chat.donejs.com/api/messages',
  idProp: 'id',
  Map: Message,
  List: Message.List,
  name: 'message'
});

tag('message-model', messageConnection);

const socket = io('http://chat.donejs.com');

socket.on('messages created',
  order => messageConnection.createInstance(order));
socket.on('messages updated',
  order => messageConnection.updateInstance(order));
socket.on('messages removed',
  order => messageConnection.destroyInstance(order));

export default Message;
```

This will listen to `messages <event>` events sent by the server and tell the connection to update all active lists of messages. Try opening another browser window to see receiving messages in real-time.

## Production build

Now that we implemented the complete chat functionality we can get our application ready for production.

### Run build

We can find the build configuration in `build.js` in the application folder. Everything is already set up so we can simply make a build by running

```
donejs build
```

The optimized bundles that load your JavaScript and CSS as fast as possible are located in the `dist/` folder.

### Set to production.

To test the production build, close the current server (with `CTRL + C`) and start it with the environment (`NODE_ENV`) set to `production`:

```
NODE_ENV=production donejs start
```

If we now open [localhost:8080](http://localhost:8080/) again we can see the production bundles being loaded in the network tab or the developer tools.

## Deploy

Now that we verified that our application works in production we can deploy it on the web. For this guide we will use [Divshot](https://divshot.com/) which provides static file hosting and [Content Delivery Network](https://en.wikipedia.org/wiki/Content_delivery_network) (CDN) support.

### Setting up Divshot

Create a free [Divshot](https://divshot.com/) account and a new app in the control panel. Then install the CLI via

```
npm install -g divshot-cli
```

And log in with your credentials

```
divshot login
```

### Configuring DoneJS

Now we can add the Divshot deployment configuration to our `package.json` like this:

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

And also update the production `baseURL` in the `system` section:

```
...
"system": {
  ...
  "envs": {
    "server-production": {
      "baseURL": "https://donejs-chat.divshot.io/"
    }
  }
}
```

Make sure to replace `"name": "donejs-chat"` with the name of the application you created. We also need to update `src/index.stache` to load its assets from the Divshot by changing the `{{#switch env.NODE_ENV}}` section to:

```html
{{#switch env.NODE_ENV}}
  {{#case "production"}}
    <script src="http://donejs-chat.divshot.io/node_modules/steal/steal.production.js"  main="donejs-chat/index.stache!done-autorender"></script>
  {{/case}}
  {{#default}}
    <script src="/node_modules/steal/steal.js"></script>
  {{/default}}
{{/switch}}
```

Again, make sure to replace `http://donejs-chat.divshot.io` with your own Divshot URL. Then we can deploy the application by running:

```
donejs build
donejs deploy
```

And verify that the application is loading from the CDN by loading it after running

```
NODE_ENV=production donejs start
```

We should now see our assets being loaded from the Divshot CDN.

## Desktop and mobile apps

In the last part of this guide we will make builds of our chat as a mobile application for iOS using [Cordova](https://cordova.apache.org/) and as a desktop application with [nw.js](http://nwjs.io/).

### Cordova

To build the chat as a Cordova based mobile application you need to have the appropriate platform SDK installed. XCode can be downloaded via the AppStore so we will use it to create an iOS application that can be tested in the ios simulator. After installing XCode to launch the simulator we also need to run:

```
npm install ios-sim -g
```

Now we can install the DoneJS Cordova tools with

```
npm install steal-cordova --save-dev
```

And update `build.js` to:

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
  index: __dirname + "/production.html",
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

To run the Cordova build and launch the simulator we can now run

```
donejs build cordova
```

If everything went well we should see the iOS simulator starting with our application.

### NW.js

For the desktop build we first have to install the build tools:

```
npm install steal-nw --save-dev
```

As well as update our `package.json` changing `main` to `app.html` and add information about the desktop window:

```js
"main": "production.html",
...
"window": {
  "width": 1060,
  "height": 625,
  "toolbar": false
}
```

And then update `build.js` to:

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
  index: __dirname + "/production.html",
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

var nwOptions = {
  buildDir: "./build",
  platforms: ["osx"],
  files: [
    "package.json",
    "production.html",
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

Now we can run the build with

```
node build nw
```

The application can be opened with

```
cd build/donejs-chat/osx64
open donejs-chat.app
```

## What's next?

In this guide we created a small real-time chat application that connect to a remote API with DoneJS. It has routing between two pages and can send and receive messages in real-time. We build an optimized bundle for production and deployed it to a static file host and CDN. Last we made builds of the application as a mobile and desktop application.

If you want to learn more about DoneJS like how to create more complex custom elements and routes, write and automatically run tests, Continuous Integration and Continuous Deployment head over to the [place-my-order Guide](./place-my-order.html).
