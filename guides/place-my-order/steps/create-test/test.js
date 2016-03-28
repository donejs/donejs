MinUnit.module("Check list test page");

MinUnit.test("Restaurant List", function(done){
	F("#qunit-banner").exists().hasClass("qunit-pass", true, "All tests pass");
	F(done);
});
