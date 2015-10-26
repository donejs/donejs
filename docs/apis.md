@page Apis
@parent DoneJS
@hide sidebar
@outline 2 ol

@description DoneJS is comprised of many projects that are documented seperately. Get an overview of the project's
APIs that go into making DoneJS and links to their official APIs.

- [generator-donejs] - Default generators are bundled with DoneJS. [api]
- [donejs-cli] - The commands available to the donejs command line interface. [api]
- [StealJS](#section=section_StealJS) - Module loader and build system. [api](http://stealjs.com/docs/index.html).
- [CanJS](#section=section_CanJS) - Views, ViewModels, modeling part of Models, custom elements, routing. [api](http://canjs.com/docs/index.html)
- [can-connect] - Data connection part of Models, real-time, fall-through cache. [api]
- [can-set] - Create set algebras used to compare AJAX parameters. [api](https://github.com/canjs/can-set#can-set)
- [QUnit] - Default test assertion library. [api]
- [FuncUnit] - Functional test utilities. [api]
- [Testee] - Browser launcher and test reporter. [api]
- [DoumentJS] - Documentation engine. [api]
- [jQuery] - DOM utilities. [api]
- [jQuery++] - Even more DOM utilities. [api]
- [can-ssr] - Server-side rendering for NodeJS. [api]
- [done-autorender] - Processes templates so they can be server-side rendered. [api]
- [can-simple-dom] - A lightweight virtual DOM. [api]




@body

## Application flow overview

Lets talk about how the typical behavior of a DoneJS application works.  We'll use
the chat application as an example in development.  We'll cover what happens when: 

 - A user navigates their browser from a different domain to `http://donejs-chat.com/`
 - A user navigates from `http://donejs-chat.com/` to another `http://donejs-chat.com/chat`. 


### First page load

1. An http request for `http://donejs-chat.com/` is sent to a node server. The node server is configured,
   in this case with express, to use [can-ssr] to render a DoneJS application:
  
   ```
   var ssr = require('can-ssr/middleware');
   
   app.use('/', ssr({
     config: __dirname + '/public/package.json!npm'
   }));
   ```
  
2. [can-ssr] uses [steal] to load the application's main module which results in loading the 
   entire application. Loading the application only happens once for all page requests.
   
   A DoneJS's main module is specified where all configuration of a DoneJS application happens, its `package.json`.
   The main module is usually a [can.stache] template processed with the [done-autorender]
   plugin. The module name is specified like: `index.stache!done-autorender`. `index.stache` might look like:
   
   ```
   <html>
   <head>
     <title>My Site</title>
   </head>
   <body>
     <can-import from="styles.less!"/>
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
   
   The [done-autorender] plugin, in NodeJS, exports this template so it can be rendered. It also exports
   any modules it imports with `<can-import>` that are labeled with `export-as="EXPORT_NAME"`. Exporting
   the [viewModel]\(can-ssr/can-map) is important for [can-ssr]
   
3. Once [can-ssr] has the [done-autorender]'s `template` and `viewModel` export it:

   1. Creates a new instance of the [viewModel]\(can-ssr/can-map), setting properties on it
   using [can.route]'s routing rules.  
   2. Creates a new [virtual dom]\(can-simple-dom) instance.
   3. Renders the [template]\(can.stache) with the `viewModel` into the `virtual dom` instance.
   
4. [done-autorender] templates waits for all promises registered with [.waitsFor] and [.pageData] to complete
   before providing a final result.  Once the template is finished rendering, [can-ssr] converts it to a 
   string and sends it back to the browser.
   
5. The browser downloads the page's HTML, which includes a `<script>` tag that points to [steal].  

   <script src="node_modules/steal/steal.js" main="index.stache!done-autorender"></script>
   
   In development, this loads `steal.js` which then loads `index.stache` and processes it with
   the `done-autorender`.  
   
6. In the browser, `done-autorender`:
   
   1. Creates a new instance of the [viewModel]\(can-ssr/can-map), setting properties on it
   using [can.route]'s routing rules.  
   2. Renders the [template]\(can.stache) with the `viewModel` into a document fragment.
   3. Once all promises registered with [.waitsFor] and [.pageData] have resolved, it replaces
      the document with the rendered result.



### Pushstate change





## generator-donejs

```
> donejs init
```

```
> donejs generate component <folder-path> <component-name>
```

```
> donejs generate component <file-name>.component <component-name>
```

```
> donejs generate supermodel <model-name>
```

## donejs-cli

- donejs add ?

- donejs build
- donejs deploy
- donejs develop



## StealJS

The base of any good JavaScript application is its depenency management system.  
DoneJS uses [StealJS](http://stealjs.com/) which
itself  is split into two sub-projects: 

- `steal` - loads CommonJS, ES6, and AMD modules. It can also load styles, templates and more.
- `steal-tools` - builds your application's modules for production and also provides hot-module-swapping.

### steal

To use [steal](http://stealjs.com/docs/steal.html), simply add a script tag to `steal.js` 
in an HTML page or in a [done-autorender template] and
point the `main` attribute to a module to load like:

```
<script src="../../node_modules/steal/steal.js" main="my-app/my-module"></script>
``` 

Using the default DoneJS [system.directories.lib](http://stealjs.com/docs/npm.html#section_Configuration) configuration, this will load 
`my-app/src/my-module.js`.  From there, use CommonJS, ES6, or AMD to load your modules:

```
// my-app/src/my-module.js
import $ from "jquery";
import "./styles.css!";

$('body')
```

If an `import`, `require` or `define` module reference ends with `"/"`, is a shorthand
for importing a module in the modlet format. The moduleName imported is the same
as the module reference, but with the last folder name added again. 

Some examples:

```
// in components/person module.
import "can/component/"; //imports "can/component/component";
import "./edit/"; // imports "components/person/edit/edit";
```

Configure [steal](http://stealjs.com/docs/steal.html)'s behavior in your `package.json` in the `system` object like:

```
// package.json
{
  "main": "index.stache!done-autorender",
  ...
  "system": {
    "meta": { 
      "ui/core": {
        "deps": [
          "jquery",
          "theme/core.css!",
          "theme/theme.css!"
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

//build.js
var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm",
  babelOptions: {
    loose: "es6.modules"
  }
}, {
  bundleAssets: true
});
 
This is already configured to run with:

```
> donejs build
```

But you could also run it with:

```
> node build.js
```

Hot module swapping is done with [live-reload](https://github.com/stealjs/live-reload) which 
is bundled within steal-tools.  

By default `donejs develop` starts the live-reload server.  However, you could start one 
yourself with:

```
> steal-tools live-reload
```

## CanJS

CanJS provides:

- __observables__ with [can.Map](#section=section_can_Map), [can.List](#section=section_can_List), and [can.compute](#section=section_can_compute).
- __one-way and two-way binding templates__ with [can.stache] and [can.view.bindings].
- __custom elements__ with [can.Component](#section=section_can_Component).
- __routing__ with [can.route].

Observables act as the `ViewModel` and part of the `Model`.

One-way and two-way binding templates act as the `View`.

[can.Component] is used to combine `View` and `ViewModel` into
easy to instantiate and assemble custom elements.

Checkout the following quick examples of their use:

__observables__:

```
// Observable objects:
var person = new can.Map({first: "Justin", last: "Meyer"});

// Observable arrays:
var hobbies =  new can.List(["basketball", "hip-hop dancing"]);

// Observable single values:
var age = can.compute(33);

// Observable computed values:
var info = can.compute(function(){
  return person.attr("first")+" "+person.attr("last")+" is "+
  	age()+" and likes "+ hobbies.join(",")+".";
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
var template = can.stache("<h1>{{first}}</h1>"+
	"<input {($value)}='first'/>");

// Create observable data for the template
var person = new can.Map({first: "Payal"});

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
// Create a custom `can.Map` constructor function 
// with a helper function.
var PersonEditViewModel = can.Map.extend({
  fullName: function(){
    return this.attr("first")+" "+this.attr("last");
  }
});

// Create a template that will be rendered within
// `<person-edit>` elements. 
var template = can.stache("Update {{fullName}}:"+
	"<input {($value)}='first'/>"+
	"<input {($value)}='last'/>");

// Create the `<person-edit>` element with the specified
// viewModel and template (view).
can.Component.extend({
  tag: "person-edit",
  viewModel: PersonEditViewModel,
  template: template
});

// Use that custom element within another template.
// `{(first)}` cross binds `<person-edit>`'s 
// `first` property to `firstName` in the scope.
var parentTemplate = can.stache(
  "<h1>{{firstName}} {{lastName}}</h1>"+
  "<person-edit {(first)}='firstName' {(last)}='lastName'/>");
  
// Render the parent template with some data:
var frag = parentTemplate(new can.Map({
  firstName: "Brian",
  lastName: "Moschel"
}));

document.body.appendChild(frag);
```

### can.Construct

[can.Construct](http://canjs.com/docs/can.Construct.html) allows you to define constructor functions that are easy to inherit 
from.  It's used by [can.Map], [can.List], and [can.Component].

To create your own constructor function, [extend] `can.Construct` 
with prototype methods like:

```
var Todo = can.Construct.extend({
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

You can extend `Todo` with [extend] too:

```
var PrivateTodo = Todo.extend({
  allowedToEdit: function( account ) {
    return account.owns( this );
  }
});
```

`can.Construct` comes with a [super] plugin that allows you to easily 
call base behavior like:

```
var PrivateTodo = Todo.extend({
  init: function(name, account){
    this._super(name);
    this.account = account;
  }
  allowedToEdit: function() {
    return this.account.owns( this );
  }
});
```

### can.Map

[can.Map](http://canjs.com/docs/can.Map.html) is used to create observable
JavaScript Object-like objects.  Create an instance of the 
base `can.Map` like:

```
var person = new can.Map({first: "Justin", last: "Meyer"});
```

Read or write a `map`'s properties with [.attr](http://canjs.com/docs/can.Map.prototype.attr.html):

```
person.attr("first") //-> Justin

person.attr("first", "Ramiya");
person.attr() //-> {first: "Ramiya", last: "Meyer"}

person.attr({first: "Brian", last: "Moschel"});
person.attr() //-> {first: "Brian", last: "Moschel"}
```

Bind to changes in a person's properties with [.bind](http://canjs.com/docs/can.Map.prototype.bind.html):

```
person.bind("first", function(ev, newValue, oldValue){
  newValue //-> "Laura"
  oldvalue //-> "Brian"
});

// changing `first` causes the function
// call above.
person.attr("first", "Laura");
```

Extend a `can.Map` to create a new constructor function.  This is
very useful for creating Models and View Models: 

```
// pass extend an object of prototype values
var Person = can.Map.extend({
  fullName: function(){
    person.attr("first")+" "+person.attr("last");
  }
})

var me = new Person({first: "Kathrine", last: "Iannuzzi"});
me.fullName() //-> "Kathrine Iannuzzi"
```

The [define plugin](http://canjs.com/docs/can.Map.prototype.define.html) allows
you to control the behavior of attributes.  You can define 
[default values](http://canjs.com/docs/can.Map.prototype.define.value.html),
[getters](http://canjs.com/docs/can.Map.prototype.define.get.html), 
[setters](http://canjs.com/docs/can.Map.prototype.define.set.html), and 
[type](http://canjs.com/docs/can.Map.prototype.define.type.html) converters.

```
var Todo = can.Map.extend({
  define: {
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
  }
});

var todo = new Todo();
todo.attr("percentComplete") //-> 10%
```

You can even describe asynchronous behavior which is critical for working
with service data:

```
var Todo = can.Map.extend({
  define: {
    owner: {
      get: function(lastSetValue, resolve){
        User.get({id: this.attr("ownerId")}).then(resolve);
      }
    }
  }
});

todo = new Todo({ownerId: 5});

// async values only become valid when bound
// this isn't a problem because templates usually bind for you
todo.bind("owner", function(ev, owner){
  owner //-> a User instance
});
```


### can.List

[can.List](http://canjs.com/docs/can.List.html) is used to create observable
JavaScript Array-like objects.  Create an instance of the 
base `can.List` like:

```
var hobbies = new can.List(["basketball","dancing"]);
```

Use [.attr] to read and write items from the list or to read the length:

```
for(var i = 0, len = hobbies.attr("length"); i < len; i++){ 
  var hobby = hobbies.attr(i);
}
hobbies.attr(1, "hip hop dancing");
hobbies.attr() //-> ["basketball", "dancing"]
```

Use array methods like [.push], [.pop], and [.splice] to modify the array:

```
hobbies.pop();

hobbies.attr() //-> ["basketball"];

hobbies.push("football");

hobbies //-> can.List["basketball","football"]
```

Use [.forEach], [.map], or [.filter] to loop through the array.  All 
these methods return a `can.List`

```
var intramurals = hobbies.map(function(hobby){
  return "intramural "+hobby;
})
intramurals //-> can.List["intramural basketball",
                          "intramural football"]
```

Listen to when a list changes by binding on `add` or `remove` or `length`
events.  

```
hobbies.bind("add", function(ev, newHobbies, index){
    console.log("added", newHobbies,"at", index);
  })
  .bind("remove", function(ev, removedHobbies, index){
    console.log("removed", newHobbies,"at", index);
  })
  .bind("length", function(ev, newVal, oldVal){
    console.log("length is", newVal);
  });

hobbies.splice(1,1,"pumpkin carving","gardening");
  // console.logs:
  //     removed [football] 1
  //     added ["pumpkin carving","gardening"] 1
  //     length is 3
```


By default, if you initialize a list with plain JavaScript objects,
those objects are converted to a `can.Map`:

```
var people = new can.List([
  {first: "Justin", last: "Meyer", age: 72},
  {first: "David", last: "Luecke", age: 20},
  {first: "Matthew", last: "Phillips", age: 30}
]);

people.attr(0).attr("first") //-> Justin
people.attr("0.first") //-> Justin
```

You can create your own custom `can.List` constructor functions
by extending `can.List`:

```
var People = can.List.extend({
  seniors: function(){
    return this.filter(function(person){
      return person.attr("age") >= 65
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

When extending `can.List` you can specify the default `Map` type
that's created when plain JS objects are added to the list:

```
var Person = can.Map.extend({
  fullName: function(){
    person.attr("first")+" "+person.attr("last");
  }
});

var People = can.List.extend({
  Map: Person
},{
  seniors: function(){
    return this.filter(function(person){
      return person.attr("age") >= 65
    });
  }
});

var people = new People([
  {first: "Justin", last: "Meyer", age: 72},
  {first: "David", last: "Luecke", age: 20},
  {first: "Matthew", last: "Phillips", age: 30}
]);

people.attr(0).fullName() //-> "Justin Meyer"
```

### can.compute

[can.compute](http://canjs.com/docs/can.compute.html) isn't used
directly much anymore. However, it's used heavily in [can.Map] 
[getters](http://canjs.com/docs/can.Map.prototype.define.get.html) and live binding 
so it's worth understanding the basics.


`can.compute` allows you to define single observable values like:

```
var age = can.compute(33);
```

or derived values like:

```
var person = new can.Map({first: "Justin", last: "Meyer"}),
    hobbies =  new can.List(["basketball", "hip-hop dancing"]);

var info = can.compute(function(){
  return person.attr("first")+" "+person.attr("last")+" is "+
  	age()+" and likes "+ hobbies.join(",")+".";
});
```

Read a compute by calling it like a function:

```
info() //-> "Justin Meyer is 33 and likes\
       //    basketball, hip-hop dancing."
```

Listen to a compute by binding on its `change` event:

```
info.bind("change", function(ev, newVal, oldVal){
  console.log("IS:\n",newVal,"\nWAS:\n", oldVal);
})
```

Internally, `bind` runs the compute function, identifying what observable
values it reads, and listening to them.  It caches the return result so that
reading the compute again like `info()` just returns the cached result.

When any of the read observables change, it updates the cached value,
and calls back any event handlers:

```
person.attr({first: "Brian", last: "Moschel"});

//  console.logs:
//  IS:
//  Brian Moschel is 33 and likes basketball, hip-hop dancing.
//  WAS:
//  Justin Meyer is 33 and likes basketball, hip-hop dancing.
```

### can.stache

[can.stache](http://canjs.com/docs/can.stache.html) is a Handlebars and
Mustache complient live-binding templating language.

Create a template programatically with `can.stache` like:

```
var template = can.stache("<h1>{{first}} {{last}}</h1>");
```

`template` is a __renderer__ function that when called with observable data,
returns a [documentFragment] that is updated when the observable data changes.

Add those fragments to the page to see the result.

```
var person = new can.Map({first: "Brian", last: "Moschel"})

var frag = template(person);

document.body.appendChild(frag);

document.body //-> <h1>Brian Moschel</h1>

person.attr({first: "Ramiya", last: "Meyer"})

document.body //-> <h1>Ramiya Meyer</h1>
```

In a DoneJS application, templates are used primarily as part of
a [can.Component] or as the [done-autorender]ed main template.  When used
in a [can.Component], the templates are often put in their own file.  For
example, a `person_edit.js` component file might have a `person_edit.stache` file like:

```
Update {{fullName}}:
<input {($value)}='first'/>
<input {($value)}='last'/>
```

This template's __renderer__ function is imported in `person_edit.js` like:

```
// person_edit.js
import template from "./person_edit.stache!";
import Component from "can/component/";

Component.extend({
  tag: "person-edit",
  template: template
});
```

`can.stache` template behavior is controlled by what's 
within magic tags like `{{ }}`. There are different tag types, lots of 
helper functions, and different ways to call methods and functions.

There's too much to cover so we will highlight the important APIs.

The different tag types:

 - [{{key}}](http://canjs.com/docs/can.stache.tags.escaped.html) - 
   inserts escaped value.
   
   ```
   stache("{{key}}")({key: "<b>Foo</b>"}) //-> `&lt;b&gt;Foo&lt;/b&gt;`
   ```

 - [{{{key}}}](http://canjs.com/docs/can.stache.tags.unescaped.html) - 
   inserts unescaped value.
   
   ```
   stache("{{key}}")({key: "<b>Foo</b>"}) //-> `<b>Foo</b>`
   ```

- [{{#key}} ... {{/key}}](http://canjs.com/docs/can.stache.tags.section.html) -
  renders the subsection depending on the value of the key.
  
  ```
  stache("{{#key}}A{{/key}}")({key: true}) //-> `A`
  stache("{{#key}}A{{/key}}")({key: false}) //-> ``
  stache("{{#key}}A{{/key}}")({key: [null,0]}) //-> `AA`
  stache("{{#key}}A{{/key}}")({key: []}) //-> ``
  
  stache("{{#key}}A{{else}}B{{/key}}")({key: false}) //-> `B`
  ```
  
  This also changes the [scope](http://canjs.com/docs/can.view.Scope.html):
  
  ```
  stache("{{#key}}{{child}}{{/key}}")({key: {child:"C"}}) //->`C`
  ```

- [{{^key}} ... {{/key}}](http://canjs.com/docs/can.stache.tags.inverse.html) -
  opposite of `{{#key}}`.
  
  ```
  stache("{{^key}}A{{/key}}")({key: true}) //-> ``
  stache("{{^key}}A{{/key}}")({key: false}) //-> `A`
  stache("{{^key}}A{{/key}}")({key: [null,0]}) //-> ``
  
  stache("{{^key}}A{{else}}B{{/key}}")({key: false}) //-> `A`
  ```

The following are stache's most commonly used helpers:

 - [{{#if}}] - 
 - [{{#is}}] - 
 - [{{#each}}] - 
 - [{{routeUrl hashes}}] -
 
[Call methods](http://canjs.com/docs/can.stache.expressions.html#section_Callexpression) in your scope like: `{{method(value)}}`

Example

### can.view.bindings

`can.view.bindings` allow you to:

 - pass data between element's properties, attributes, or View Model and `can.stache`'s scope.
 - bind to an element's events or an element's View Model's events.
 

 

### can.Component

### can.route

## Data Layer APIs

### can-set

### can-connect

## Testing APIs

### QUnit

### FuncUnit

### Testee

## DocumentJS

## DOM APIs

### jQuery

### jQuery++

## Server Side Rendering APIs

### can-ssr

### done-autorender

[done-autorender](https://github.com/donejs/autorender) is a Steal plugin that
enables using a [can.stache] template as your application's entry point. Create a template like:

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
the `export-as="viewModel"` attribute is a [can.Map] that acts as the View Model
(or application state) for the application.

If you have [live-reload] enabled done-autorender will additionally use those
APIs to re-render the application when any modules are reloaded.

done-autorender handles requests when running in Node for server-side rendering and
will wait for all asynchronous events to complete.

### can-simple-dom







 








