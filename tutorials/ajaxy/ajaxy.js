steal('jquery/controller',
	  'jquery/event/hashchange', 
	  'steal/html',function(){
	
	$.Controller('Ajaxy',{
		init : function(){
			this.updateContent()
		},
		"{window} hashchange" : function(){
			this.updateContent();
		},
		updateContent : function(){
			var hash = window.location.hash.substr(2),
				url = "fixtures/"+(hash || "videos")+".html";
				
			steal.html.wait();
			
			$.get(url, {}, this.callback('replaceContent'),"text" )
		},
		replaceContent : function(html){
			this.element.html(html);
			steal.html.ready();
		}
	})
	
	$('#content').ajaxy()
})
