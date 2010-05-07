/*
 * @page getstarted 2. Get Started
 * @tag home, get started
 * <h1 class='addFavorite'>Get Started</h1>
 * This guide introduces the most important aspects of JavaScriptMVC (JMVC) by 
 * creating a simple cookbook application.
 * <h2>The Video</h2>
 * <a href='http://cdn.javascriptmvc.com/videos/2_0/2_0_demo.htm' id='video' class='big_button floatLeft'>
     <span>Watch</span>
     <span class='label'>2.0 Video</span>
 </a>  Check out the <a href='http://javascriptmvc.s3.amazonaws.com/videos/2_0/2_0_demo.htm'>
 JavaScriptMVC 2.0</a> video that walks you through much of the getting started guide.
 * <h2 class='spaced'>Basics</h2>
 * Before jumping in, there are some things you should know:
 * <h3>Folder Structure</h3>
 * JMVC logically separates your files with the following folder structure:<br/>
 * <img src='http://wiki.javascriptmvc.com/wiki/images/d/d7/File_structure.png'/>
 * <h3>Plugins</h3>
 * Everything is a plugin.  Just [include.static.plugins include] the ones you need. Plugins load their
 * own dependencies.  
 * @codestart
 * include.plugins('model','view','controller');
 * @codeend
 * <h3>Environments</h3>
 * There are different environments for each phase of development:
 * <ul>
 *     <li><span class='gray'>Development</span> - optimized for debugging</li>
 *     <li><span class='gray'>Test</span> - loads console and application tests</li>
 *     <li><span class='gray'>Production</span> - loads compressed application file </li>
 * </ul>
 * <h2>Making a Cookbook</h2>
 * Lets get started by [install installing JavaScriptMVC].
 */
//break


/*
@page install 2.1. Installing JavaScriptMVC

<h1 class='addFavorite'>Installing JavaScriptMVC</h1>
<p>[download Download] the latest JavaScriptMVC. Unzip the folder on your file system or web server.  If you are using this on a webserver, put JMVC in a public folder.</p>
<p>A simple JavaScriptMVC application is running in index.html. You may want to refer to this as a reference.
</p>
<h2>Updating JavaScriptMVC</h2>
Update JavaScriptMVC to the latest/best code.  In a console, type: 
@codestart text
C:\workspace\Cookbook>js jmvc\update
@codeend
Continue to [creating Creating Cookbook].
 */
//break ---------------------------------------------------------------------

