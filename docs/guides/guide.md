@page Guide Quick start guide
@parent Guides
@hide sidebar
@outline 2 ol
@description In this guide, we will create [chat.donejs.com](https://chat.donejs.com), a small real-time chat application with a homepage showing a tabs widget and a messages page that lets us send and receive messages in real-time:

<img src="static/img/donejs-chat.gif" alt="chat.donejs.com" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

In the first part of this guide, we will install DoneJS, [generate a new application](./Features.html#generators) and start a server that provides [hot module swapping](./Features.html#hot-module-swapping) and [server-side rendering](./Features.html#server-side-rendered). We will then [import Bootstrap from npm](./Features.html#npm-packages), create our [own custom HTML elements](./Features.html#custom-html-elements) and [set up routing](./Features.html#pretty-urls-with-pushstate) between the homepage and the chat messages page. After that, we will complete both pages by adding a tabs widget to the homepage and the ability to send messages and [receive real-time updates](./Features.html#real-time-connected).

In the final parts of the guide we will make an [optimized, progressively loaded production build](./Features.html#progressive-loading) and [deploy it to a CDN](./Features.html#deploy-to-a-cdn). We will conclude with creating a [mobile and desktop](./Features.html#ios-android-and-desktop-builds) version of the application.

If you run into any problems, let us know [on Gitter](https://gitter.im/donejs/donejs), we’re happy to help out.

> For an even easier version of this guide, one that can be done entirely online, checkout [CanJS’s Chat Guide](https://canjs.com/doc/guides/chat.html). There, you'll build the same chat widget in a [JS Bin](https://jsbin.com/), but
without a mobile or desktop build and deployment to a CDN.
>
>
> Similarly, if you are unfamiliar with module loading and module loaders, you may want to checkout [StealJS’s Quick Start Guide](https://stealjs.com/docs/StealJS.quick-start.html) before proceeding with this guide.

@body

## Setup

In this section, we will install DoneJS and generate a new application.

> If you haven't already, check out the [SettingUp] guide to ensure you have all of the prerequisites installed and configured.

### Install DoneJS

To get started, let’s install the DoneJS command line utility globally:

```shell
npm install -g donejs@3
```

### Generate the application

Then we’ll create a new DoneJS application called `donejs-chat`:

```shell
donejs add app donejs-chat --yes
```

This will create a new folder called `donejs-chat` and in it generate our application.

The initialization process will ask questions like the name of your application, the source folder, etc. We’ll answer these with the default settings by hitting enter.

<img src="static/img/donejs-init.png" alt="donejs add app" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

This will install all of DoneJS’s dependencies, including the following:

- [StealJS](https://stealjs.com) — ES6, CJS, and AMD module loader and builder
- [CanJS](https://canjs.com) — Custom elements and Model-View-ViewModel utilities
- [done-ssr](https://github.com/donejs/done-ssr) - Server-rendering
- [QUnit](https://qunitjs.com/) — Assertion library (A [Mocha](https://github.com/donejs/donejs-mocha) generator is also available)
- [FuncUnit](https://funcunit.com) — Functional tests
- [Testee](https://github.com/bitovi/testee) — JavaScript Test runner

### Turn on development mode

DoneJS comes with its own development server, which hosts your development files and automatically [renders the application on the server](./Features.html#server-side-rendered). Development mode enables [hot module swapping](./Features.html#hot-module-swapping), which automatically reloads files in the browser and on the server as they change.

To start it let’s go into the `donejs-chat` application directory:

```shell
cd donejs-chat
```

We can start development mode by running:

```shell
donejs develop
```

The default port is `8080`.

Go to [http://localhost:8080/] to see our application showing a default homepage.

<img src="static/img/donejs-homepage.png" alt="hello world" height="272" width="600" />

## Adding Bootstrap

DoneJS makes it easy to import other projects that are published on [npm](https://npmjs.org). In this section, we will install and add [Bootstrap](https://getbootstrap.com/) to the page, and see DoneJS’s [hot module swapping](./Features.html#hot-module-swapping) in action.

### Install the npm package

Open a new terminal window so we can keep the DoneJS development server running. Then, install the [Bootstrap npm package](https://www.npmjs.com/package/bootstrap) and save it as a dependency of our application like this:

```shell
npm install bootstrap@3 --save
```

### Add it to the page

To see hot module swapping in action, let’s update the main template to import Bootstrap’s LESS file and also add some HTML that uses its styles.

Update `src/index.stache` to look like this:

@sourceref ../../guides/guide/steps/4-bootstrap/index.stache
@highlight 6,10-20,only

> New APIs Used:
> - [<can-import>](https://canjs.com/doc/can-view-import.html) — specifies template dependencies.

If you kept your browser window open at [http://localhost:8080/] you should see the updated styles and content as soon as you save the file.

<img src="static/img/donejs-bootstrap.png" alt="donejs add app" height="272" width="400" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

Feel free to edit the HTML or `src/styles.less` to see how hot module swapping updates the page automatically.

## Routing and components

In this part, we will create our own custom HTML elements — one for the homepage and another to display the chat messages. Then we will create routes to navigate between these two pages.

### Generate custom elements

We’ll use a DoneJS [generator](./Features.html#generators) to create custom components. The component generator is run by typing `donejs add component <file-or-folder> <component-name>`.

The homepage custom element (with the HTML tag name `chat-home`) won't be very big or complex, so we’ll put everything into a single `.component` file.

To generate it, run:

```shell
donejs add component pages/home.component chat-home
```

The messages component (with the tag `chat-messages`) will be a little more complex, so we’ll generate it using the [modlet file pattern](./Features.html#modlets).


Now run:

```shell
donejs add component pages/messages chat-messages
```

<img src="static/img/donejs-generator.png" alt="chat.donejs.com" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

Later we will update the generated files with the chat messages functionality.

### Navigate between pages

> Routing works a bit differently than other libraries. In other libraries, you might declare routes and map those to controller-like actions. DoneJS application [routes](https://canjs.com/doc/can-route.html) map URL strings (like /user/1) to properties on an observable. In other words, our routes will just be a representation of the application state. To learn more about routing visit the [CanJS Routing guide](https://canjs.com/doc/guides/routing.html).

First, let’s update `src/pages/home.component` with the original content from the homepage and a link to the chat messages page:

@sourceref ../../guides/guide/steps/7-navigate/home.component
@highlight 5,8-18,only

> New APIs Used:
> - [done-component](https://github.com/donejs/done-component#done-component) — a [StealJS](https://stealjs.com/) plugin for CanJS [components](https://canjs.com/doc/can-component.html) that allows you to define a component completely within a  _.component_ file.
> - [`routeUrl`](https://canjs.com/doc/can-stache.helpers.routeUrl.html) — a helper that populates the anchor’s href with a URL that sets the `page` property to `"chat"` on [route.data](https://canjs.com/doc/can-route.data.html).

Next, add a link to go back to the homepage from the chat page by updating `src/pages/messages/messages.stache` to:

@sourceref ../../guides/guide/steps/7-navigate/messages.stache
@highlight 1-2,only

> New APIs Used:
> - [DefineMap](https://canjs.com/doc/can-define/map/map.html) — used to define observable types.
> - [route](https://canjs.com/doc/can-route.html) — used to map changes in the URL to changes on the route.data `page` property.

### Switch between pages

Finally we'll glue together these components as separate pages. Our Application ViewModel is where we determine which page to show. This is done by determining the `pageComponent`, an instance of a [can-component](https://canjs.com/doc/can-component.html), based on the `route.data.page` property.

Add the following two new properties to `src/app.js`:

@sourceref ../../guides/guide/steps/7-navigate/app.js
@highlight 20-36,only

This imports the chosen page's module and then instantiates a new instance using `new Component()`. We can use this component by placing it in the `index.stache`:

@sourceref ../../guides/guide/steps/7-navigate/index.stache
@highlight 13-17,only

> New APIs Used:
> - [steal.import](https://stealjs.com/docs/steal.import.html) - imports the pageComponentModuleName dynamically.
> - [new Component()](https://canjs.com/doc/can-component.html#newComponent__options__) - creates new instance of the component imported.
> - [{{#if(isResolved)}}](https://canjs.com/doc/can-stache.helpers.if.html) — Renders the components once their modules have loaded.
> - [{{else}}](https://canjs.com/doc/can-stache.helpers.else.html) — renders _"Loading"_ while the modules are loading.

Now each component is being dynamically loaded while navigating between the home and messages page.  You should see the changes already in your browser.

<img src="static/img/donejs-chat1.png" alt="chat.donejs.com" height="302" width="400" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

## Homepage

Now that we can navigate between pages, we will finish implementing their functionality, starting with the homepage.


### Install bit-tabs

On the homepage, let’s install and add [bit-tabs](https://github.com/bitovi-components/bit-tabs), a simple declarative tabs widget.

Run:

```shell
npm install bit-tabs@2 --save
```

### Update the page

Then, import the unstyled custom elements from `bit-tabs/unstyled` (unstyled because we will use Bootstrap’s styles) and add `<bit-tabs>` and `<bit-panel>` elements to the template.

Update `src/pages/home.component` to:

@sourceref ../../guides/guide/steps/8-bit-tabs/home.component
@highlight 5-7,11,18-25,only

You'll notice tabs appear in the browser:

<img src="static/img/donejs-tabs.png" alt="chat.donejs.com" height="437" width="400" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

## Messages page

In this section we add live chat functionality to the messages page. We’ll need to:

 * Create a messages model that connects to a RESTful API.
 * Add the ability to retrieve and list messages and create new messages.
 * Make the message list receive real-time updates from other clients.

### Generate Message model

To load messages from the server, we will use [can-connect’s supermodel](https://canjs.com/doc/can-connect/can/super-map/super-map.html).

Generate a `message` supermodel like this:

```shell
donejs add supermodel message
```

When asked for the URL endpoint, set it to our remote RESTful API at `https://chat.donejs.com/api/messages`. When it asks if https://chat.donejs.com is your service URL answer `Yes`. The other questions can be answered with the default by hitting enter.

<img src="static/img/donejs-model-generator.png" alt="model generator" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

Update `src/models/message.js` to:

@sourceref ../../guides/guide/steps/10-message-model/message.js
@highlight 10-12

> New APIs Used:
> - [QueryLogic](https://canjs.com/doc/can-query-logic.html) — used to describe a service-layer’s parameters. For example if `"api/messages?limit=20"` only returned 20 messages, you would configure the `limit` parameter behavior in the connection’s `queryLogic`.
> - [DefineList](https://canjs.com/doc/can-define/list/list.html) — used to define the behavior of an observable list of `Message`s.
> - [superModel](https://canjs.com/doc/can-super-model.html) — connects the `Message` type to the  
>   restful `'/api/messages'` service. This adds [real-time](https://canjs.com/doc/can-connect/real-time/real-time.html), [fall-through-caching](https://canjs.com/doc/can-connect/fall-through-cache/fall-through-cache.html) and other useful behaviors.
> - [loader](https://stealjs.com/docs/@loader.html) — references the module loader that is loading this code. All configuration
>   in your _package.json_’s "steal" property is available, including the `serviceBaseUrl`.

### Use the connection

The generated file is all that is needed to connect to our RESTful API. Use it by importing it and requesting a list of all messages.

Update `src/pages/messages/messages.js` to:

@sourceref ../../guides/guide/steps/10-use-connection/messages.js
@highlight 4,21-23,only

> New APIs Used:
> - [getList](https://canjs.com/doc/can-connect/connection.getList.html) — returns a promise that resolves to a `Message.List` of `Message` instances.

Display the messages by updating `src/pages/messages/messages.stache` to:

@sourceref ../../guides/guide/steps/10-use-connection/messages.stache
@highlight 4-15,only

> New APIs Used:
> - [{{#each}}](https://canjs.com/doc/can-stache.helpers.each.html) — loops through each `Message` instance.
> - [{{key}}](https://canjs.com/doc/can-stache.tags.escaped.html) — reads either the name or body of a
>   `Message` instance and inserts it into the output of the template.


If you open [localhost:8080/chat](http://localhost:8080/chat), you will see a list of messages from the server or the "No message" text.

<img src="static/img/donejs-chat2.png" alt="chat.donejs.com" height="272" width="400" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

### Create messages

Now let’s add the form to create new messages. The form will two-way bind the `name` and `body` properties to the component’s view-model and calls `send()` when hitting the enter key in the message input.

First we have to implement the `send()` method. Update `src/pages/messages/messages.js` to this:

@sourceref ../../guides/guide/steps/11-create-messages/messages.js
@highlight 16-17,29-36,only

> New APIs Used:
> - [save()](https://canjs.com/doc/can-connect/connection.save.html) — creates a `POST` request to `/api/messages` with
>   the message data.  

The `send()` method takes the `name` and `message` properties from the view-model and creates a `Message` instance, saving it to the server. Once saved successfully, it sets the message to an empty string to reset the input field.

Next update `src/pages/messages/messages.stache` to look like this:

@sourceref ../../guides/guide/steps/11-create-messages/messages.stache
@highlight 17-29,only

> New APIs Used:
> - [on:submit](https://canjs.com/doc/can-stache-bindings.event.html) — listens to _submit_ events and calls
>   the `send()` method on the ViewModel.
> - [value:bind](https://canjs.com/doc/can-stache-bindings.twoWay.html) — two-way bindings a `<input>`’s value
>   to a property of the ViewModel.


You can now enter your name and a message! It will automatically appear in our messages list.

<img src="static/img/donejs-chat3.png" alt="chat.donejs.com" height="289" width="400" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

In fact, all lists that are related to that model will be updated automatically whenever there is new, modified, or deleted data. [can-connect](https://canjs.com/doc/can-connect.html) automatically manages the lists, while also providing [caching and minimized data requests](./Features.html#caching-and-minimal-data-requests).

You can see from your console that the localStorage cache is already populated with data:

<img src="static/img/donejs-localstorage.png" alt="chat.donejs.com" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

### Enable a real-time connection

Right now our chat’s messages update automatically with our own messages, but not with messages from other clients. The API server ([chat.donejs.com/api/messages](https://chat.donejs.com/api/messages)) provides a [Socket.io](https://socket.io/) server that sends out real-time updates for new, updated and deleted chat messages.

To connect to it, first we’ll install a socket.io connector, by running:

```shell
npm install steal-socket.io --save
```

Update `src/models/message.js` to:

@sourceref ../../guides/guide/steps/12-real-time/message.js
@highlight 3,27-34,only

> New APIs used:
> - [createInstance](https://canjs.com/doc/can-connect/real-time/real-time.createInstance.html) — tells the real-time
>   system that a message has been created.
> - [updateInstance](https://canjs.com/doc/can-connect/real-time/real-time.updateInstance.html) — tells the real-time
>   system that a message has been updated.
> - [destroyInstance](https://canjs.com/doc/can-connect/real-time/real-time.destroyInstance.html) — tells the real-time
>   system that a message has been destroyed.

This will listen to `messages <event>` events sent by the server and tell the connection to update all active lists of messages accordingly. Try opening another browser window to see receiving messages in real-time.

<img src="static/img/donejs-twobrowsers.png" alt="two browsers" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

## Production build

Now that we implemented the complete chat functionality we can get our application ready for production.

### Run build

We can find the build configuration in `build.js` in the application folder.

Everything is already set up, so we can simply make a build by running:

```shell
donejs build
```

The optimized bundles that load your JavaScript and CSS as fast as possible are sent to the `dist/` folder.

### Turn on production

To test the production build, close the current server (with `CTRL + C`) and start it with the environment (`NODE_ENV`) set to `production`:

```shell
NODE_ENV=production donejs start
```

If you’re using Windows, you must first set the environmental variable:

1. For Windows **command prompt** you set with `set NODE_ENV=production`
1. For Windows **Powershell** you set it with `$env:NODE_ENV="production"`

Then run your application with `donejs start`.

If we now open [localhost:8080](http://localhost:8080/) again we can see the production bundles being loaded in the network tab of the developer tools.

<img src="static/img/donejs-prodmode.png" alt="two browsers" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

All DoneJS projects are extremely modular, which is why in development mode, you see 200 or more requests when loading the page (thanks to hot-module swapping, we only have to make those requests once). In production mode, we can see only about 8 requests and a significantly reduced file-size.

## Deploy

Now that we verified that our application works in production, we can deploy it to the web. In this section, we will use [Firebase](https://firebase.google.com/), a service that provides static file hosting and [Content Delivery Network](https://en.wikipedia.org/wiki/Content_delivery_network) (CDN) support, to automatically deploy and serve our application’s static assets from a CDN.

### Set up Firebase

Sign up for free at [Firebase](https://firebase.google.com/). After you have an account go to [Firebase console](https://console.firebase.google.com/) and create an app called `donejs-chat-<user>` where `<user>` is your GitHub username. Write down the name of your app because you'll need it in the next section.

> You'll get an error if your app name is too long, so pick something on the shorter side. After you're created your app be sure to note the Firebase **ID**, as this is the information you need to enter in the next section.

When you deploy for the first time it will ask you to authorize, but first we need to configure the project.

### Configure DoneJS

Now we can add the Firebase deployment configuration to our `package.json` like this:

```shell
donejs add firebase
```

When prompted, enter the name of the application created when you set up the Firebase app. Before you can deploy your app you need to login and authorize the Firebase tools, which you can do with:

```shell
node_modules/.bin/firebase login
```

Then we can deploy the application by running:

```shell
donejs build
donejs deploy
```

Static files are deployed to Firebase.

<img src="static/img/donejs-firebase.png" alt="two browsers" />

And verify that the application is loading from the CDN by loading it after running:

```shell
NODE_ENV=production donejs start
```

> If you’re using Windows, set the NODE_ENV variable as you did previously in the Production section.

We should now see our assets being loaded from the Firebase CDN.

<img src="static/img/donejs-deploy.png" alt="two browsers" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

## Desktop and mobile apps

In the last part of this guide we will make mobile and desktop builds of our chat application, using [Cordova](https://cordova.apache.org/) and [Electron](https://electron.atom.io/).

### Cordova

To build the application as a Cordova based mobile application, you need to have each platform’s SDK installed.
We’ll be building an iOS app if you are a Mac user, and an Android app if you’re a Windows user.

Mac users should download XCode from the AppStore and install the `ios-sim` package globally with:

```shell
npm install -g ios-sim
```

We will use these tools to create an iOS application that can be tested in the iOS simulator.

Windows users should install the [Android Studio](https://developer.android.com/sdk/index.html), which gives all of the tools we need.

Now we can install the DoneJS Cordova tools with:

```shell
donejs add cordova@1
```

Depending on your operating system you can accept most of the defaults, unless you would like to build for Android, which needs to be selected from the list of platforms.

To run the Cordova build and launch the simulator we can now run:

```shell
donejs build cordova
```

If everything went well, we should see the emulator running our application.

<img src="static/img/donejs-ios.png" alt="ios build" height="590" width="320" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

Windows users will get instructions to download the latest version of the platform and to create a Virtual Device. Follow the instructions and then re-do the build. This will only happen the first time you build for Cordova.

__Note:__ if you receive the error `Error: Cannot read property 'replace' of undefined`, you can work around it by running `cd build/cordova/platforms/ios/cordova/ && npm install ios-sim@6` until [this patch](https://git-wip-us.apache.org/repos/asf?p=cordova-ios.git;a=commit;h=4490abf273ec6d12810c8ff5ea16d197c58ecd4b) is released.

### Electron

To set up the desktop build, we have to add it to our application like this:

```shell
donejs add electron@1
```

Accept the default for all of the prompts.

<img src="static/img/donejs-electron-prompt.png" alt="electron prompt" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

Then we can run the build like this:

```shell
donejs build electron
```

The macOS application can be opened with

```shell
open build/donejs-chat-darwin-x64/donejs-chat.app
```

The Windows application can be opened with

```shell
.\build\donejs-chat-win32-x64\donejs-chat.exe
```

<img src="static/img/donejs-electron-app.png" alt="electron app" style="box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px #E7E7E7 solid;" />

## What’s next?

In this guide we created a small chat application that connects to a remote API with DoneJS. It has routing between two pages and can send and receive messages in real-time. We built an optimized bundle for production and deployed it to a static file host and CDN. Last, we made builds of the application as a mobile and desktop application.

If you want to learn more about DoneJS - like how to create more complex custom elements and routes, write and automatically run tests, Continuous Integration and Continuous Deployment - head over to the [place-my-order Guide](./place-my-order.html).

If you’re not ready for that yet, we might suggest the following guides:

- CanJS’s [TodoMVC Guide](https://canjs.com/doc/guides/todomvc.html) and [ATM Guide](https://canjs.com/doc/guides/atm.html) — to better familiarize yourself with CanJS (DoneJS’s models, views, and observables).
- StealJS’s [Progressive Loading Guide](https://stealjs.com/docs/StealJS.guides.progressive_loading.html) — to better familiarize yourself with StealJS (DoneJS’s module loader and builder).
