module("recipe")

test("recipes present", function(){

        S.open("ex.html");
		S('.recipe').exists(function(){
			ok(true, "recipes present");
	    });

})

test("create recipes", function(){
    S("[name=name]").type("Ice")
    S("[name=description]").type("Cold Water")
    S("[type=submit]").click()
    S('.recipe:nth-child(2)').exists()
    S('.recipe:nth-child(2) td:first').text(function(text){
        ok(text.match(/Ice/), "Typed Ice");
    });
})

test("edit recipes", function(){
    S('.recipe:nth-child(2) a.edit').click();
    S(".recipe input[name=name]").type(" Water")
    S(".recipe input[name=description]").type("\b\b\b\b\bTap Water")
    S(".update").click()
    S('.recipe:nth-child(2) .edit').exists()
    S('.recipe:nth-child(2) td:first').text(function(text){
        ok(text.match(/Ice Water/), "Typed Ice Water");
    });
    S('.recipe:nth-child(2) td:nth-child(2)').text(function(text){
        ok(text.match(/Cold Tap Water/), "Typed Ice Water");
    });
})


test("destroy", function(){
    S(".recipe:nth-child(2) .destroy").click()
    S.confirm(true);
	S('.recipe:nth-child(2)').missing()
    ok("destroyed");
});