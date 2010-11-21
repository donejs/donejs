/*
@page index home
<h1>JavaScriptMVC <span>- <i>develop with direction!</i></span></h1>

JavaScriptMVC is an <span class='highlight'>open-source framework</span> 
containing the best ideas in jQuery development. 
It <span class='highlight'>guides</span> you 
to successfully completed projects by promoting best practices, 
maintainability, and convention over configuration.

<a class="big_button floatLeft" id="download" href="http://github.com/downloads/jupiterjs/javascriptmvc/javascriptmvc-3.0.1.zip"><span>Download JavaScriptMVC</span><span class="label">3.0.1 Production</span></a>
<a href='http://cdn.javascriptmvc.com/videos/2_0/2_0_demo.htm' id='video' class='big_button floatLeft'>
 <span>Watch</span>
 <span class='label'>2.0 Video</span>
</a>

<h2 class='spaced'>What's Inside?</h2>

Everything you should be doing, as
easy as possible:

<table class='inside'>
<tr>
<td>
[steal.generate Code Generators]
</td>
<td>
@codestart
./js jquery/generate/app myapp
@codeend
</td>
</tr>
<tr>
<td>
[steal Dependency Management]
</td>
<td>
@codestart
steal.plugins('jquery/controller').then(function($){ ... });
@codeend
</td>
</tr>

<tr>
<td>
[steal.build Production Builds]
</td>
<td>
@codestart
js myapp/scripts/build.js
@codeend
</td>
</tr>

<tr>
<td>
[FuncUnit Testing]
</td>
<td>
@codestart
S.open("//myapp/myapp.html");
S("#search").click().type("Hello World");
@codeend
</td>
</tr>

<tr>
<td>
[jQuery.View Client Side Templates]
</td>
<td>
@codestart
$("#menu").html("menu.tmpl",items);
@codeend
</td>
</tr>

<tr>
<td>
[jQuery.Controller jQuery Widget Factory]
</td>
<td>
@codestart
$.Controller("Tabs",{
  "li click" : function(el, ev){ ... }
});
@codeend
</td>
</tr>

<tr>
<td>
[jQuery.Model Service/Data Modeling]
</td>
<td>
@codestart
$.Model("Todo",{ findAll : "/recipes" }, {});
Todo.findAll(function(todos){ ... });
@codeend
</td>
</tr>

<tr>
<td>
[DocumentJS Documentation]
</td>
<td>
@codestart
js myapp/scripts/docs.js
@codeend
</td>
</tr>


<tr>
<td>
[steal.clean Code Cleaning and Linting]
</td>
<td>
@codestart
js myapp/scripts/clean.js
@codeend
</td>
</tr>

<tr>
<td>
[specialevents jQuery Special Events]
</td>
<td>
@codestart
$("#items").delegate(".item","draginit",function(){});
@codeend
</td>
</tr>

<tr>
<td>
[dom jQuery Utilities]
</td>
<td>
@codestart
$("#panel").outerWidth(500);
@codeend
</td>
</tr>

</table>
 
You can use JavaScriptMVC as a complete framework, or download only the parts you need.
Read [http://jupiterjs.com/news/javascriptmvc-features JavaScriptMVC's features] for
more info.

## The Plan.

 - [download |Download] JavaScriptMVC
 - [getstarted |Read] the Getting Started Guide
 - [learn Learn] the technology
 - [api Explore] the api

## What People Are Saying.

> "JavaScriptMVC is the <span class='highlight'>single most important reason</span> why I don't hate
> client side development anymore."

<cite> Mihael Konjevic, HibreedCMS </cite>

> "JavaScriptMVC strike the 
> <span class='highlight'>perfect balance between structure, speed
> and featureset</span> to enable web developers to build large, scalable apps
> in a modular fashion."

<cite> Rob Loh, Lyris, Inc. </cite>

> "JavaScriptMVC is an 
> <span class='highlight'>elegant solution that has proven indispensable</span> in building
> our most sophisticated applications."

<cite>Chris Osborn, Sitelier Inc.</cite>

> "Since standardizing on JavaScriptMVC, we've been able to start sharing
> well-tested code between projects, 
> <span class='highlight'>quickly bring new developers up to speed</span>
> and take the complexity out of the packaging, minification, and deployment
> process."

<cite> Thomas Reynolds, Second Story</cite>

> "Structured Event Delegation? Development, Test, and Production 
> environments?  It even has a build step in its deployment process?
> <span class='highlight'>Are you sure this is a JavaScript application?</span>"

<cite> Donnie Hall, eNova Financial</cite>

 */
steal(
'getstarted',
'install',
'creating',
'documenting',
'testing',
'compressing',
'api',
'download',
'learn',
'why',
'selenium',
'follow',
'contribute',
'getcode',
'help',
'generators',
'developingwithgit',
'folders',
'developingjmvc',
'//steal/rhino/docs')



