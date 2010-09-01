/*
@page why 0. Why JavaScriptMVC
@tag home
<h1 class='addFavorite'>Why JavaScriptMVC</h1>
<div style='color:#96A84A; font: bold 12pt/20pt Verdana;'>Bad developers copy. Great developers Steal!</div>
<p>JavaScriptMVC has 'stolen' all the greatest ideas in JavaScript development and integrated them into 
one convient package.
Read how JavaScriptMVC:</p>
<ul>
    <li>enforces best practices</li>
    <li>improves maintainability</li>
    <li>reduces development time</li>
</ul>
<div style='color:#96A84A; font: bold 12pt Verdana;'>
p.s. Jupiter provides affordable JavaScriptMVC and jQuery [http://jupiterit.com/pages/training training] and 
[http://jupiterit.com/pages/support support].
</div>
<br/>

<h2>Best Practices</h2>
<h3>Compression</h3>
<p>Effortlessly include and compress JavaScript files no matter how complex the dependencies. 
Because it's so easy, there's little incentive for developers to lazily group unrelated functionality 
in the same file.
</p>
<h3>Testing</h3>
<p>JavaScript testing sucks and almost always fails.  JavaScriptMVC's Selenium, Rhino, and browser
test integration provide a fast, comprehensive, and easy to author testing environment.
</p>
<h3>Documentation</h3>
<p>Like testing, documentation is one of those things that we need to do, but avoid. 
JMVC makes this easy and automatic.  This entire site is written in JMVC's source and generated
from its [include.Doc documentation engine].
<h3>Error Reporting</h3>
Getting JavaScript to work perfectly across all browsers is extremely challenging, if not impossible. 
JavaScriptMVC sends you an email when your application breaks by 
integrating with the [http://damnit.jupiterit.com] service.
<h3>Updating</h3>
Staying current with the latest code is as simple as writing:
@codestart text
js jmvc\update
@codeend
<br/>

<h2>Maintainability</h2>
<h3>Class</h3>
<p>[jQuery.Class] provides simple simulated inheritance in JavaScript and other awesomeness:
 class level inheritance, class initialization callbacks, introspection, instance class access.
</p>
<h3>Model</h3>
[jQuery.Model Models] organizes an application's data layer. This is done in two ways:
<ul>
    <li>Requesting data from and interacting with services</li>
    <li>Wrap service data with a domain-specific representation.</li>
</ul>
<h3>Controllers and Event Delegation</h3>
JavaScriptMVC's [jQuery.Controller controllers] use event delegation to organize event handlers.
They are JavaScriptMVC's best and most unique feature.
<h3>Views</h3>
<p>[jQuery.View Views] are client side templates that avoid mixing HTML and JavaScript.  Don't add strings to create HTML!</p>
<br/>
<h2>Reduce Development Time </h2>
<h3>Fixtures</h3>
<p>[fixtures Fixtures] are simulated Ajax responses.  Use them to sever your 
front end development dependency on the backend.  
Your (sexy, smart) frontend team won't have to burn cycles waiting for the (ugly, stupid) 
backend team.</p>
<h3>Scaffolding</h3>
<p>Scaffolding generates the code you need to manipulate a service.  Its a great way to 
get something working up quickly.  It even makes tests to test the generated code. 
</p>

<h3>Code Generators</h3>
<p>JavaScriptMVC is packed with code generators. Generate application and file stubs via the command line:</p>
@codestart text
js jquery\generate\app email_manager
js jquery\generate\controller emails
js jquery\generate\model user
js jquery\generate\test email
js jquery\generate\page email_manager index.html
@codeend


<h3>Plugins and Engines</h3>
<p>Engines are community built pre-packaged widgets.  Install them from the command line.</p>


 */


//break