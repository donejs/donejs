@page Guides
@parent DoneJS
@hide sidebar
@outline 2 ol

@description DoneJS is about getting your application ... __done__ ... so you can spend time with
your friends and family.  To demonstrate how easy it is to make something amazing with all the bells and
whistles a modern developer needs, we created the following guides.


@body

## [Quick start: donejs-chat](./Guide.html)
<a href="./Guide.html"><img class="app-thumbs" src="static/img/donejs-chat.gif" width="500" style="border: 1px solid #000"></a>

In the [quick start guide](./Guide.html), we will build a small chat application - [https://chat.donejs.com/](https://chat.donejs.com/).  You'll learn about:

- Hot Module Swapping
- Server-side rendering
- Progressive loading
- Real time connections
- Building and deploying to a CDN.
- Builds to Cordova (mobile) and NW.js (desktop).

## [In-depth: place-my-order](./place-my-order.html)
<a href="./place-my-order.html"><img class="app-thumbs" src="static/img/thumb-pmo.png" srcset="static/img/thumb-pmo.png 1x, static/img/thumb-pmo-2x.png 2x"></a>


In the [place-my-order guide](./place-my-order.html), we will go into detail, creating [http://www.place-my-order.com](http://www.place-my-order.com), a restaurant menu order application. You'll learn everything covered in the "Quick start", plus more:

- MVVM architecture
- Testing
- Nested routing
- Continuous integration and continuous deployment
- Documentation

## [Creating a plugin](./plugin.html)
<a href="./plugin.html"><img class="app-thumbs" src="static/img/thumb-plugin.png" srcset="static/img/thumb-plugin.png 1x, static/img/thumb-plugin-2x.png 2x"></a>


In the [plugin guide](plugin.html), we will create a reusable number input widget using [Bootstrap](http://getbootstrap.com) styles. We will cover:

- Create the project on GitHub
- Initialize the repository as a new DoneJS plugin
- Set up continuous integration with Travis CI
- Start development mode
- Implement the component functionality and tests
- Make a pull request to the repository
- Make a build
- Publish to npm
- Use the plugin in other projects

## [Example App: Bitballs](./bitballs.html)

<a href="./bitballs.html"><img class="app-thumbs" src="static/img/bitballs/bitballs-video.png" srcset="static/img/bitballs/bitballs-video.png 1x, static/img/bitballs/bitballs-video-2x.png 2x"></a>

In this guide, you'll learn how [Bitballs](http://bitballs.herokuapp.com) - a charity basketball tournament management application - works.
Specifically, this guide will walk through the implementation of the following behaviors or functionality:

 - Registration, login, user sessions, and access rights.
 - Handling relationships between model types.
 - Setup node services and server-side rendering on the same process.
 - How to turn off parts of the app that should not be server-side rendered.

## [migrate-1]

Explains how to upgrade DoneJS 0.9 app to 1.0.

## [migrate-2]

Explains how to upgrade DoneJS 1.0 app to 2.0.

## [migrate-3]

Explains how to upgrade DoneJS 2.0 app to 3.0.

## [contributing]

The [contributing contribution guide] includes information about our code of conduct, reporting bugs, submitting new code, and more!

## [ssr-react]

In this guide you'll learn how to use the great features of [done-ssr](https://github.com/donejs/done-ssr) outside of a traditional DoneJS app. This guide walks through building a [React](https://reactjs.org/) app with a streaming list, and then building an HTTP/2 server that renders using done-ssr and [can-zone](https://github.com/canjs/can-zone).
