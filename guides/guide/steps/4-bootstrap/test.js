MinUnit.module("After bootstrap installed");

MinUnit.test("bootstrap styles added", function(done){
	F("style").size(3, "There are now 3 styles on the page");
	F(done);
});
