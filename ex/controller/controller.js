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
		
	
}).plugins("jquery/controller").then(function(){
	$.Controller.extend('Tabs',{selected: 'ui-state-active'},{
	  init : function(){
	    var self = this;
	    this.find('li:gt(0)').each(function(){
	      self.sub($(this)).hide();
	    })
	  },
	  sub : function(el) {
	    return $(el.find('a[href]').attr('href'))
	  },
	  "li click" : function(el, ev){
	    var old = this.find('.'+this.constructor.selected)
	                  .removeClass(this.constructor.selected)
	    this.sub(old).hide()
	    this.sub(el.addClass(this.constructor.selected)).show()
	  }
	})
	$("#tabhere").tabs();
})
