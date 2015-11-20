var assert = require("assert");
var fetch = require("node-fetch");

describe("donejs develop after init", function(){
	before(function(done){
		var test = this;
		fetch("http://localhost:8080").then(function(res){
			return res.text();
		}).then(function(body){
			test.html = body;
		}).then(done, done);
	});

	it("Returns a hello page", function(){
		assert(/Hello World/.test(this.html), "Basic page was rendered");
	});
});
