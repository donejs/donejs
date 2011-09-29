load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
	steal.html.crawl("jmvc/docs.html#!jquerymx", 
	{
		out: 'html',
		browser: 'phantomjs'
	})
})