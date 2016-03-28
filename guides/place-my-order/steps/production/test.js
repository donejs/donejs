var assert = require("assert");
var fetch = require("node-fetch");

describe("donejs start after production build", function(){
    this.timeout(20000);

	before(function(done){
		var test = this;
		fetch("http://localhost:8080").then(function(res){
			return res.text();
		}).then(function(body){
			test.html = body;
		}).then(done, done);
	});

	it("Returns the home page", function(){
		assert(/Ordering food/.test(this.html), "Home page was rendered");
	});
});
