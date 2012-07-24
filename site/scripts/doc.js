load('steal/rhino/rhino.js');
steal.overwrite = true;
load('documentjs/documentjs.js');


DocumentJS('site/scripts/doc.html',{
	markdown : ['steal', 'can', 'site', 'jquery', 'funcunit', 'tutorials', 'canui'],
	out : 'site/docs'
});
