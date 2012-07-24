//steal/js jmvc/site/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('site/scripts/build.html',{to: 'site'});
});
