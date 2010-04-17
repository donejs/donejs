steal("http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js",
      "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.0/jquery-ui.js").then(function(){
          
    $("#tabs").tabs();
});

steal.then("../../jmvcdoc/resources/highlight",
			'../../jmvcdoc/resources/languages/javascript',
			'../../jmvcdoc/resources/languages/www',
function(){
	 hljs.initHighlighting();
	$(function(){
		$("code").each(function(){
			hljs.highlightBlock(this)
		})
	})
		
	
})