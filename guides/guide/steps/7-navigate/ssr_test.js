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

	it("Contains the button on the server", function(){
		assert(/btn-primary/.test(this.html), "Chat button added");
	});
});
