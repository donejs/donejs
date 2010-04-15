steal.plugins('jquery').then(
	"../../jmvcdoc/resources/highlight",'../../jmvcdoc/resources/languages/javascript','../../jmvcdoc/resources/languages/www',
function(){
	 hljs.initHighlighting();
	$(function(){
		$("code").each(function(){
			hljs.highlightBlock(this)
		})
	})
	
})


.plugins('jquery/event/drop').then(function(){
	$('.drag').live("draginit", function(){})
	$('.drop').live("dropover", function(){
		$(this).addClass('over')
	}).live("dropout", function(){
		$(this).removeClass('over')
	})
})
