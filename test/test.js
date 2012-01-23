//we probably have to have this only describing where the tests are
steal('funcunit')
	.then('jquery/test/qunit')
	.then(function(){
		FuncUnit.jQuery("<iframe src='steal/test/qunit.html'></iframe>").appendTo(document.body)
	})
	.then('funcunit/syn/test/qunit')
	.then('funcunit/test/funcunit')
	.then('mxui/test.js')
	
	
	// .then('steal/less/less_test.js')
