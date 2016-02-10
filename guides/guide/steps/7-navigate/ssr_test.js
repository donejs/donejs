var assert = require("assert");
var fetch = require("node-fetch");

describe("development server after generating components", function(){
    this.timeout(20000);
    
	before(function(done){
		var test = this;
		fetch("http://localhost:8080").then(function(res){
			return res.text();
		}).then(function(body){
			test.html = body;
		}).then(done, done);
	});

	it("Contains the button on the server", function(){
		assert(/btn-primary/.test(this.html), "Chat button added");
	});
});
