/**
 * This test loads every test in JavaScriptMVC
 */
load('test/getting_started_test.js')

print("==========================  generators =============================")
load('steal/generate/test/run.js');


print("==========================  compression ============================")
load('steal/build/test/run.js');
load('jquery/view/test/compression/run.js');


print("==========================  unit ============================")
load('steal/rhino/steal.js');
load('funcunit/loader.js');
FuncUnit.load('qunit.html');

print("==========================  functional ============================")
load('steal/rhino/steal.js');
load('funcunit/loader.js');
FuncUnit.load('funcunit.html');

