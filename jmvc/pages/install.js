/*
@page install 2.1. Installing JavaScriptMVC
@parent getstarted
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
