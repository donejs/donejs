load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
	steal.html.crawl("site/docs.html#!can.Control",
	{
		out: 'html',
		browser: 'phantomjs'
	})
})