@page gettingstarted

Welcome to the getting started guide!  This getting started guide walks 
you through creating a simple cookbook app that uses all core parts of 
JavaScriptMVC.  It's purpose is to give you a high level overview of JavaScriptMVC's functionality.

## Breakdown

JavaScriptMVC is divided into 4 independent sub projects:

jQueryMX - jQuery MVC and other extensions.
StealJS - Dependency Managment and build tool system.
DocumentJS - A documentation Engine
FuncUnit - A web testing framework

Every project has different needs.  Your project might not need (or even 
want) to use all of JavaScriptMVC.  That's fine because each part of 
JavaScriptMVC works without every other part. If you want only want one 
part, click that part above and you'll be directed to it's getting 
started guide.

## jQueryMX

jQueryMX is a collection of useful jQuery extensions broken down
into four broad categories:

### Model-View-Controller

Model lets you connect to services and model data - getting events when data changes.

View provides templates.

Controller.

__DOM Extensions__

__Special Events__

__Language Helpers__


## StealJS

StealJS is a dependency management and build tool system.  It packs tons of useful scripts that help you:

  - Load JavaScript, CSS, Less, CoffeeScript, and templates.
  - Combine and minifiy files into fewer and smaller downloads.
  - Lint and beautify scripts
  - Log messages that 
  - Install 3rd party scripts and dependencies
  - Generate Google crawl-able pages of your ajax apps.

### Loading Scripts

Load scripts by 
adding <code>steal/steal.js</code> to your page with the path to your script
in the querystring:

    <script type='text/javascript'
            src='../steal/steal.js?cookbook/cookbook.js'></script>

Then, use steal to load any files you need:

    steal('widgets/list',
          'models/recipe.js')
    .then('views/recipes.ejs', 
          function(){
            // runs when everything else has finished
          })








