MinUnit.module("Navigate between pages");

MinUnit.test("button to navigate to the chat page added", function(done){
	F(".btn-primary").exists().attr("href", /chat/, "Button to navigate to the messages page now exists");
	F(done);
});