/*
@page creating 2.2. Creating Cookbook
<h1 class='addFavorite'>Creating Cookbook</h1>
<p>JavaScriptMVC uses generator scripts to assist you in setting up your application's files and folders.
</p>
<h2>Generating an Application</h2>
<p>To create your application, open a console window and navigate to your public directory. Run:
</p>
@codestart text
C:\workspace\Cookbook>js jmvc\generate\app cookbook
Generating...

     apps/cookbook
     apps/cookbook/init.js
     apps/cookbook/compress.js
     apps/cookbook/test
     apps/cookbook/test/unit.js
     apps/cookbook/test/run_unit.js
     apps/cookbook/test/functional.js
     apps/cookbook/test/run_functional.js
     apps/cookbook/test/selenium_config.js
     apps/cookbook/docs
     test/unit/truth_test.js
     test/functional/truth_functional_test.js
     cookbook.html

     Make sure to add new files to your application and test file!
@codeend

<p>This script creates an application folder and files. 
Here's what each file does:</p>
<DL>
    <DT><code>init.js</code>
    <DD>The application file, which apps use to load plugins and other JavaScript files.
    <DT><code>compress.js</code>
    <DD>Compresses your application.
    <DT><code>unit.js</code>
    <DD>Loads unit tests.
    <DT><code>run_unit.js</code>
    <DD>Runs unit tests in Rhino.
    <DT><code>functional.js</code>
    <DD>Loads functional tests.
    <DT><code>run_functional.js</code>
    <DD>Runs functional tests in Selenium.
    <DT><code>selenium_config.js</code>
    <DD>Configures Selenium options.
    <DT><code>truth_test.js + truth_functional_test.js</code>
    <DD>Simple unit and functional tests.
    <DT><code>cookbook.html</code>
    <DD>A page that loads your application.
</DL>    
</p>
<p>We'll use cookbook.html for our application. But if you need to make another page for your app:
</p>
@codestart text
C:\workspace\Cookbook>js jmvc/generate/page cookbook index.html
Generating ... index.html
@codeend
<h2>Scaffolding Recipes</h2>
<p>The Scaffold Generator creates all the code you need for simple 
Create-Read-Update-Delete (CRUD) functionality.  For our cookbook app, we want to make recipes. 
To scaffold recipes run the following in a console:
</p>
@codestart text
C:\workspace\Cookbook>js jmvc/generate/scaffold Recipe
Generating...

             controllers
             controllers/recipe_controller.js
             views/recipe
             views/recipe/edit.ejs
             views/recipe/init.ejs
             views/recipe/list.ejs
             views/recipe/show.ejs
             test/functional/recipe_controller_test.js
             models
             models/recipe.js
             test/fixtures/recipes.get
             test/unit/recipe_test.js

             Make sure to add new files to your application and test file!
@codeend
<p>Here's what each part does:</p>
<DL>
    <DT><code>recipe_controller.js</code>
    <DD>RecipeController, like all [jQuery.Controller Controllers], respond to events such as click and manipulate the DOM.
    <DT><code>edit.ejs,init.ejs,list.ejs,show.ejs</code>
    <DD>[jQuery.View Views] are JavaScript templates for easily creating HTML.
    <DT><code>recipe_controller_test.js</code>
    <DD>[jQuery.Test.Functional Tests] the CRUD functionality of the user interface.
    <DT><code>recipe.js</code>
    <DD>The Recipe [jQuery.Model model] performs AJAX requests by manipulating services.
    
    <DT><code>recipes.get</code>
    <DD>[fixtures Fixtures] simulate AJAX responses.  This fixture responds to GET '/recipes'.
    <DT><code>recipe_test.js</code>
    <DD>A [jQuery.Test UnitTest] that tests Recipe model.
</DL>
<h2>Including Scripts</h2>
<p>After generating the scaffolding files, you must include them in your application.
Open <b>apps/cookbook/init.js</b> and include your recipe controller and model as follows:</p>
@codestart
include.plugins('controller','view','dom/fixtures','dom/form_params','model');

include(function(){ //runs after prior includes are loaded
  include.models(<u><b>'recipe'</b></u>);
  include.controllers(<u><b>'recipe'</b></u>);
  include.views();
});
@codeend
<p>To add tests to your unit and functional tests, include them in your unit.js 
and functional.js files.
</p>
<b>apps/cookbook/test/unit.js</b>
@codestart
include.unitTests('truth',<u><b>'recipe'</b></u>);
@codeend
<b>apps/cookbook/test/functional.js</b>
@codestart
include.functionalTests('truth_functional',<u><b>'recipe_controller'</b></u>);
@codeend
<h2>Run Cookbook</h2>
<p>That's it. You've created a simple Cookbook application. Open cookbook.html in a browser. </p>
<img src='http://wiki.javascriptmvc.com/wiki/images/c/c8/Cookbook.png'/>

<p>Continue to [testing Testing Cookbook].</p>
*/
//break ----------------------------------------------------------------------


/*
@page testing 2.3. Testing Cookbook
<h1 class='addFavorite'>Testing Cookbook
</h1>
<p>The [jQuery.Test Test] plugin's tiered approach allows testing in the browser, 
[http://www.mozilla.org/rhino/ Rhino], and with 
[http://seleniumhq.org/ Selenium].
Don't worry about creating the tests.  When you scaffolded recipe, it created tests for you.
</p>
<h2>Testing in the Browser
</h2>
<p>In a text editor, open cookbook.html and 
change the src attribute of the script tag that loads include.js like this:</p>
@codestart html
&lt;script type='text/javascript' src='jmvc/include.js?cookbook,<span style="text-decoration:underline"><b>test</b></span>'>&lt;/script>
@codeend
<p>Reload cookbook.html in the browser. The JavaScriptMVC Console will load in another window:</p>
<h3>JavaScriptMVC Console</h3>
<img src='http://wiki.javascriptmvc.com/wiki/images/b/bd/Unit.png'/>
<p class='warn'>If you don't see the console appear, turn off your popup blocker!</p>

<h3>Run Tests</h3>
<p>To run the tests, click the <b>unit</b> and <b>functional</b> tabs
and click the play buttons.</p>
<img src='http://wiki.javascriptmvc.com/wiki/images/d/d8/Functional.png' />

<h2>Testing with Selenium</h2>
Selenium can automatically run your Functional tests.  
In another console, start [http://seleniumhq.org/ Selenium] with the
following command:
@codestart text
C:\workspace\Cookbook>js -selenium
@codeend
To run your tests run:
@codestart text
C:\workspace\Cookbook>js apps\cookbook\test\run_functional.js
@codeend
Selenium will try to open Firefox and Internet Explorer and run all functioanl tests in each.
You can configure any other browser too. Read more about
 [selenium JMVC and Selenium].
<p class="tip"><b>Tip:</b> Have these tests run nightly.</p>

<h2>Testing with Rhino</h2>
<p>[http://www.mozilla.org/rhino/ Rhino] can run your unit tests in the simulated browser environment: 
[http://github.com/thatcher/env-js/tree/master Env.js].</p>
To run the tests enter the following on the command line:
@codestart text
C:\workspace\Cookbook>js apps\cookbook\test\run_unit.js
@codeend
<p class="tip"><b>Tip:</b> Have this run before allowing check in.</p>
<h2>More on Testing</h2>
<p>Read the [jQuery.Test test documentation] to learn more about testing.</p>
Next, learn how to [compressing Compress Cookbook].
*/
//break ----------------------------------------------------------------------

