<<<<<<< HEAD
@page bitcentive Example: Bitcentive
@parent DoneJS
@hide sidebar
@outline 2 ol
@description

In this guide, you'll learn how [Bitcentive](http://bitcentive.herokuapp.com) - an open source royalty program - works.
Specifically, this guide will walk through the implementation of the following behaviors or functionality:

 - Working with document-based data structures (MongoDB).
 - Registration, login, user sessions, and access rights with FeathersJS and websockets.
 - Using streams to manage state.

@body

## High Level Architecture

### Folder organization

### Data Model and Service Layer

- Feathers
- feathers-mongoose
	- only used for the model validation
- MongoDB
- Session Management: feathers-authentication
	- Loosely using the word “session” feels fine unless you have experience with sessions on the server.

### Component Map

## Document data structures

ContributionMonth is nested ... nice to operate on items individually.

### Relationships

 - Ref type
 - Explain how we are using it.
 - [https://v3.canjs.com/doc/can-connect/can/ref/ref.html](https://v3.canjs.com/doc/can-connect/can/ref/ref.html)

### Mutations on children

The DOM allows you to make changes without accessing the document.

`monthlyClientProject.save()` ... really need to call `contributionMonth.save()`.

How do you setup this relationship? `added` and `removed`.

What do you do if a `monthlyClientProject` is created without an associated
contributionMonth?

### ContributionMonth uses

- MonthlyOSProject
- MonthlyClientProject
- MonthlyContributions

## Users, Sessions, and Access

### Behavior

### Responsibilities

## Streams


## GitHub Auth

### Client popup flow

- **Client**: Open popup window
	- feathers-authentication-popups openLoginPopups()
- **Server**: direct popup to GitHub login window with configuration data on the server.
	- feathers-authentication OAuth2 plugin
- **Client**: User grants access
- **Server**: middleware to handle popup returns a pre-made page to handle the success response
	- feathers-authentication-popups express.js middleware
- **Client**: popup window sends “session” data (JWT) to the parent window.
	- feathers-authentication-popups window.authAgent
- **Client**: Event streams in the main window respond to the session data
	- can-stream
- **We get a JWT back in this process, let’s talk about JWTs, now**.

### JWTs

- Explaining the in a way that’s easy to understand is difficult.
- Give basic overview and provide links out to good sources for more information.
- We could get into the weeds and talk security
  - How we avoid CSRF vulnerabilities while still using cookies.
  - This would probably serve better as its own blog article with the diagrams that I made.


## Fixturizing WebSockets

### can-fixture-socket

- Intercepts [socket.io](http://socket.io) requests
- returns data from a fixture store
	- can-set algebra
	- link to blog article on fixture stores
- [https://v3.canjs.com/doc/can-fixture-socket.html](https://v3.canjs.com/doc/can-fixture-socket.html)

### steal-socket.io

- Needed in order to proxy and delay the socket for fixture use.
- [https://stealjs.github.io/stealjs/docs/steal-socket.io.html](https://stealjs.github.io/stealjs/docs/steal-socket.io.html)

### How to use socket fixtures in

- Tests
- Demos


## Permissions / Access Control

### Explain the high level permissions logic,  setup / groups, etc

### How we used the JWT payload combined with feathers hooks to lock down the API server.
