MinUnit.module("Order Model Test");

MinUnit.test("Tests are passing", function(done){
	F("#qunit-banner").exists().hasClass("qunit-pass", true,
																			 "All tests are passing");
	F(done);
});
