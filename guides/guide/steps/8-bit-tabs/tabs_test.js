MinUnit.module("Using bit-tabs");

MinUnit.test("2 tabs exist", function(done){
	F("bit-tabs").exists("bit-tabs added to the page");
	F("bit-panel").size(2, "there are 2 panels");
	F("bit-panel:eq(0)").attr("title", /CanJS/, "The first tab is for Canjs");
	F("bit-panel:eq(1)").attr("title", /StealJS/, "The second tab is for StealJS");
	F(done);
});

MinUnit.test("Can toggle between tabs", function(done){
	F("bit-tabs li:eq(1)").exists().click();
	F("bit-panel:eq(1)").text(/StealJS provides the infrastructure/,
							  "StealJS tab is showing");
	F("bit-tabs li:eq(0)").exists().click();
	F("bit-panel:eq(0)").text(/CanJS provides/, "CanJS tab is showing");
	F(done);
});
