_args = ['jmvc/jmvc.html']

load('steal/rhino/rhino.js');
steal.overwrite = true;
load('documentjs/documentjs.js');

var file = _args.shift(),
	options = steal.opts(_args || {}, {out: 1});


DocumentJS(file,options);

runCommand("cmd", "/C", "js jmvcdoc/toHTML/convert.js path=jmvc\\docs "+
	"docsLoc=docs commentsLoc=http://jmvcs3.disqus.com/embed.js "+
	"analyticsAct=UA-2302003-4 analyticsDomain=javascriptmvc.com")
