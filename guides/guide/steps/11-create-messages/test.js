MinUnit.module("Adding messages");

MinUnit.test("Can go to the chat page and add a message", function(done){
	function some(size) { return size > 0; }

	F("bit-tabs").exists("we are on the home page");
	F(".btn-primary").click();

	F("form input:eq(0)").click().type("DoneJS");
	F("form input:eq(1)").click().type("Rocks");
	F("form input:eq(2)").click();

	F("message-model .list-group-item").size(some, "Message added to the page");
	F(done);
});
