@page bitcentive Example: Bitcentive
@parent DoneJS
@hide sidebar
@outline 2 ol
@description

In this guide, you'll learn how [Bitcentive](http://bitcentive.herokuapp.com) - an open source royalty program - works.
Specifically, this guide will walk through the implementation of the following behaviors or functionality:

 - Working with document-based data structures (MongoDB).
 - Registration, login, user sessions, and access rights with Websockets (FeathersJS).
 - Using streams to manage state.

The code for Bitcentive can be found [on GitHub](https://github.com/donejs/bitcentive). To install and run it locally, follow its [development setup instructions](https://github.com/donejs/bitcentive#getting-started).

The application allows __admins__, who manage the application, to:

Establish login or establish an account with Github:

<img src="static/img/bitcentive/use-1-login-a.png"/>

This opens a popup allowing you to access the account:

<img src="static/img/bitcentive/use-1-login-b.png"/>

Add, update, or delete a list of Open Source projects available for the bounty that month:

<img src="static/img/bitcentive/use-2-os-projects.png"/>

Add, update, or delete a list of client projects for that month:

<img src="static/img/bitcentive/use-3-client-projects.png"/>

Manage the Open Source projects used by the client for that month:

<img src="static/img/bitcentive/use-4-client-projects-os-projects.png"/>

Add, update, or delete a list of contributions for the month.

<img src="static/img/bitcentive/use-5-contributions.png"/>

See royalty payments for the month:

> IMG


@body

## High Level Architecture

Bitcentive uses the following technology organized by
layer:

<p>&nbsp;</p>


__Storage__

- Database: [MongoDB](https://www.mongodb.com/)

> NOTE: DoneJS works perfectly fine with [SQL](bitballs.html) approaches and other databases. We don't
> endorse any backend storage technology.  

__Server and Services__

- Language: JavaScript/[Node 6](https://nodejs.org/)
- Migrations: [DBMigrate](http://umigrate.readthedocs.org/projects/db-migrate/en/v0.9.x/)
- Service API Layer: [FeathersJS](http://feathersjs.com/)
- Service Middleware: [Express](http://expressjs.com/)
- Session Management: [passport](http://passportjs.org/) and [feathers-authentication-jwt](https://github.com/feathersjs/feathers-authentication-jwt)

> NOTE: DoneJS works with any service technology.  Furthermore, Bitcentive's server-side code was not created by server-side NodeJS experts.  There are likely many improvements that could be made.  Don't learn NodeJS/Express from us.  With respect to the server, our only goal with this example is to introduce service APIs that work well DoneJS clients and give an example of how to create them.

__Client__

- Dependency Management: [StealJS](http://stealjs.com/) and [ES6](http://stealjs.com/docs/syntax.es6.html).
- Model: [can-connect](https://connect.canjs.com/) and [can-connect-feathers](http://canjs.com/doc/can-connect-feathers.html)
- ViewModel: [can-define/map](http://canjs.com/doc/can-define/map/map.html) and [can-define/list](http://canjs.com/doc/can-define/list/list.html)
  - Event Streams: [KefirJS](https://rpominov.github.io/kefir/) and [can-define-stream](http://canjs.com/doc/can-define-stream.html)
- View: [can-stache](http://canjs.com/doc/can-stache.html)
- Custom Elements: [can-component](http://canjs.com/doc/can-component.html)
- Routing: [can-route](http://canjs.com/doc/can-route.html)

__Testing__

- Assertion Library: [QUnit](https://qunitjs.com/)
- Ajax Fixtures: [can-fixture](https://www.npmjs.com/package/can-fixture) and [can-fixture-socket](http://canjs.com/doc/can-fixture-socket.html).
- Functional Testing: [FuncUnit](https://www.npmjs.com/package/funcunit)
- Test Runner: [Testee](https://www.npmjs.com/package/testee)
- Continuous Integration and Deployment: [Travis CI](https://travis-ci.org/)


__Hosting__

- Database and Server: [Heroku](https://www.heroku.com/)
- Static Content: [Firebase](https://www.firebase.com/)


__Documentation__

- Engine: [DocumentJS](http://documentjs.com/)

&nbsp;

### Folder organization

The [Bitcentive codebase](http://github.com/donejs/bitcentive) can be
thought of as two applications:

- A JavaScript client app in `/public`.
- A Restful services server in `/` and all other folders except `/public`.

First, lets checkout the server side parts:


```
├── package.json    - Server-side dependencies configuration
├── install.js      - Post install script, installs /public/package.json
├── migrate.js      - Runs the migrations
├── documentjs.json - Documentation configuration
├── Procfile        - Heroku configuration
├── .travis.yml     - Travis configuration
├── readme.md       - Installation instructions
├── config/         - Environment configuration
|   ├── default.json  - Dev mode configuration.
|
├── src/        
|   ├── index.js     - Main entry-point of application
|   ├── hooks/       - Feathers service method middleware
|   ├── middleware/  - Express middleware
|   ├── services/    - Feathers services
```

Now, lets checkout the contents of the `/public` folder:

```
├── package.json - Client configuration and dependencies

├── index.stache - Main entrypoint of application.
├── app.js       - Application ViewModel and routing rules
├── app.less     - Core stylesheet

├── build.js         - Client build script
├── development.html - Loads app in development without SSR
├── production.html  - Loads app in production without SSR

├── test.js      - Main entrypoint for loading all tests
├── test.html    - Runs all tests in the browser.

├── models/        - can-connect models
|   ├── contribution-month/ - ContributionMonth model and sub-types
|   |   ├── contribution-month.js
|   |   ├── monthly-client-project.js
|   |   ├── monthly-client-project-os-project-list.js
|   |   ├── monthly-contribution.js
|   |   ├── monthly-os-project.js

|   ├── feathers-client.js  - The feathers client connection
|   ├── mongo-algebra.js    - A set algebra useful to MongoDB.

|   ├── client-project.js
|   ├── contributor.js
|   ├── os-project.js
|   ├── session.js
|   ├── user.js

|   ├── test.js    - Tests for the model layer
|   ├── test.html  - Runs all model tests in the browser
|   ├── fixtures/  - Mocked server responses

├── components/
|   ├── main-nav/
|   ├── page-contributors/
|   ├── page-dashboard/
|   |   ├── os-projects/
|   |   ├── client-projects/
|   |   ├── contribution-month/
|   |   ├── contributions/
|   |   ├── contributors/
|   |   ├── payouts/
|   |   ├── select-contribution-month/
|   ├── page-home/
|   ├── page-users/
|   |   ├── users/
|   ├── ui/
|   |   ├── alerts/
|   |   ├── model-edit-property/
```


### Data Model and Service Layer

Bitcentive uses a document driven MongoDB database that supports the following
primary types:

__[OSProject]__ - An open source project like:

```
{
  "_id": "osProjectRandomId1",
  "name": "Feathers"
}
```

__[ClientProject]__ - A consulting project like:
```
{
  "_id": "clientProjectRandomId2",
  "name": "Lowe's"
}
```

__[Contributor]__ - A contributor to open source like:
```
{
  "_id": "contributorRandomId3",
  "active": true,
  "email": "kyle@bitovi.com",
  "name": "Kyle Gifford"
}
```

__[ContributionMonth]__ - A nested document containing all the information for that month's
  available open source projects, client projects, and contributions.  You'll
  notice that in the following example there are nested lists of OSProjects, ClientProjects,
  OSProjects for each ClientProject, and Contributions. These lists contain information
  specific to that month.  For example the number of billed `hours` might change month to
  month for a specific `ClientProject`.

How the client works with
this nested document structure is reviewed in the
[Document Data Structures section](#section=section_DocumentDataStructures).

```
{
  "_id": "contributionMonthRandomId4",
  "date": "2016-08-01T05:00:00.000Z",
  "startRange": 2,
  "endRange": 4,
  "monthlyOSProjects": [
    {
      "_id": "monthlyOSProjectRandomId5",
      "osProjectRef": "osProjectRandomId1",
      "significance": 80,
      "commissioned": true
    },
    {
      "_id": "monthlyOSProjectRandomId6",
      "osProjectRef": "osProjectRandomId2",
      "significance": 5,
      "commissioned": false
    }
  ],
  "monthlyClientProjects": [
    {
      "_id": "monthlyClientProjectRandomId7",
      "hours": 100,
      "clientProjectRef": "clientProjectRandomId2",
      "monthlyClientProjectsOSProjects": [
        "osProjectRandomId1",
        "osProjectRandomId2"
      ]
    },
    {
      "_id": "monthlyClientProjectRandomId8",
      "hours": 50,
      "clientProjectRef": "clientProjectRandomId3",
      "monthlyClientProjectsOSProjects": [
        "osProjectRandomId2"
      ]
    }
  ],
	"monthlyContributions": [
    {
      "_id": "monthlyContributionRandomId9",
      "points": 10,
      "description": "Fixed an issue with DELETE sending payload",
      "osProjectRef": "osProjectRandomId2",
      "contributorRef": "contributorRandomId3",
    }
  ]
}
```

#### Service Layer

The service layer is a WebSockets service layer created by [FeathersJS].

For each data type above, Feathers exposes a way to retrieve, create, update, and delete
records of that type through events emitted on the client to the server with the underlying
[socket.io](http://socket.io/) connection.  For example:

- `socket.emit("api/contributors::get", {...}, handler)` - Gets a contributor.
- `socket.emit("api/contributors::find", {...}, handler)` - Gets a list of contributors.
- `socket.emit("api/contributors::create", {...}, handler)` - Creates a contributor.
- `socket.emit("api/contributors::update", {...}, handler)` - Updates a contributor.
- `socket.emit("api/contributors::remove", {...}, handler)` - Deletes a contributor.

[FeathersJS] also sends events to the client when the types above have been created,
updated, or destroyed:

- `socket.on("api/contributors created", handler)` - A contributor has been created.
- `socket.on("api/contributors updated", handler)` - A contributor has been updated.
- `socket.on("api/contributors removed", handler)` - A contributor has been removed.



### Component Map

## Document Data Structures

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
