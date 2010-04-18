module("Model: Ex.Models.Recipe")

test("findAll", function(){
	stop(2000);
	Ex.Models.Recipe.findAll({}, function(recipes){
		start()
		ok(recipes)
        ok(recipes.length)
        ok(recipes[0].name)
        ok(recipes[0].description)
	});
	
})

test("create", function(){
	stop(2000);
	new Ex.Models.Recipe({name: "dry cleaning", description: "take to street corner"}).save(function(recipe){
		start();
		ok(recipe);
        ok(recipe.id);
        equals(recipe.name,"dry cleaning")
        recipe.destroy()
	})
})
test("update" , function(){
	stop();
	new Ex.Models.Recipe({name: "cook dinner", description: "chicken"}).
            save(function(recipe){
            	equals(recipe.description,"chicken");
        		recipe.update({description: "steak"},function(recipe){
        			start()
        			equals(recipe.description,"steak");
        			recipe.destroy();
        		})
            })

});
test("destroy", function(){
	stop(2000);
	new Ex.Models.Recipe({name: "mow grass", description: "use riding mower"}).
            destroy(function(recipe){
            	start();
            	ok( !Ex.Models.Recipe.store.findOne(recipe.id) ,"Store no longer has field" )
            })
})