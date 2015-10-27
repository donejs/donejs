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
- [QUnit](#section_QUnit) - Default test assertion library. [api]
- [FuncUnit](#section_FuncUnit) - Functional test utilities. [api]
- [Testee](#section_Testee) - Browser launcher and test reporter. [api]
- [DoumentJS](#section=section_DocumentJS) - Documentation engine. [api](http://documentjs.com/)
- [jQuery] - DOM utilities. [api]
- [jQuery++] - Even more DOM utilities. [api]
- [can-ssr](#section=section_can_ssr) - Server-side rendering for NodeJS. [api](http://canjs.github.io/can-ssr/doc/)
- [can-ssr/app-map] - An application's ViewModel. [api]
- [done-autorender](#section=section_done_autorender) - Processes templates so they can be server-side rendered. [api](https://github.com/donejs/autorender#use)
- [can-simple-dom](#section=section_can_simple_dom) - A lightweight virtual DOM. [api]




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

1. A pushstate is triggered by user action, usually by clicking a link. Routes determine how the application will react to the change.

   ```
   can.route(':page', { page: 'home' });
   ```

2. [done-autorender](#section=section_done_autorender) previously bound the [can-ssr/app-map] to [can.route] which causes any change in the route to be reflected in the AppMap instance.

3. Live binding causes the initial template to reflect in the change in route. If the new route is `/chat` it will cause the `page` to be **chat**:

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

3. [can-import] will progressively load the component for the new page with a [Promise] as it's view model. When the promise resolves the [can.Component] will be inserted.



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

```
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
Mustache compliant live-binding templating language.

Create a template programmatically with `can.stache` like:

```
var template = can.stache("<h1>{{first}} {{last}}</h1>");
```

`template` is a __renderer__ function that, when called with observable data,
returns a [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) that is updated when the observable data changes.

Add those fragments to the page to see the result:

```
var person = new can.Map({first: "Brian", last: "Moschel"})

var frag = template(person);

document.body.appendChild(frag);

document.body //-> <h1>Brian Moschel</h1>

person.attr({first: "Ramiya", last: "Meyer"})

document.body //-> <h1>Ramiya Meyer</h1>
```

In a DoneJS application, templates are used primarily as part of
a [can.Component](#section=section_can_Component) or as the [done-autorender](#section=section_done_autorender)ed main template.

When used in a [can.Component](#section=section_can_Component), the templates are often put in their own file. For
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
   inserts an escaped value.

   ```
   can.stache("{{key}}")({key: "<b>Foo</b>"}) //-> `&lt;b&gt;Foo&lt;/b&gt;`
   ```

 - [{{{key}}}](http://canjs.com/docs/can.stache.tags.unescaped.html) -
   inserts an unescaped value.

   ```
   can.stache("{{key}}")({key: "<b>Foo</b>"}) //-> `<b>Foo</b>`
   ```

- [{{#key}} ... {{/key}}](http://canjs.com/docs/can.stache.tags.section.html) -
  renders a subsection depending on the value of the key.

  ```
  // boolean values render the subsection or it's inverse
  can.stache("{{#key}}A{{/key}}")({key: true}) //-> `A`
  can.stache("{{#key}}A{{/key}}")({key: false}) //-> ``
  can.stache("{{#key}}A{{else}}B{{/key}}")({key: false}) //-> `B`

  // iterative values render the subsection for each value
  can.stache("{{#key}}A{{/key}}")({key: [null,0]}) //-> `AA`
  can.stache("{{#key}}A{{/key}}")({key: []}) //-> ``

  ```

  The subsection is rendered with the `key` value as the top of the [scope](http://canjs.com/docs/can.view.Scope.html):

  ```
  can.stache("{{#key}}{{child}}{{/key}}")({key: {child:"C"}}) //->`C`
  ```

- [{{^key}} ... {{/key}}](http://canjs.com/docs/can.stache.tags.inverse.html) -
  opposite of `{{#key}}`.

  ```
  can.stache("{{^key}}A{{/key}}")({key: true}) //-> ``
  can.stache("{{^key}}A{{/key}}")({key: false}) //-> `A`
  can.stache("{{^key}}A{{/key}}")({key: [null,0]}) //-> ``

  can.stache("{{^key}}A{{else}}B{{/key}}")({key: false}) //-> `B`
  ```

The following are stache's most commonly used helpers:

 - [{{#if expr}} .. {{/if}}](http://canjs.com/docs/can.stache.helpers.if.html) - renders the subsection if the expr is truthy.

   ```
   can.stache("{{#if key}}A{{/if}}")({key: true}) //-> `A`
   can.stache("{{#if key}}A{{/if}}")({key: false}) //-> ``

   can.stache("{{#if key}}A{{else}}B{{/if}}")({key: false}) //-> `B`
   ```

 - [{{#is expr1 expr2}} ... {{/is}}](http://canjs.com/docs/can.stache.helpers.is.html) - compares two expressions and renders a subsection depending on the result.

   ```
   can.stache("{{#is page 'A'}}A{{/is}}")({page: 'A'}) //-> `A`
   can.stache("{{#is page 'A'}}A{{/is}}")({page: 'B'}) //-> ``

   can.stache("{{#is page 'A'}}A{{else}}C{{/is}}")({page: 'C'}) //-> `B`
   ```

 - [{{#each key}} ... {{/each}}](http://canjs.com/docs/can.stache.helpers.each.html) - renders a subsection for each item in a key's value.

   ```
   can.stache('{{#each hobbies}}<p>{{.}}</p>{{/each}}')(['Hockey', 'Hiking']) //-> `<p>Hockey</p><p>Hiking</p>`
   ```

    If the value of a key is a [can.List](#section=section_can_List) only the minimum amount of DOM updates occur when the list changes.

 - [{{routeUrl hashes}}](http://canjs.com/docs/can.stache.helpers.routeUrl.html) - generates a url using [can.route](#section=section_can_route) for the provided hashes.

   ```
   can.stache("<a href="{{routeUrl page='details' id='23'}}">{{name}}</a>")({name: 'Item 23'}) //-> `<a href="#!&page=details&id=23">Item 23</a>`
   ```

[Call methods](http://canjs.com/docs/can.stache.expressions.html#section_Callexpression) in your scope like: `{{method(value)}}`

```
can.stache('<p>10 {{pluralize("Baloon" 10)}}</p>')({
  pluralize: function(subject, howMany) {
    if(howMany > 1) {
      subject += 's';
    }
    return subject;
  }
}); //-> "<p>10 Baloons</p>"
```

### can.view.bindings

`can.view.bindings` allow you to:

 - pass data between element's properties, attributes, or View Model and `can.stache`'s scope.
 - bind to an element's events or an element's View Model's events.




### can.Component

### can.route

[can.route](http://canjs.com/docs/can.route.html) provides powerful 2-way, nested, routing to your application, supporting both hash and [pushstate](http://canjs.com/docs/can.route.pushstate.html). Routes are defined and then bound to your application's View Model:

```
// Specifies 'home' as the default page
can.route(":page", { page: 'home' }); 

can.route(":page/:slug");
can.route(":page/:slug/:action");
```

You can update the url by changing can.route:

```
can.route.attr("page", "restaurants");
// location.href -> "/restaurants"
```

Or change can.route by modifying the url:

```
history.pushState(null, null, "/");
// can.route.attr("page"); // -> "home"
```

In a DoneJS application can.route is bound to the [application View Model](#section=section_can_ssr_app_map), but you can also do this manually:

```
var Map = require("can/map/");

var AppViewModel = Map.extend({
 ...
});

var viewModel = new AppViewModel();

can.route.map(viewModel);
```

Which will cause any changes in the route to reflect in the View Model instance, and any changes in the View Model instance to reflect in the route.

## Data Layer APIs

### can-set

### can-connect

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
  QUnit.equal(vm.attr('message'), 'This is the my-component component');
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
    assert.equal(vm.attr('message'), 'This is the my-component component');
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

Here's how you would document a [can.Component](#section=section_can_Component) View Model:

```
/**
 * @add order/new
 */
export const ViewModel = Map.extend({
  define: {
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
        let items = this.attr('order.items');
        return items.attr('length');
      }
    }
  },

  /**
   * @function placeOrder
   *
   * Save the current order and update the status Deferred.
   *
   * @return {boolean} false to prevent the form submission
   */
  placeOrder() {
    let order = this.attr('order');
    this.attr('saveStatus', order.save());
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
    this.attr('order', new Order());
    this.attr('saveStatus', null);
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
[CanJS](#section=section_CanJS) is built making it safe to use jQuery when needed.

For example, you can make your own custom elements that call jQuery
plugins:

```
can.view.tag("tooltip", function(el){
  $(el).tooltip({
    content: el.getAttribute("content"), 
    items: "tooltip"
  });
})
```

[can.view.bindings](#section=section_can_view_bindings) lets you listen 
to [jQuery special events](http://benalman.com/news/2010/03/jquery-special-events/) like:

```
<div ($tripleclick)="doSomething()">
```

[can.Component](#section=section_can_Component)'s events object also supports this:  

```
can.Component.extend({
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

### can-ssr

[can-ssr](https://github.com/canjs/can-ssr) enables DoneJS applications to be
server-side rendered. Paired with [done-autorender](#section=section_done_autorender) 
it allows you to render the entire document from a single template.

```
var ssr = require("can-ssr");
var render = ssr();

render("/chat").then(function(response){
  // response.html === <html> ..
});
```

The render function is called with a string url to render and returns a response
object that contains the html string that was rendered. Use any Node-based
http framework with can-ssr.

For convenience it also comes with [Express](http://expressjs.com/) middleware:

```
var ssr = require("can-ssr/middleware");
var app = require("express")();

app.use(ssr(
  config: __dirname + "/package.json!npm"
));
```

Additionally it comes with [can-serve](https://github.com/canjs/can-ssr#server)
which acts as a rendering front-end for your application. It will host static
content, render your application, and proxy requests to another back-end server.

```
can-serve --proxy http://localhost:7070 --port 8080
```

### can-ssr/app-map

[can-ssr/app-map](http://canjs.github.io/can-ssr/doc/can-ssr.AppMap.html) is a [can.Map](#section=section_can_Map)
that aids in rendering a template that performs asynchronous operations (like Ajax).

The app-map is used as your application's View Model by extending it:

```
var AppMap = require("can-ssr/app-map");

module.exports = AppMap.extend({
  ...
});
```

Within a [can.Component](#section=section_can_Component) View Model you can use the app-map
to tell [can-ssr](#section=section_can_ssr) to wait for a request to finish:

```
exports.ViewModel = can.Map.extend({
  define: {
    orders: {
      get: function() {
        var params = {};
        var orderPromise = Order.getList(params);
        this.attr("%root").pageData("orders", params, orderPromise);
        return orderPromise;
      }
    }
  }
});
```

Using `pageData` will result in the response data being inlined into the page when using the
[inline-cache](http://canjs.github.io/can-ssr/doc/inline-cache.html) asset,
preventing a request for the data in the browser.

Additionally **can-ssr/app-map** contains a `statusCode` property that is useful for handling 404s
and other non-200 conditions:

```
{{#switch statusCode}}
    {{#case 404}}
        These are not the Droids you are looking for.
    {{/case}}
    {{#case 500}}
        Sorry, our API crashed.
    {{/case}}
    {{#default}}
        {{! spin up your application here}}
    {{/default}}
{{/switch}}
```

### done-autorender

[done-autorender](https://github.com/donejs/autorender) is a Steal plugin that
enables using a [can.stache](#section=section_can_stache) template as your application's entry point. Create a template like:

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
the `export-as="viewModel"` attribute is a [can.Map](#section=section_can_Map) that acts as the View Model
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
