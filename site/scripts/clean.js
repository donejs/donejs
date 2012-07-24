//steal/js jmvc/site2/scripts/compress.js

load("steal/rhino/rhino.js");
steal.plugins('steal/clean',function(){
	steal.clean('jmvc/site2/site2.html',{indent_size: 1, indent_char: '\t'});
});
