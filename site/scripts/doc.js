load('steal/rhino/rhino.js');

steal("documentjs", function(DocumentJS){
	DocumentJS('site/scripts/doc.html',{
		markdown : [ 'site', 'tutorials', 'steal', 'documentjs', 'jquery', 'can', 'funcunit'],
		out : 'site/docs'
	});
});
