// load('big_test.js');
load('steal/test/helpers.js')

print("==========================  generators =============================")
print("-- plugin --");
load('steal/generate/test/run.js');

/*print("-- controller --");
_args = ['TodosController']; load('jmvc/generate/controller');clearEverything();
print("-- unit test --");
_args = ['Truth']; load('jmvc/generate/unit_test');clearEverything();
print("-- functional test --");
_args = ['TruthFunctional']; load('jmvc/generate/functional_test');clearEverything();
print("-- page --")
_args = ['generate','gen.html']; load('jmvc/generate/page');clearEverything();

load('jmvc/rhino/env.js');
Envjs('gen.html', {scriptTypes : {"text/javascript" : true,"text/envjs" : true}});
if(typeof jQuery.Controller == "undefined") throw "Controllers should be here";
clearEverything();*/


print("==========================  compression ============================")
load('steal/compress/test/run.js');
load('jquery/view/test/compression/run.js');

/*
//test compressing a normal blank page

MVCDontQuit = true;
load('apps/generate/compress.js');
//test foriegn characters

print("-- Foreign characters --");
include.setPath("");
f = new include.fn.init("foreign")
f.setSrc();
new include.File('foreignResult.js').save( include.compressString(f.src));
//check that srcs are equal
f1 = readFile('foreign.js').replace(/\r/,"");
f2 = readFile('foreignResult.js');
if(f1 !=  f2){
    print(f1+"\n---------------------------\n"+f2)
    throw "Foreign characters aren't right";
}
new java.io.File("foreignResult.js")["delete"]();

//make sure it can run
print("-- Production integrity --");
clearEverything();
//make sure we don't have jQuery
if(typeof jQuery != "undefined") throw "jQuery should not be here";
load('jmvc/rhino/env.js');
doneLoadingCalled = false;
include = {
    done : function(total){
        doneLoadingCalled = true;
    },
    env: "production"
}
load('jmvc/rhino/env.js');
Envjs('apps/generate/index.html', {scriptTypes : {"text/javascript" : true,"text/envjs" : true}});
if(typeof jQuery == "undefined") throw "jQuery should be here";
if(typeof jQuery.Controller == "undefined") throw "Controllers should be here";
if(!doneLoadingCalled) throw "Done loading should be called";
*/

print("==========================  unit ============================")
print("-- steal --");
load('steal/test/run.js');


/*
print("==========================  functional ============================")
clearEverything();
load('apps/testing/test/run_functional.js')
_wait("window.jQuery.Test.Functional.browsersComplete")


print("==========================  Generated Tests ============================")
clearEverything();
print("-- unit --");
load('apps/generate/test/run_unit.js');
_wait("window.jQuery.Test.Unit.complete");
clearEverything();
print("-- functional --");
load('apps/generate/test/run_functional.js')
_wait("window.jQuery.Test.Functional.browsersComplete")
*/
print("==========================  Getting Started ============================")

load('steal/test/helpers.js');
_S.clear();

_args = ['cookbook']; load('steal/generate/app');_S.clear();
_args = ['Cookbook.Models.Recipe']; load('steal/generate/scaffold');_S.clear();

load('steal/file/file.js');
cookbookContent = readFile('cookbook/cookbook.js').
    replace(".models()", ".models('recipe')").
    replace(".controllers()", ".controllers('recipe')");
new steal.File('cookbook/cookbook.js').save( cookbookContent );

qunitContent = readFile('cookbook/test/qunit/qunit.js').
    replace(".then(\"tests/basic\")", ".then(\"recipe_test\")");
new steal.File('cookbook/test/qunit/qunit.js').save( qunitContent );

funcunitContent = readFile('cookbook/test/funcunit/funcunit.js').
    replace(".then(\"tests/basic\")", ".then(\"recipe_controller_test\")");
new steal.File('cookbook/test/funcunit/funcunit.js').save( funcunitContent ); 

_S.clear();
//now see if unit and functional run
print("-- unit --");
_args = ['-unit']; load('cookbook/scripts/test.js');

_S.clear();
//print("-- functional --");
//_args = ['-functional']; load('cookbook/scripts/test.js');_S.clear();

print("!!!!!!!!!!!!!!!!!!!!!!!!!!  complete !!!!!!!!!!!!!!!!!!!!!!!!!!!!")


print("-- cleanup --");
(function(){
	var	deleteDir = function(dir){
		if (dir.isDirectory()) {
	        var children = dir.list();
	        for (var i=0; i<children.length; i++) {
	            var success = deleteDir(new java.io.File(dir, children[i]));
	            if (!success) return false;
	            
	        }
	    }
	
	    // The directory is now empty so delete it
	    return dir['delete']();
	}
	deleteDir(new java.io.File("cnu"));
    /*deleteDir(new java.io.File("engines/generate"));
    deleteDir(new java.io.File("views/todos"));*/
    deleteDir(new java.io.File("cookbook"));

    /*var tbd = ['gen.html',
               'test/functional/todos_test.js',
               'cookbook.html',
               'controllers/recipe_controller.js',
               'models/recipe.js',
               'test/functional/recipe_controller_test.js',
               'test/fixtures/recipes.json.get',
               'test/unit/recipe_test.js'
               ]
    for(var i = 0; i< tbd.length; i++){
        new java.io.File(tbd[i])["delete"]();
    }*/
    
})();

