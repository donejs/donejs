@page bitballs Bitballs App
@parent DoneJS
@hide sidebar
@outline 2 ol
@description

__NOTE: This guide and application are a work in progress. We plan on completing it by the
end of March 2016.  We are publishing the guide early because we think it will still be
a useful learning tool.__

In this guide, you'll learn how [Bitballs](http://bitballs.herokuapp.com) - a charity basketball tournament management application - works.
Specifically, this guide will walk through the implementation of the following behaviors or functionality:

 - Registration, login, user sessions, and access rights.
 - Handling relationships between model types.
 - Setup node services and server-side rendering on the same process.
 - How to turn off parts of the app that should not be server-side rendered.

The code for Bitballs can be found [on github](http://github.com/donejs/bitballs).
To install and run it locally, follow its
[development setup instructions](https://github.com/donejs/bitballs#development-setup).

Bitballs was written to help organize Bitovi's yearly charity basketball tournement
for the American Heart and Stroke Association.  Justin Meyer, one of Bitovi's founders,
and DoneJS core contributor had a stoke. Read about his experience and the purpose of
the tournament [here](http://blog.bitovi.com/bitovi-hoops-for-heart-with-the-american-stroke-association/).

The application allows __admins__, who manage the tournament, to:

Create an account (and verify their email address):

<img src="/static/img/bitballs/functionality-1_create_account.png"/>

Login:

<img src="/static/img/bitballs/functionality-2_login.png"/>

Create, edit, and delete players:

<img src="/static/img/bitballs/functionality-3_players.png"/>

Create, edit, and delete tournaments:

<img src="/static/img/bitballs/functionality-4_tournaments.png"/>

Create teams of players for a tournament:

_image of creating a team_

Create and delete games for a tournament:

_image of creating a game_

Add and remove stats for a game while watching it on youtube:

_image of adding a stat_

Visitors who are not logged in admins are currently only able to
view the list of players, tournaments, and game details:

_image of game details_


@body




## High Level Architecture

Bitballs uses the following technology organized by
technology layers:


__Storage__

- Database: [Postgres](http://www.postgresql.org/)

__Server and Services__

- Language: JavaScript/[Node 5](https://nodejs.org/)
- Object Relational Model: [Bookshelf](http://bookshelfjs.org/)
- Migrations: [DBMigrate](http://umigrate.readthedocs.org/projects/db-migrate/en/v0.9.x/)
- Service Middleware: [Express](http://expressjs.com/)
- Server Side Rendering: [done-ssr's express middleware](https://www.npmjs.com/package/done-ssr-middleware)
- Session Management: [passport](http://passportjs.org/)

__Client__

- Dependency Management: [StealJS](http://stealjs.com/) with mixed use of [CommonJS](http://stealjs.com/docs/syntax.CommonJS.html) and [ES6](http://stealjs.com/docs/syntax.es6.html).
- Model: [can-connect](https://connect.canjs.com/)
- ViewModel: [can.Map](https://canjs.com/docs/can.Map.html) and [can.List](https://canjs.com/docs/can.List.html)
- View: [can.stache](https://canjs.com/docs/can.stache.html)
- Custom Elements: [can.Component](https://canjs.com/docs/can.Component.html)
- Routing: [can.route](https://canjs.com/docs/can.route.html)

__Testing__

- Assertion Library: [QUnit](https://qunitjs.com/)
- Ajax Fixtures: [can-fixture](https://www.npmjs.com/package/can-fixture)
- Functional Testing: [FuncUnit](https://www.npmjs.com/package/funcunit)
- Test Runner: [Testee](https://www.npmjs.com/package/testee)
- Continuous Integation and Deployment: [Travis CI](https://travis-ci.org/)


__Hosting__

- Database and Server: [Heroku](https://www.heroku.com/)
- Static Content: [Firebase](https://www.firebase.com/)


__Documentation__

- Engine: [DocumentJS](http://documentjs.com/)

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
|   |   ├── register/ - Register a user or edit their password page
```

### Data Model and Service layer

Bitballs has the following tables and therefore data types:

- Tournament - A scheduled date of a basketball tournament.
- Player - A person with an age, height, and weight.
- Team - A team of 4 Players for a Tournament.
- Game - A match between two Teams for a Tournament.
- Stat - A record of some activity for a Game and Player.
- User - Someone who can log into the application with an email and password.

The server also has a concept of a Session.  The Session
can be thought of as having a User.

_Picture of data model_.


The restful service layer provides the following urls
(each links to their corresponding docs):

- [`/services/tournaments`]
- `/services/players`
- `/services/teams`
- `/services/games`
- `/services/stats`
- `/services/users`
- `/services/session`

The database-backed services, like `/services/teams` follow a subset of
[Rest relational algebra].

- To get a list of items, `GET /services/{plural_type}?...`
- To get a single item, `GET /services/{plural_type}/{id}`
- To create an item, `POST /services/{plural_type}s`
- To update an item, `PUT /services/{plural_type}/{id}`
- To destroy an item, `DESTROY /services/{plural_type}/{id}`

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
  GET /services/teams?gameId=7
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
  GET /services/teams?gameId=7\
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



The `/services/session` is singular because there can only be
one session available to a particular user. We'll discuss
this more in the [Users, Sessions, and Access section](#section=section_Users_Sessions_andAccess)



### Component map

- Visually highlight each custom element on each page.
- Detail its responsibility. Link to its docs with embedded
  demo page.

## Users, Sessions, and Access

This section details Bitballs' access rights system. Learn
how users are created, sessions are established, and access
rights are handled.

### Behavior

Bitballs has a very simple access rights system.  Only
admin users can manipulate tournament data. And only admin users
can set another user as an admin user.

_PIC:admin view of game details_

Non-admin users can read data.  

_PIC:non-admin view of game details_

Non-admins only create new users by registering
and verify their email address.

_PIC:register page_

The only exception is when there are no users.  In this situation,
the first created user will be automatically set as the admin user.

### Responsibilities

The following breaks down what parts of the app perform which parts
of managing users, sessions and access rights:

The `/services/users` service handles creating, reading, updating and deleting (CRUDing)
of users.

The `/services/session` service handles establishing a cookie-based session
for a particular user. This will add a `req.user` property to all
server request objects when there is a logged in user.

All other services use `req.user.isAdmin` to determine if the current user has
access rights for the given service.

The `<user-register>` component handles creating a
new user.

The `<user-list>` component allows an admin user to set
other users as admin.

The [AppViewModel] has a `session` property that uses the [Session] model
to request and store the available
session. You can read the session's user and if they are an admin like:

```
appViewModel.attr('user').attr('isAdmin')
```

The `<bitballs-navigation>` component allows someone to login and change
the `AppViewModel`'s session.

All other page-level components get passed the `AppViewModel`'s `session`. They
use it to determine which functionality should be displayed.

### Creating a user

When a user navigates to `/users/regsiter`, the [`<users-register>`] component
creates a form that takes a user's email and password.  When the [form is
submitted], an instance of the client `User` model is created and sent to the
[/services/users] service. This creates a user and sends them an
email to verify their email address.

### Getting, creating, or destroying a session

#### Getting the session

When the client application starts, the app should immediately check if
it has a session.  

This is done by defining a `session` property that will use the [Session]
model to retrieve the current session.  If there is a session, it will
be stored on the AppViewModel.

```
session: {
  serialize: false,
  value: function() {
    Session.get({}).then((session) => {
      this.attr("session", session);
    });
  }
},
```

The [Session] model makes a request to `GET /services/session`. By default,
AJAX requests are sent with the user's cookies.  

Passport is used and configured to add a `req.user` property to every
request object when a
user logs in.  That user object is returned as assocated data on the session:

```
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
  user: {email: "justin@bitovi.com"}
}
```

We like to keep session data distinct from User data.  In a more complex application,
additional session information could be returned that does not belong on the
user. For example:

```
{
  createdAt: 1456512713012,
  expiresAt: 14565123013012,
  user: {email: "justin@bitovi.com"},
}
```

Once the reponse data comes back, a `session` object with its associated `session.user`
object will be available on the AppViewModel.

The [`Session` client model] makes sure that `user` is converted into a [User model]
and also provides an `isAdmin` method that returns if admin functionality should
be available:

```
var Session = Map.extend({
	define: {
		user: {
			Type: User
		}
	},
	isAdmin: function(){
		return this.attr("user") && this.attr("user").attr("isAdmin");
	}
});
```

The session, its user, or the result of `isAdmin` is then [passed to
sub components] depending on their needs:

```
tournament-details {editable}='session.isAdmin'
```

Finally, those components use that information to control what is
shown on the page:

```
{{#if editable}}
<h4>New Game</h4>
<form ($submit)="createGame(%event)">...</form>
{{/if}}
```

In more complex apps, the `user` object might include an [Access Contol List]
which might include methods to check access rights:

```
{{#if user.acl.can("create","game") }}
<h4>New Game</h4>
<form ($submit)="createGame(%event)">...</form>
{{/if}}
```

#### Creating a session

Creating a session is done with the [<bitballs-navigation>] component. It builds a
[login form](LINK_TO:navigation.stache's form) that takes an email and password:

```
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
[ViewModel](LINK_TO:createSession) will save an instance of the
Session model. When the save is successful, it will update the AppViewModel with
the new session instance.

Saving a session calls [`POST /services/session`] to create a session server side. The service
should operate on similar data as `GET /services/session`, so it's passed data like:

```
{
  user: {email: "justin@bitovi.com", password: "pass1234"}
}
```

The application looks up the user, makes sure the encrypted passwords
match, and then calls `req.logIn()` to set `req.user` and then
responds with the Session data.

```
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
				return res.json({user: _.omit(req.user.toJSON(), "password")});
			});
		}
	} else {
		return res.status(404).json({message: "wrong username"});
	}
})
```


#### Destroy the session

The [`<bitballs-navigation>`] component's [template](LINK_TO:logout part) as a link that
calls `logout()` on its ViewModel:

```
<a href="javascript://" ($click)="logout()">Logout</a>
```

`logout` calls destroy on the session and then removes the session from the AppViewModel:

```
logout: function(){
  this.attr("session").destroy().then(()=>{
    this.attr("session", null);
  });
}
```

Destroying a session calls [`DELETE /services/session`] to destroy a session server side. No
data is needed to be passed. The server simply calls passport's `logout()` and responds
with an empty JSON object.

```
app['delete']("/services/session", function(req, res){
	req.logout();
	res.json({});
});
```

### Server side rendering

DoneJS is able to automatically server-side render pages that use
cookie based sessions.  For example, if an admin logs into Bitballs
and refreshes the [tournament details] page, they will be
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

Bitballs [data model](#section=section_DataModelandServicelayer) has many relationships among
its data types.  For example, Tournaments have many Games and have many Teams.  Games
have Teams and Stats.  And Teams have Players.

The __tournament details__ page not only needs to load a tournament, it needs to load
that tournaments games, teams, and all players.

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
players until we have teams.  We can load teams until we
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
backend [Object Relational Model].

For instance, the __game details__ page requests a game with its
related fields like:

```
Game.get({
	id: this.attr("gameId"),
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

Bitballs uses [Bookshelf] as its ORM.  It allows us
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
	id: this.attr("gameId"),
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
Bitballs case this means we shouldn't be changing what's in `/services`,
instead changing what's in `/models` as the database changes.

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

This happens for free because we pass the querystirng directly to bookshelf:

```
app.get('/services/games', function(req, res){
	new Games().query(req.query).fetch().then(function(games){
		res.send({data: games.toJSON()});
	});
});
```

Most server technologies have a ORM that can make this process
straightforward.  It's generally best to use a service API that
matches closely the API of your ORM.

### Models and ViewModels

Once you've settled on an expressive service API, you need
to make Model's that connect to it and handle associated data. And if you want
any of the advanced behavior of [can-connect], you have
to create a relational algebra that understands the service API.

#### Connecting to a service

Bitball's client Models are [can-connect supermodels].  So a
type and list type is defined:

```
var Game = Map.extend({
  ...
});

Game.List = can.List.extend({Map: Game},{});
```

And they are connected to a url:

```
var gameConnection = superMap({
  Map: Game,
  List: Game.List,
  url: "/services/games",
  name: "game",
  algebra: ...
});
```

#### Relational Algebra

To match the query parameters our service and eventually Bookshelf
expects, we need to define a custom set algebra. For Bookshelf, it looks like this:

```
new set.Algebra(new set.clause.Where("where"));
```

#### Defining related properties

Because Game data can come back with a `homeTeam`,
`awayTeam` and `stats` property, we make sure those
are created as the right type:

```
var Game = Map.extend({
  define: {
	homeTeam: {
		Type: Team
	},
	awayTeam: {
		Type: Team
	},
	stats: {
		Type: Stat.List,
		set: function(newVal){
			newVal.__listSet = {where: {gameId: this.attr("id")}};
			return newVal;
		}
	}
  },
  ...
});
```

Notice that `stats.set` is setting the `__listSet` property of the
stats.  This is necessary for [can-connect's real-time] behavior.
When stats are created for this game, they will automatically appear in this list.

#### Defining computed properties

`Game` also has `teams` and `players` computed properties that
derive their value from related fields:

```
var Game = Map.extend({
  define: {
    ...
    teams: {
      get: function() {

        var teams = [],
          home = this.attr("homeTeam"),
          away = this.attr("awayTeam");

        if (home) {
          teams.push(home);
        }
        if (away) {
          teams.push(away);
        }
        return new Team.List(teams);
      }
    },
    players: {
      get: function() {
        var players = [];
        this.attr("teams").forEach(function(team) {
          [].push.apply(players, can.makeArray(team.attr("players")));
        });
        return new Player.List(players);
      }
    }
  }
});
```

In `players`, `team.attr("players")` is actually making use of a similar computed
`players` property in [`/public/models/team`].

#### Defining intermediate computed properties to avoid recomputing.

Sometimes ViewModels mash up Model data.  For example,
the `<tournament-details>` component makes four requests in parallel:

```
Tournament.get({id: this.attr("tournamentId")});
Game.getList({tournamentId: this.attr("tournamentId")});
Team.getList({ tournamentId: this.attr("tournamentId") });
Player.getList({});
```

This gets a tournament, the games for a tournament, the
teams for a tournament, and all the players. All the players
are needed to allow the admin to pick teams. This means
it would be wasteful to use `withRelated: ["player1","player2",...]` on the
Team request because all players are already loading.

But this makes it tricky to list a teams players because
all we have are player ids on each team:

_image of teams list_

A nieve solution would be to make a `findById` method on `Player.List` like:

```
Player.List = can.List.extend({Map: Player},{
  findById: function(id){
    return this.filter(function(player){
      return team.attr("id") === id;
    }).attr(0);
  }
});
```

And then use that in the template to look up the player

```
<td>{{#players.findById(team.player1Id)}}{{name}}{{/playerById}}</td>
<td>{{#players.findById(team.player2Id)}}{{name}}{{/playerById}}</td>
<td>{{#players.findById(team.player3Id)}}{{name}}{{/playerById}}</td>
<td>{{#players.findById(team.player4Id)}}{{name}}{{/playerById}}</td>
```

The problem with this is that each `.findById` is linear.  Instead,
we can keep a mapping of player ids to players like:

```
playerIdMap: {
	get: function(){
		var map = {};
		this.attr("players").each(function(player){
			map[player.attr("id")] = player;
		});
		return map;
	},
	type: "*"
},
```

And make a `playerById` method on the view model that uses this:

```
playerById: function(id){
	return this.attr("playerIdMap")[id];
},
```

It's used in the template like:

```
<td>{{#playerById(player1Id)}} {{name}} {{/playerById}}</td>
<td>{{#playerById(player2Id)}} {{name}} {{/playerById}}</td>
<td>{{#playerById(player3Id)}} {{name}} {{/playerById}}</td>
<td>{{#playerById(player4Id)}} {{name}} {{/playerById}}</td>
```

The good thing about this is `playerIdMap` will only ever
be calculated once.




## SSR and node services

_coming soon_.

- Why do this?
	- mostly because if you are using node as a frontend server, you probably want it able to do other things besides can-serve
- How to do this.
	- ssr
	- live reload
	- apis
	- 404s
	- static resources?

## Turn off SSR

_coming soon_.

- How to make youtube embed not SSR.
