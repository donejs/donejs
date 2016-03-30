MinUnit.module("Restaurant List Demo Page");

MinUnit.test("pmo-restaurant-list loaded", function(done){
	F("pmo-restaurant-list").exists("Component loaded");
	F(done);
});

MinUnit.test("Renders component", function(done){
  F(".restaurants").exists("Restaurant component rendered");
	F(done);
});
