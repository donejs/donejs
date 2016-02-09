var automate = require("guide-automation");
var streamWhen = require("stream-when");

var guide = automate({ spinner: true, log: true });
var wait = function(){
	return guide.wait(2000);
};

guide.step("Install donejs", function(){
	return guide.executeCommand("npm", ["install", "donejs", "-g"]);
});

// Move to a temp folder for the rest of the guide
guide.moveToTmp();

guide.step("Run donejs init", function(){
	var init = guide.answerPrompts("donejs", ["init", "place-my-order"]);
	var answer = init.answer;

	answer(/Project name/, "\n");
	answer(/Project main folder/, "src\n");
	answer(/Description/, "\n");
	answer(/Project homepage url/, "\n");
	answer(/GitHub username or organization/, "\n");
	answer(/Author's Name/, "\n");
	answer(/Author's Email/, "\n");
	answer(/Author's Homepage/, "\n");
	answer(/Application keywords/, "\n");

	return init.promise;
});

guide.step("Move to place-my-order folder", function(){
	process.chdir("place-my-order");
	return guide.injectSpy("src/index.stache");
});

guide.step("Install place-my-order-api", function() {
	return guide.executeCommand("npm", ["install", "place-my-order-api"]);
});

guide.step("Start donejs develop", function(){
	var child = guide.canServe = guide.executeCommand("donejs", ["develop"]).childProcess;

	var server = streamWhen(child.stdout, /can-serve starting on/);
	var liveReload = streamWhen(child.stderr, /Live-reload server/);
	return Promise.all([server, liveReload]).then(wait);
});

guide.test(function(){
	return guide.nodeTest(__dirname + "/steps/3-donejs-develop/test.js");
});

guide.launchBrowser("http://localhost:8080");

guide.run().then(
	function(){
		console.log("All done!");
		return 0;
	},
	function(err){
		console.error("Oh no", err.message, err.stack, err);
		return 1;
	}
).then(function(exitCode){
	if(guide.canServe) {
		guide.canServe.kill();
	}
	return exitCode;
}).then(function(exitCode){
	process.exit(exitCode);
});
