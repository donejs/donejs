MinUnit.module("Switching Between Components");

MinUnit.test("Homepage is loaded", function(done){
	F("pmo-home").exists("pmo-home component loaded");
	F(done);
});

MinUnit.test("Can navigate to Restaurants", function(done){
	F("pmo-header li:eq(1) a").exists().click();
	F("pmo-restaurant-list").exists("Restaurant list loaded");
	// Go back to the home page
	F("pmo-header li:eq(0) a").exists().click();
	F("pmo-home").exists("Went back to the home page");
	F(done);
});

MinUnit.test("Can navigate to Order History", function(done){
	F("pmo-header li:eq(2) a").exists().click();
	F("pmo-order-history").exists("Order History loaded");
	// Go back to the home page
	F("pmo-header li:eq(0) a").exists().click();
	F("pmo-home").exists("Went back to the home page");
	F(done);
});
