var assert = require("assert");
var fetch = require("node-fetch");

describe("donejs develop after init", function(){
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
		assert(/home/.test(this.html), "Home is in there");
    assert(/page/.test(this.html), "Page is there");
	});
});
