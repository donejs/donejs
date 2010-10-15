//steal/js jmvc/scripts/doc.js
//load("jmvc/scripts/doc.js")

_args = ['jmvc/jmvc.html']

load('steal/rhino/steal.js');
steal.overwrite = true;
load('documentjs/documentjs.js');

var file = _args.shift(),
	options = steal.opts(_args || {}, {out: 1});


DocumentJS(file,options);