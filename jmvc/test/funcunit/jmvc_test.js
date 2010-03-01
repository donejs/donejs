module("jmvc")


test("jmvc testing works", function(){

        S.open("file:/C:/Users/Jupiter/development/framework/jmvc/jmvc.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})