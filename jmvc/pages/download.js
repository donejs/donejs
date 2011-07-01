/**
@page download 1. Download

<div style='width: 600px'>
<p class='spaceabove'>The integrated framework.  Everything you need to sling mad $().
</p>
<a class="big_button floatLeft spaceabove" id="download" href="https://github.com/downloads/jupiterjs/javascriptmvc/javascriptmvc-3.0.5.zip"><span>Download JavaScriptMVC</span><span class="label">3.0.5 Production</span></a>

<p class='spaced' style="clear: left;"/>
<div class='hrule'>
<span>OR</span>
</div>
<p>Download the individual libraries or tools:</p>
<a href='https://github.com/downloads/jupiterjs/funcunit/funcunit-1.0.zip' class='floatLeft funcunit downloadbutton spaceabove'>
	<span>Download FuncUnit</span>
	<span class='label'>1.0 Production</span>
</a>
<p class='spaceabove'>Web Application Testing.  [FuncUnit Learn more].
</p>
<p class='spaced' style="clear: left;"/>
<a href='https://github.com/downloads/jupiterjs/steal/stealjs-1.0.zip' class='floatLeft steal downloadbutton spaceabove'>
	<span>Download StealJS</span>
	<span class='label'>1.0 Production</span>
</a>
<p class='spaceabove'>Manage dependencies, build fast pages, etc.  [stealjs Learn more].
</p>
<p class='spaced' style="clear: left;"/>
<a href='https://github.com/downloads/jupiterjs/documentjs/documentjs-1.0.zip' class='floatLeft documentjs downloadbutton spaceabove'>
	<span>Download DocumentJS</span>
	<span class='label'>1.0 Production</span>
</a>
<p class='spaceabove'>Powerfully easy documentation engine. [DocumentJS Learn more].
</p>

<p class='spaced' style="clear: left;"/>

<div id='jquerymxouter'>
	<div class='rightmx'>
		jQuery MVC Extensions.  Learn More
	</div>	
	<div class='leftmx'>
		<div>Download jQueryMX</div>
		<div class='label'>Check the libraries you want. Then <a href='javascript://' class='down'>Download</a>!</div>
	</div>	
	
	<div id='jquerymx'></div>
</div>


</div>

<script type='text/javascript'>
	// we need this so the iframe loads correctly from index.html and docs/whatever.html
	if(typeof $ !== "undefined"){
		$("#jquerymx").append('<iframe class="pluginify" scrolling="no" frameborder="0" src="'+
			steal.root.join('jquery/download/download.html')+
			'" />');
		
	}
</script>
 */

//break
