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
 It's an older treatment, but still touches on JMVC's strong points.
 * <h2 class='spaced'>Basics</h2>
 * Before jumping in, there are some things you should know:
 * <h3>Folder Structure</h3>
 * JMVC logically separates your files with the following folder structure:
@codestart
documentjs         -documentation engine
funcunit           -testing tool
appname            -your applicatoin
    \controllers   -organized event handlers
    \models        -manage data
    \resources     -helper scripts
    \test          -test files
        \funcunit  -funcunit tests
        \qunit     -qunit tests
    \views         -html templates
jquery             -jquery and jQuery plugins (like $.Controller)
steal              -compression and build
@codeend
<div class='whisper'>P.S. Don't worry about creating an 'appname' folder yet.  We'll do that
in a second.</div>
 * <h3>Plugins</h3>
 * Everything is a plugin.  Just [steal.static.plugins steal] the ones you need. Plugins load their
 * own dependencies and won't load duplicate files.  
 * @codestart
 * steal.plugins('jquery/model',
 *   'jquery/view',
 *   'jquery/controller');
 * @codeend
<div class='whisper'>
  P.S. <code>steal.plugins('a/b')</code> adds <code>a/b/b.js</code>
 to your project. 
  </div>
 * <h3>Environments</h3>
 * There are different environments for each phase of development:
 * <ul>
 *     <li><span class='gray'>Development</span> - optimized for debugging and rapid development</li>
 *     <li><span class='gray'>Production</span> - loads compressed application file </li>
 * </ul>
<div class='whisper'>
  P.S. The 'test' environment has been replaced by [FuncUnit]
  awesomeness. 
</div>
 * <h2>Making a Cookbook</h2>
 * Lets get started by [install installing JavaScriptMVC].
 */
//break


/*
@page install 2.1. Installing JavaScriptMVC

<h1 class='addFavorite'>Installing JavaScriptMVC</h1>
<p>
	[download Download] the latest JavaScriptMVC. 
	Unzip the folder on your file system or web server.  
	If you are using this on a webserver, put 
	unzip in a public folder.  You should have something that
	looks like:
</p>
@codestart
static
  \documentjs - DocumentJS library
  \funcunit   - FuncUnit testing library
  \jquery     - jQuery and MVC plugins
  \steal      - compression and build system
  \js.bat     - Windows Rhino shortcut
  \js         - Mac/Linux Rhino shortcut
@codeend
<div class='whisper'>PRO TIP: 
  Unzip these files as
  high in your apps folder structure as possible (i.e. don't
  put them under a javascriptmvc folder in your public directory).
</div>
<h2>Installing Java</h2>
JavaScriptMVC requires Java JRE 1.6 or greater for some of its features 
such as:
<ul>
	<li>Compression (Google Closure)</li>
	<li>Selenium run FuncUnit tests</li>
	<li>Easy updating</li>
	<li>Code Generators</li>
</ul>
and this walkthrough uses most of those features.  But, your
backend (server) can be written in any language. 
<h2>Updating JavaScriptMVC</h2>
We are constantly upgrading JMVC.  To get the latest, most
error free code, in a console, type:
@codestart text
C:\workspace\Cookbook>js documentjs\update
C:\workspace\Cookbook>js funcunit\update
C:\workspace\Cookbook>js jquery\update
C:\workspace\Cookbook>js steal\update
@codeend
<div class='whisper'>
	P.S. If you are using linux/mac you
	want to use <code>./js</code> and change <code>\</code> 
	to <code>/</code>.
</div>
Continue to [creating Creating Cookbook].
 */
//break ---------------------------------------------------------------------




/*
@page creating 2.2. Creating Cookbook
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
> js steal\generate\app cookbook
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
> js steal/generate/page cookbook index.html
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
> js steal/generate/scaffold Cookbook.Models.Recipe
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
Open <b>apps/cookbook/cookbook.js</b> and steal your recipe controller and model as follows:</p>
@codestart
steal.plugins('jquery/controller',
              'jquery/controller/subscribe',
              'jquery/view/ejs',
              'jquery/model',
              'jquery/dom/fixtures',
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
<b>cookbook/test/qunit/qunit.js</b>
@codestart
steal
  .plugins("funcunit/qunit", "cookbook")
  .then("cookbook_test",<u><b>"recipe_controller_test"</b></u>)
@codeend
<b>cookbook/test/funcunit/funcunit.js</b>
@codestart
steal
 .plugins("funcunit")
 .then("cookbook_test",<u><b>"recipe_test"</b></u>)
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