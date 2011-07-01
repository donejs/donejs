@page creating Creating Cookbook
@parent getstarted 1

We're going to create a basic cookbook application that
lets us create, read, update, and delete (CRUD) 
recipes. It will look like:

<img src='http://wiki.javascriptmvc.com/wiki/images/c/c8/Cookbook.png'/>

JavaScriptMVC uses 
[steal.generate generator scripts] to 
assist you
in setting up your application's 
files and folders.  They make everything you need to fall
into the pit of success!

## Generating an Application

To create your application, open a console window and 
navigate to your public directory. Run:

@codestart text
> js jquery\generate\app cookbook
@codeend

This script creates an application folder and 
files. Here's what each file does:

@codestart
cookbook/                // app for your folder
  cookbook.css           // css for your app
  cookbook.html          // a page for your app
  cookbook.js            // app file, loads other files
  controllers/           // plugins & widgets
  docs/                  // documentation
  fixtures/              // simulated ajax responses
  funcunit.html          // functional test page
  models/                // model & data layers
  qunit.html             // unit test page
  resources/             // 3rd party scripts
  scripts/               // command line scripts
    build.html           // html for build script
    build.js             // build script
    clean.js             // code cleaning / linting
    docs.js              // create documentation
  test/                    
    funcunit             // functional tests
      cookbook_test.js   // functional test
      funcunit.js        // loads functional tests
    qunit/               // unit tests
      cookbook_test.js   // unit test
      qunit.js           // loads unit tests
  views/                 // client side templates
@codeend

Read [folders Folder and File Organization]
for more information.

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

<img src='http://wiki.javascriptmvc.com/wiki/images/4/42/Welcome.png' />

## Scaffolding Recipes

The scaffold generator creates all the code you need for simple 
Create-Read-Update-Delete (CRUD) functionality.  
For our cookbook app, we want to make recipes. 
To scaffold recipes run the following in a console:

@codestart text
> js jquery\generate\scaffold Cookbook.Models.Recipe
@codeend

Here's what each part does:

<DL>
<DT><code>recipe\_controller.js</code></DT>
<DD>Cookbook.Controllers.Recipe, like all [jQuery.Controller Controllers], 
	respond to events such as click and manipulate the DOM.</DD>
<DT><code>edit.ejs,init.ejs,list.ejs,show.ejs</code></DT>
<DD>[jQuery.View Views] are JavaScript templates for easily creating HTML.</DD>
<DT><code>recipe\_controller\_test.js</code></DT>
<DD>[FuncUnit Tests] the CRUD functionality of the user interface.</DD>
<DT><code>recipe.js</code></DT>
<DD>Cookbook.Models.Recipe [jQuery.Model model] performs AJAX requests by manipulating services.</DD>
<DT><code>recipes.get</code></DT>
<DD>[jQuery.fixture Fixtures] simulate AJAX responses.  This fixture responds to GET '/recipes'.</DD>
<DT><code>recipe_test.js</code></DT>
<DD>A [FuncUnit unit test] that tests Recipe model.</DD>
</DL>


## Including Scripts


After generating the scaffolding files, you
must steal them in your application file. Open <b>cookbook/cookbook.js</b> and modify the code to steal
your recipe controller 
and model as follows:
  
@codestart
steal.plugins(	
	'jquery/controller',			
	'jquery/controller/subscribe',	
	'jquery/view/ejs',	
	'jquery/controller/view',			
	'jquery/model',					
	'jquery/dom/fixture',			
	'jquery/dom/form_params')		
	.css('cookbook')	
	            
	.resources()					
	.models('recipe')						
	.controllers('recipe')					
	.views();
@codeend

<div class="whisper">P.S. By default the app file loads
the most common MVC components and a few other useful plugins.
</div>

To add your unit and functional tests, 
include them in your qunit.js 
and funcunit.js files.

<b>
cookbook/test/qunit/qunit.js
</b>

@codestart
steal
  .plugins("funcunit/qunit", "cookbook")
  .then("cookbook_test",<u><b>"recipe_test"</b></u>)
@codeend

<div class="whisper">
P.S. qunit.js describes what scripts are loaded into qunit.html
</div>

