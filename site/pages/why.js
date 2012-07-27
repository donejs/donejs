/*
@page why 0. Why JavaScriptMVC


So you've read through the list of features and you're still not 
convinced JavaScriptMVC is right for you.  If you're looking for
a little (<i>extremely biased</i>) advice, you've come to the 
right place.

## Who Should Use JavaScriptMVC?

JavaScriptMVC is designed to enhance jQuery development
for medium to large projects.  You should care about
code quality, performance, and maintainability.

If you don't care about these things, or think jQuery is enough 
for any project,
you don't know what you're doing, and you will
embarrass the project by using it. Leave now.

If you do care, here's how JavaScriptMVC helps you:

<h2 style='color:#96A84A;'>
	JavaScriptMVC makes everything you should be doing, as easy as possible!
</h2>

Here's a few things you should be doing:

 - Testing (especially automatic and functional testing)
 - Documenting
 - Breaking up code into logically organized files
 - Compressing and concatenating your JavaScript files
 - Using and organizing client side templates
 - Making plugins that clean themselves up, are internally organized, and extendable.
 - Error reporting
 
All of these things are hard or impossible to do right with jQuery alone.  

You can add your own automated testing library - 
QUnit isn't automated, it's difficult to write Selenium tests.

You can add your own documentation engine - JSDoc, make sure you keep track of every file!

You can add your own way of loading and compressing scripts - RequireJS.

You can use other client side template libraries - jquery-tmpl, but you won't be able to compress them into your build or put them in external files as easily.

You can be careful to structure your jQuery plugins so they can be easily removed from an element, remove all event handlers, and provide some mechanism for extending or overwriting your plugin.

You can devise your own way of doing error reporting.

### OR ...

You can download JavaScriptMVC and run:

@codestart text
js steal/generate/app APPNAME
@codeend

and get all of these things for free.

JavaScriptMVC's greatest strength is it's integration. 
Everything you should be doing is available immediately.

## Ease of Adoption

Despite the huge amount of features, JavaScriptMVC is
easy to learn.  

Every component includes:

 - thorough documentation
 - demo examples
 - test pages
 - a write-up on <a href='http://jupiterjs.com/pages/javascriptmvc'>JavaScriptMVC's blog</a>.

We are extremely active on the <a href='http://forum.javascriptmvc.com/'>forums</a>, with essentially
zero unanswered questions.

We've released a number of mini apps that are built the 
JavaScriptMVC way.

<a href='http://jupiterjs.com'>Jupiter Consulting</a> provides JavaScriptMVC training, support,
and consulting services.



 */


//break