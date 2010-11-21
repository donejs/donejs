//we probably have to have this only describing where the tests are
steal.plugins(	'funcunit/qunit', // load qunit
 				'steal/test/qunit')
	.then('//steal/less/less_test')
	.plugins(
				'jquery/test/qunit',
 				'funcunit/test/qunit'
				)