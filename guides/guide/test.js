var automate = require("guide-automation");
var join = require("path").join;
var streamWhen = require("stream-when");

var guide = automate({ spinner: true, log: true });
var wait = function(){
	return guide.wait(2000);
};

/**
 * @Step 1
 */

guide.step("Install donejs", function(){
	return guide.executeCommand("npm", ["install", "donejs", "-g"]);
});

// Move to a temp folder for the rest of the guide
guide.moveToTmp();

/**
 * @Step 2
 */
guide.step("Run donejs init", function(){
	var init = guide.answerPrompts("donejs", ["init", "donejs-chat", "--skip-install"]);
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
	answer(/NPM version/, "\n");

	return init.promise;
});

/**
 * @Step 3
 */
guide.step("Move to donejs-chat folder", function(){
	process.chdir("donejs-chat");
	return guide.injectSpy("src/index.stache");
});

guide.step("Run NPM install", function() {
	return guide.executeCommand("npm", ["install"]).then(wait);
});

/**
 * @Step 4
 */
guide.step("Start donejs develop", function(){
	var child = guide.canServe = guide.executeCommand("donejs", ["develop"]).childProcess;

	var server = streamWhen(child.stdout, /can-serve starting on/);
	var liveReload = streamWhen(child.stderr, /Live-reload server/);
	return Promise.all([server, liveReload]).then(wait);
});

guide.test(function(){
	return guide.nodeTest(join(__dirname, "steps", "3-donejs-develop", "test.js"));
});

guide.launchBrowser("http://localhost:8080");

/**
 * @Step 5
 */
guide.step("Install bootstrap", function(){
	return guide.executeCommand("npm", ["install", "bootstrap", "--save"])
		.then(wait)
		.then(function(){
			return guide.replaceFile(join("src", "index.stache"),
									 join(__dirname, "steps", "4-bootstrap", "index.stache"));
		})
		.then(wait);
});

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "4-bootstrap", "test.js"))
		.then(wait);
});

/**
 * @Step 6
 */
guide.step("Generate custom elements", function(){
	return guide.executeCommand("donejs", ["add","component","home.component","chat-home"])
		.then(function(){
			return guide.executeCommand("donejs", ["add","component","messages",
								  "chat-messages"]);
		}).then(wait);
});

/**
 * @Step 7
 */
guide.step("Navigate between pages", function(){
	return guide.replaceFile(join("src", "home.component"),
					   join(__dirname, "steps", "7-navigate", "home.component"))
		.then(function(){
			return guide.replaceFile(join("src", "messages", "messages.stache"),
							   join(__dirname, "steps", "7-navigate", "messages.stache"));
		})
		.then(function(){
			return guide.replaceFile(join("src", "app.js"),
							   join(__dirname, "steps", "7-navigate", "app.js"));
		})
		.then(function(){
			return guide.replaceFile(join("src", "index.stache"),
							   join(__dirname, "steps", "7-navigate", "index.stache"));
		}).then(wait);
});



guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "7-navigate", "test.js"));
});

guide.test(function(){
	return guide.nodeTest(join(__dirname, "steps", "7-navigate", "ssr_test.js"));
});

/**
 * @Step 8
 */
guide.step("Install and use bit-tabs", function(){
	return guide.executeCommand("npm", ["install", "bit-tabs", "--save"])
		.then(wait)
		.then(function(){
			return guide.replaceFile(join("src", "home.component"),
									 join(__dirname, "steps", "8-bit-tabs", "home.component"));
		})
		.then(wait);
});

guide.test(function(){
	// Check that the tabs have appeared.
	return guide.functionalTest(join(__dirname, "steps", "8-bit-tabs", "tabs_test.js"))
		.then(wait);
});

/**
 * @Step 9
 */
guide.step("Generate the Message model", function(){
	var supermodel = guide.answerPrompts("donejs", ["add", "supermodel", "message"]);
	var answer = supermodel.answer;

	answer(/URL endpoint/, "http://chat.donejs.com/api/messages\n");
	answer(/property name/, "\n");

	return supermodel.promise;
});

/**
 * @Step 10
 */
guide.step("Use the connection", function(){
	return guide.replaceFile(join("src", "messages", "messages.stache"),
							 join(__dirname, "steps", "10-use-connection", "messages.stache"))
		.then(wait);
});

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "10-use-connection", "test.js"));
});

/**
 * @Step 11
 */
guide.step("Create messages", function(){
	return guide.replaceFile(join("src", "messages", "messages.stache"),
							 join(__dirname, "steps", "11-create-messages", "messages.stache"))
		.then(function(){
			return guide.replaceFile(join("src", "messages", "messages.js"),
									 join(__dirname, "steps", "11-create-messages", "messages.js"));
		}).then(wait);
});

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "11-create-messages", "test.js"));
});

/**
 * @Step 12
 */
guide.step("Enable a real-time connection", function(){
	return guide.executeCommand("npm", ["install", "steal-socket.io", "--save"])
		.then(wait)
		.then(function(){
			return guide.replaceFile(join("src", "models", "message.js"),
									 join(__dirname, "steps", "12-real-time", "message.js"));
		});

});

/**
 * @Step 13
 */
guide.closeBrowser();

guide.step("Stop development mode", function(){
	var canServe = guide.canServe;
	canServe.kill("SIGTERM");
	guide.canServe = undefined;
	return guide.wait(2000);
});

/**
 * @ Step 14
 */

guide.step("Production build", function(){
	return guide.executeCommand("donejs", ["build"]);
});

/**
 * @Step 15
 */
guide.stepIf("Deploy to CDN", function() {
	return !!guide.options.app;
}, function(){
	var appName = guide.options.app;

	var setConfig = function(pkg){
		pkg.donejs.deploy.services.production.config.firebase = appName;
		if(!pkg.system.envs) {
			pkg.system.envs = {};
		}

		if(!pkg.system.envs["server-production"]) {
			pkg.system.envs["server-production"] = {};
		}
		pkg.system.envs["server-production"].baseURL = "https://" +
			appName + ".firebaseapp.com/";
		return pkg;
	};
	return guide.replaceJson("package.json",
							 join(__dirname, "steps", "15-cdn", "deploy.json"), setConfig)
		.then(function(){
			return guide.executeCommand("donejs", ["build"]);
		})
		.then(function(){
			return guide.executeCommand("donejs", ["deploy"]);
		});
});

/**
 * @Step 16
 */
guide.stepIf("Desktop and mobile apps: Cordova", function() {
	return process.platform === 'darwin';
},function(){
	return guide.executeCommand("npm", ["install", "-g", "ios-sim"])
		.then(function(){
			var proc = guide.answerPrompts("donejs", ["add", "cordova"]);
			var answer = proc.answer;

			answer(/Name of project/, "donejs chat\n");
			answer(/ID of project/, "com.donejs.donejschat\n");
			answer(/What platforms/, "\n");

			return proc.promise;
		})
		.then(function(){
			return guide.executeCommand("donejs", ["build", "cordova"]);
		});
});

/**
 * @Step 17
 */
guide.step("Desktop and mobile apps: NW.js", function(){
	var proc = guide.answerPrompts("donejs", ["add", "nw"]);
	var answer = proc.answer;

	answer(/Main HTML file/, "\n");
	answer(/The nw.js version/, "0.12.3\n");
	answer(/Width of/, "\n");
	answer(/Height of/, "\n");
	answer(/What platforms/, "\n");

	return proc.promise
		.then(function(){
			return guide.executeCommand("donejs", ["build", "nw"]);
		});
});

/**
 *  Run the test
 */

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
