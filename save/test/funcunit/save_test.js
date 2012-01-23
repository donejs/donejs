steal("funcunit", function(){
	module("save test", { 
		setup: function(){
			S.open("//save/save.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})