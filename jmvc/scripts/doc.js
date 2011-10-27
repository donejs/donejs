//steal/js jmvc/scripts/doc.js
//load("jmvc/scripts/doc.js")



load('steal/rhino/rhino.js');
steal.overwrite = true;
load('documentjs/documentjs.js');


DocumentJS('jmvc/jmvc.html',{
	markdown : ['jquery','steal','jmvc','tutorials','funcunit']
});

// change timestamp in docs.html
(function(){
	var page = readFile("docs.html"),
		newPage = page.replace(/JMVCDOC_TIMESTAMP\s\=\s\d+/, "JMVCDOC_TIMESTAMP = "+(new Date()).getTime());
	
	steal.File("docs.html").save(newPage);
})();