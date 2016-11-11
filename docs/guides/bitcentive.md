# Bitcentive


## High Level Architecture

### Server and Services

- Feathers
- feathers-mongoose
	- only used for the model validation
- MongoDB
- Session Management: feathers-authentication
	- Loosely using the word “session” feels fine unless you have experience with sessions on the server.

## ~~donejs-feathers generator~~

- Too much tech debt here, now.  I agree, for different reasons, that we probably shouldn't mention it at all.
- We started with the generator.
- Puts everything that the client app needs in place with one cli command.
- High level explanation of what we modified.  (not much)
- **Generator Tech Debt**
	- Needs to be updated to use the new modules
		- feathers-client
	- can-connect-feathers behaviors
	- feathers-authentication-popups
	- feathers-socketio-ssr
	- auth-component
		- Not currently being used in Bitcentive, but we could, now that we’ve removed username/password auth.  We can easily explain that it only opens a popup window.
		- It’s built to be feathers-compatible by default.  Maybe I should generalize the main one and make a feathers-specific one available in the same package.
	- can-fixture-socket
	- steal-socket.io
- **With this much tech debt / delay, we probably shouldn’t even mention the generator**.

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

## JWTs

### Feathers uses them

### High level overview of JWTs

- Explaining the in a way that’s easy to understand is difficult.
- Give basic overview and provide links out to good sources for more information.
- We could get into the weeds and talk security
  - How we avoid CSRF vulnerabilities while still using cookies.
  - This would probably serve better as its own blog article with the diagrams that I made.

## SSR

### A lot is already covered in the BitBalls guide, so we can cover Feathers-specific information.

- feathers-socketio-ssr
	- Switches between [Socket.io](http://Socket.io) on the client and XHR requests on the server.
		- Made possible because Feathers uses a common query syntax across multiple transports
- steal-socket.io
	- Prevents the server from opening the socket connection on the SSR server.
- done-ssr / can-zone plugin?
	- For the client, intercept native WebSockets and return cached requests from SSR server’s XHR_CACHE
- done-ssr JWT proxy
	- [https://github.com/donejs/done-ssr#auth-cookie-domains](https://github.com/donejs/done-ssr#auth-cookie-domains)
	- Allows the SSR server to know which endpoints are safe to receive the JWT
		- Solves a privacy problem.  Other domains (say, an ad network) shouldn’t receive your JWT, or they could use it to make authenticated requests.

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

## Enhancing your connection with custom can-connect behaviors

### connected define-maps

### can-connect-feathers

- killer real-time features

## Nested model relationships

### canRef

- Explain how we are using it.
- [https://v3.canjs.com/doc/can-connect/can/ref/ref.html](https://v3.canjs.com/doc/can-connect/can/ref/ref.html)

### ContributionMonth uses

- MonthlyOSProject
- MonthlyClientProject
- MonthlyContributions

## Permissions / Access Control

### Explain the high level permissions logic,  setup / groups, etc

### How we used the JWT payload combined with feathers hooks to lock down the API server.

