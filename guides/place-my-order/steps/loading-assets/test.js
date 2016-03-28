MinUnit.module("After place-my-order-assets installed");

MinUnit.test("pmo styles added", function(done){
	F("style").size(2, "There are now 2 styles on the page");
	F(done);
});
