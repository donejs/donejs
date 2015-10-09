@page Guide
@parent DoneJS
@hide sidebar
@outline 2 ol
@description In this guide, we will create [chat.donejs.com](http://chat.donejs.com), a small real-time chat application with a homepage showing a tabs widget and a messages page that lets us send and receive messages in real-time:

<img src="static/img/donejs-chat.gif" alt="chat.donejs.com" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); margin: 20px 0; border-radius: 5px; border: 1px #E7E7E7 solid;" />

In the first part of this guide we will install DoneJS, [generate a new application](Features.html#section=section_Generators) and start a server that provides [live-reload](Features.html#section=section_HotModuleSwapping_LiveReload) and [server-side rendering](Features.html#section=section_ServerSideRendered). We will then [import Bootstrap from NPM](Features.html#section=section_NPMPackages), create our [own custom HTML elements](Features.html#section=section_CustomHTMLElements) and [set up routing](Features.html#section=section_PrettyURL_swithPushstate) between the homepage and the chat messages page. After that, we will complete both pages by adding a tabs widget to the homepage and the ability to send messages and [receive real-time updates](Features.html#section=section_RealTimeConnected).

In the final parts of the guide we will make an [optimized, progressively loaded production build](Features.html#section=section_Progressiveloading) and [deploy it to a CDN](Features.html#section=section_DeploytoaCDN). We will conclude with creating a [mobile and desktop](Features.html#section=section_iOS_Android_andDesktopBuilds) version of the application.

@body

## Setup

In this section, we will install DoneJS and generate a new application. To get started, let's install the DoneJS command line utility globally:

```
npm install -g donejs
```

### Generate the application

Then we create a new DoneJS application called `donejs-chat`:

```
donejs init donejs-chat
```

This will create a new folder called `donejs-chat` and in it generate our application. The initialization process will ask questions like the name of your application, the source folder, etc. We can answer these with the default settings by hitting enter. This will install all of DoneJS's dependencies, including the following:

- [StealJS](http://stealjs.com) - ES6, CJS, and AMD module loader and builder
- [CanJS](http://canjs.com) - Custom elements and Model-View-ViewModel utilities
- [jQuery](http://jquery.com) - DOM helpers
- [jQuery++](http://jquerypp.com) - Extended DOM helpers
- [QUnit](https://qunitjs.com/) - Assertion library (optionally: [Mocha] or [Jasmine])
- [FuncUnit](http://funcunit.com) - Functional tests
- [Testee](https://github.com/bitovi/testee) - JavaScript Test runner
- [DocumentJS](http://documentjs.com) - Documentation

### Development mode

DoneJS comes with its own development server which hosts your development files and automatically [renders the application on the server](Features.html#section=section_ServerSideRendered). Development mode starts the [live-reload](Features.html#section=section_HotModuleSwapping_LiveReload) server that automatically reloads files in the browser and on the server as they change. To start it let's go into the `donejs-chat` application directory:

```
cd donejs-chat
```

Then we can start development mode by running:

```
donejs develop
```

The default port is `8080`. Go to [http://localhost:8080/](localhost:8080) to see our application showing a default homepage.

If you run into any problems, let us know [on Gitter](https://gitter.im/donejs/donejs).


## Adding Bootstrap

DoneJS makes it easy to import other projects that are published on [NPM](https://npmjs.org). In this section we will install and add [Bootstrap](http://getbootstrap.com/) to the page and see DoneJS's [live-reload](Features.html#section=section_HotModuleSwapping_LiveReload) (hot module swapping) in action.

### Installing the NPM package

Keep the server from `donejs develop` running and open a new terminal window to install the [Bootstrap NPM package](https://www.npmjs.com/package/bootstrap) and save it as a dependency of our application like this:

```
npm install bootstrap --save
```

### Add it to the page

To see live-reload in action, let's update the main template to import Bootstrap's LESS file and also add some HTML that uses its styles. Update `src/index.stache` to look like this:

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
    <can-import from="donejs-chat/app" export-as="viewModel" />

    <div class="container">
      <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
          <h1 class="page-header text-center">
            <img src="http://donejs.com/static/img/donejs-logo-white.svg"
                alt="DoneJS logo" style="width: 100%;" />
            <br>Chat
          </h1>
        </div>
      </div>
    </div>

    {{asset "inline-cache"}}

    {{#switch env.NODE_ENV}}
      {{#case "production"}}
        <script src="{{joinBase 'node_modules/steal/steal.production.js'}}"  main="donejs-chat/index.stache!done-autorender"></script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

If you kept your browser window open at [http://localhost:8080/](localhost:8080) you should see the updated styles and content as soon as you save it. Feel free to edit the HTML or `src/styles.less` to see how live-reload updates the page automatically.

## Routing and components

In this part we will create our own custom HTML elements. One for the homepage and another to display the chat messages. Then we will create routes to navigate between those two pages.

### Generate custom elements

The homepage custom element (with the HTML tag name `chat-home`) won't be very big or complex, so we put everything into a single `.component` file. To generate it run:

```
donejs generate component home.component chat-home
```

Then move the content from the homepage into this component so that `src/home.component` looks like this:

```html
<can-component tag="chat-home">
  <style type="less">
    display: block;
  </style>
  <template>
    <h1 class="page-header text-center">
      <img src="http://donejs.com/static/img/donejs-logo-white.svg"
        alt="DoneJS logo" style="width: 100%;" />
      <br>Chat
    </h1>
  </template>
</can-component>
```

The messages component (with the tag `chat-messages`) will be a little more complex, so we generate it using the [modlet file pattern](Features.html#section=section_Modlets).

```
donejs generate component messages chat-messages
```

Later we will update the generated files with the chat messages functionality.

### Navigate between pages

Routing works slightly different than what you might be used to with other libraries. Instead of declaring routes and mapping those to actions, our application will use CanJS's [can.route](http://canjs.com/docs/can.route.html) which allows mapping property names from the URL to properties in our application view-model.

To learn more about CanJS routing, visit the CanJS guide on [Application State and Routing](http://canjs.com/2.3-pre/guides/AppStateAndRouting.html).

First, let's update `src/home.component` with a link to the chat messages page:

```html
<can-component tag="chat-home">
  <style type="less">
    display: block;

    h1.page-header { margin-top: 0; }
  </style>
  <template>
    <h1 class="page-header text-center">
      <img src="http://donejs.com/static/img/donejs-logo-white.svg" 
           alt="DoneJS logo" style="width: 100%;" />
      <br>Chat
    </h1>

    <a can-href="{ page='chat' }" 
       class="btn btn-primary btn-block btn-lg">
      Start chat
    </a>
  </template>
</can-component>
```

When the "Start chat" button is clicked, `can-href="{ page='chat' }"` will make sure that our application view-model gets updated with that property. This property will also update the URL.

Next, add a link to go back to the chat page by updating `messages/messages.stache` to:

```html
<h5><a can-href="{ page='home' }">Home</a></h5>
<p>{{message}}</p>
```

Then, add a routing rule for the `page` property in `src/app.js`:

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

Finally, we'll glue both components together as separate pages in `src/index.stache`. This is done by adding dynamic imports for the `home.component` and `chat/messages/` components and showing each import based on the `page` property.  Update `src/index.stache` to:


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
    <can-import from="donejs-chat/app" export-as="viewModel" />

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
        <script src="{{joinBase 'node_modules/steal/steal.production.js'}}"  main="donejs-chat/index.stache!done-autorender"></script>
      {{/case}}
      {{#default}}
        <script src="/node_modules/steal/steal.js"></script>
      {{/default}}
    {{/switch}}
  </body>
</html>
```

Now each component is being dynamically loaded while navigating between the home and messages page.  You should see the changes already in your browser.

Also, everything is [rendered on the server](Features.html#section=section_ServerSideRendered). If you reload the homepage at [localhost:8080](http://localhost:8080) you'll see the pages content right away, while the JavaScript is loading in the background. Viewing the source will show the dynamically inserted styles and the corresponding HTML.


## Homepage

Now that we can navigate between pages, we will finish implementing their functionality, starting with the homepage.


### Installing bit-tabs

On the homepage, let's install and add [bit-tabs](https://github.com/bitovi-components/bit-tabs), a simple declarative tabs widget.

```
npm install bit-tabs --save
```

### Update the page

Then, import the unstyled custom elements from `bit-tabs/unstyled` (unstyled because we will use Bootstrap's styles) and add `<bit-tabs>` and `<bit-panel>` elements to the template. Update `src/home.component` to:

```html
<can-component tag="chat-home">
  <style type="less">
    display: block;

    bit-panel p {
      padding: 10px;
    }
  </style>
  <template>
    <can-import from="bit-tabs/unstyled" />
    <h1 class="page-header text-center">
      <img src="http://donejs.com/static/img/donejs-logo-white.svg"
        alt="DoneJS logo" style="width: 100%;" />
      <br>Chat
    </h1>

    <bit-tabs tabs-class="nav nav-tabs">
      <bit-panel title="CanJS">
        <p>CanJS provides the MV*</p>
      </bit-panel>
      <bit-panel title="StealJS">
        <p>StealJS provides the infrastructure.</p>
      </bit-panel>
    </bit-tabs>

    <a can-href="{ page='chat' }" 
       class="btn btn-primary btn-block btn-lg">
      Start chat
    </a>
  </template>
</can-component>
```

## Messages page

For the messages page, we will:

 * Create a messages model that connects to a RESTful API.
 * Add the ability to retrieve and list messages and create new messages.
 * Make the message list receive real-time updates from other clients.

### Generate Message model

To load messages from the server, we will use [can-connect's supermodel](http://connect.canjs.com/doc/can-connect%7Ccan%7Csuper-map.html). Generate a `message` supermode like this:

```
donejs generate supermodel message
```

When asked for the URL endpoint, set it to our remote RESTful API at `http://chat.donejs.com/api/messages`. The other questions can be answered with the default by hitting enter.

### Using the connection

The generated file is all that is needed to connect to our RESTful API. Use it by importing it and requesting a list of all messages with the `<message-model>` custom element. Update  `src/messages/messages.stache` to:

```html
<can-import from="donejs-chat/models/message" />
<h5><a can-href="{ page='home' }">Home</a></h5>
<message-model get-list="{}" class="list-group">
  <div class="list-group">
    {{#each ./value}}
      <div class="list-group-item">
        <h4 class="list-group-item-heading">{{name}}</h4>
        <p class="list-group-item-text">{{message}}</p>
      </div>
    {{else}}
      <div class="list-group-item">
        <h4 class="list-group-item-heading">No messages</h4>
      </div>
    {{/each}}
  </div>
</message-model>
```

If we now open [localhost:8080/chat](http://localhost:8080/chat) we either see the list of messages from the server or the text that there are no messages.

### Creating messages

Now let's add the form to create new messages. The form two-way binds the `name` and `message` properties to the component's view-model and calls `send()` when hitting the enter key in the message input. Update `src/messages/messages.stache` to look like this:

```html
<h5><a can-href="{ page='home' }">Home</a></h5>
<message-model get-list="{}" class="list-group">
  <div class="list-group">
    {{#each ./value}}
      <div class="list-group-item">
        <h4 class="list-group-item-heading">{{name}}</h4>
        <p class="list-group-item-text">{{message}}</p>
      </div>
    {{/each}}
    {{^if ./value.length}}
    <div class="list-group-item">
      <h4 class="list-group-item-heading">No messages</h4>
    </div>
    {{/if}}
  </div>
</message-model>
<div class="row">
  <div class="col-sm-3">
    <input type="text" class="form-control" placeholder="Your name"
        {($value)}="name">
  </div>
  <div class="col-sm-9">
    <input type="text" class="form-control" placeholder="Your message"
        {($value)}="message" ($enter)="send()">
  </div>
</div>
```

Next we have to implement the `send()` method. Update `src/messages/messages.js` to this:

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

The `send()` method takes the `name` and `message` properties from the view-model and creates a `Message` instance and saves it to the server. Once completed successfully it sets the message to an empty string to reset the input field.

You can now enter your name and a message! It will automatically appear in our messages list. In fact, all lists that are related to that model will be updated automatically whenever there is new, modified, or deleted data. [can-connect](http://connect.canjs.com/) automatically manages the lists, while also providing [caching and minimizing data requests](Features.html#section=section_Cachingandminimaldatarequests).

### Real-time connection

Right now our chat updates automatically with our own messages, but not with messages from other clients. The API server ([chat.donejs.com/api/messages](http://chat.donejs.com/api/messages)) provides a [Socket.io](http://socket.io/) server that sends out real-time updates for new, updated and deleted chat messages. To connect to it we install:

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

This will listen to `messages <event>` events sent by the server and tell the connection to update all active lists of messages accordingly. Try opening another browser window to see receiving messages in real-time.

## Production build

Now that we implemented the complete chat functionality we can get our application ready for production.

### Run build

We can find the build configuration in `build.js` in the application folder. Everything is already set up so we can simply make a build by running

```
donejs build
```

The optimized bundles that load your JavaScript and CSS as fast as possible are sent to the `dist/` folder.

### Turn on production

To test the production build, close the current server (with `CTRL + C`) and start it with the environment (`NODE_ENV`) set to `production`:

```
NODE_ENV=production donejs start
```

If we now open [localhost:8080](http://localhost:8080/) again we can see the production bundles being loaded in the network tab of the developer tools. All of DoneJS is extremely modular, which is why development mode makes 200 or more requests when loading the page (thanks to live-reload we have to make those requests only once though). In production mode, we can only see about 10 requests and a significantly reduced file-size.

## Deploy

Now that we verified that our application works in production, we can deploy it to the web. For this guide we will use [Divshot](https://divshot.com/), a service that provides static file hosting and [Content Delivery Network](https://en.wikipedia.org/wiki/Content_delivery_network) (CDN) support.

### Setting up Divshot

Sign up for free at [divshot.com](https://divshot.com/). Then install the command line tool and log in with your credentials:

```
npm install -g divshot-cli
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
          "name": "donejs-chat-<user>",
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

Change the `<user>` part in `"name": "donejs-chat-<user>"` to your GitHub username. This will be your Divshot application name (you can choose any other available name as well).

And also update the production `baseURL` in the `system` section:

```
...
"system": {
  ...
  "envs": {
    "server-production": {
      "baseURL": "https://donejs-chat-<user>.divshot.io/"
    }
  }
}
```

Again, make sure to replace the URL with your Divshot application name. Then we can deploy the application by running:

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

In the last part of this guide we will make mobile and desktop builds of our chat application, using [Cordova](https://cordova.apache.org/) and [nw.js](http://nwjs.io/).

### Cordova

To build the application as a Cordova based mobile application you need to have each platform's SDK installed. XCode can be downloaded via the AppStore. We will use it to create an iOS application that can be tested in the iOS simulator.

We'll also need to install the `ios-sim` command line utility in order to launch the simulator:

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

If everything went well we should see the iOS simulator running our application.

### NW.js

To set up the desktop build, first we have to install the build tools:

```
npm install steal-nw --save-dev
```

We'll also update our `package.json`, changing `main` to `app.html` and addding information about the desktop window:

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
donejs build nw
```

The OS X application can be opened with

```
cd build/donejs-chat/osx64
open donejs-chat.app
```

## What's next?

In this guide we created a small chat application that connects to a remote API with DoneJS. It has routing between two pages and can send and receive messages in real-time. We built an optimized bundle for production and deployed it to a static file host and CDN. Last we made builds of the application as a mobile and desktop application.

If you want to learn more about DoneJS - like how to create more complex custom elements and routes, write and automatically run tests, Continuous Integration and Continuous Deployment - head over to the [place-my-order Guide](./place-my-order.html).
