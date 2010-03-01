//we probably have to have this only describing where the tests are
steal.plugins(	'funcunit/qunit', // load qunit
 				'jquery/test/qunit')
 
if(steal.browser.rhino){
  steal.plugins('funcunit/qunit/env')
}