/*
@page compressing 2.4. Compressing Cookobook
<h1 class='addFavorite'>Compressing Cookbook</h1>

<p>There is a large overhead associated with downloading many JavaScript files. 
Server side compression makes it simple to concatenate and compress your code into one file.</p>
<h2>Compress Script
</h2>
<p>To compress your application, run the following command from a console:
</p>
@codestart
C:\workspace\Cookbook>js apps\cookbook\compress.js
   jmvc/plugins/jquery/init.js
   ...
   WARNING! The Fixture Plugin Is Included!!!!!!
   ...
Compressed to 'apps/cookbook/production.js'.
@codeend
<p>Don't worry about the warning for now.  The application is loading the [fixtures Fixtures]
plugin.  Remove the 'dom/fixtures' plugin from your application file (init.js) when your app is ready to make
Ajax requests.</p>
<p>Verify that production.js was created by checking your <b>'apps/cookbook'</b> folder.</p>
<h2>Switch to Production Mode</h2>
<p>Switch to production mode by changing the part of the 
src tag in cookbook.html that reads "test" to "production" like this:
</p>
@codestart html
&lt;script type='text/javascript' src='jmvc/include.js?cookbook,<span style="text-decoration:underline;"><b>production</b></span>'>&lt;/script>
@codeend
<h2>Reload and verify</h2>

<p>Reload your page. Only two JavaScript files will load: include.js and production.js. 
Not bad considering 28 files are loaded in development mode.</p>

When you're ready, learn how to [documenting Document Cookbook]
*/
//break ----------------------------------------------------------------------

/*
@page documenting 2.5. Documenting Cookbook
<h1 class='addFavorite'>Documenting Cookbook</h1>

<p>Documentation is a critical step in creating maintainable code. 
It's often burdensome on developers and becomes a neglected. 
JavaScriptMVC's integrated documentation makes it easy to document JavaScript.
</p>
<p>In fact, you've already created documentation!</p>
<h2>Viewing Documentation
</h2>
<p> Open <b>cookbook_doc.html</b> (in your root directory) and click RecipeController and then Recipe:
</p>
<img src='http://wiki.javascriptmvc.com/wiki/images/2/27/Docs.png' />


<h2>Writing Documentaion</h2>
<p>Open recipe_controller.js:
</p>
@codestart
* /**
*  * @tag controllers, home
*  * Displays a table of recipes.  Lets the user 
*  * &#91;"RecipeController.prototype.form submit" create&#93;, 
*  * &#91;"RecipeController.prototype.&amp;#46;edit click" edit&#93;,
*  * or &#91;"RecipeController.prototype.&amp;#46;destroy click" destroy&#93; recipes.
*  *|
* jQuery.Controller.extend('RecipeController',
* /* @Static *|
* {
*    onDocument: true
* },
* /* @Prototype *|
* {
*    /**
*     * When the page loads, gets all recipes to be displayed.
*     *|
*    load: function(){
*        if(!$("#recipe").length) 
*            $(document.body).append($(document.createElement('div')).attr('id','recipe'))
*        Recipe.findAll({}, this.callback('list'));
*    },
@codeend
<p>  You'll notice that the syntax for documentation is very similar to JavaDoc.  
However, there are some important differences.  Consult the [include.Doc Documentation documentation]
for more information.
</p>
<h2>Generating Documentation
</h2>
<p>Just run the compressor script again to generate documentation:
</p>
@codestart text
C:\workspace\Cookbook>js apps\cookbook\compress.js
@codeend

<h2>Next steps
</h2>

<p>In the context of this trivial application, you've been exposed to major tenets of JavaScriptMVC: 
code separation, testing, compression, and documentation. This is pretty cool! Look at how simply you went from nothing to a compressed, tested, and documented application.
</p>
*/
//break ----------------------------------------------------------------------