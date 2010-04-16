steal.plugins('jquery').then(function(){
	$('h2').each(function(){
		var h2 = $(this);
		var frame = h2.attr("frame");
		h2.hide();
		var ifr = $("<iframe/>").attr({
			src: '../../phui/'+frame+'/'+frame+'.html'
		}).height(parseInt(h2.attr('fheight')) || 400)
		$(this).after(ifr)
	})
})
