@page documenting Documenting Cookbook
@parent getstarted 3
<h1 class='addFavorite'>Documenting Cookbook</h1>

<p>Documentation is a critical step in creating maintainable code. 
It's often burdensome on developers and becomes a neglected. 
JavaScriptMVC's integrated documentation makes it easy to document JavaScript.
</p>
<h2>Generating Documentation</h2>
<p>Before creating the docs, put your app back in development mode:</p>
@codestart html
&lt;script type='text/javascript' 
       src='../steal/steal.js?cookbook,<span style="text-decoration:underline;"><b>development</b></span>'>
&lt;/script>
@codeend
<p>Create the docs by running:</p>
@codestart
> documentjs/doc cookbook/cookbook.html
@codeend
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
<h2>Next steps
</h2>

<p>In the context of this trivial application, you've been exposed to major tenets of JavaScriptMVC: 
code separation, testing, compression, and documentation. This is pretty cool! Look at how simply you went from nothing to a compressed, tested, and documented application.
</p>