<b>
cookbook/test/funcunit/funcunit.js
</b>

@codestart
steal
 .plugins("funcunit")
 .then("cookbook_test",<u><b>"recipe_controller_test"</b></u>)
@codeend

<div class="whisper">
P.S. funcunit.js describes what scripts are loaded into funcunit.html
</div>

## Run Cookbook


That's it. You've created a simple Cookbook 
application. Open cookbook/cookbook.html in a browser. 

<img src='http://wiki.javascriptmvc.com/wiki/images/c/c8/Cookbook.png'/>

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


The Cookbook application's functionality can be broken into 4 parts:

  - Loading scripts.
  - Get and show recipes and recipe form.</li>
  - Create a recipe.
  - Delete a recipe.
  - Edit a recipe.


Lets see how this gets mapped to files in our Cookbook app.

### Loading Scripts

In cookbook.html, you'll find a script tag like:

@codestart
&lt;script type='text/javascript' 
        src='../steal/steal.js?cookbook'>   
&lt;/script>
@codeend

This does 2 things:

 - Loads the steal script.
 - Tells steal to load the cookbook app (at <code>cookbook/cookbook.js</code>) in development mode.
 
When <code>cookbook/cookbook.js</code> runs, it loads a bunch of 
plugins, then loads the generated 
controller and model.

### Get and Show Recipes and Recipe Form.

When recipe_controller.js is loaded, it 
creates Cookbook.Controllers.RecipeController.  

RecipeController extends [jQuery.Controller controller]
and describes what events control recipe functionality.

Because RecipeController is a "document" controller 
(<code>onDocument: true</code>), 
it automatically listens on the document
element for events described by it's prototype methods.  The 
<code>load</code> method listens for the window onload event 
and calls RecipeController's <code>load</code> function.  



The load function looks for a '#recipe' element in the page
and creates one if not present. Then uses 
the <code>Recipe</code> model to retrieve a list of 
recipes and callback the <code>list</code> function.

<b>In  Recipe.findAll ....</b>


An Ajax request is made to <code>/recipe</code>, 
but because the [jQuery.fixture fixtures] plugin
is included, the ajax request is 
directed to <code>//cookbook/fixtures/recipes.json.get</code>. After 
the content is retrived from the fixture, 
new instances of Recipe are created with the
[jQuery.Model.static.wrapMany wrapMany] function
 and passed to the success callback.

<div class='whisper'>
	P.S. [jQuery.fixture Fixtures] are awesome and help 
	you develop while the slow-poke backend teams catch up.
	Once the service is ready you simply have to remove 
	the fixtures plugin from your application file.
</div>


The success function is RecipeController's <code>list</code> method.  
<code>List</code> replaces 
the "#recipe" element's 
html with the content rendered 
by the template in
<code>cookbook/views/recipe/init.ejs</code> with the 
recipe's data.

<code>cookbook/views/recipe/init.ejs</code> draws out the outline of the
recipe table and the recipe form.  It uses the partial template 
<code>'views/recipe/list'</code> to draw out the individual recipes.
	

<div class='whisper'>
	Multiple partial templates are used because other functionality will resuse them.
</div>


### Create a Recipe.


RecipeController listens for "form submit".  It's 
important to note that 
document controllers only respond to events in an 
element that has an id that matches
the name of the controller.  In this case, RecipeController
 only responds to "form submit"
events in "#recipe" element.


When the event happens, the formParams plugin is used to turn the name
and description fields into an object like:

@codestart
{
  name: "The entered name",
  description : "The entered description" 
}
@codeend

These attributes are passed to create a new recipe.  When 
[jQuery.Model.prototype.save save] is called, Recipe model's
create function is called with the recipe's attributes.
In <code>Recipe.create</code> a post request is sent to
"/recipes", but intercepted by the fixtures plugin.  Instead, fixtures call
back success with a JSON object that looks like:


@codestart
{
  "id": <u><b>100</b></u>,
  "name": "The entered name",
  "description" : "The entered description" 
}
@codeend


Success is the new recipe instance's 
[jQuery.Model.prototype.created created] function
which updates the attributes of the recipe and 
publishes an OpenAjax "recipe.created" message. 

