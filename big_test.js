// load('big_test.js');
load('steal/test/helpers.js')

print("==========================  generators =============================")
print("-- plugin --");
load('steal/generate/test/run.js');


print("==========================  compression ============================")
load('steal/compress/test/run.js');
load('jquery/view/test/compression/run.js');


print("==========================  unit ============================")
print("-- steal unit tests --");
load('steal/test/run.js');


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
    replace(".then(\"basic_test\")", ".then(\"recipe_test\")");
new steal.File('cookbook/test/qunit/qunit.js').save( qunitContent );

funcunitContent = readFile('cookbook/test/funcunit/funcunit.js').
    replace(".then(\"basic_test\")", ".then(\"recipe_controller_test\")");
new steal.File('cookbook/test/funcunit/funcunit.js').save( funcunitContent );
 
_S.clear();
//now see if unit and functional run
print("-- Run unit tests for cookbook --");
load('cookbook/scripts/qunit.js');

_S.sleep(300);

_S.clear();
load('steal/file/file.js');

_S.clear();
print("-- Run functional tests for cookbook --");
load('cookbook/scripts/funcunit.js');_S.clear();

_S.sleep(300);

_S.clear();
print("-- Compress cookbook --");
load("cookbook/scripts/compress.js")

_S.clear();
load('steal/file/file.js');
cookbookPage = readFile('cookbook/cookbook.html').
    replace("steal[env]=development", "steal[env]=production");
new steal.File('cookbook/cookbook.html').save( cookbookPage );

/*print("-- Run functional tests again, this time with cookbook compressed --");
load('cookbook/scripts/funcunit.js');*/

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

