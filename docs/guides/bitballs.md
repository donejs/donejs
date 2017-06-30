@page bitballs Example: Bitballs
@parent DoneJS
@hide sidebar
@outline 2 ol
@description

In this guide, you'll learn how [Bitballs](http://bitballs.herokuapp.com) - a charity basketball tournament management application - works.
Specifically, this guide will walk through the implementation of the following behaviors or functionality:

 - Registration, login, user sessions, and access rights.
 - Handling relationships between model types.
 - Setup node services and server-side rendering on the same process.
 - How to turn off parts of the app that should not be server-side rendered.

The code for Bitballs can be found [on GitHub](http://github.com/donejs/bitballs).
To install and run it locally, follow its
[development setup instructions](https://github.com/donejs/bitballs#setup-environment).

Bitballs was written to help organize Bitovi's yearly charity basketball tournament
for the American Heart and Stroke Association.  Justin Meyer, one of Bitovi's founders,
and DoneJS core contributor had a stroke. Read about his experience and the purpose of
the tournament [here](http://blog.bitovi.com/bitovi-hoops-for-heart-with-the-american-stroke-association/).

The application allows __admins__, who manage the tournament, to:

Create an account (and verify their email address):

<img src="static/img/bitballs/create-user.png" srcset="static/img/bitballs/create-user.png 1x, static/img/bitballs/create-user-2x.png 2x">

Login:

<img src="static/img/bitballs/login.png" srcset="static/img/bitballs/login.png 1x, static/img/bitballs/login-2x.png 2x">

Create, edit, and delete players:

<img src="static/img/bitballs/create-player.png" srcset="static/img/bitballs/create-player.png 1x, static/img/bitballs/create-player-2x.png 2x">

Create, edit, and delete tournaments:

<img src="static/img/bitballs/create-tournament.png" srcset="static/img/bitballs/create-tournament.png 1x, static/img/bitballs/create-tournament-2x.png 2x">

Create teams of players for a tournament:

<img src="static/img/bitballs/create-team.png" srcset="static/img/bitballs/create-team.png 1x, static/img/bitballs/create-team-2x.png 2x">

Create and delete games for a tournament:

<img src="static/img/bitballs/new-game.png" srcset="static/img/bitballs/new-game.png 1x, static/img/bitballs/new-game-2x.png 2x">

Add and remove stats for a game while watching it on YouTube:

<img src="static/img/bitballs/add-stat.png" srcset="static/img/bitballs/add-stat.png 1x, static/img/bitballs/add-stat-2x.png 2x">

Visitors who are not admins are only able to
view the list of players, tournaments, and game details:

<img src="static/img/bitballs/public-view.png" srcset="static/img/bitballs/public-view.png 1x, static/img/bitballs/public-view-2x.png 2x">


@body




## High Level Architecture

Bitballs uses the following technology organized by
technology layers:


__Storage__

- Database: [Postgres](http://www.postgresql.org/)

> NOTE: DoneJS works perfectly fine with NOSQL approaches and other databases. We don't
> endorse any backend storage technology.  

__Server and Services__

- Language: JavaScript/[Node 5](https://nodejs.org/)
- Object Relational Mapper: [Bookshelf](http://bookshelfjs.org/)
- Migrations: [DBMigrate](http://umigrate.readthedocs.org/projects/db-migrate/en/v0.9.x/)
- Service Middleware: [Express](https://expressjs.com/)
- Server Side Rendering: [done-ssr's express middleware](https://www.npmjs.com/package/done-ssr-middleware)
- Session Management: [passport](http://passportjs.org/)

> NOTE: DoneJS works with any service technology.  Furthermore, Bitballs' server-side code was not created by server-side NodeJS experts.  There are likely many improvements that could be made.  Don't learn NodeJS/Express from us.  With respect to the server, our only goal with this example is to introduce service APIs that work well with DoneJS clients and give an example of how to create them.

__Client__

- Dependency Management: [StealJS](https://stealjs.com/) with mixed use of [CommonJS](https://stealjs.com/docs/syntax.CommonJS.html) and [ES6](https://stealjs.com/docs/syntax.es6.html).
- Model: [can-connect](https://canjs.com/doc/can-connect.html/)
- ViewModel: [can-define/map](http://v3.canjs.com/doc/can-define/map/map.html) and [can-define/list](http://v3.canjs.com/doc/can-define/list/list.html)
- View: [can.stache](https://canjs.com/docs/can.stache.html)
- Custom Elements: [can.Component](https://canjs.com/docs/can.Component.html)
- Routing: [can.route](https://canjs.com/docs/can.route.html)

__Testing__

- Assertion Library: [QUnit](https://qunitjs.com/)
- Ajax Fixtures: [can-fixture](https://www.npmjs.com/package/can-fixture)
- Functional Testing: [FuncUnit](https://www.npmjs.com/package/funcunit)
- Test Runner: [Testee](https://www.npmjs.com/package/testee)
- Continuous Integration and Deployment: [Travis CI](https://travis-ci.org/)


__Hosting__

- Database and Server: [Heroku](https://www.heroku.com/)
- Static Content: [Firebase](https://www.firebase.com/)


__Documentation__

- Engine: [DocumentJS](https://documentjs.com/)

.


### Folder organization

The [bitballs codebase](http://github.com/donejs/bitballs) can be
thought of as two applications:

- A JavaScript client app in `/public`.
- A Restful services server in `/` and all other folders except `/public`.

First, lets checkout the server side parts:


```
├── package.json    - Server-side dependencies configuration
├── install.js      - Post install script, installs /public/package.json
├── database.json   - Database connection configuration
├── documentjs.json - Documentation configuration
├── Procfile        - Heroku configuration
├── .travis.yml     - Travis configuration

├── index.js        - Main entrypoint of application

├── readme.md       - Installation instructions

├── migrations/     - Database transformation scripts
├── models/         - Bookshelf models
├── services/       - Service middleware definitions
```

Now, lets checkout the contents of the `/public` folder:

```
├── package.json - Client configuration and dependencies

├── service.js   - Server side rendering middleware

├── index.stache - Main entrypoint of application.
├── app.js       - Application ViewModel and routing rules
├── app.less     - Core stylesheet

├── build.js     - Client build script
├── dev.html     - Loads app in development without SSR
├── prod.html    - Loads app in production without SSR

├── test.js      - Main entrypoint for loading all tests
├── test.html    - Runs all tests in the browser.

├── models/        - can-connect models
|   ├── player.js
|   ├── session.js
|   ├── state.js
|   ├── team.js
|   ├── user.js
|   ├── youtube.js

|   ├── test.js    - Tests for the model layer
|   ├── test.html  - Runs all model tests in the browser
|   ├── fixtures/  - Mocked server responses

├── components/
|   ├── game/
|   |   ├── details/  - Game details page
|   ├── player/
|   |   ├── edit/     - Create or Edit a player widget
|   |   ├── list/     - Players list page
|   ├── navigation/   - The navigation and login/logout widget
|   ├── tournament/
|   |   ├── details/  - Tournament details page
|   |   ├── list/     - Tournaments list page
|   ├── user/
|   |   ├── details/  - Register a user or edit their password page
|   |   ├── list/     - Make admin users.
|   ├── 404.component - 404 response page.
```

### Data Model and Service layer

Bitballs has the following tables and therefore data types:

- [Tournament](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Ctournament.html) - A scheduled date of a basketball tournament.
- [Player](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Cplayer.html) - A person with an age, height, and weight.
- [Team](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Cteam.html) - A team of 4 Players for a Tournament.
- [Game](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Cgame.html) - A match between two Teams for a Tournament.
- [Stat](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Cstat.html) - A record of some activity for a Game and Player.
- [User](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Cuser.html) - Someone who can log into the application with an email and password.

The server also has a concept of a [Session](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Csession.html).  The Session
can be thought of as having a User.

<img class="img-responsive" src="static/img/bitballs/data-model.png">


The restful service layer provides the following urls
(each links to their corresponding docs):

- [`/services/tournaments`](http://donejs.github.io/bitballs/docs/services%7Ctournaments.html)
- [`/services/players`](http://donejs.github.io/bitballs/docs/services%7Cplayers.html)
- [`/services/teams`](http://donejs.github.io/bitballs/docs/services%7Cteams.html)
- [`/services/games`](http://donejs.github.io/bitballs/docs/services%7Cgames.html)
- [`/services/stats`](http://donejs.github.io/bitballs/docs/services%7Cstats.html)
- [`/services/users`](http://donejs.github.io/bitballs/docs/services%7Cusers.html)
- [`/services/session`](http://donejs.github.io/bitballs/docs/services%7Csession.html)

The database-backed services, like `/services/teams` follow a subset of
[Rest relational algebra](https://gist.github.com/justinbmeyer/3753564).

- To get a list of items, `GET /services/{plural_type}?...`
- To get a single item, `GET /services/{plural_type}/{id}`
- To create an item, `POST /services/{plural_type}s`
- To update an item, `PUT /services/{plural_type}/{id}`
- To destroy an item, `DELETE /services/{plural_type}/{id}`

This means that you can get all Teams like:

```
REQUEST:
  GET /services/teams
RESPONSE:
  {
    data: [
      {
        id: 5, color: "Orange", name: "Orange Crush",
        player1Id: 57, player2Id: 12, player3Id: 99, player4Id: 1,
        gameId: 3
      },
      ...
    ]
  }
```

Or get list of teams for a particular tournament like:

```
REQUEST:
  GET /services/teams?where[gameId]=7
RESPONSE:
  {
    data: [
      {
        id: 5, color: "Red", name: "Red Dragons",
        player1Id: 15, player2Id: 16, player3Id: 17, player4Id: 18,
        gameId: 7
      },
      ...
    ]
  }
```

But critically for handling data relationships, you can tell the
server to bring in related data like:

```
REQUEST:
  GET /services/teams?where[gameId]=7\
                      &withRelated[]=player1\
                      &withRelated[]=player2\
                      &withRelated[]=player3\
                      &withRelated[]=player4
RESPONSE:
  {
    data: [
      {
        id: 5, color: "Red", name: "Red Dragons",
        player1Id: 15,
        player1: {id: 15, name: "Justin M."}
        player2Id: 16,
        player2: {id: 16, name: "Matt P."}
        player3Id: 17,
        player3: {id: 17, name: "Lela P."}
        player4Id: 18,
        player4: {id: 18, name: "David L."}
        gameId: 7
      },
      ...
    ]
  }
```

Get a single Team like:

```
REQUEST:
  GET /services/teams/5

RESPONSE:
  {
    id: 5, color: "Red", name: "Red Dragons",
    player1Id: 15, player2Id: 16, player3Id: 17, player4Id: 18,
    gameId: 7
  }
```

Create a team like:

```
REQUEST:
  POST /services/teams
  {
    color: "Red", name: "Red Dragons",
    gameId: 7
  }

RESPONSE:
  {
    id: 5, color: "Red", name: "Red Dragons",
    gameId: 7
  }
```

Update a team like:

```
REQUEST:
  PUT /services/teams/5
  {
    color: "Red", name: "Red Dragons",
    player1Id: 15, player2Id: 16, player3Id: 17, player4Id: 18,
    gameId: 7
  }

RESPONSE:
  {
    id: 5, color: "Red", name: "Red Dragons",
    player1Id: 15, player2Id: 16, player3Id: 17, player4Id: 18,
    gameId: 7
  }
```

Destroy a team like:

```
REQUEST:
  DELETE /services/teams/5

RESPONSE:
  {}
```

The [`/services/session`](http://donejs.github.io/bitballs/docs/services%7Csession.html) api is singular because there can only be
one session available to a particular user. We'll discuss
this more in the [Users, Sessions, and Access section](#users-sessions-and-access)


### Component map

The following diagrams show which component is responsible for each part of the application:

<div class="row">
  <div class="col-sm-6">
    <a href="http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cnavigation.html">
    <img class="img-responsive" src="static/img/bitballs/map-navlogin.png" srcset="static/img/bitballs/map-navlogin.png 1x, static/img/bitballs/map-navlogin-2x.png 2x">
    </a>
  </div>
  <div class="col-sm-6">
    <a href="http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cnavigation.html">
    <img class="img-responsive" src="static/img/bitballs/map-nav.png" srcset="static/img/bitballs/map-nav.png 1x, static/img/bitballs/map-nav-2x.png 2x">
    </a>
  </div>
</div>
<div class="row">
  <div class="col-sm-6">
    <a href="http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Ctournament%7Clist.html">
        <img class="img-responsive" src="static/img/bitballs/map-tournamentlist.png" srcset="static/img/bitballs/map-tournamentlist.png 1x, static/img/bitballs/map-tournamentlist-2x.png 2x">
    </a>
  </div>
  <div class="col-sm-6">
    <a href="http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cplayer%7Clist.html">
    <img class="img-responsive" src="static/img/bitballs/map-playerlist.png" srcset="static/img/bitballs/map-playerlist.png 1x, static/img/bitballs/map-playerlist-2x.png 2x">
    </a>
  </div>
</div>
<div class="row">
  <div class="col-sm-6">
    <a href="http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Ctournament%7Cdetails.html">
    <img class="img-responsive" src="static/img/bitballs/map-tournamentdetails.png" srcset="static/img/bitballs/map-tournamentdetails.png 1x, static/img/bitballs/map-tournamentdetails-2x.png 2x">
    </a>
  </div>
  <div class="col-sm-6">
    <a href="http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cgame%7Cdetails.html">
        <img class="img-responsive" src="static/img/bitballs/map-gamedetails.png"  
        srcset="static/img/bitballs/map-gamedetails.png 1x, static/img/bitballs/map-gamedetails-2x.png 2x">
    </a>
  </div>
</div>
<div class="row">
  <div class="col-sm-6">
    <a href="http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cuser%7Cdetails.html">
    <img class="img-responsive" src="static/img/bitballs/map-userdetails.png" srcset="static/img/bitballs/map-userdetails.png 1x, static/img/bitballs/map-userdetails-2x.png 2x">
    </a>
  </div>
  <div class="col-sm-6">
    <a href="http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cuser%7Clist.html">
        <img class="img-responsive" src="static/img/bitballs/map-userlist.png" srcset="static/img/bitballs/map-userlist.png 1x, static/img/bitballs/map-userlist-2x.png 2x">
    </a>
  </div>
</div>

## Users, Sessions, and Access

This section details Bitballs' access rights system. Learn
how users are created, sessions are established, and access
rights are handled.

### Behavior

Bitballs has a very simple access rights system.  Only
admin users can manipulate tournament data.

<img src="static/img/bitballs/new-game.png" srcset="static/img/bitballs/new-game.png 1x, static/img/bitballs/new-game-2x.png 2x">

And only admin users can set another user as an admin user.

<img src="static/img/bitballs/admin-view.png">

Non-admin users can read data.  

<img src="static/img/bitballs/nonadmin-games.png" srcset="static/img/bitballs/nonadmin-games.png 1x, static/img/bitballs/nonadmin-games-2x.png 2x">

Non-admins can register themselves and verify their email address.

<img src="static/img/bitballs/register.png" srcset="static/img/bitballs/register.png 1x, static/img/bitballs/register-2x.png 2x">

The only exception is when there are no users.  In this situation,
the first created user will be automatically set as the admin user.

### Responsibilities

The following breaks down what parts of the app perform which parts
of managing users, sessions and access rights:

The [`/services/users`](http://donejs.github.io/bitballs/docs/services%7Cusers.html) service handles creating, reading, updating and deleting (CRUDing)
of users.

The [`/services/session`](http://donejs.github.io/bitballs/docs/services%7Csession.html) service handles establishing a cookie-based session
for a particular user. This will add a `req.user` property to all
server request objects when there is a logged in user.

All other services use `req.user.isAdmin` to determine if the current user has
access rights for the given service.

The [`<user-details>`](http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cuser%7Cdetails.html) component handles creating a
new user.

The [`<user-list>`](http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cuser%7Clist.html) component allows an admin user to set
other users as admin.

The [AppViewModel](http://donejs.github.io/bitballs/docs/bitballs%7Capp.html) has a `session` property that uses the [Session] model
to request and store the available
session. You can read the session's user and if they are an admin like:

```
appViewModel.user.isAdmin
```

The [`<bitballs-navigation>`](http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cnavigation.html) component allows someone to login and change
the `AppViewModel`'s session.

All other page-level components get passed the `AppViewModel`'s `isAdmin` property. They
use it to determine which functionality should be displayed.

### Creating a user

When a user navigates to `/register`, the [`<user-details>`](http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cuser%7Cdetails.html) component
creates a form that takes a user's email and password.  

```
<form ($submit)="saveUser(%event)" action="">
    <div class="form-group">
        <label for="user-email">
            Email
        </label>
        {{#is userStatus "verified"}}
            <div class="input-group has-success has-feedback">
                <span class="input-group-addon">verified!</span>
                <input
                    class="form-control"
                    id="user-email"
                    {{^if user.isNew}}disabled{{/if}}
                    {($value)}="user.email" />
            </div>
        {{else}}
            <input
                class="form-control"
                id="user-email"
                {{^if user.isNew}}disabled{{/if}}
                {($value)}="user.email" />
        {{/is}}
    </div>
    ...
</form>
```

When the form is submitted, an instance of the client `User` model is created and sent to the
[`/services/users`](http://donejs.github.io/bitballs/docs/services%7Cusers.html) service.

```js
saveUser: function(ev) {
    if(ev) {
        ev.preventDefault();
    }
    var self = this,
        promise = this.user.save().then(function(user) {
            ...
        });
    ...
},
```

The service creates a user and sends the user an
email to verify their email address.

```js
app.post('/services/users',
	function ( req, res, next ){
        // validates request ...
	},
	passport.authenticate( 'signup' ),
	function ( req, res ) {
		var user = req.user.toJSON();
		var hash = encodeURIComponent( user.verificationHash );
		var subject = "Complete your registration at bitballs";
		var htmlbody = // create email body ...

		nodeMail( user.email,
            'bitballs@bitovi.com',
            subject,
            htmlbody, function ( err, info ) {
			...
			res.send( omitSensitive( user ) );
		});
	}
);
```

### Getting, creating, or destroying a session

The following details how Bitballs:

- Knows if a user is logged in.
- Logs in a user.
- Logs out a user.

#### Getting the session

When the client application starts, the app checks if
it has a session.  

This is done by defining a `session` property that will use the Session
model to retrieve the current session.  If there is a session, it will
be stored on the AppViewModel.

```js
session: {
  serialize: false,
  value: function() {
    Session.get({}).then((session) => {
      this.session = session;
    });
  }
},
```

The [Session](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Csession.html) model makes a request to `GET /services/session`. By default,
AJAX requests are sent with the user's cookies.  

Passport is used and configured to add a `req.user` property to every
request object when a
user logs in.  That user object is returned, minus any private data, as associated data on the session:

```js
app.get('/services/session', function(req, res) {
	if (req.user) {
		res.send({user: _.omit(req.user.toJSON(), "password")});
	} else {
		res.status(404).send(JSON.stringify({
			message : "No session"
		}));
	}
});
```

This means that once a user logs in, `GET /services/session` responds with
an object like:

```
{
  user: {email: "justin@bitovi.com", isAdmin: true}
}
```

We like to keep session data distinct from User data.  In a more complex application,
additional session information could be returned that does not belong on the
user. For example:

```
{
  createdAt: 1456512713012,
  expiresAt: 14565123013012,
  user: {email: "justin@bitovi.com", isAdmin: true},
}
```

Once the response data comes back, a `session` object with its associated `session.user`
object will be available on the AppViewModel.

The [`Session` client model](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Csession.html) makes sure that `user` is converted into a [User model](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Cuser.html)
and also provides an `isAdmin` method that returns if admin functionality should
be available:

```js
var Session = DefineMap.extend({
	define: {
		user: {
			Type: User
		}
	},
	isAdmin: function(){
		return this.user && this.user.isAdmin;
	}
});
```

The session, its user, or the result of `isAdmin` is then passed to
sub components depending on their needs:

```html
<tournament-details {is-admin}='session.isAdmin'/>
```

Finally, those components use that information to control what is
shown on the page:

```
{{#if isAdmin}}
<h4>New Game</h4>
<form ($submit)="createGame(%event)">...</form>
{{/if}}
```

In more complex apps, the `user` object might include an [Access Control List](https://en.wikipedia.org/wiki/Access_control_list)
which might include methods to check access rights:

```
{{#if user.acl.can("create","game") }}
<h4>New Game</h4>
<form ($submit)="createGame(%event)">...</form>
{{/if}}
```

#### Creating a session

Creating a session is done with the [<bitballs-navigation>](http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cnavigation.html) component. It builds a
login form that takes an email and password:

```html
<form ($submit)="createSession(%event)" action="">
    <input  
        placeholder="email"
    	{($value)}="loginSession.user.email"/>

    <input  
        placeholder="password"
    	type="password"
    	{($value)}="loginSession.user.password"/>

	<button type="submit">Login</button>
</form>
```


When a user submits the login form its
ViewModel will save an instance of the
Session model. When the save is successful, it will update the AppViewModel with
the new session instance.

```js
createSession: function(ev){
    if(ev) {
        ev.preventDefault();
    }
    var self = this;
    this.loginSession.save().then(function(session){
        // create placeholder session for next login.
        self.loginSession = new Session({user: new User()});
        // update AppViewModel with new session
        self.app.session = session;

    });
},
```

Saving a session calls `POST /services/session` to create a session server side. The service should operate on similar data as `GET /services/session`, so it's passed data like:

```ks
{
  user: {email: "justin@bitovi.com", password: "pass1234"}
}
```

The application looks up the user, makes sure the encrypted passwords
match, and then calls `req.logIn()` to set `req.user` and then
responds with the Session data.

```js
new User({
	'email': email
}).fetch().then(function(user) {
	if(user) {
		// User exists but wrong password, log the error
		if (!isValidPassword(user, password)) {
			res.status(401).json({message: "wrong password"});
		} else {
			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}
				return res.json({
                    user: _.omit(req.user.toJSON(), "password")
                });
			});
		}
	} else {
		return res.status(404).json({message: "wrong username"});
	}
})
```


#### Destroy the session

The [`<bitballs-navigation>`](http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cnavigation.html) component's [template](https://github.com/donejs/bitballs/blob/master/public/components/navigation/navigation.stache) as a link that
calls `logout()` on its ViewModel:

```html
<a href="javascript://" ($click)="logout()">Logout</a>
```

`logout` calls destroy on the session and then removes the session from the AppViewModel:

```js
logout: function(){
  this.session.destroy().then(()=>{
    this.session = null;
  });
}
```

Destroying a session calls `DELETE /services/session` to destroy a session server side. No data needs to be passed. The server simply calls passport's `logout()` and responds
with an empty JSON object.

```js
app['delete']("/services/session", function(req, res){
	req.logout();
	res.json({});
});
```

### Server side rendering

DoneJS is able to automatically server-side render pages that use
cookie based sessions.  For example, if an admin logs into Bitballs
and refreshes the [tournament details](https://bitballs.herokuapp.com/tournaments/2) page, they will be
served a page with all of the additional forms an admin user can see.  
Furthermore, they will be served a "Logout" link instead of "Login".

This works because when a browser navigates to `tournaments/5`,
the cookie is passed to DoneJS's server-side rendering.  It adds
this cookie to the virtual document used to render that page
and it makes sure any AJAX requests the client makes
also includes that cookie.

This means that when `Session.get()` is called by the AppViewModel
to get the session, the right cookie information is passes to the `GET /services/session`
service and a session is established in the client.

## Data Relationships

In this section, we'll learn about how to manage related data in a
DoneJS application. We'll describe our approach that balances performance and
maintainability concerns that are vital for making high performance apps that
can quickly respond to changes in design.

### Performance vs Maintainability

Bitballs [data model](#data-model-and-service-layer) has many relationships among
its data types.  For example, Tournaments have many Games and have many Teams.  Games
have Teams and Stats.  And Teams have Players.

The __tournament details__ page not only needs to load a tournament, it needs to load
that tournament's games, teams, and all players.

The __game details__ page needs to load the game, all of the game's stats, teams, and the teams
players.

Bitballs needs to be able to load these pages quickly.  Using a very simplistic
RESTful service layer, the client might have to do the following to load a __game details__
page:

```
GET /services/games/5
 -> {id: 5, homeTeamId: 16, awayTeamId: 17, videoUrl: "X1Ha9d8fE", ...}

GET /services/stats?gameId=5
 -> {data: [{id: 99, gameId: 5, playerId: 61, type: "orb"}, ...]}

GET /services/teams/16
 -> {id: 16, player1Id: 61, player2Id: 62, player3Id: 63, player4Id: 64,...}

GET /services/teams/17
 -> {id: 17, player1Id: 71, player2Id: 72, player3Id: 73, player4Id: 74,...}

GET /services/players/61 -> {id: 61, name: "Justin M", ...}
GET /services/players/62 -> {id: 61, name: "Matt P", ...}
GET /services/players/63 -> {id: 61, name: "David L", ...}
GET /services/players/64 -> {id: 61, name: "Julia P", ...}

GET /services/players/71 -> {id: 61, name: "Paula P", ...}
GET /services/players/72 -> {id: 61, name: "Chris G", ...}
GET /services/players/73 -> {id: 61, name: "Jan J", ...}
GET /services/players/74 -> {id: 61, name: "James A", ...}


```

That's 12 requests! But that's not the worst part.  The worst part is that
at least 3 _serial_ batches of requests must happen.  We can't load
players until we have teams.  We can't load teams until we
have the game.

Instead, we'd want to load a game and get back its data with its
nested teams and players and stats like:

```
GET /services/games/5
 -> {
 id: 5,
 homeTeamId: 16,
 homeTeam: {
   id: 16,
   player1Id: 61,
   player1: {id: 61, name: "Justin M", ...},
   player2Id: 62,
   player2: {id: 61, name: "Matt P", ...}
   player3Id: 63,
   player3: {id: 61, name: "David L", ...}
   player4Id: 64,
   player4: {id: 61, name: "Julia P", ...}
   ...
 },
 awayTeamId: 17,
 awayTeam: {
   id: 17,
   player1Id: 71,
   player1: {id: 61, name: "Paula P", ...}
   player2Id: 72,
   player2: {id: 61, name: "Chris G", ...}
   player3Id: 73,
   player3: {id: 61, name: "Jan J", ...}
   player4Id: 74,
   player4: {id: 61, name: "James A", ...}
   ...
 },
 stats: [{id: 99, gameId: 5, playerId: 61, type: "orb"}, ...],
 videoUrl: "X1Ha9d8fE",
 ...
}
```

> Note: Including stats is optional because stats can be requested in parallel
to the game and its teams and players.  In some apps, it might be a better
user experience to make two requests, allowing the client to show
something when it has some data instead of all of it.

What you __don't__ want to do, is make `/services/games/{id}` always
return this nested data because you don't know the future of the __game details__
page or all of the uses of the `/services/games/{id}` service.  For example,
it's possible someone might want to simply know the final score of a game. In this
case, the teams and players would not be necessary.

So how do you reconcile performance needs with the certainty that application
requirements and the uses of your services will change?

The answer is making expressive Restful services and client Models and ViewModels
that are able to work with them.  

### Expressive services

Expressive services allow the client to specify some of the raw behavior that
normally goes into database requests while being adaptive to changes in the database.

They are normally built by mapping parts of the query string to clauses in a
backend [Object Relational Mapper](https://en.wikipedia.org/wiki/Object-relational_mapping) (ORM).

For instance, the __game details__ page requests a game with its
related fields like:

```
Game.get({
	id: this.gameId,
	withRelated: ["stats",
		"homeTeam.player1",
		"homeTeam.player2",
		"homeTeam.player3",
		"homeTeam.player4",
		"awayTeam.player1",
		"awayTeam.player2",
		"awayTeam.player3",
		"awayTeam.player4"
	]
});
```

This results in an AJAX request like:

```
GET /services/games/5?\
  withRelated[]=stats&\
  withRelated[]=homeTeam.player1&\
  withRelated[]=homeTeam.player2&\
  withRelated[]=homeTeam.player3&\
  withRelated[]=homeTeam.player4&\
  withRelated[]=awayTeam.player1&\
  withRelated[]=awayTeam.player2&\
  withRelated[]=awayTeam.player3&\
  withRelated[]=awayTeam.player4
```

`withRelated` allows the client to control the the Database's `JOIN`
clause.  

Instead of processing the querystring ourselves and build the corresponding
Database request, most ORMs make it easy to do the expected thing.

Bitballs uses [Bookshelf](http://bookshelfjs.org/) as its ORM.  It allows us
to define relationships between a `Game` and other server-side models:

```
var Game = bookshelf.Model.extend({
	tableName: 'games',
	stats: function(){
		return this.hasMany(Stat,"gameId");
	},
	homeTeam: function(){
		return this.belongsTo(Team,"homeTeamId");
	},
	awayTeam: function(){
		return this.belongsTo(Team,"awayTeamId");
	}
});
```

It does a similar thing for `Team`:

```
var Team = bookshelf.Model.extend({
	tableName: 'teams',
	player1: function(){
		return this.belongsTo(Player,"player1Id");
	},
	player2: function(){
		return this.belongsTo(Player,"player2Id");
	},
	player3: function(){
		return this.belongsTo(Player,"player3Id");
	},
	player4: function(){
		return this.belongsTo(Player,"player4Id");
	}
});
```

Once these server Models are in place, it is extremely easy
to make a service that can dynamically include related data:

```
app.get('/services/games/:id', function(req, res){
	new Game({id: req.params.id}).fetch(req.query).then(function(game){
		res.send(game.toJSON());
	});
});
```

This setup also lets us be very adaptive to changes in the
database. For instance, if a game suddenly has
comments, we could make the following work:

```
Game.get({
	id: this.gameId,
	withRelated: ["comments"]
});
```

By creating a `Comment` model and changing `Game` to
look like:

```
var Game = bookshelf.Model.extend({
	tableName: 'games',
	comments: function(){
		return this.hasMany(Comment,"commentId");
	},
	stats: function(){
		return this.hasMany(Stat,"gameId");
	},
	homeTeam: function(){
		return this.belongsTo(Team,"homeTeamId");
	},
	awayTeam: function(){
		return this.belongsTo(Team,"awayTeamId");
	}
});
```

The goal should be changing your service code as little as possible. Instead,
you should be changing your ORMs and the service code adapts to them.  In
Bitballs' case this means we shouldn't be changing what's in `/services`,
instead we should be changing what's in `/models` as the database changes.

Related data is not the only behavior that your expressive
service layer should provide:

 - filter (`WHERE`)
 - pagination (`OFFSET` and `LIMIT`)
 - sorting (`SORTBY`)
 - which properties to include or exclude

For example, I can get all of team 5's games like:

```
GET /services/games?where[teamId]=5
```

This happens for free because we pass the querystrng directly to bookshelf:

```
app.get('/services/games', function(req, res){
	new Games().query(req.query).fetch().then(function(games){
		res.send({data: games.toJSON()});
	});
});
```

Most server technologies have an ORM that can make this process
straightforward.  It's generally best to use a service API that
closely matches the API of your ORM.

### Models and ViewModels

Once you've settled on an expressive service API, you need
to make Models that connect to it and handle associated data. And if you want
any of the advanced behavior of [can-connect](https://canjs.com/doc/can-connect.html), you have
to create a relational algebra that understands the service API.

#### Connecting to a service

Bitballs' client Models are [can-connect supermodels](https://canjs.com/doc/can-connect.html/doc/can-connect%7Ccan%7Csuper-map.html).  So a type and list type is defined:

```
var Game = DefineMap.extend({
  ...
});

Game.List = DefineList.extend({"#": Game},{});
```

And they are connected to a url:

```
var gameConnection = superMap({
  Map: Game,
  List: Game.List,
  url: "/services/games",
  name: "game",
  algebra: Game.algebra
});
```

#### Relational Algebra

To match the query parameters our service and eventually Bookshelf
expects, we need to define a custom set algebra. For `Game`, it looks like this:

```js
Game.algebra = new set.Algebra(
	new set.Translate("where","where"),
	set.comparators.sort('sortBy')
);
```

#### Defining related properties

Because Game data can come back with a `homeTeam`,
`awayTeam` and `stats` property, we make sure those
are created as the right type:

```
var Game = DefineMap.extend({
	homeTeam: {
		Type: Team
	},
	awayTeam: {
		Type: Team
	},
	stats: {
		Type: Stat.List,
		set: function(newVal){
			newVal.__listSet = {where: {gameId: this.id}};
			return newVal;
		}
	},
  ...
});
```

Notice that `stats.set` is setting the [__listSet](https://canjs.com/doc/can-connect.html/doc/connect.base.listSetProp.html) property of the stats.  This is necessary for [can-connect's real-time](https://canjs.com/doc/can-connect.html/doc/can-connect%7Creal-time.html) behavior. When stats are created for this game, they will automatically appear in this list.

#### Defining computed properties

`Game` also has `teams` and `players` computed properties that
derive their value from related fields:

```js
var Game = DefineMap.extend({
  ...
  get teams() {
    var teams = [],
      home = this.homeTeam,
      away = this.awayTeam;

    if (home) {
      teams.push(home);
    }
    if (away) {
      teams.push(away);
    }
    return new Team.List(teams);
  },
  get players() {
    var players = [];
    this.teams.forEach(function(team) {
      [].push.apply(players, can.makeArray(team.players));
    });
    return new Player.List(players);
  }
});
```

In `players`, `team.players` is actually making use of a similar computed
[`players` property](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Cteam.html)  in the Team client model.

#### Defining intermediate computed properties to avoid recomputing.

Sometimes ViewModels mash up Model data.  For example,
the `<tournament-details>` component makes four requests in parallel:

```
Tournament.get({id: this.tournamentId});
Game.getList({tournamentId: this.tournamentId});
Team.getList({ tournamentId: this.tournamentId });
Player.getList({});
```

This gets a tournament, the games for a tournament, the
teams for a tournament, and all the players. All the players
are needed to allow the admin to pick teams. This means
it would be wasteful to use `withRelated: ["player1","player2",...]` on the
Team request because all players are already loading.

But this makes it tricky to list a team's players because
all we have are player ids on each team:

<img class="img-responsive" src="static/img/bitballs/team-list.png" srcset="static/img/bitballs/team-list.png 1x, static/img/bitballs/team-list-2x.png 2x">

A naive solution would be to make a `getById` method on `Player.List` like:

```
Player.List = DefineList.extend({"#": Player},{
  getById: function(id){
    return this.filter(function(player){
      return team.id === id;
    })[0];
  }
});
```

And then use that in the template to look up the player:

```
{{#each teams}}
    ...
    <td>{{#../players.getById(player1Id)}}{{name}}{{/}}</td>
    <td>{{#../players.getById(player2Id)}}{{name}}{{/}}</td>
    <td>{{#../players.getById(player3Id)}}{{name}}{{/}}</td>
    <td>{{#../players.getById(player4Id)}}{{name}}{{/}}</td>
{{/each}}
```

> NOTE: The `../` is needed to use the [tournaments/details](http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Ctournament%7Cdetails.ViewModel.html)'s `players` property instead of the [players property on the client Game model](http://donejs.github.io/bitballs/docs/bitballs%7Cmodels%7Cgame.properties.players.html).

The problem with this is that each `.getById` call is linear search.  Instead,
we can keep a mapping of player ids to players like:

```
idMap: {
    type: "any",
    get: function(){

        var map = {};

        this.each(function(player){
            map[player.id] = player;
        });

        return map;
    }
},
```

And make a `getById` use `idMap` like:

```
getById: function(id){
	return this.playerIdMap[id];
},
```

Now when `.getById` is used in the template `playerIdMap` will only ever
be calculated once.


## SSR and node services

In this section, we'll learn about how to setup DoneJS's server-side rendering in the same process
as other NodeJS services. We'll also detail how 404s and other HTTP response codes can be communicated
from your client app to DoneJS's server-side rendering.

> NOTE: DoneJS works with any service technology, for example Ruby on Rails, PHP,
Java, etc.  In applications where services are built without NodeJS,
server-side rendering is run as a separate NodeJS process.  However, if your application's services
are written in NodeJS, you can host server-side rendering in the same process as the rest of your
NodeJS application.  This is the only, relatively minor, advantage of writing backend services in NodeJS.

### Setup

Bitballs is written using [Express middleware](https://expressjs.com/en/guide/using-middleware.html).
With express you order middleware functions to handle different requests. Bitballs sets up its middleware in [/index.js](https://github.com/donejs/bitballs/blob/master/index.js). The middleware is setup in the
following order:

1. Static assets in the `/public` folder.
2. Services in the `/services` folder.
3. Server-side rendering in `public/service.js`

In general, server-side should be last in the line of middleware handlers.  Static assets
and services should be the first to respond to a given URL.

[`public/service.js`](https://github.com/donejs/bitballs/blob/master/public/service.js) uses
[done-ssr-middleware](https://github.com/donejs/done-ssr-middleware) to export a middleware handler like:

```js
var ssr = require('done-ssr-middleware');

module.exports = ssr({
  config: __dirname + "/package.json!npm",
  main: "bitballs/index.stache!done-autorender",
  liveReload: true
});
```

This passes what is needed for StealJS to load the client app to `ssr`.  `ssr` uses
StealJS to load the app, and returns an express handler that renders the client app.
That express handler is assigned to the `"/"` route in `index.js`:

```js
app.use( "/", require('./public/service') );
```

### 404s

In general, there are two situations where server-side rendering should respond with a 404
status code:

- When a user navigates to a url not matched by routing like `/total-mistake`.
- When a user navigates to a url for an item that doesn't exist like: `/tournaments/999`.

[done-ssr-middleware](https://github.com/donejs/done-ssr-middleware) uses the `statusCode` property
on the [AppViewModel](http://donejs.github.io/bitballs/docs/bitballs%7Capp.html) as the status of the http response.

For Bitballs, we implemented `statusCode` as a [define getter](https://canjs.com/docs/can.Map.prototype.define.get.html) as follows:

```
statusCode: {
    get: function(lastSet, resolve){
        var pageConfig = this.pageComponentConfig;

        if(pageConfig.statusCode) {
            return pageConfig.statusCode;
        }

        var pagePromise = this.pagePromise;
        if(pagePromise){
            pagePromise.then(function(){
                resolve(200);
            }, function(){
                resolve(404);
            });
        }else{
            return 200;
        }
    }
}
```

`statusCode` derives its value from two places that reflect the two common `404`
situations.

#### 404 when URL doesn't match a routing rule

`statusCode` first checks if the `pageComponentConfig` is specifying a specific `statusCode`
to be given.  `pageComponentConfig` only specifies a `statusCode` when its state
doesn't match a valid route:

```
get pageComponentConfig() {
    var page = this.page;
    if(this.gameId) {
        return {...};
    } else if(this.tournamentId) {
        return {...};
    } else if(page === "tournaments") {
        return {...};
    } else if(page === "users") {
        return {...};
    } else if(page === "register" || page === "account") {
        return {...};
    } else if(page === "players"){
        return {...};
    } else {

        return {
            title: "Page Not Found",
            componentName: "four-0-four",
            attributes: "",
            moduleName: "404.component!",
            statusCode: 404
        };
    }
},
```

When the state doesn't match a valid route, users will see the contents of the
`404.component`.

With this setup, we could also check the session and include `401 Unauthorized`
status codes for pages that are only visible to an authenticated user.

#### 404 when an item doesn't exist.

Next, `statusCode` checks the `pagePromise` property.  If the `pagePromise` resolves
successfully, a `200` status code is returned.  If the `pagePromise` is rejected,
a `404` status code is returned.

`pagePromise` is a promise that is passed by a child component up to the
`AppViewModel`.  Notice how [<game-details>](http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cgame%7Cdetails.html) passes its `gamePromise`
as the `pagePromise` like `{^game-promise}='./pagePromise'`:


```js
get pageComponentConfig() {
    var page = this.page;
    if(this.gameId) {
        return {
            title: "Game",
            componentName: "game-details",
            attributes: "{^game-promise}='./pagePromise' {game-id}='./gameId' {session}='./session'",
            moduleName: "game/details/"
        };

    } else if(this.tournamentId) {
        return {
            title: "Tournament",
            componentName: "tournament-details",
            attributes: "{^tournament-promise}='./pagePromise' {tournament-id}='./tournamentId' {is-admin}='./isAdmin'",
            moduleName: "tournament/details/"
        };

    } else if(page === "tournaments") {
        return {...};
    } else if(page === "users") {
        return {...};
    } else if(page === "register" || page === "account") {
        return {...};
    } else if(page === "players"){
        return {...};
    } else {
        return {...};
    }
},
```

[<game-details>](http://donejs.github.io/bitballs/docs/bitballs%7Ccomponents%7Cgame%7Cdetails.html)'s `gamePromise` property is used to load the game's data:

```js
get gamePromise() {
    return Game.get({
        id: this.gameId,
        withRelated: [...]
    });
}
```

If there is no game at `gameId`, the promise will be rejected and `statusCode` will be
set to `404`.


## Turn off SSR

In this section, we'll learn about how prevent code from running during server-side rendering.

<div class='here-to-turn-off-highlighting'>

While DoneJS's virtual DOM approximates a real DOM and browser, there is much that it
cannot do such as provide element dimension information.

</div>

Typically, this doesn't affect the code you write because server-side rendering only runs code involved
in the initial render of a page.

However, in Bitballs case, the [game details](https://bitballs.herokuapp.com/games/9) page
has an embedded YouTube player.  The YouTube API code needed to load
a player will not work in DoneJS's default server-side environment.

To detect if your code is running in `NodeJS` and therefore being server-side rendered,
you can use [steal-platform](https://github.com/stealjs/platform) like:

```js
var platform = require("steal-platform" );
if (platform.isNode ) {
    // do one thing
} else {
    // do something else
}
```

To prevent loading YouTube's API in node, we reject the promise
that would normally resolve to YouTube's API as follows:

```js
var platform = require("steal-platform" );

var promise;

module.exports = function(){
	if(promise) {
		return promise;
	} else {
		return promise = new Promise(function(resolve, reject){
			if ( platform.isNode ) {
				reject({});
				return;
			}
			window.onYouTubeIframeAPIReady = function(){
				resolve(YT);
			};
			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			document.head.appendChild(tag);
		});

	}
};
```

> NOTE: If you plan on supporting NW.js, know that `platform.isNode`
will also be true.
