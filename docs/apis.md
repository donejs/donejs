@page Apis
@parent DoneJS
@hide sidebar
@outline 2 ol

@description DoneJS is comprised of many projects that are documented seperately. This page contains overviews of each project and links to their official APIs.

### Application Infrastructure

The blue boxes in the following architecture diagram represent modules provided by DoneJS.

<object type="image/svg+xml" data="static/img/donejs-stack-app.svg"></object>

- [StealJS](#stealjs) - Module loader and build system. [api](http://stealjs.com/docs/index.html).
- [CanJS](#canjs) - Views, ViewModels, modeling part of Models, custom elements, routing. [api](http://canjs.com/docs/index.html)
- [can-connect](#can-connect) - Data connection part of Models, real-time, fall-through cache. [api](https://connect.canjs.com)
- [can-set](#can-set) - Create set algebras used to compare AJAX parameters. [api](https://github.com/canjs/can-set#can-set)
- [jQuery](#jquery) - DOM utilities. [api](http://jquery.com/)
- [jQuery++](#jquery-1) - Even more DOM utilities. [api](http://jquerypp.com/)
- [done-ssr](#done-ssr) - Server-side rendering for NodeJS. [api](https://github.com/donejs/done-ssr)
- [done-autorender](#done-autorender) - Processes templates so they can be server-side rendered. [api](https://github.com/donejs/autorender#use)
- [can-simple-dom](#can-simple-dom) - A lightweight virtual DOM. [api](https://github.com/canjs/can-simple-dom)

### Tooling

DoneJS provides many aspects of JavaScript application tooling, shown in the diagram below.

<object type="image/svg+xml" data="static/img/donejs-stack-tooling.svg"></object>

- [donejs-cli](#cli-and-generators) - The commands available to the donejs command line interface. [api](https://github.com/donejs/cli)
- [generator-donejs](#cli-and-generators) - Default generators are bundled with DoneJS. [api](https://github.com/donejs/generator-donejs/)
- [QUnit](#qunit) - Default test assertion library. [api](http://qunitjs.com/)
- [FuncUnit](#funcunit) - Functional test utilities. [api](http://funcunit.com/)
- [Testee](#testee) - Browser launcher and test reporter. [api](https://github.com/bitovi/testee)
- [DocumentJS](#documentjs) - Documentation engine. [api](http://documentjs.com/)

@body

## Application flow overview

Lets talk about how the typical behavior of a DoneJS application works.  We'll use
the chat application as an example in development.  We'll cover what happens when:

 - A user navigates their browser from a different domain to `http://donejs-chat.com/`
 - A user navigates from `http://donejs-chat.com/` to another `http://donejs-chat.com/chat`.


### First page load

1. An http request for `http://donejs-chat.com/` is sent to a node server. The node server is configured,
   in this case with express, to use [done-ssr-middleware](#done-ssr) to render a DoneJS application:

   ```
   var ssr = require('done-ssr-middleware');

   app.use('/', ssr({
     config: __dirname + '/public/package.json!npm'
   }));
   ```

2. [done-ssr](#done-ssr) uses [steal](#stealjs) to load the application's main module which results in loading the
   entire application. Loading the application only happens once for all page requests.

   A DoneJS's main module is specified where all configuration of a DoneJS application happens, its `package.json`.
   The main module is usually a [can-stache](#canstache) template processed with the [done-autorender](#done-autorender)
   plugin. The module name is specified like: `index.stache!done-autorender`. `index.stache` might look like:

   ```
   <html>
   <head>
     <title>My Site</title>
   </head>
   <body>
     <can-import from="styles.less"/>
     <can-import from="donejs-chat/app" export-as="viewModel" />
     {{#eq page "home"}}

       <can-import from="home/">
         {{#if isResolved}}
           <home-page></home-page>
         {{/if}}
       </can-import>

     {{/eq}}
     <script src="node_modules/steal/steal.js" main="index.stache!done-autorender"></script>
   </body>
   </html>
   ```

   The [done-autorender](#done-autorender) plugin, in NodeJS, exports this template so it can be rendered. It also exports
   any modules it imports with `<can-import>` that are labeled with `export-as="EXPORT_NAME"`. Exporting
   the viewModel is important for [done-ssr](#done-ssr)

3. Once [done-ssr](#done-ssr) has the [done-autorender](#done-autorender)'s `template` and `viewModel` export it:

   1. Creates a new instance of the viewModel, setting properties on it
   using [can-route](#canroute)'s routing rules.  
   2. Creates a new [virtual dom](#can-simple-dom) instance.
   3. Renders the [template](#canstache) with the `viewModel` into the `virtual dom` instance.

4. [done-autorender](#done-autorender) templates waits for all promises to complete
   before providing a final result.  Once the template is finished rendering, [done-ssr](#done-ssr) converts it to a
   string and sends it back to the browser.

5. The browser downloads the page's HTML, which includes a `<script>` tag that points to [steal](#stealjs).  

   ```
   <script src="node_modules/steal/steal.js" main="index.stache!done-autorender"></script>
   ```

   In development, this loads `steal.js` which then loads `index.stache` and processes it with
   the `done-autorender`.  

6. In the browser, `done-autorender`:

   1. Creates a new instance of the [viewModel](#canmap), setting properties on it
   using [can-route](#canroute)'s routing rules.  
   2. Renders the [template](#canstache) with the `viewModel` into a document fragment.
   3. Once all asynchronous activity has completed, it replaces the document with the rendered result.



### Pushstate change

1. A pushstate is triggered by user action, usually by clicking a link. [can-route](#canroute)'s routing rules determines the properties set on the application [viewModel](#canmap).

   ```
   route(':page', { page: 'home' });
   ```

2. [done-autorender](#done-autorender) previously bound the AppViewModel to [can-route](#canroute) which causes any change in the route to be reflected in the AppMap instance.

3. Live binding causes the initial template to reflect in the change in route. If the new route is `/chat` it will cause the `page` to be **chat**:

   ```
   <html>
   <head>
     <title>My Site</title>
   </head>
   <body>
     <can-import from="styles.less"/>
     <can-import from="donejs-chat/app" export-as="viewModel" />
     {{#eq page "home"}}

       <can-import from="home/">
         {{#if isResolved}}
           <home-page></home-page>
         {{/if}}
       </can-import>

     {{/eq}}

     {{#eq page "chat"}}
       <can-import from="chat/">
        {{#if isResolved}}
          <chat-page></chat-page>
        {{/if}}
      </can-import>

     {{/eq}}

     <script src="node_modules/steal/steal.js" main="index.stache!done-autorender"></script>
   </body>
   </html>
   ```

3. [can-import](http://canjs.com/docs/can%7Cview%7Cstache%7Csystem.import.html) will progressively load the component for the new page with a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) as its view model. When the promise resolves the [can-component](#section=section_can_Component) will be inserted.

## CLI and Generators

After installing DoneJS globally with `npm install donejs -g` you will have the `donejs` command available on the command line. It lets you initialize a new application and - when navigating within a DoneJS project - run scripts provided locally by your application. Within your application folder the `donejs` command is a convenience wrapper for the functionality described below and you can also get a list of all commands by running

```
donejs help
```

### NPM scripts

[NPM scripts](https://docs.npmjs.com/misc/scripts) are defined in the `scripts` section of your applications `package.json`. There are some standard scripts that every Node application uses (like `npm start` or `npm test` - both of which are already set up for you) and you can add your own which is what DoneJS does with commands like `npm run develop` or `npm run build`.
The `donejs` command makes running those commands easier by allowing you to run them like `donejs start`, `donejs develop` or `donejs build`

### Generators

`donejs add` lets you run the [Yeoman](http://yeoman.io/) generators provided by [generator-donejs](https://github.com/donejs/generator-donejs/). Currently the following generators are available:

- `donejs add app [folder]` which will initialize a new application (optionally within the given folder)
- `donejs add component <modulename> <tagname>` to create a new can-component
- `donejs add supermodel <modulename>` to generate a new model
- `donejs add plugin [folder]` which will initialize a new plugin project
- `donejs add generator [folder]` which will initialize a new generator project

### Third party generators

If `donejs add` can't find a built-in generator, e.g. when running `donejs add myplugin`, DoneJS will try to install the `donejs-myplugin` package from NPM and run the Yeoman generators it provides. This is how we can enable a desktop application build of the application by simply running

```
donejs add nw
```

Which will install the [donejs-nw](https://github.com/donejs/donejs-nw) package and then run its generator which initializes everything you need. This also works for adding a mobile application build using [donejs-cordova](https://github.com/donejs/donejs-cordova) like this:

```
donejs add cordova
```

This way you can use DoneJS's growing list of plugins and generators without having to add anything to your application that you don't use.

## StealJS

The base of any good JavaScript application is its depenency management system.  
DoneJS uses [StealJS](http://stealjs.com/) which
itself  is split into two sub-projects:

- `steal` - loads CommonJS, ES6, and AMD modules. It can also load styles, templates and more.
- `steal-tools` - builds your application's modules for production and also provides hot-module-swapping.

### steal

To use [steal](http://stealjs.com/docs/steal.html), simply add a script tag to `steal.js`
in an HTML page or in a [done-autorender](#done-autorender) `template` and
point the `main` attribute to a module to load like:

```
<script src="../../node_modules/steal/steal.js" main="my-app/my-module"></script>
```

Using the default DoneJS [system.directories.lib](http://stealjs.com/docs/npm.html#section_Configuration) configuration, this will load
`my-app/src/my-module.js`.  From there, use CommonJS, ES6, or AMD to load your modules:

```
// my-app/src/my-module.js
import $ from "jquery";
import "./styles.css";

$('body')
```

If an `import`, `require` or `define` module reference ends with `"/"`, is a shorthand
for importing a module in the modlet format. The moduleName imported is the same
as the module reference, but with the last folder name added again.

Some examples:

```
// in components/person module.
import "can-component"; //imports "can-component";
import "./edit/"; // imports "components/person/edit/edit";
```

Configure [steal](http://stealjs.com/docs/steal.html)'s behavior in your `package.json` in the `steal` object like:

```
// package.json
{
  "main": "index.stache!done-autorender",
  ...
  "steal": {
    "meta": {
      "ui/core": {
        "deps": [
          "jquery",
          "theme/core.css",
          "theme/theme.css"
        ]
      }
    }
  }
}
```

### steal-tools

In DoneJS applications, [steal-tools](http://stealjs.com/docs/steal-tools.html) is primarily used to:

 - [build](http://stealjs.com/docs/steal-tools.build.html) and minify your application to production-ready bundles.
 - add [hot module swapping](http://stealjs.com/docs/steal-tools.cmd.live-reload.html)

It can also be used to [export](http://stealjs.com/docs/steal-tools.export.html) your
modules to different formats.

DoneJS comes with a `build.js` script that call's steal-tools' [build](http://stealjs.com/docs/steal-tools.build.html):

```
//build.js
var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm"
}, {
  bundleAssets: true
});
```

This is already configured to run with:

```
> donejs build
```

But you could also run it with:

```
> node build.js
```

Hot module swapping is done with [live-reload](http://stealjs.com/docs/steal-tools.cmd.live-reload.html) which
is bundled within steal-tools.  

By default `donejs develop` starts the live-reload server.  However, you could start one
yourself with:

```
> steal-tools live-reload
```

## CanJS

CanJS provides:

- __observables__ with [can-map](#canmap), [can-list](#canlist), and [can-compute](#cancompute).
- __one-way and two-way binding templates__ with [can-stache](#canstache) and [can-stache-bindings](#canviewbindings).
- __custom elements__ with [can-component](#cancomponent).
- __routing__ with [can-route](#canroute).

Observables act as the `ViewModel` and part of the `Model`.

One-way and two-way binding templates act as the `View`.

[can-component](#cancomponent) is used to combine `View` and `ViewModel` into
easy to instantiate and assemble custom elements.

Checkout the following quick examples of their use:

__observables__:

```
// Observable objects:
var person = new DefineMap({first: "Justin", last: "Meyer"});

// Observable arrays:
var hobbies =  new DefineList(["basketball", "hip-hop dancing"]);

// Observable single values:
var age = compute(33);

// Observable computed values:
var info = compute(function(){
  return person.first + " " + person.last + " is " +
  	age() + " and likes " + hobbies.join(",") + ".";
});

// Get the compute's value
info() //-> Justin Meyer is 33 and likes\
       //   basketball, hip-hop dancing.

// Listen to changes in the compute
info.bind("change", function(ev, newValue){
  newValue //-> Justin Meyer is 33 and likes\
           //   basketball, hip-hop dancing.
});

hobbies.pop(); // causes `change` event above
```

__one and two-way binding templates__:

```
// Programatically create a template
// `{($value)}` cross binds the input's value
// to `first` in the scope.
var template = stache("<h1>{{first}}</h1>"+
	"<input {($value)}='first'/>");

// Create observable data for the template
var person = new DefineMap({first: "Payal"});

// Render the template with data
var frag = template(person);

// Add the result to the document
document.body.appendChild(frag);

// Document shows rendered result
document.body //-> <h1>Payal</h1><input value='Payal'/>

// ... User changes the input's value to "Ramiya" ...

// Document is updated with changes
document.body //-> <h1>Ramiya</h1><input value='Ramiya'/>
```

__custom elements__:

```
// Create a custom `can-define/map/map` constructor function
// with a helper function.
var PersonEditViewModel = DefineMap.extend({
  first: "string",
  last: "string",
  fullName: function(){
    return this.first + " " + this.last;
  }
});

// Create a template that will be rendered within
// `<person-edit>` elements.
var template = stache("Update {{fullName}}:"+
	"<input {($value)}='first'/>"+
	"<input {($value)}='last'/>");

// Create the `<person-edit>` element with the specified
// viewModel and template (view).
Component.extend({
  tag: "person-edit",
  ViewModel: PersonEditViewModel,
  view: view
});

// Use that custom element within another template.
// `{(first)}` cross binds `<person-edit>`'s
// `first` property to `firstName` in the scope.
var parentTemplate = stache(
  "<h1>{{firstName}} {{lastName}}</h1>"+
  "<person-edit {(first)}='firstName' {(last)}='lastName'/>");

// Render the parent template with some data:
var frag = parentTemplate(new DefineMap({
  firstName: "Brian",
  lastName: "Moschel"
}));

document.body.appendChild(frag);
```

### can-construct

[can-construct](http://canjs.com/doc/can-construct.html) allows you to define constructor functions that are easy to inherit
from.  It's used by [can-define](#candefine) and [can-component](#cancomponent).

To create your own constructor function, [extend](http://canjs.com/doc/can-construct.extend.html) `can-construct`
with prototype methods like:

```
var Todo = Construct.extend({
  init: function(name){
    this.name = name;
  },

  author: function() { ... },

  coordinates: function() { ... },

  allowedToEdit: function( account ) {
    return true;
  }
});
```

Then you can create instances of `Todo` like:

```
var todo = new Todo("dishes");
todo.name //-> "dishes";
todo.allowedToEdit() //-> true;
```

You can extend `Todo` with [extend](http://canjs.com/doc/can-construct.extend.html) too:

```
var PrivateTodo = Todo.extend({
  allowedToEdit: function( account ) {
    return account.owns( this );
  }
});
```

### can-define/map/map

[can-define](http://canjs.com/doc/can-define.html) is used to create observable
JavaScript Object-like objects.  Create an instance of the
base can-define/map/map like:

```
var person = new DefineMap({first: "Justin", last: "Meyer"});
```

Read or write a `map`'s properties:

```
person.first //-> Justin

person.first = "Ramiya";
person.get() //-> {first: "Ramiya", last: "Meyer"}

person.first = "Brian";
person.last = "Moschel";
person.get() //-> {first: "Brian", last: "Moschel"}
```

Bind to changes in a person's properties with [.on](http://canjs.com/doc/can-define/map/map.prototype.on.html):

```
person.on("first", function(ev, newValue, oldValue){
  newValue //-> "Laura"
  oldvalue //-> "Brian"
});

// changing `first` causes the function
// call above.
person.first = "Laura";
```

Extend a `DefineMap` to create a new constructor function.  This is
very useful for creating Models and View Models:

```
// pass extend an object of prototype values
var Person = DefineMap.extend({
  first: "string",
  last: "string",
  fullName: function(){
    person.first + " " + person.last;
  }
})

var me = new Person({first: "Kathrine", last: "Iannuzzi"});
me.fullName() //-> "Kathrine Iannuzzi"
```

The [can-define](http://canjs.com/doc/can-define.html) allows
you to control the behavior of attributes.  You can define
[default values](http://canjs.com/doc/can-define.types.value.html),
[getters](http://canjs.com/doc/can-define.types.get.html),
[setters](http://canjs.com/doc/can-define.types.set.html), and
[type](http://canjs.com/doc/can-define.types.type.html) converters.

```
var Todo = DefineMap.extend({
  percentComplete: {
    value: 0.1,
    type: "number",
    get: function(value){
      return ""+value+"%"
    },
    set: function(newValue){
      return newValue*100;
    }
  }
});

var todo = new Todo();
todo.percentComplete //-> 10%
```

You can even describe asynchronous behavior which is critical for working
with service data:

```
var Todo = DefineMap.extend({
  ownerId: "number",
  owner: {
    get: function(lastSetValue, resolve){
      User.get({id: this.ownerId}).then(resolve);
    }
  }
});

todo = new Todo({ownerId: 5});

// async values only become valid when bound
// this isn't a problem because templates usually bind for you
todo.on("owner", function(ev, owner){
  owner //-> a User instance
});
```


### can-define/list/list

[can-define/list/list](http://canjs.com/doc/can-define/list/list.html) is used to create observable
JavaScript Array-like objects.  Create an instance of the
base `DefineList` like:

```
var hobbies = new DefineList(["basketball","dancing"]);
```

Read and write items from the list or to read the length:

```
for(var i = 0, len = hobbies.length; i < len; i++){
  var hobby = hobbies.get(i);
}
hobbies.set(1, "hip hop dancing");
hobbies.get() //-> ["basketball", "dancing"]
```

Use array methods like [.push](http://canjs.com/doc/can-define/list/list.prototype.push.html), [.pop](http://canjs.com/doc/can-define/list/list.prototype.pop.html), and [.splice](http://canjs.com/doc/can-define/list/list.prototype.splice.html) to modify the array:

```
hobbies.pop();

hobbies.generated() //-> ["basketball"];

hobbies.push("football");

hobbies //-> DefineList["basketball","football"]
```

Use [.forEach](http://canjs.com/doc/can-define/list/list.prototype.forEach.html), [.map](http://canjs.com/doc/can-define/list/list.prototype.map.html), or [.filter](http://canjs.com/doc/can-define/list/list.prototype.filter.html) to loop through the array.  All
these methods return a `DefineList`

```
var intramurals = hobbies.map(function(hobby){
  return "intramural "+hobby;
})
intramurals //-> DefineList["intramural basketball",
                          "intramural football"]
```

Listen to when a list changes by binding on `add` or `remove` or `length`
events.  

```
hobbies.on("add", function(ev, newHobbies, index){
    console.log("added", newHobbies,"at", index);
  })
  .on("remove", function(ev, removedHobbies, index){
    console.log("removed", newHobbies,"at", index);
  })
  .on("length", function(ev, newVal, oldVal){
    console.log("length is", newVal);
  });

hobbies.splice(1,1,"pumpkin carving","gardening");
  // console.logs:
  //     removed [football] 1
  //     added ["pumpkin carving","gardening"] 1
  //     length is 3
```


By default, if you initialize a list with plain JavaScript objects,
those objects are converted to a `DefineMap`:

```
var people = new DefineList([
  {first: "Justin", last: "Meyer", age: 72},
  {first: "David", last: "Luecke", age: 20},
  {first: "Matthew", last: "Phillips", age: 30}
]);

people.get(0).first //-> Justin
```

You can create your own custom `DefineList` constructor functions
by extending `DefineList`:

```
var People = DefineList.extend({
  seniors: function(){
    return this.filter(function(person){
      return person.age >= 65
    });
  }
});

var people = new People([
  {first: "Justin", last: "Meyer", age: 72},
  {first: "David", last: "Luecke", age: 20},
  {first: "Matthew", last: "Phillips", age: 30}
]);

people.seniors() //-> People[{Justin}]
```

When extending `DefineList` you can specify the default `Map` type
that's created when plain JS objects are added to the list:

```
var Person = can.Map.extend({
  fullName: function(){
    person.first + " " + person.last;
  }
});

var People = DefineList.extend({
  "*": Person
},{
  seniors: function(){
    return this.filter(function(person){
      return person.age >= 65
    });
  }
});

var people = new People([
  {first: "Justin", last: "Meyer", age: 72},
  {first: "David", last: "Luecke", age: 20},
  {first: "Matthew", last: "Phillips", age: 30}
]);

people.get(0).fullName() //-> "Justin Meyer"
```

### can-compute

[can-compute](http://canjs.com/doc/can-compute.html) isn't used
directly much anymore. However, it's used heavily in [can-define](#candefine)
[getters](http://canjs.com/doc/can-define.types.get.html) and live binding
so it's worth understanding the basics.

`can-compute` allows you to define single observable values like:

```
var age = compute(33);
```

or derived values like:

```
var person = new DefineMap({first: "Justin", last: "Meyer"}),
    hobbies =  new DefineList(["basketball", "hip-hop dancing"]);

var info = compute(function(){
  return person.firs + " " + person.last + " is " +
  	age() + " and likes " + hobbies.join(",") + ".";
});
```

Read a compute by calling it like a function:

```
info() //-> "Justin Meyer is 33 and likes\
       //    basketball, hip-hop dancing."
```

Listen to a compute by binding on its `change` event:

```
info.on("change", function(ev, newVal, oldVal){
  console.log("IS:\n",newVal,"\nWAS:\n", oldVal);
})
```

Internally, `on` runs the compute function, identifying what observable
values it reads, and listening to them.  It caches the return result so that
reading the compute again like `info()` just returns the cached result.

When any of the read observables change, it updates the cached value,
and calls back any event handlers:

```
person.first = "Brian";
person.last = "Moschel";

//  console.logs:
//  IS:
//  Brian Moschel is 33 and likes basketball, hip-hop dancing.
//  WAS:
//  Justin Meyer is 33 and likes basketball, hip-hop dancing.
```

### can-stache

[can-stache](http://canjs.com/doc/can-stache.html) is a Handlebars and
Mustache compliant live-binding templating language.

Create a template programmatically with `can-stache` like:

```
var template = stache("<h1>{{first}} {{last}}</h1>");
```

`template` is a __renderer__ function that, when called with observable data,
returns a [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) that is updated when the observable data changes.

Add those fragments to the page to see the result:

```
var person = new DefineMap({first: "Brian", last: "Moschel"})

var frag = template(person);

document.body.appendChild(frag);

document.body //-> <h1>Brian Moschel</h1>

person.first = "Ramiya";
person.last = "Meyer";

document.body //-> <h1>Ramiya Meyer</h1>
```

In a DoneJS application, templates are used primarily as part of
a [can-component](#cancomponent) or as the [done-autorender](#done-autorender)ed main template.

When used in a [can-component](#cancomponent), the templates are often put in their own file. For
example, a `person_edit.js` component file might have a `person_edit.stache` file like:

```
// person_edit.stache
Update {{fullName}}:
<input {($value)}='first'/>
<input {($value)}='last'/>
```

This template's __renderer__ function is imported in `person_edit.js` like:

```
// person_edit.js
import template from "./person_edit.stache";
import Component from "can-component";

Component.extend({
  tag: "person-edit",
  template: template
});
```

`can-stache` template behavior is controlled by what's
within magic tags like `{{ }}`. There are different tag types, lots of
helper functions, and different ways to call methods and functions.

There's too much to cover so we will highlight the important APIs.

The different tag types:

 - [{{key}}](http://canjs.com/doc/can-stache.tags.escaped.html) -
   inserts an escaped value.

   ```
   stache("{{key}}")({key: "<b>Foo</b>"}) //-> `&lt;b&gt;Foo&lt;/b&gt;`
   ```

 - [{{{key}}}](http://canjs.com/doc/can-stache.tags.unescaped.html) -
   inserts an unescaped value.

   ```
   stache("{{key}}")({key: "<b>Foo</b>"}) //-> `<b>Foo</b>`
   ```

- [{{#key}} ... {{/key}}](http://canjs.com/doc/can-stache.tags.section.html) -
  renders a subsection depending on the value of the key.

  ```
  // boolean values render the subsection or its inverse
  stache("{{#key}}A{{/key}}")({key: true}) //-> `A`
  stache("{{#key}}A{{/key}}")({key: false}) //-> ``
  stache("{{#key}}A{{else}}B{{/key}}")({key: false}) //-> `B`

  // iterative values render the subsection for each value
  stache("{{#key}}A{{/key}}")({key: [null,0]}) //-> `AA`
  stache("{{#key}}A{{/key}}")({key: []}) //-> ``

  ```

  The subsection is rendered with the `key` value as the top of the [scope](http://canjs.com/doc/can-view-scope.html):

  ```
  stache("{{#key}}{{child}}{{/key}}")({key: {child:"C"}}) //->`C`
  ```

- [{{^key}} ... {{/key}}](http://canjs.com/doc/can-stache.tags.inverse.html) -
  opposite of `{{#key}}`.

  ```
  stache("{{^key}}A{{/key}}")({key: true}) //-> ``
  stache("{{^key}}A{{/key}}")({key: false}) //-> `A`
  stache("{{^key}}A{{/key}}")({key: [null,0]}) //-> ``

  stache("{{^key}}A{{else}}B{{/key}}")({key: false}) //-> `B`
  ```

The following are stache's most commonly used helpers:

 - [{{#if expr}} .. {{/if}}](http://canjs.com/doc/can-stache.helpers.if.html) - renders the subsection if the expr is truthy.

   ```
   stache("{{#if key}}A{{/if}}")({key: true}) //-> `A`
   stache("{{#if key}}A{{/if}}")({key: false}) //-> ``

   stache("{{#if key}}A{{else}}B{{/if}}")({key: false}) //-> `B`
   ```

 - [{{#is expr1 expr2}} ... {{/is}}](http://canjs.com/doc/can-stache.helpers.is.html) - compares two expressions and renders a subsection depending on the result.

   ```
   stache("{{#is page 'A'}}A{{/is}}")({page: 'A'}) //-> `A`
   stache("{{#is page 'A'}}A{{/is}}")({page: 'B'}) //-> ``

   stache("{{#is page 'A'}}A{{else}}C{{/is}}")({page: 'C'}) //-> `B`
   ```

 - [{{#each key}} ... {{/each}}](http://canjs.com/doc/can-stache.helpers.each.html) - renders a subsection for each item in a key's value.

   ```
   stache('{{#each hobbies}}<p>{{.}}</p>{{/each}}')(['Hockey', 'Hiking']) //-> `<p>Hockey</p><p>Hiking</p>`
   ```

    If the value of a key is a [DefineList](#section=section_definelist) only the minimum amount of DOM updates occur when the list changes.

 - [{{routeUrl hashes}}](http://canjs.com/doc/can-stache/helpers/route.html) - generates a url using [can-route](#canroute) for the provided hashes.

   ```
   stache("<a href="{{routeUrl page='details' id='23'}}">{{name}}</a>")({name: 'Item 23'}) //-> `<a href="#!&page=details&id=23">Item 23</a>`
   ```

[Call methods](http://canjs.com/doc/can-stache.expressions.html#Callexpressions) in your scope like: `{{method(value)}}`

```
stache('<p>10 {{pluralize("Baloon" 10)}}</p>')({
  pluralize: function(subject, howMany) {
    if(howMany > 1) {
      subject += 's';
    }
    return subject;
  }
}); //-> "<p>10 Baloons</p>"
```

### can-stache-bindings

`can-stache-bindings` allows you to bind to viewModel or DOM events and create one-way or two-way bindings on element's properties/attributes, can-component viewModels and `can-stache`'s scope.

Create a one-way binding from the parent scope to a child's properties/attributes or viewModel:

 - [{child-prop}="value"](http://canjs.com/doc/can-stache-bindings.toChild.html) - One-way bind `value` in the scope to `childProp` in the viewModel.

    ```
    <my-component {user-name}="name"></my-component>
    ```

 - [{$child-prop}="value"](http://canjs.com/doc/can-stache-bindings.toChild.html) - One-way bind `value` in the scope to the `childProp` property or attribute of the element.

    ```
    <input {$value}="name" type="text">
    ```

Create a one-way binding from the child's properties/attributes or viewModel to the parent scope:

- [{^child-prop}="value"](http://canjs.com/doc/can-stache-bindings.toParent.html) - One-way bind the value of `childProp` in the viewModel to the `name` in the parent scope.

    ```
    <my-component {^user-name}="name"></my-component>
    ```

 - [{^$child-prop}="value"](http://canjs.com/doc/can-stache-bindings.toParent.html) - One-way bind `value` in the scope to the `childProp` property or attribute of the element.

    ```
    <input {$value}="name" type="text">
    ```

Create two-way bindings between the parent scope and the child's viewModel or property/attributes:

- [{(child-prop)}="value"](http://canjs.com/doc/can-stache-bindings.twoWay.html) - Two-way bind the value of `childProp` in the viewModel to the `name` in the parent scope.

    ```
    <my-component {(user-name)}="name"></my-component>
    ```

 - [{^$child-prop}="value"](http://canjs.com/doc/can-stache-bindings.twoWay.html) - Two-way bind `value` in the scope to the `childProp` property or attribute of the element.

    ```
    <input {$value}="name" type="text">
    ```

Create bindings to viewModel or DOM events:

 - [($EVENT)="handler()"](http://canjs.com/doc/can-stache-bindings.event.html) - Listen to the DOM event `EVENT` and use `handler` as the event handler.

    ```
    <div ($click)="updateThing()"></my-component>
    ```

- [(EVENT)="handler()"](http://canjs.com/doc/can-stache-bindings.event.html) - Listen to the viewModel event `EVENT` and use `handler()` as the event handler.

    ```
    <my-component (show)="showTheThing()"></my-component>
    ```

### can-component

[can-component](http://canjs.com/doc/can-component.html) lets you
create widgets with well-defined View Models and are instantiated with
custom elements.

Define a `can-component` by extending one with a `tag` name, [can-define](#candefine) `viewModel` and
[can-stache template](#canstache) like:

```
// Define the view model
var HelloViewModel = DefineMap.extend({
  excitedMessage: function(){
    return this.attr("message")+"!"
  }
});

Component.extend({
  tag: "hello-world",
  ViewModel: HelloViewModel,
  view: stache("<h1>{{excitedMessage}}</h1>")
});
```

To instantiate this component so it says `Hello World!`, add
a `<hello-world>` element to the page like:

```
<hello-world message="Hello World"/>
```

Use [can-stache-bindings](#canstachebindings)
to send a value from the `can-stache` scope like:

```
// a `DefineMap` that will be available in the scope
var appViewModel = new DefineMap({
  greeting: "Howdy Planet"
});

var template = stache('<hello-world {message}="greeting"/>');

var frag = template(appViewModel);

frag //-> <hello-world {message}="greeting">
     //      <h1>Howdy Planet!</h1>
     //   </hello-world>
```

`can-component`s are usually built as [modlets](./Features.html#modlets),
meaning their template and styles are another file and imported:

```
// hello-world.js
import Component from 'can-component';
import Map from 'can-define/map/map';
import './hello-world.less';
import view from './hello-world.stache';

export const ViewModel = Define.extend({
  message: "string",
  excitedMessage: function(){
    return this.message+"!"
  }
});

export default Component.extend({
  tag: "hello-world",
  ViewModel: ViewModel,
  view
});
```

Some components are so small, they they don't require three
seperate files. For these, you can use a `.component` file:

```
<!-- hello-world.component -->
<can-component tag="<%= tag %>">
  <style type="less">
    display: block;
  </style>
  <template>
    <h1>{{excitedMessage}}</h1>
  </template>
  <view-model>
    import DefineMap from 'can-define/map/map';

    export default DefineMap.extend({
      message: "string",
      excitedMessage: function(){
        return this.message+"!"
      }
    });
  </view-model>
</can-component>
```

### can-route

[can-route](http://canjs.com/doc/can-route.html) provides powerful 2-way, nested, routing to your application, supporting both hash and [pushstate](http://canjs.com/doc/can-route-pushstate.html).

Configure routing rules to define property values on your application's
View Model when a url is matched.


The following sets the application ViewModel's `page` property
to `"chat"` when the url looks like `/chat`:

```
route(":page");
```

You can define defaults that get set when `:page` is empty. The
following sets the default `page` property to `"home"`.

```
route(":page", { page: "home" });
```

You can specify multiple properties to set for a given url:

```
route(":page/:slug");
route(":page/:slug/:action");
```


Update the url by changing `can-route`:

```
route.attr("page", "restaurants");
// location.href -> "/restaurants"
```

Or change `route` by modifying the url:

```
history.pushState(null, null, "/");
// route.attr("page"); // -> "home"
```

In a DoneJS application can.route is bound to the [application View Model](#candefine), but you can connect `can-route` to other
maps:

```
var DefineMap = require("can-define/map/map");

var AppViewModel = DefineMap.extend({
 ...
});

var viewModel = new AppViewModel();

route.data = viewModel;
```

Which will cause any changes in the route to reflect in the View Model instance, and any changes in the View Model instance to reflect in the route.

## Data Layer APIs


### can-connect

[can-connect](https://connect.canjs.com) is used to connect typed
data to backend services.  In a DoneJS application, that typed data is a
[can-define/map/map](#candefine) and [can-define/list/list](#candefinelistlist) type.  

To make a simple connection to a restful interface:

```
// First, create custom Map and List type
var Todo = DefineMap.extend({
  ownerId: "number",
  canComplete: function(ownerId) {
    return this.ownerId === ownerId;
  }
});

var TodoList = DefineList.extend({
  "*": Todo
},{
  incomplete: function(){
    return this.filter(function(todo){
      return !todo.complete;
    });
  }
});

// Then, make a connection with the right behaviors and options.
var todoConnection = connect(["data-url","constructor","can/map"],{
  Map: Todo,
  List: TodoList,
  url: "/services/todos"
});
```

This adds a [getList](http://connect.canjs.com/doc/can.Map.getList.html),
[.get](http://connect.canjs.com/doc/can.Map.get.html),
[.save](http://connect.canjs.com/doc/can.Map.prototype.save.html) and
[.destroy](http://connect.canjs.com/doc/can.Map.prototype.destroy.html) methods to
`Todo` allowing you to CRUD `Todo`s and `TodoList`s from the service layer like:

```
// Get a list of todos
Todo.getList({due: "today"}).then(function(todos){ ... });

// Get a single todo
Todo.get({id: 5}).then(function(todo){ ... });

// Create a todo
var todo = new Todo({name: "dishes"})

// Create it on the server
todo.save().then(function(todo){

  // Update its properties
  todo.name = "Do the dishes";
  // Update the service layer with changes
  todo.save().then(function(todo){

    // Delete the todo on  the service layer
    todo.destroy();
  });
});
```

`can-connect` comes with a wide variety of behaviors that
can be mixed into a connection.  Examples include:

 - [real-time](http://connect.canjs.com/doc/can-connect%7Creal-time.html) keeps `can.List`s updated with changes.
 - [fall-through-cache](http://connect.canjs.com/doc/can-connect%7Cfall-through-cache.html)

To make the process of creating `can.Map` based connections easier,
DoneJS comes with a [supermodel generator](#generators)
creates a [super-map](http://connect.canjs.com/doc/can-connect%7Ccan%7Csuper-map.html).

A super-map is just a connection with a bunch of the mostly commonly used
behaviors.  Create one with the `superMap` function like:

```
export const messageConnection = superMap({
  url: "/services/todos",
  Map: Todo,
  List: TodoList,
  name: 'todo'
});
```

### can-set

[can-set](https://github.com/canjs/can-set) is used to compare
set objects that are represented by the parameters commonly passed
to service requests.  

For example, if you want all todos for user `5` that are complete, you
might call:

```
Todo.getList({userId: 5, complete: true})
```

`{userId: 5, complete: true}` represents a set.  Using
`can-set` we can compare it to other sets. The following
returns `true` because `{userId: 5, complete: true}` represents
a subset of `{userId: 5}`.

```
set.subset({userId: 5, complete: true},{userId: 5}) //-> true
```

`can-set` can perform more complex logic with custom [set Algebras](https://github.com/canjs/can-set#setalgebra).

The following creates a set-algebra that is able to combine ranges:

```
// Create a set Algebra
var algebra = new set.Algebra(
  set.comparators.rangeInclusive("start","end"));

// use it
algebra.union({start: 1, end: 10},
              {start: 11, end: 20}) //-> {start: 1, end: 20}
```

In a DoneJS application, you create custom algebras to pass
to [can-connect](#section=section_can_connect) connections. The
connection's behaviors use that [algebra](http://connect.canjs.com/doc/connect.base.algebra.html) to their optimizations.

For example, if the `Todo` type in the [can-connect section](#can-connect) has the following property behaviors:

 - `complete` can be true or false
 - `type` can be one of "dev", "design", or "QA"

... and the service layer supports queries like:

```
//-> gets all incomplete todos
/services/todos?complete=false

// -> gets all todos that are for design and dev
/services/todos?type[]=dev&type[]=design
```

You'd want to create an algebra for the `superMap` as follows:

```
var algebra = new set.Algebra(
  set.comparators.boolean("complete"),
  set.comparators.enum("type", ["dev", "design", "QA"])
);

export const messageConnection = superMap({
  url: "/services/todos",
  Map: Todo,
  List: TodoList,
  name: 'todo',
  algebra: algebra
});
```

This allows a `superMap` to combine requests like:

```
  Todo.getList({complete: true})
+ Todo.getList({complete: true})
================================
  Todo.getList({})
```

And know that if `Todo.getList({type: ["dev","design"]})` has already been
retrieved, there's no need to make a request for
`Todo.getList({type: ["dev"]})`.


## Testing APIs

### QUnit

[QUnit](http://qunitjs.com/) is DoneJS's default JavaScript unit testing framework. It is provided for DoneJS by the [steal-qunit](https://github.com/stealjs/steal-qunit) project. A basic unit test for a can.Component view-model looks like this:

```js
import QUnit from 'steal-qunit';
import { ViewModel } from 'my/component/';

// ViewModel unit tests
QUnit.module('my/component');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the my-component component');
});
```

While the generators create QUnit tests by default you can switch your own tests easily to [Jasmine](https://github.com/stealjs/steal-jasmine) or [Mocha](https://github.com/stealjs/steal-mocha).
To use Mocha instead for the previous view-model example we just need to install the wrapper with

```
npm install steal-mocha --save-dev
npm install assert --save-dev
```

And then change the test file to:

```
import mocha from 'steal-mocha';
import assert from 'assert';
import { ViewModel } from 'my/component/';

mocha.setup('bdd');

// ViewModel unit tests
describe('my/component', function() {
  it('Has a message', function() {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the my-component component');
  });
});
```

### FuncUnit

[FuncUnit](http://funcunit.com/) enhances QUnit, Mocha or Jasmine and enables them to simulate user actions, easily test asynchronous behavior, and support black box testing. It uses a jQuery-like syntax to write functional or unit tests. When generating an application, DoneJS already includes a basic FuncUnit smoke-test which runs alongside the other tests. It looks like this:

```js
import F from 'funcunit';
import QUnit from 'steal-qunit';

F.attach(QUnit);

QUnit.module('my-app functional smoke test', {
  beforeEach() {
    F.open('../development.html');
  }
});

QUnit.test('my-app main page shows up', function() {
  F('title').text('my-app', 'Title is set');
});
```

This will open the main application (`development.html` is the HTML file that loads our DoneJS app without server-side-rendering) and ensures that the `<title>` is set to the name (which is the default in a newly generated application). To learn more about the user interactions and assertions available, follow up in the [FuncUnit API documentation](http://funcunit.com/docs/index.html).

### Testee

[Testee](https://github.com/bitovi/testee) is a JavaScript test runner that can run your QUnit, Mocha and Jasmine tests from the command line. The command executed when running `donejs test` (which is the same as running `npm test`) is located in the `package.json` `scripts` section and already set up to run the main test suite in Firefox like this:

```
testee src/test.html --browsers firefox --reporter Spec
```

To change the browsers that our tests run on we can update the list of browsers, for example to add Safari and Google Chrome Canary by changing the test script to:

```
testee src/test.html --browsers firefox,canary,safari --reporter Spec
```

Testee supports all [Mocha command line reporters](https://mochajs.org/#reporters). For example, running the tests in the default browser [PhantomJS](http://phantomjs.org/) (DoneJS only works with PhantomJS >= 2.0) on a [Jenkins CI](https://jenkins-ci.org/) server that uses XUnit output from a `testresults.xml` can be accomplished like this:

```
testee src/test.html --reporter XUnit > testresults.xml
```

For more configuration options follow up in the [Testee documentation](https://github.com/bitovi/testee#testee).

## DocumentJS

When working on large applications keeping updated documentation is critical.
[DocumentJS](http://documentjs.com/) generates API documentation for your
application supporting [jsdoc](http://usejsdoc.org/) syntax that can be multi-versioned.

### Configuration

DocumentJS is configured with a [docConfig](http://documentjs.com/docs/DocumentJS.docConfig.html) specified
in a **documentjs.json** file within your project:

```
{
  "sites": {
    "docs": {
      "dest": "docs",
      "glob" : "**/*.{js,md}"
    }
  }
}
```

This specifies to look in JavaScript and Markdown files for jsdoc tags. When ran the documentation will be written to the **docs** folder.

### Documenting

DocumentJS includes most [tags](http://documentjs.com/docs/documentjs.tags.html) you need to document a web application and includes an API to create your own.

Here's how you would document a [can-component](#cancomponent) View Model:

```
/**
 * @add order/new
 */
export const ViewModel = Define.extend({
  /**
   * @property {String} slug
   *
   * The restaurants slug (short name). Will
   * be used to request the actual restaurant.
   */
  slug: {
    type: 'string'
  },
  /**
   * @property {place-my-order/models/order} order
   *
   * The order that is being processed. Will
   * be an empty new order inititally.
   */
  order: {
    Value: Order
  },
  /**
   * @property {can.Deferred} saveStatus
   *
   * A deferred that contains the status of the order when
   * it is being saved.
   */
  saveStatus: {
    Value: Object
  },
  /**
   * @property {Boolean} canPlaceOrder
   *
   * A flag to enable / disable the "Place my order" button.
   */
  canPlaceOrder: {
    get() {
      let items = this.order.items;
      return items.length;
    }
  }

  /**
   * @function placeOrder
   *
   * Save the current order and update the status Deferred.
   *
   * @return {boolean} false to prevent the form submission
   */
  placeOrder() {
    let order = this.order;
    this.saveStatus = order.save();
    return false;
  },

  /**
   * @function startNewOrder
   *
   * Resets the order form, so a new order can be placed.
   *
   * @return {boolean} false to prevent the form submission
   */
  startNewOrder: function() {
    this.order = new Order();
    this.saveStatus = null;
    return false;
  }
});
```

### Generating

DoneJS preconfigures your app to be documented with:

```
donejs document
```

Or you can run the [documentjs](http://documentjs.com/docs/DocumentJS.apis.generate.documentjs.html) command directly with:

```
node_modules/.bin/documentjs
```

## DOM APIs

### jQuery

[jQuery](http://jquery.com/) is the ubiquitous DOM manipulation
library. While you don't often need to write jQuery directly,
[CanJS](#canjs) is built making it safe to use jQuery when needed.

For example, you can make your own custom elements that call jQuery
plugins:

```
callbacks.tag("tooltip", function(el){
  $(el).tooltip({
    content: el.getAttribute("content"),
    items: "tooltip"
  });
})
```

[can.-stache-bindings](#canstachebindings) lets you listen
to [jQuery special events](http://benalman.com/news/2010/03/jquery-special-events/) like:

```
<div ($tripleclick)="doSomething()">
```

[can-component](#cancomponent)'s events object also supports this:  

```
Component.extend({
  events: {
    "li tripleclick": function(li, ev){ ... }
  }
})
```


CanJS adds special [inserted](http://canjs.com/docs/can.events.inserted.html), [removed](http://canjs.com/docs/can.events.removed.html), and [attributes](http://canjs.com/docs/can.events.attributes.html) events. This allows you to
teardown any behavior when the DOM is modified:

```
$(el).bind("removed", function(){
  $(el).tooltip("teardown");
})
```

CanJS's live-binding also hooks into these same events.  So if you remove
an element with jQuery, CanJS will also teardown its bindings.  This means that if
you were to call:

```
$("body").empty();
```

### jQuery++

[jQuery++](http://jquerypp.com/) adds a bunch of special events and other DOM
utilties to jQuery.  

 - DOM utilities
   - [animate](http://jquerypp.com/#animate) - Overwrites `jQuery.animate` to use CSS3 animations if possible.
   - [compare](http://jquerypp.com/#compare) - Compare the position of two elements in the page.
   - [range](http://jquerypp.com/#range) - Manipulate text ranges.
   - [within](http://jquerypp.com/#within) - Get the elements within a specified area.
 - Special events
   - [drag / drop](http://jquerypp.com/#drag) - drag drop events.
   - [hover](http://jquerypp.com/#hover) - hover events.
   - [key](http://jquerypp.com/#key) - get a string representation of the key pressed.
   - [resize](http://jquerypp.com/#resize) - listen to when an element changes size.
   - [swipe](http://jquerypp.com/#swipe) - mobile swipe events.


## Server Side Rendering APIs

### done-ssr

[done-ssr](https://github.com/donejs/done-ssr) enables DoneJS applications to be
server-side rendered. Paired with [done-autorender](#done-autorender)
it allows you to render the entire document from a single template.

```
var http = require("http");
var ssr = require("done-ssr");
var render = ssr();

var server = http.createServer(function(request, response){
    render(request).pipe(response);
});

server.listen(8080);
```

The render function is called with a string url to render and returns a response
object that contains the html string that was rendered. Use any Node-based
http framework with done-ssr.

For convenience we have published an [Express](http://expressjs.com/) middleware:

```
var ssr = require("done-ssr-middleware");
var app = require("express")();

app.use(ssr(
  config: __dirname + "/package.json!npm"
));
```

Additionally DoneJS has [done-serve](https://github.com/donejs/done-serve)
which acts as a rendering front-end for your application. It will host static
content, render your application, and proxy requests to another back-end server.

```
done-serve --proxy http://localhost:7070 --port 8080
```

### done-autorender

[done-autorender](https://github.com/donejs/autorender) is a Steal plugin that
enables using a [can.stache](#canstache) template as your application's entry point. Create a template like:

```handlebars
<html>
<head>
  <title>app | {{page}}</title>
</head>
<body>
  <can-import from="app/state" export-as="viewModel"/>

  <div>Hello {{name}}</div>
</body>
</html>
```

**done-autorender** will insert this template on page load. The import specied with
the `export-as="viewModel"` attribute is a [can-define/map/map](#candefine) that acts as the View Model
for the application.

If you have [live-reload](http://stealjs.com/docs/steal.live-reload.html#section_Use) enabled done-autorender will additionally use those APIs to re-render the
application when any modules are reloaded.

done-autorender handles requests when running in Node for server-side rendering and
will wait for all asynchronous events to complete.

### can-simple-dom

[can-simple-dom](https://github.com/canjs/can-simple-dom) is a minimal virtual DOM implementation used
for server-side and worker thread rendering. It contains enough of the DOM APIs to get basic
jQuery usage to work, as well as what is typical of CanJS applications.

If you are working on an advanced plugin you might use can-simple-dom directly,
in which case you would import it:

```js
import simpleDOM from "can-simple-dom";

const document = new simpleDOM.Document();
```

From here document has the normal DOM apis such as `document.createElement`.
