//steal/js jmvc/scripts/doc.js
//load("jmvc/scripts/doc.js")



load('steal/rhino/rhino.js');
steal.overwrite = true;
load('documentjs/documentjs.js');


DocumentJS('jmvc/jmvc.html',{
	markdown : ['jquery','steal','jmvc']
});