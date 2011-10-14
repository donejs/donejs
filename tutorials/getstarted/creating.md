@page creating Creating Cookbook
@parent getstarted 0

We're going to create a basic cookbook application that
lets us create, and delete recipes. It will look like:

@image tutorials/getstarted/Cookbook.png



JavaScriptMVC uses 
[steal.generate generator scripts] to 
assist you
in setting up your application's 
files and folders.  They make everything you need to fall
into the pit of success!

## Generating an Application

To create your application, open a console window and 
navigate to your public directory. Run:

    > js jquery\generate\app cookbook


This script creates an application folder and 
files. Here's what each file does:


    cookbook/                // folder for your app
      cookbook.css           // css for your app
      cookbook.html          // a page for your app
      cookbook.js            // app file, loads other files
      docs/                  // documentation
      fixtures/              // simulated ajax responses
      funcunit.html          // functional test page
      models/                // model & data layers
      qunit.html             // unit test page
      scripts/               // command line scripts
        build.html           // html for build script
        build.js             // build script
        clean.js             // code cleaning / linting
        crawl.js             // generate search content
        docs.js              // create documentation
      test/                    
        funcunit             // functional tests
          cookbook_test.js   // functional test
          funcunit.js        // loads functional tests
        qunit/               // unit tests
          cookbook_test.js   // unit test
          qunit.js           // loads unit tests



We'll use cookbook.html for our application. If 
you need to make another page for your app you 
can generate it:

@codestart text
> js jquery\generate\page cookbook index.html
Generating ... index.html
@codeend

Or you add the steal script to an existing page 
page followed by <code>?cookbook</code> like:

@codestart html
&lt;script type='text/javascript'
        src='../path/to/steal/steal.js?cookbook'>
&lt;/script>
@codeend

If you open cookbook/cookbook.html, you'll see a
JavaScriptMVC welcome screen.  

@image tutorials/getstarted/Welcome.png



Open <code>cookbook/cookbook.html</code> and you will find:

@codestart html
&lt;script type='text/javascript' 
        src='../steal/steal.js?cookbook'>
@codeend

This line loads [steal] and tells steal to 
load <code>cookbook/cookbook.js</code>. <code>cookbook/cookbook.js</code> is
your application file.  Open it and you will find:

    steal(
	    './cookbook.css', 			// application CSS file
	    './models/models.js',		// steals all your models
	    './fixtures/fixtures.js',	// sets up fixtures for your models
	    function(){					// configure your application
		
	})

The application file loads and configures your applications resources.  Currently,
it's loading the app's css file, models and fixtures (there are no fixtures or models yet).

Now it's time to make some widgets, models, and fixtures that allow us to create and delete
recipes!  

## Scaffolding Recipes

We'll use the scaffold generator to quickly create:

  - A Recipe model for CRUDing recipes on the server
  - A Fixture for simulating a recipe service
  - A widget for creating recipes
  - A widget for listing and deleting recipes

  
To scaffold recipes run the following in the command-line console:

@codestart text
> js jquery\generate\scaffold Cookbook.Models.Recipe
@codeend

Here's what each part does:

__recipe.js__

Creates a recipe [jQuery.Model model] that is used
to create, retrieve, updated, and delete 
recipes on the server.

__recipe_test.js__

Tests the recipe model.

__fixtures.js__

The generator added code to simulate the Recipe Model's Ajax
requests (You might not have a Recipe service).

__recipe/create__

This folder contains the code, demo page, and tests for a
widget that creates Recipes.

__recipe/list__

This folder contains the code, demo page, and tests for a
widget that lists recipes.

__(steal added)__

The generator will also list files that 
say "(steal added)". For example:

@codestart text
cookbook/models/models.js (steal added)
@codeend    

The "(steal added)" means the generator is 
adding a steal call to load
a generated file for you.  For example, 
<code>cookbook/models/models.js</code> now steals your
<code>recipe.js</code> model like:

    steal('./recipe.js')

## Page Setup

After the generator runs, your application file (<code>cookbook.js</code>)
looks like:

    steal(
    	'./cookbook.css', 			// application CSS file
    	'./models/models.js',		// steals all your models
    	'./fixtures/fixtures.js',	// sets up fixtures for your models
	    'cookbook/create',
	    'cookbook/list',
	    function(){					// configure your application
    		
    		$('#recipes').cookbook_recipe_list();
    		$('#create').cookbook_recipe_create();
    })

You'll notice that it now loads <code>cookbook/create</code>
and <code>cookbook/list</code> and then tries to add these widgets to the
<code>#recipes</code> and <code>#create</code> elements.  

However, <code>#recipes</code> and <code>#create</code> elements do not 
exist.  All we have to do now is add them.  Open __cookbook/cookbook.html__
and add a <code>#recipes</code> __ul__ and a <code>#create</code> __form__
so it looks like:

