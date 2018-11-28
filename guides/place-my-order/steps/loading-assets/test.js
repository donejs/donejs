MinUnit.module("After place-my-order-assets installed");

MinUnit.test("pmo styles added", function(done){
	F("style").size(3, "There are now 3 styles on the page");
	F(done);
});
