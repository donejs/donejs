var assert = require("assert");
var fetch = require("node-fetch");

describe("after running donejs document", function(){
  this.timeout(20000);

  before(function(done){
    var test = this;
		fetch("http://localhost:8080/docs/").then(function(res){
			return res.text();
		}).then(function(body){
			test.html = body;
		}).then(done, done);
  });

  it("Has produced a page", function(){
    assert(/THIS IS A GENERATED FILE/.test(this.html), "Documentjs made a page");
  });
});