@codestart html
&lt;!DOCTYPE HTML>
&lt;html lang="en">
	&lt;head>
		&lt;title>cookbook&lt;/title>
	&lt;/head>
	&lt;body>
	    &lt;h1>Welcome to JavaScriptMVC 3.2!&lt;/h1>
	    &lt;ul id='recipes'>&lt;/ul>
	    &lt;form id='create' action=''>&lt;/form>
		&lt;script type='text/javascript' 
	            src='../steal/steal.js?cookbook'>	 
        &lt;/script>
	&lt;/body>
&lt;/html>
@codeend

## Run Cookbook


That's it. You've created a simple Cookbook 
application. Open cookbook/cookbook.html in a browser. 

@image tutorials/getstarted/Cookbook.png



<div style='background-color: #dddddd;  margin: 20px 0px;padding: 20px'>
<p>
<b style='color:red'>NOTICE:</b> 
If you are having problems and 
using Chrome from the filesystem, it's because Chrome has an
[http://code.google.com/p/chromium/issues/detail?id=47416 insanely restrictive AJAX policies on the filesystem].
</p>
<p>
Essentially, Chrome does not allow AJAX requests to
files outside the html page's folder.  JavaScriptMVC
organizes your files into separate folders.
</p>
<p>
To fix this, just run JavaScriptMVC from a web server.
Or, you can use another browser.  Or you can add
<code>--allow-file-access-from-files</code> to Chrome's start script.
</p>
<p>
If you're annoyed like we are, 
[http://code.google.com/p/chromium/issues/detail?id=47416 star the issue]
and let 
google know you'd like Chrome to work on the filesystem!
</p>
</div>


Continue to [testing Testing Cookbook] or continue to read how
this code works.




## How it Works

The Cookbook application can be broken into 5 parts:

  - The Recipe Model
  - The Recipe Fixture
  - The Recipe Create control
  - The Recipe List control
  - The Cookbook application that puts it all together

### The Recipe Model and Fixture

<code>cookbook/models/recipe.js</code> looks like:

    steal('jquery/model', function(){
    
      $.Model('Cookbook.Models.Recipe',
      {
        findAll: "/recipes.json",
        findOne : "/recipes/{id}.json", 
        create : "/recipes.json",
        update : "/recipes/{id}.json",
        destroy : "/recipes/{id}.json"
      },
      {});
    })

This loads [jQuery.Model $.Model] and uses it to create a 
<code>Cookbook.Models.Recipe</code> class.  This class lets us
create, retrieve, update, and delete models programmatically like:

__create__

    // create a recipe instance
    var recipe = new Cookbook.Models.Recipe({
      name: 'Hot Dog',
      description: 'nuke dog, put in bun'
     })
  
    // call save to create on the server
    recipe.save()

__retrieve__

    // get recipes from the server
    Cookbook.Models.Recipe.findAll({}, function(recipes){
      // do something with recipes
    })

__update__

    // update the properties of a created recipe
    recipe.attrs({
      name: 'Bratwurst',
      description: 'nuke bratwurst, put in bun'
    });
  
    // call save to send updates to the server
    recipe.save()

__delete__

    // call destroy
    recipe.destroy()

Of course, we don't have a server to make requests to.  This is
where fixtures come in.

### The Recipe Fixture

[jQuery.fixture Fixtures] intercept Ajax requests and 
simulate the response. They are a great tool that enables
you to start work on the front end without a ready server.

Open <code>cookbook/fixtures/fixtures.js</code> and you will find:

    $.fixture.make("recipe", 5, function(i, recipe){
    	var descriptions = ["grill fish", "make ice", "cut onions"]
    	return {
    		name: "recipe "+i,
    		description: $.fixture.rand( descriptions , 1)
    	}
    })

The scaffold generator added this to simulate a server 
with 5 recipes.  Read more about how this works on
[jQuery.fixture.make make's documentation page].

### The Recipe Create Control

Open <code>cookbook/recipe/create/create.html</code> in your 
browser.  This page demos the Cookbook.Recipe.Create control and
lets you create recipes.  It lets us work on Cookbook.Recipe.Create
independent of the rest of the application.

Open <code>cookbook/recipe/create/create.js</code> to
see the Cookbook.Recipe.Create control's code:

    steal( 'jquery/controller',
           'jquery/view/ejs',
           'jquery/dom/form_params',
           'jquery/controller/view',
           'cookbook/models' )
    .then('./views/init.ejs', function($){

      $.Controller('Cookbook.Recipe.Create',
      {
        init : function(){
          this.element.html(this.view());
        },
        submit : function(el, ev){
          ev.preventDefault();
          this.element.find('[type=submit]').val('Creating...');
          new Cookbook.Models.Recipe(el.formParams()).save(this.callback('saved'));
        },
        saved : function(){
          this.element.find('[type=submit]').val('Create');
          this.element[0].reset();
        }
      });
    });

This code uses [steal] to load dependencies and then creates a 
<code>Cookbook.Recipe.Create</code> controller.  This creates
a <code>cookbook_recipe_create</code> jQuery helper function that
can be called on a form element like:

    $('form#create').cookbook_recipe_create()

When the jQuery plugin is called, the controller's <code>init</code>
method is called and runs 

    this.element.html(this.view());
    
This code renders the template at <code>cookbook/recipe/create/views/init.ejs</code>
into the controller's [jQuery.Controller.prototype.element element].

When the jQuery plugin is called controller also binds event handlers on the
controller's element.  In this case, it listens for "submit" events on the element.

When a submit event happens, it updates the submit button's text, then creates
a new recipe.

### The Recipe List Control

Open <code>cookbook/recipe/create/create.html</code> in your 
browser.  This page demos the Cookbook.Recipe.List control. It loads
Recipes from the server, lets you delete recipes, and it also 
listens for recipes being created and adds them to the list.

Open <code>cookbook/recipe/list/list.js</code> to
see the Cookbook.Recipe.Create control's code:

    $.Controller('Cookbook.Recipe.List',
    {
      init : function(){
        this.element.html(this.view('init',Cookbook.Models.Recipe.findAll()) )
      },
      '.destroy click': function( el ){
        if(confirm("Are you sure you want to destroy?")){
          el.closest('.recipe').model().destroy();
        }
      },
      "{Cookbook.Models.Recipe} destroyed" : function(Recipe, ev, recipe) {
        recipe.elements(this.element).remove();
      },
      "{Cookbook.Models.Recipe} created" : function(Recipe, ev, recipe){
        this.element.append(this.view('init', [recipe]))
      },
      "{Cookbook.Models.Recipe} updated" : function(Recipe, ev, recipe){
      	recipe.elements(this.element)
              .html(this.view('recipe', recipe) );
      }
    });

When the List control is added to the page, <code>init</code> is called:

    this.element.html(this.view('init',Cookbook.Models.Recipe.findAll()) )

This beautiful one-liner does 4 things:

  - Requests recipes from the server
  - Loads the <code>cookbook/recipe/list/views/init.ejs</code> template
  - When both recipes and the template have loaded, renders it
  - Inserts the result into the list element

<code>init.ejs</code> looks like:

@codestart html
&lt;%for(var i = 0; i &lt; this.length ; i++){ %>
	&lt;li &lt;%= this[i]%> >
		&lt;%== $.View('//cookbook/recipe/list/views/recipe.ejs', this[i] )%>
	&lt;/li>
&lt;%}%>
@codeend

This iterates through the recipes retrieved from the server.  For each
recipe, it creates an LI element and renders the <code>recipe.ejs</code>
sub-template.

Notice that the view 'adds' each recipe instance to its LI element with:

@codestart
&lt;%= this[i]%>
@codeend

This adds the model to jQuery.data and sets a 'recipe' className on the 
LI element.  We'll make use of this in a moment.

__Destroying Recipes__

Each recipe has a destroy link.  When it is clicked on the list's
<code>'.destroy click'</code> method is called:

    if(confirm("Are you sure you want to destroy?")){
      el.closest('.recipe').model().destroy();
    }

This method checks if you want to destroy the method.  If you do,
it finds the parent 'recipe' element and gets back the model instance (that's
in jQuery.data).  It then calls [jQuery.Model.prototype.destroy model's destroy] method.

When a model is destroyed, it creates a <code>destroyed</code> event.  The List control 
listens to these events with:

    "{Cookbook.Models.Recipe} destroyed" : function(Recipe, ev, recipe) {
      recipe.elements(this.element).remove();
    }

So, when a destroyed event happens, the List controller will look for [jQuery.fn.elements elements] that
have the recipe in jQuery.data and then remove them.

__Creating Recipes__

When a recipe is created, a "created" event is triggered.  The List control listens for this
with:

    "{Cookbook.Models.Recipe} created" : function(Recipe, ev, recipe){
      this.element.append(this.view('init', [recipe]))
    }

So, when a recipe is created, it will render the init view with the recipe and append the
result to the recipe element.

__Updating Recipes__

When a recipe is updated, an "updated" event is triggered. The List control listens for this
with:

    "{Cookbook.Models.Recipe} updated" : function(Recipe, ev, recipe){
      recipe.elements(this.element)
            .html(this.view('recipe', recipe) );
    }

So, when a recipe is updated, List will update that element's html.

### Putting it all Together

The cookbook application loads both of these widgets and adds them to the page.
When Cookbook.Recipe.Create creates a Recipe, it creates a 'created' event which
Cookbook.Recipe.List listens for and adds that newly created recipe to its list
of recipes.

Continue to [testing Testing Cookbook].
