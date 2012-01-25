## 3.2.2 (1/20/12)

### JavaScriptMVC

- MXUI library is now officially in beta

### StealJS

- added steal.instrument
- better diagnostics in env.js
- better diagnostics in build process
- added isDirectory, move; fixed isFile in steal.File
- fixed parser to handle hex literals
- phantom supports https protocol
- fixed loaded bug
- added toClass on generators
- fixed CSS url and data references in production builds
- improved error handling in steal.request 
- upgrade to LESS v1.1.6
- fixed cache busting in IE
- fixed steal.crawl to handle subdirectories
- changed //@ to //! prefix in steal directives

### jQueryMX

- updated docs for plugin hookups
- removed OpenAjax integration from $.Model
- fixed bug with unique in model
- EJS now accepts blocks
- improvements and fixes to $.Observe, $.route and $.Model.List
- form_params fixes and documentation updates
- don't hookup val() or text()
- resize event correctly propagates extra data
- fixed drop so it handles elements removed from the DOM
- $.Model.serialize() calls converter with the Class scope

### FuncUnit

- added coverage option to view test coverage via cobertura
- added noautorun option to run tests individually or on demand
- fixing bug in S.open of URLs that have a hash
- supporting timeouts for waits
- every action has an implicit exists() before it runs
- added node proxy script
- updated selenium to support FF8
- added an optional message parameter which adds an assertion for wait conditions
- fixed iframe-lookup logic to work in IE

### Syn

- fixed problem with keypress not being changed by a focus in keydown
- fixed center-of-element calculation for IE

## 3.2.1 (10/18/11)

### Steal

- Fixed a bug in steal/html that made it unusable

### FuncUnit

- Fixed a bug in PhantomJS steal.browser

## 3.2 (10/15/11)

### JavaScriptMVC

- Updated Getting Started Guide
- Added tutorials for FuncUnit, jQueryMX, and StealJS
- Added examples for Contacts, PlayerMX, Todo, and Srchr apps.
- Added Organizing your App, Searchable Ajax Apps, Migrating to 3.1, and Ajax Service Guidelines tutorial

### StealJS

- js accepts `-e` to exit on error
- steal works asynchronously 
- steal uses suffix as type (using steal.type)
- removed steal.plugins, steal.less, steal.css, etc.
- added steal.parse
- fixed bug with steal.dev not handling nested parenthesis
- added steal.html and steal.html.crawl
- IE loads more than 32 styles
- added steal.browser
- steal.get can follow steals and install dependencies
- added steal.loaded and steal.has

### jQueryMX

  - Better distance calculation on drag-drop
  - $.Range fixes for IE
  - Added $.Observe and $.route
  - fixtures handle 0 based ids
  - CoffeeScript generator
  - Moved string helpers to lang/string
  - Added $.Object helpers
  - $.fixture can intercept a request and handle templated urls.
  - Updated generators to insert steal requests auto-magically
  - FormParams leaves values as strings by default.
  - dimensions works when not provided an element
  - upgraded to jQuery 1.6.4
  
#### View

  - EJS escapes content by default.  Use <%== to not escape.
  - Bugs fixed jQuery modify helpers when not passing html.
  - EJS filenames show up in firebug on the filesystem.


#### Controller

  - Removed Document Controllers
  - pluginName works right
  - Controller's can bind on constructors or other functions.
  - plugin helper code happens in setup
  - update rebinds event handlers

#### Model

  - added beta $.Model.Store
  - Removed associations, added convert
  - removed wrap and wrapMany in favor of model and models.
  - Model.List creates updated events instead of update events.
  - Model uses static update and destroy for ajax events.
  
### FuncUnit

  - 'inherits' from jQuery via .sub()
  - Uses steal.browser so PhantomJS and browsers can work
  - Faster Page Opening
  - Uses latest QUnit
  

### Syn

  - rightclick works better

### DocumentJS

  - caches content in localStorage
  - better breadcumb
  - handles .md files
 

## 3.1 (5/17/2011)

### JavaScriptMVC

- Added getjmvc script
- Added install script for windows
- Added new init page with framework overview
- Added error level (-e) support to the js.bat (Windows) and ./js (Mac, Linux)

### jQueryMX

- jQuery upgraded to 1.6.1
- .val method supports Views. EX: $('input').val('view_name', {});
- Added range plugin
- Added deparam plugin - Takes a string of name value pairs and returns a Object literal that represents those params.

#### Model

- Deferreds and Converter Support.
- Added VERB support to parameterized CRUD urls.  EX:  update: "POST /recipe/update/{id}.json"
- Global model events. EX: Recipe.bind('update', func).
- Attribute update event. EX: recipe.bind('updated.attr', func);
- Model.list upgraded to handle findAll, findOne
- AJAX converters are renamed: wrap -> model and wrapMany -> models
- Added dataType optional param to the ajax function
- Added filters to Fixtures
- Models and Fixtures support create, delete, and update model encapsulation.

#### Events

- Added swipe, swipeleft and swiperight events
- Swipe left and swipe right added to jQuery.event.special for autobinding with controller
- Hover can set leave. EX: $('.elem').bind('hoverleave', func)
- Hover only runs one Mouseenter / Mouseleave per selector at a time
- Added support for HTML5 history API
- Drag and drop allows adding drops after drag has started 
- Drag doesn't select text anymore
- Limit and step take center param
- Limit can limit center of drag
- Added pause and resume for events

#### Controller

- Added object binding to parameterized controller events.  EX: "{window} load".
    
#### View

- Deferreds support
- Better warning when templates don't exist
    
#### Funcunit

- Changes to the repeat API.
- Added eval.
- Added examples.

#### Syn

- Syn adjusts scrolling for drag / move positions not in the page.
- Syn loads in Rhino, and documentation can be generated.
- Syn works under Env.js.