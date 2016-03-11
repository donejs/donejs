MinUnit.module("After bootstrap installed");

MinUnit.test("bootstrap styles added", function(done){
	F("style").size(2, "There are now 2 styles on the page");
	F(done);
});