"recipe.created subscribe" messages are listened 
for in RecipeController.  Here, RecipeController uses the 
list template to insert the new 
recipe's html into the page.


### Destroy a Recipe.

When a recipe's html "tr" element created, it is 
labeled with the recipe instance like this:

@codestart html
&lt;tr &lt;%= recipes[i]%> >
@codeend

This code adds  the following to the recipe element:

  - the "recipe" class name
  - a unique identifier to the class name: <code>cookbook_models_recipe_5</code>
  - the recipe instance to jQuery.data
  
Inside the tr, the destroy link look like this:

@codestart html
&lt;a class="destroy">destroy&lt;/a>
@codeend

Recipe controller listens for clicks on destroy in the  
<code>'.destroy click'</code> action.  if the person wants to destroy that
recipe, it uses <code>closest</code> to find the first parent with className= 
'recipe' and then gets back the model instance.  With that instance, it calls destroy.


[jQuery.Model.prototype.destroy] calls Recipe.destroy with the id of the object to be 
destroyed.  If successful, [jQuery.Model.prototype.destroyed] publishes a 
<code>"recipe.destroyed"</code> OpenAjax event.  RecipeController
listens for this event, then removes the element from the page.

<div class='whisper'>
PRO TIP: Use OpenAjax events instead of callback functions.  This will help you a lot if
you have a representation of the same instance in multiple places on the page.  For
example, if you have 2 todo lists with a shared todo.  If that todo is deleted in one
place, it will be removed in the other.
</div>

### Edit Recipe


Edit starts out similar to destroy - RecipeController listens for ".edit click" and gets
the recipe instance from <code>model()</code>.  Then RecipeController replaces the 
tr's html with the rendered content of the edit template.  


The edit template adds an <b>Update</b> and <b>cancel</b>.  RecipeController 
listens for <code>".update click"</code> and <code>".cancel click"</code>.  


When <code>".update click"</code> happens, the model instance is updated
with the values in the input elements.  This results in a call to
Recipe.update which tries to send a put request to 'recipe/:id', but instead
uses fixtures.  

When the request complates, a <code>"recipe.updated"</code> message is published.
RecipeController listens for these events, and uses the show template to
render the updated content.


When <code>".cancel click"</code> occurs, the tr's content is replaced using the
show template.

## Adding isTasty

I hate mushrooms.  I'd like to know if a recipe is 
tasty (it doesn't have mushrooms) and list it in the 
Recipe's table.  Here's how to do that:


### Add isTasty to Cookbook.Models.Recipe

Add an isTasty method to the prototype 
object of Recipe model (at the end of recipe.js):

@codestart
/* @Prototype *|
{
  isTasty : function(){
    return !/mushroom/.test(this.name+" "+this.description)
  }
})
@codeend

### Adding an "is tasty" column

In <code>cookbook/views/recipe/init.ejs</code> 
add a <b>th</b> like this:

@codestart html
&lt;% for(var attr in Cookbook.Models.Recipe.attributes){%>
    &lt;% if(attr == 'id') continue;%>
    &lt;th><%= attr%> &lt;/th>    
&lt;%}%>
<u><b>&lt;th>Tasty?&lt;/th></b></u>
&lt;th>Options&lt;/th>
@codeend

In <code>cookbook/views/recipe/show.ejs</code> add a <b>td</b> like this:

@codestart html
&lt;%for(var attribute in this.Class.attributes){%>
    &lt;%if(attribute == 'id') continue;%>
    &lt;td class='&lt;%= attribute%>'>
            &lt;%=this[attribute]%>
    &lt;/td>
&lt;%}%>
<u><b>&lt;td>&lt;%= this.isTasty() %>&lt;/td></b></u>
&lt;td>
    &lt;a href='javascript: void(0)' class='edit'>edit&lt;/a>
    &lt;a href='javascript: void(0)' class='destroy'>destroy&lt;/a>
&lt;/td>
@codeend

Reload your page.  You should see the 
Tasty column.  Add a recipe with mushrooms
and Tasty? should be false.

Continue to [testing Testing Cookbook].
