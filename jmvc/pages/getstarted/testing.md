@page testing Testing Cookbook
@parent getstarted 2

<h1 class='addFavorite'>Testing Cookbook
</h1>
<p>[FuncUnit] tiered approach allows unit and functional testing in the browser, 
[http://www.mozilla.org/rhino/ Rhino], and 
[http://seleniumhq.org/ Selenium].
When you scaffolded recipe, it created tests for you.  This guide will show you how to:
</p>
<ul>
	<li>Run unit tests.</li>
	<li>Run functional tests.</li>
	<li>Understand the qUnit unit tests.</li>
	<li>Understand the FuncUnit functional tests.</li>
	<li>Test isTasty functionality.</li>
</ul>

<h2>Run Unit Tests</h2>
<p>JavaScriptMVC uses qUnit to test unit functionality (like models and basic plugins).  You can run these
tests in the browser or Envjs.  </p>
<p><code>cookbook/test/qunit/qunit.js</code> loads qunit and your unit tests.  Make sure
you have added <code>recipe_test.js</code> like:</p>
@codestart
steal
  .plugins("funcunit/qunit", "cookbook")
  .then("cookbook_test",<u><b>'recipe_test'</b></u>)
@codeend
<h3>Run Unit Tests in the Browser</h3>
<p>Open <code>cookbook/qunit.html</code>.  You should see something like:</p>
<img src='http://wiki.javascriptmvc.com/wiki/images/2/27/Qunit.png'/>
<h3>Run Unit Tests in Envjs</h3>
<p>In a command window type:</p>
@codestart
> funcunit\envjs cookbook/qunit.html
@codeend
This runs qunit.html in a simulated browser environment.  The output should look like:<br/>
<img src='http://wiki.javascriptmvc.com/wiki/images/2/24/Qunit-envjs.png' width='500px'>

<h2>Run Functional Tests</h2>
<p>JavaScriptMVC uses FuncUnit to add browser and selenium-based functional 
testing to qUnit.  You can run tests in the browser or using selenium.</p>
<p><code>cookbook/test/funcunit/funcunit.js</code> loads funcunit and your functional tests.  
Make sure you have added <code>recipe_controller_test.js</code> like:</p>
@codestart
steal
 .plugins("funcunit")
 .then("cookbook_test",<u><b>'recipe_controller_test'</b></u>)
@codeend

<h3>Run Functional Tests in the Browser</h3>
<p>Open <code>cookbook/funcunit.html</code>.  You should see something like:</p>
<img src='http://wiki.javascriptmvc.com/wiki/images/b/b6/Funcunit.png'/>
<h3>Run Functional Tests in Selenium</h3>
<p>In a command window type:</p>
@codestart
> funcunit\envjs cookbook\funcunit.html
@codeend
This should open Firefox and IE if you are using Windows.  The results of the
test should look like:<br/>
<img src='http://wiki.javascriptmvc.com/wiki/images/a/a7/Funcunit-envjs.png' width='500px'>
<div class='whisper'>
	If Selenium is unable to open your browsers, it's likely you have them in an
	unusual location.  Read [FuncUnit.static.browsers] for information on how to configure browsers
	so selenium can find them.
</div>

<p>
If you are having trouble running the tests in Internet Explorer, you need to change a few settings in the browser.  Please see the [FuncUnit FuncUnit documentation] for troubleshooting help.
</p>




<h2>Understanding qUnit Tests</h2>
FuncUnit adds very little to qUnit, so the best place to start understanding qUnit is its own
[http://docs.jquery.com/QUnit documentation].  FuncUnit / JavaScriptMVC just adds a way to:
<ul>
	<li>Organize tests</li>
	<li>Load tests</li>
	<li>Run and report results in Envjs</li>
</ul>
<p>Here's how it works ...</p>
<ol>
	<li><code>cookbook/qunit.html</code> loads steal.js and tells it to load:
		<code>cookbook/test/qunit/qunit.js</code> with the following script tag:
@codestart
&lt;script type='text/javascript' 
       src='../steal/steal.js?steal[app]=cookbook/test/qunit'>
&lt;/script>
@codeend
	</li>
	<li>In qUnit.js, the qUnit plugin and tests are loaded.</li>
	<li>In <code>cookbook/test/qunit/cookbook_test.js</code>
		tests are added to be run by qunit.
	</li>
	<li>When the page loads, the tests are run.</li>
</ol>
<p>When the page is run in Envjs, qUnit does the same 4 steps, but reports
the messages on the command line.</p>

<p>As an example of a test, let look at how the findAll test works:</p>
@codestart
//creates a test
test("findAll", function(){
  //prevents the next test from running
  stop(2000);
  
  //requests recipes
  Cookbook.Models.Recipe.findAll({}, function(recipes){
    
    //makes sure we have something
    ok(recipes)
    
    //makes sure we have at least 1 recipe
    ok(recipes.length)
    
    //makes sure a recipe looks right
    ok(recipes[0].name)
    ok(recipes[0].description)
    
    //allows the next test to start
    start()
  });
})
@codeend


<h2>Understanding FuncUnit Tests</h2>
<p>FuncUnit adds to qUnit the ability to open another page, in this case
<code>cookbook/cookbook.html</code>, perform actions on it, and
get information from it.</p>
<p>
	The <code>cookbook/funcunit.html</code>  page
	works just like the <code>qunit.html</code> page except the 'funcunit' plugin is loaded which 
	provides [FuncUnit].  FuncUnit is aliased to "<b>S</b>" to highlight the similarity between its API
	and jQuery's API.
</p>
<p>Let take a quick look at a FuncUnit test:</p>
@codestart
test("create recipes", function(){
    
  //type Ice in the name field
  S("[name=name]").type("Ice")
    
  //type Cold Water in the description field
  S("[name=description]").type("Cold Water")
    
  //click the submit button
  S("[type=submit]").click()
    
  //wait until the 2nd recipe exists
  S('.recipe:nth-child(2)').exists()
  
  //Gets the text of the first td
  S('.recipe:nth-child(2) td:first').text(function(text){
  
    //checks taht it has ice
    ok(text.match(/Ice/), "Typed Ice");
  });
  
})
@codeend
<p>Wait ... why is getting the text passed a function?</p>
<p>
	Functional tests are largely many asynchronous actions 
	(clicks and keypresses)
	with relatively few checks/assertions.  
	FuncUnit's goal is to provide as readable and linear syntax as possible.
	FuncUnit statements are actually stored and then run asynchronously.  This requires that
	getting a value from the page happens in a callback function.
</p>
<p>For more information on FuncUnit, read its [FuncUnit documentation]</p>
<h2>Testing isTasty</h2>
<p>In the [creating Creating Cookbook] section of the Getting Started guide,
we added an isTasty function to be shown.  Lets see how we could unit test
that functionality.</p>
<p>At the end of <code>recipe_test.js</code> we'll add code that 
creates two recipe instances and checks if they are tasty.
</p>
@codestart
test("isTasty", function(){
  var Recipe = Cookbook.Models.Recipe,
      r1 = new Recipe({name: "tea",
                       description: "leaves and water"}),
      r2 = new Recipe({name: "mushroom soup",
                       description: "mushrooms and water"});
  ok(r1.isTasty(), "tea is tasty")
  ok(!r2.isTasty(), "mushroom soup is not tasty")
})
@codeend
<p>Next, learn how to [compressing Compress Cookbook].</p>