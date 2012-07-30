load('steal/rhino/rhino.js');

steal("documentjs", function(DocumentJS){
	DocumentJS('site/scripts/doc.html',{
		markdown : ['steal', 'site'],
		out : 'site/docs'
	});
});



