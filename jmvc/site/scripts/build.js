//steal/js jmvc/site/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('jmvc/site/scripts/build.html',{to: 'jmvc/site'});
});
