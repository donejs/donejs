load('steal/rhino/rhino.js');

steal("documentjs", function(DocumentJS){
	DocumentJS('site/scripts/doc.html',{
		markdown : ['steal', 'site', 'documentjs', 'jquery', 'can', 'canui', 'funcunit'],
		out : 'site/docs'
	});
});
