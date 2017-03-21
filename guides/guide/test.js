var automate = require("guide-automation");
var isWindowsCI = require("is-appveyor");
var join = require("path").join;
var rimraf = require("rimraf").sync;
var streamWhen = require("stream-when");
var nodeVersion = +process.version.substr(1).split(".")[0];

// Only run in AppVeyor if version >= 5
if(isWindowsCI && nodeVersion < 5) {
    process.exit(0);
}

var guide = automate({ spinner: true, log: true });
var wait = function(){
    var ms = isWindowsCI ? 5000 : 2000;
	return guide.wait(ms);
};

/**
 * @Step 1
 */
guide.step("Remove existing dependencies", function(){
  rimraf(join("node_modules", "donejs-cli"));
  rimraf(join("node_modules", "generator-donejs"));
});

guide.step("Install donejs", function(){
  var branch = process.env.TRAVIS_PULL_REQUEST_BRANCH || process.env.TRAVIS_BRANCH
    || process.env.APPVEYOR_REPO_COMMIT || 'master';

	return guide.executeCommand("npm", ["install", "donejs/donejs#" + branch, "-g"]);
});

// Move to a temp folder for the rest of the guide
guide.moveToTmp();

/**
 * @Step 2
 */
guide.step("Run donejs add app", function(){
	var init = guide.answerPrompts("donejs", ["add", "app", "donejs-chat", "--skip-install"]);
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
	return guide.executeCommand("npm", ["install"]).then(guide.wait(10000));
});

/**
 * @Step 4
 */
guide.step("Start donejs develop", function(){
	var child = guide.canServe = guide.executeCommand("donejs", ["develop"]).childProcess;
  console.log("done-serve running as", child.pid);

	var server = streamWhen(child.stdout, /done-serve starting on/);
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
    .then(function(){
      return guide.injectSpy("src/index.stache");
    })
    .then(wait)
		.then(wait);
});

guide.test(function(){
  console.log("Running bootstrap tests");
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
		})
    .then(function(){
      return guide.injectSpy("src/index.stache");
    })
    .then(wait);
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
  function installWait(){
    return guide.wait(10000);
  }

	return guide.executeCommand("npm", ["install", "bit-tabs@alpha", "--save"])
    .then(installWait)
		.then(function(){
			return guide.replaceFile(join("src", "home.component"),
									 join(__dirname, "steps", "8-bit-tabs", "home.component"));
		})
		.then(wait);
});

guide.test(function(){
  console.log("Running bit-tabs tests");
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
  answer(/service URL/, "Yes\n");

	return supermodel.promise;
});

/**
 * @Step 10
 */
guide.step("Use the connection", function(){
	return guide.replaceFile(join("src", "messages", "messages.stache"),
							 join(__dirname, "steps", "10-use-connection", "messages.stache"))
    .then(function() {
      return guide.replaceFile(join("src", "messages", "messages.js"),
                   join(__dirname, "steps", "10-use-connection", "messages.js"))
    })
		.then(wait);
});

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "10-use-connection", "test.js"));
});

/**
 * @Step 11
 */
guide.step("Create messages", function(){
  return guide.replaceFile(join("src", "messages", "messages.js"),
               join(__dirname, "steps", "11-create-messages", "messages.js"))
		.then(function(){
      return guide.replaceFile(join("src", "messages", "messages.stache"),
    							 join(__dirname, "steps", "11-create-messages", "messages.stache"));
		}).then(wait);
});

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "11-create-messages", "test.js"));
});

/**
 * @Step 12
 */
guide.step("Enable a real-time connection", function(){
	return guide.executeCommand("npm", ["install", "steal-socket.io@2", "--save"])
		.then(wait)
		.then(function(){
			return guide.replaceFile(join("src", "models", "message.js"),
									 join(__dirname, "steps", "12-real-time", "message.js"));
		});

});

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "12-real-time", "test.js"));
});

/**
 * @Step 13
 */
guide.closeBrowser();

guide.step("Stop development mode", function(){
  return guide.kill(guide.canServe)
    .then(function(){
      guide.canServe = null;
      return guide.wait(2000);
    });
});

/**
 * @ Step 14
 */

guide.step("Production build", function(){
	return guide.executeCommand("donejs", ["build"]);
});

/**
 * @ Step 15
 */
guide.step("Open in production", function(){
	process.env["NODE_ENV"] = "production";

	var child = guide.canServe = guide.executeCommand("donejs", ["start"])
		.childProcess;

	var server = streamWhen(child.stdout, /done-serve starting on/);
	return server.then(wait);
});

guide.test(function(){
	return guide.nodeTest(join(__dirname, "steps", "15-production", "test.js"));
});

guide.step("Stop production mode", function(){
	return guide.kill(guide.canServe)
		.then(function(){
			guide.canServe = null;
			return guide.wait(2000);
		});
});

/**
 * @Step 16
 */
guide.stepIf("Deploy to CDN", function() {
	return !!guide.options.app;
}, function(){
  return guide.executeCommand("donejs", ["add", "firebase"])
		.then(function(){
			return guide.executeCommand("donejs", ["build"]);
		})
		.then(function(){
			return guide.executeCommand("donejs", ["deploy"]);
		});
});

/**
 * @Step 17
 */
guide.stepIf("Desktop and mobile apps: Cordova", function() {
	return process.platform === 'darwin';
}, function(){
	return guide.executeCommand("npm", ["install", "-g", "ios-sim"])
		.then(function(){
			var proc = guide.answerPrompts("donejs", ["add", "cordova"]);
			var answer = proc.answer;

			answer(/Name of project/, "donejs chat\n");
			answer(/ID of project/, "com.donejs.donejschat\n");
      answer(/service layer/, "\n");
			answer(/What platforms/, "\n");

			return proc.promise;
		})
		.then(function(){
			return guide.executeCommand("donejs", ["build", "cordova"]);
		});
});

/**
 * @Step 18
 */
guide.step("Desktop and mobile apps: Electron", function(){
	var proc = guide.answerPrompts("donejs", ["add", "electron"]);
	var answer = proc.answer;

	answer(/Main HTML file/, "\n");
  answer(/service layer/, "\n");
	answer(/What platforms/, "\n");
	answer(/What architectures/, "\n");

	return proc.promise
		.then(function(){
			return guide.executeCommand("donejs", ["build", "electron"]);
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
