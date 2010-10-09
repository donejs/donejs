/*
@page creating 2.2. Creating Cookbook
@parent getstarted
<h1 class='addFavorite'>Creating Cookbook</h1>
<p>
	JavaScriptMVC uses generator scripts to assist you
	in setting up your application's files and folders.
</p>
<h2>Generating an Application</h2>
<p>To create your application, open a console window and 
navigate to your public directory. Run:
</p>
@codestart text
> js jquery\generate\app cookbook
@codeend

<p>This script creates an application folder and files. 
Here's what each file does:</p>
<DL>
    <DT><code>cookbook.js</code>
    <DD>The application file, 
    	load plugins and other JavaScript files.
    <DT><code>cookbook.html</code>
    <DD>A page that loads your application.
    
    <DT><code>funcunit.html</code>
    <DD>A page that runs your functional tests.
    
    <DT><code>funcunit.html</code>
    <DD>A page that runs your qunit tests.
    
    <DT><code>test/</code>
    <DD>A folder for your qunit and funcunit tests.
    
    <DT><code>docs/</code>
    <DD>A folder for your documentation files.
    
    <DT><code>scripts/</code>
    <DD>Scripts to document and compress your application.
    
    
    <DT><code>controllers/</code>
    <DD>A folder for code that manages events.
    <DT><code>models/</code>
    <DD>A folder code that manages Ajax requests.
    <DT><code>view/</code>
    <DD>A folder for client side templates
    <DT><code>resources/</code>
    <DD>A folder for 3rd party plugins and scripts.
    <DT><code>fixtures/</code>
    <DD>A folder for simulated ajax responses (So you don't have to wait on the slow poke backenders).
    
</DL>    
</p>
<p>We'll use cookbook.html for our application. 
If you need to make another page for your app you can generate it:
</p>
@codestart text
> js jquery\generate\page index cookbook
Generating ... index.html
@codeend
Or you add the steal script to an existing page 
page followed by <code>?cookbook</code> like:
@codestart html
&lt;script type='text/javascript'
        src='../path/to/steal.js?cookbook'>
&lt;/script>
@codeend
<h2>Scaffolding Recipes</h2>
<p>The scaffold generator creates all the code you need for simple 
Create-Read-Update-Delete (CRUD) functionality.  
For our cookbook app, we want to make recipes. 
To scaffold recipes run the following in a console:
</p>
@codestart text
> js jquery\generate\scaffold Cookbook.Models.Recipe
@codeend
<p>Here's what each part does:</p>
<DL>
    <DT><code>recipe_controller.js</code>
    <DD>Cookbook.Controllers.Recipe, like all [jQuery.Controller Controllers], respond to events such as click and manipulate the DOM.
    <DT><code>edit.ejs,init.ejs,list.ejs,show.ejs</code>
    <DD>[jQuery.View Views] are JavaScript templates for easily creating HTML.
    <DT><code>recipe_controller_test.js</code>
    <DD>[FuncUnit Tests] the CRUD functionality of the user interface.
    <DT><code>recipe.js</code>
    <DD>Cookbook.Models.Recipe [jQuery.Model model] performs AJAX requests by manipulating services.
    
    <DT><code>recipes.get</code>
    <DD>[jQuery.fixture Fixtures] simulate AJAX responses.  This fixture responds to GET '/recipes'.
    <DT><code>recipe_test.js</code>
    <DD>A [FuncUnit unit test] that tests Recipe model.
</DL>
<h2>Including Scripts</h2>
<p>After generating the scaffolding files, you must steal them in your application file.
Open <b>cookbook/cookbook.js</b> and steal your recipe controller and model as follows:</p>
@codestart
steal.plugins('jquery/controller','jquery/controller/subscribe',
			  'jquery/view/ejs',
			  'jquery/model/store',
			  'jquery/model',
			  'jquery/dom/fixture',
			  'jquery/dom/form_params')
     .resources()
     .models(<u><b>'recipe'</b></u>)
     .controllers(<u><b>'recipe'</b></u>)
     .views()
@codeend
<div class='whisper'>P.S. By default the app file loads
the most common MVC components and a few other useful plugins.
</div>
<p>
	To add tests to your unit and functional tests, 
	include them in your qunit.js 
	and funcunit.js files.
</p>
<p><b>cookbook/test/qunit/qunit.js</b></p>
@codestart
steal
  .plugins("funcunit/qunit", "cookbook")
  .then("cookbook_test",<u><b>"recipe_test"</b></u>)
@codeend
<div class='whisper'>P.S. qunit.js describes what scripts are loaded into qunit.html</div>
<p><b>cookbook/test/funcunit/funcunit.js</b></p>
@codestart
steal
 .plugins("funcunit")
 .then("cookbook_test",<u><b>"recipe_controller_test"</b></u>)
@codeend
<div class='whisper'>P.S. funcunit.js describes what scripts are loaded into funcunit.html</div>
<h2>Run Cookbook</h2>
<p>That's it. You've created a simple Cookbook application. Open cookbook.html in a browser. </p>
<img src='http://wiki.javascriptmvc.com/wiki/images/c/c8/Cookbook.png'/>

<p>Continue to [testing Testing Cookbook] or continue to read how this code works.</p>
<h2>How it Works</h2>
The Cookbook application's functionality can be broken into 4 parts:
<ul>
	<li>Loading scripts.</li>
	<li>Get and show recipes and recipe form.</li>
	<li>Create a recipe.</li>
	<li>Delete a recipe.</li>
	<li>Edit a recipe.</li>
</ul>
Lets see how this gets mapped to files in our Cookbook app.
<h3>Loading Scripts</h3>
In cookbook.html, you'll find a script tag like:
@codestart
&lt;script type='text/javascript' 
        src='../steal/steal.js?cookbook,development'>   
&lt;/script>
@codeend
This does 2 things:
<ol>
	<li>Loads the steal script.</li>
	<li>Tells steal to load the cookbook app (at <code>cookbook/cookbook.js</code>) in development mode.</li>
</ol>
When <code>cookbook/cookbook.js</code> runs, it loads a bunch of plugins, then loads the generated 
controller and model.
<h3>Get and Show Recipes and Recipe Form.</h3>
<p>When recipe_controller.js is loaded, it creates Cookbook.Controllers.RecipeController.  
RecipeController extends [jQuery.Controller controller]
and describes what events control recipe functionality.
</p>

<p>
Because RecipeController is a "document" controller 
(<code>onDocument: true</code>), 
it automatically listens on the document
element for events described by it's prototype methods.  
The <code>load</code> method listens for the window onload event and calls
RecipeController's <code>load</code> function.  
</p>
<p>
	The load function looks for a '#recipe' element in the page
	and creates one if not present.
	Then uses the <code>Recipe</code> model to retrieve a list of 
	recipes and callback the <code>list</code> function.
</p>
<b>In  Recipe.findAll ....</b>
<p>
	An Ajax request is made to <code>/recipe</code>, but because the [jQuery.fixtures fixtures] plugin
	is included, the ajax request is directed to <code>//cookbook/fixtures/recipes.json.get</code>.
	After the content is retrived from the fixture, new instances of Recipe are created with the
	[jQuery.Model.static.wrapMany wrapMany] function and passed to the success callback.
</p>
<div class='whisper'>
	P.S. [jQuery.fixtures Fixtures] are awesome and help 
	you develop while the slow-polk backend teams catch up.
	Once the service is ready you simply have to remove 
	the fixtures plugin from your application file.
</div>
<p>
	The success function is RecipeController's <code>list</code> method.  
	<code>List</code> replaces the "#recipe" element's 
	html with the content rendered by the template in
	<code>cookbook/views/recipe/init.ejs</code> with the 
	recipe's data.
</p>
<p>
	<code>cookbook/views/recipe/init.ejs</code> draws out the outline of the
	recipe table and the recipe form.  It uses the partial template 
	<code>'views/recipe/list'</code> to draw out the individual recipes.
	
</p>
<div class='whisper'>
	Multiple partial templates are used because other functionality will resuse them.
</div>
<h3>Create a Recipe.</h3>
<p>RecipeController listens for "form submit".  It's important to note that 
document controllers only respond to events in an element that has an id that matches
the name of the controller.  In this case, RecipeController only responds to "form submit"
events in "#recipe" element.</p>
<p>When the event happens, the formParams plugin is used to turn the name
and description fields into an object like:</p>
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
<p>
Success is the new recipe instance's [jQuery.Model.prototype.created created] function
which updates the attributes of the recipe and publishes an OpenAjax "recipe.created" message. 
</p>
<p>"recipe.created subscribe" messages are listened for in RecipeController.  Here,
RecipeController uses the list template to insert the new recipe's html into the page.</p>
<h3>Destroy a Recipe.</h3>
When a recipe's html "tr" element created, it is labeled with the recipe instance like this:
@codestart html
&lt;tr &lt;%= recipes[i]%> >
@codeend
This code adds  the following to the recipe element:
<ul>
	<li>the "recipe" class name</li>
	<li>a unique identifier to the class name: <code>cookbook_models_recipe_5</code></li>
	<li>the recipe instance to jQuery.data</li>
</ul>
Inside the tr, the destroy link look like this:
@codestart html
&lt;a class="destroy">destroy&lt;/a>
@codeend
Recipe controller listens for clicks on destroy in the  
<code>'.destroy click'</code> action.  if the person wants to destroy that
recipe, it uses <code>closest</code> to find the first parent with className= 
'recipe' and then gets back the model instance.  With that instance, it calls destroy.
<p>
  [jQuery.Model.prototype.destroy] calls Recipe.destroy with the id of the object to be 
  destroyed.  If successful, [jQuery.Model.prototype.destroyed] publishes a 
  <code>"recipe.destroyed"</code> OpenAjax event.  RecipeController
  listens for this event, then removes the element from the page.
</p>
<div class='whisper'>
PRO TIP: Use OpenAjax events instead of callback functions.  This will help you a lot if
you have a representation of the same instance in multiple places on the page.  For
example, if you have 2 todo lists with a shared todo.  If that todo is deleted in one
place, it will be removed in the other.
</div>
<h3>Edit Recipe</h3>
<p>
	Edit starts out similar to destroy - RecipeController listens for ".edit click" and gets
	the recipe instance from <code>model()</code>.  Then RecipeController replaces the 
	tr's html with the rendered content of the edit template.  
</p>
<p>
	The edit template adds an <b>Update</b> and <b>cancel</b>.  RecipeController 
	listens for <code>".update click"</code> and <code>".cancel click"</code>.  
</p>
<p>
	When <code>".update click"</code> happens, the model instance is updated
	with the values in the input elements.  This results in a call to
	Recipe.update which tries to send a put request to 'recipe/:id', but instead
	uses fixtures.  
</p>
<p>When the request complates, a <code>"recipe.updated"</code> message is published.
   RecipeController listens for these events, and uses the show template to
   render the updated content.
</p>
<p>
	When <code>".cancel click"</code> occurs, the tr's content is replaced using the
	show template.
</p>
<h2>Adding isTasty</h2>
I hate mushrooms.  I'd like to know if a recipe is tasty (it doesn't have mushrooms) and list it in the 
Recipe's table.  Here's how to do that:
<h3>Add isTasty to Cookbook.Models.Recipe</h3>
Add an isTasty method to the prototype object of Recipe model (at the end of recipe.js):
@codestart
/* @Prototype *|
{
  isTasty : function(){
    return !/mushroom/.test(this.name+" "+this.description)
  }
})
@codeend
<h3>Adding an "is tasty" column</h3>
In <code>cookbook/views/recipe/init.ejs</code> add a <b>th</b> like this:
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
Reload your page.  You should see the Tasty column.  Add a recipe with mushrooms
and Tasty? should be false.
<p>Continue to [testing Testing Cookbook].</p>
*/
//break ----------------------------------------------------------------------
