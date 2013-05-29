load('steal/rhino/rhino.js');

steal("documentjs", function(DocumentJS){
	DocumentJS('site/scripts/doc.html',{
		markdown : [ 'readme.md', 'site', 'tutorials', 'steal', 'jquerypp', 'can', 'funcunit'],
		out : 'docs',
		parent: 'javascriptmvc'
	});
});
