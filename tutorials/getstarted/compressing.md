@page compressing Compressing Cookbook
@parent getstarted 2
<h1 class='addFavorite'>Compressing Cookbook</h1>

<p>There is a large overhead associated with downloading many JavaScript files. 
Server side compression makes it simple to concatenate and compress your code into one file.</p>
<h2>Compress Script
</h2>
<p>To compress your application, run the following command from a console:
</p>
@codestart
C:\workspace\Cookbook>js cookbook\scripts\build.js
   steal/steal.js
   ...
   ignore ../steal/dev/dev.js
   ...
Package #0: 'cookbook/production.js'.
@codeend
<p>Verify that production.js was created by checking your <b>'cookbook'</b> folder.</p>
<h2>Switch to Production Mode</h2>
<p>Switch to production mode by changing the script tag to include steal.production.js:
</p>
@codestart html
&lt;script type='text/javascript' 
       src='../steal/steal.<span style="text-decoration:underline;"><b>production</b></span>.js?cookbook'>
&lt;/script>
@codeend
<h2>Reload and verify</h2>

<p>Reload your page. Only two JavaScript files will load: steal.production.js and production.js. 
Not bad considering 28 files are loaded in development mode.</p>

When you're ready, learn how to [documenting Document Cookbook]