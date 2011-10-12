load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
	steal.html.crawl("jmvc/docs.html#!jQuery.Range.static.current", 
	{
		out: 'html',
		browser: 'phantomjs'
	})
})