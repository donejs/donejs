var automate = require("guide-automation");
var join = require("path").join;
var streamWhen = require("stream-when");
var isWindowsCI = require("is-appveyor");
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

function supermodel(name, endpoint, id){
	var args = ["add", "supermodel", name];
	var model = guide.answerPrompts("donejs", args);
	var answer = model.answer;

	answer(/URL endpoint/, endpoint + "\n");
	answer(/property name/, id + "\n");

	return model.promise;
}

/**
 * Set up the project
 */

guide.step("Install donejs", function(){
	return guide.executeCommand("npm", ["install", "donejs", "-g"]);
});

// Move to a temp folder for the rest of the guide
guide.moveToTmp();

guide.step("Run donejs init", function(){
	var init = guide.answerPrompts("donejs", ["init", "place-my-order",
		"--skip-install"]);
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

guide.step("Move to place-my-order folder", function(){
	process.chdir("place-my-order");
	return guide.injectSpy("src/index.stache");
});

guide.step("Run NPM install", function() {
	return guide.executeCommand("npm", ["install"]).then(guide.wait(10000));
});


guide.step("Install place-my-order-api", function() {
	return guide.executeCommand("npm", ["install", "place-my-order-api"]);
});

guide.step("Starting the application", function(){
	function startSSRServer(){
		var child = guide.doneServe = guide.executeCommand("donejs", ["develop"])
			.childProcess;

		var server = streamWhen(child.stdout, /done-serve starting on/);
		var liveReload = streamWhen(child.stderr, /Live-reload server/);
		return Promise.all([server, liveReload]).then(wait);
  }

  function startAPIServer() {
		var child = guide.doneApi = guide.executeCommand("donejs", ["api"]);
		return guide.wait(5000);
  }

  function updateScripts(){
		return guide.replaceJson("package.json", join(__dirname, "steps",
																									"starting-the-application",
																									"scripts.json"))
																									.then(wait);
  }

  return updateScripts().then(startAPIServer).then(startSSRServer);
});

guide.launchBrowser("http://localhost:8080");

/**
 * Loading assets
 */
guide.step("Loading assets", function(){
	return guide.executeCommand("npm", ["install", "place-my-order-assets", "--save"])
		.then(wait)
		.then(function(){
			return guide.replaceFile(join("src", "index.stache"),
															 join(__dirname, "steps", "loading-assets",
																		"index.stache"));
		})
		.then(wait)
		.then(wait);
});

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "loading-assets",
																	 "test.js"))
		.then(wait);
});

/**
 * Creating custom elements
 */
guide.step("Creating a homepage element", function(){
	var args = "add component home.component pmo-home".split(" ");
	return guide.executeCommand("donejs", args)
		.then(function(){
			return guide.replaceFile(join("src", "home.component"),
															 join(__dirname, "steps", "creating-homepage",
																		"home.component"));
		})
		.then(wait);
});

guide.step("Create the order history element", function(){
	var args = "add component order/history.component pmo-order-history".split(" ");
	return guide.executeCommand("donejs", args)
		.then(function(){
			return guide.replaceFile(join("src", "order", "history.component"),
															 join(__dirname, "steps", "creating-oh",
																		"history.component"))
				.then(wait)
				.then(wait);
		})
		.then(wait);
});

guide.step("Creating a restaurant list element", function(){
	var args = "add component restaurant/list pmo-restaurant-list".split(" ");
	return guide.executeCommand("donejs", args)
		.then(wait)
		.then(wait);
});

guide.step("Create Routes", function(){
	return guide.replaceFile(join("src", "app.js"),
													 join(__dirname, "steps", "create-routes",
																"app.js"))
		.then(wait);
});

guide.step("Adding a header element", function(){
	var args = "add component header.component pmo-header".split(" ");
	return guide.executeCommand("donejs", args)
		.then(function(){
			return guide.replaceFile(join("src", "header.component"),
															 join(__dirname, "steps", "add-header",
																		"header.component"))
				.then(wait)
				.then(wait);
		})
		.then(wait)
		.then(wait);
});

guide.step("Create a loading indicator", function(){
	var args = "add component loading.component pmo-loading".split(" ");
	return guide.executeCommand("donejs", args)
		.then(function(){
			return guide.replaceFile(join("src", "loading.component"),
															 join(__dirname, "steps", "add-loading",
																		"loading.component"))
				.then(wait)
				.then(wait);
		})
		.then(wait)
		.then(wait);
});

guide.step("Switch between components", function(){
	return guide.replaceFile(join("src", "index.stache"),
													 join(__dirname, "steps", "switch-between",
																"index.stache"))
		.then(function(){
			return guide.injectSpy("src/index.stache");
		})
		.then(wait);
});

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "switch-between",
																	 "test.js"))
		.then(wait);
});

guide.step("Creating a restaurants connection", function(){
	return supermodel("restaurant", "/api/restaurants", "_id").then(wait);
});

guide.step("Add data to the page", function(){
	return guide.replaceFile(join("src", "restaurant", "list", "list.js"),
													 join(__dirname, "steps", "add-data", "list.js"))
		.then(wait)
		.then(function(){
			return guide.replaceFile(join("src", "restaurant", "list", "list.stache"),
															 join(__dirname, "steps", "add-data", "list.stache"));
		})
		.then(wait)
		.then(wait);
});

guide.step("Create dependent models", function(){
	return supermodel("state", "/api/states", "short")
		.then(function(){
			return supermodel("city", "/api/cities", "name");
		})
		.then(wait)
		.then(function(){
			return guide.replaceFile(join("src", "restaurant", "list", "list.js"),
															 join(__dirname, "steps", "create-dependent",
																		"list.js"));
		})
		.then(wait);
});

/**
 * Testing
 */
guide.closeBrowser();

guide.step("Create a test", function(){
	return guide.replaceFile(join("src", "models", "fixtures", "state.js"),
													 join(__dirname, "steps", "create-test", "state.js"))
		.then(function(){
			return guide.replaceFile(join("src", "models", "fixtures", "city.js"),
													 join(__dirname, "steps", "create-test", "city.js"));
		})
		.then(function(){
			return guide.replaceFile(join("src", "models", "fixtures", "restaurant.js"),
													 join(__dirname, "steps", "create-test", "restaurant.js"));
		})
		.then(function(){
			return guide.replaceFile(join("src", "restaurant", "list", "list_test.js"),
													 join(__dirname, "steps", "create-test", "list_test.js"));

		})
    .then(function(){
			return guide.injectSpy("src/restaurant/list/test.html");
    })
		.then(wait)
		.then(wait);
});

guide.launchBrowser("http://localhost:8080/src/restaurant/list/test.html");

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "create-test",
																	 "test.js"))
		.then(wait);
});

guide.closeBrowser();

guide.step("Write the template", function(){
	return guide.replaceFile(join("src", "restaurant", "list", "list.stache"),
													 join(__dirname, "steps", "write-template",
																"list.stache"))
		.then(function(){
			return guide.replaceFile(join("src", "restaurant", "list", "list.html"),
													 join(__dirname, "steps", "write-template",
																"list.html"));
		})
		.then(function(){
			return guide.injectSpy("src/restaurant/list/list.html");
		})
		.then(wait);
});

guide.launchBrowser("http://localhost:8080/src/restaurant/list/list.html");

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "write-template",
																	 "test.js"))
		.then(wait);
});

guide.closeBrowser();

guide.step("Using a test runner", function(){
	return guide.replaceFile(join("src", "test", "test.js"),
													 join(__dirname, "steps", "test-runner", "test.js"))
		.then(function(){
			return guide.executeCommand("donejs", ["test"]);
		})
		.then(wait);
});

/**
 * Creating additional components
 */
guide.step("Create additional components", function(){
	var args = "add component restaurant/details.component pmo-restaurant-details"
		.split(" ");
	return guide.executeCommand("donejs", args)
	.then(function(){
		return guide.replaceFile(join("src", "restaurant", "details.component"),
														 join(__dirname, "steps", "additional",
																	"details.component"));
	})
	.then(function(){
		args = "add component order/new pmo-order-new".split(" ");
		return guide.executeCommand("donejs", args);
	})
	.then(wait)
	.then(function(){
		return guide.replaceFile(join("src", "index.stache"),
														 join(__dirname, "steps", "additional",
																	"index.stache"))
			.then(function(){
				return guide.injectSpy("src/index.stache");
			});
	})
	.then(wait);
});

guide.step("Importing other projects", function(){
	return guide.executeCommand("npm", ["install", "bit-tabs", "--save"])
		.then(wait)
		.then(wait)
		.then(function(){
			return guide.replaceFile(join("src", "order", "new", "new.stache"),
															 join(__dirname, "steps", "bit-tabs", "new.stache"));
		})
		.then(wait);
});

guide.step("Creating the order model", function(){
	var replaceFile = guide.replaceFile;
	return supermodel("order", "/api/orders", "_id")
		.then(function(){
			return replaceFile(join("src", "models", "order.js"),
												 join(__dirname, "steps", "create-data", "order.js"));
		})
		.then(function(){
			return replaceFile(join("src", "order", "new", "new.js"),
												 join(__dirname, "steps", "create-data", "new.js"));
		})
		.then(function(){
			return replaceFile(join("src", "order", "new", "new_test.js"),
												 join(__dirname, "steps", "create-data", "new_test.js"));
		})
		.then(function(){
			var args = "add component order/details.component pmo-order-details"
				.split(" ");
			return guide.executeCommand("donejs", args);
		})
		.then(function(){
			return replaceFile(join("src", "order", "details.component"),
												 join(__dirname, "steps", "create-data",
															"details.component"));
		})
		.then(function(){
			return replaceFile(join("src", "order", "new", "new.stache"),
												 join(__dirname, "steps", "create-data", "new.stache"));
		})
		.then(function(){
			return guide.injectSpy("src/order/new/test.html");
		})
		.then(wait)
		.then(wait);
});

guide.launchBrowser("http://localhost:8080/src/order/new/test.html");

guide.test(function(){
	return guide.functionalTest(join(__dirname, "steps", "create-data",
																	 "test.js"))
		.then(wait);

});

guide.closeBrowser();

/**
 * Real-time
 */
guide.step("Set up a real-time connection", function(){
	var replaceFile = guide.replaceFile;
	return guide.executeCommand("npm", ["install", "steal-socket.io", "--save"])
		.then(function(){
			return replaceFile(join("src", "models", "order.js"),
												 join(__dirname, "steps", "real-time", "order.js"));
		})
		.then(function(){
			var args = "add component order/list.component pmo-order-list".split(" ");
			return guide.executeCommand("donejs", args);
		})
		.then(function(){
			return replaceFile(join("src", "order", "list.component"),
												 join(__dirname, "steps", "real-time", "list.component"));
		})
		.then(function(){
			return replaceFile(join("src", "order", "history.component"),
												 join(__dirname, "steps", "real-time",
															"history.component"));
		})
		.then(wait)
		.then(wait);
});

/**
 * Documentation
 */
guide.step("Create documentation", function(){
	return guide.replaceFile(join("src", "order", "new", "new.js"),
													 join(__dirname, "steps", "document", "new.js"))
		.then(function(){
			return guide.executeCommand("donejs", ["document"]);
		})
		.then(wait)
		.then(wait);
});

guide.test(function(){
	return guide.nodeTest(join(__dirname, "steps", "document", "test.js"));
});

guide.step("Stop development mode", function(){
  return guide.kill(guide.doneServe)
    .then(function(){
      guide.doneServe = null;
      return guide.wait(2000);
    });
});

/**
 * Production builds
 */
guide.step("Bundling your app", function(){
	return guide.executeCommand("donejs", ["build"]);
});

if(isWindowsCI) {
  guide.step("Open in production", function(){
    process.env["NODE_ENV"] = "production";

    var child = guide.doneServe = guide.executeCommand("donejs", ["start"])
      .childProcess;

    var server = streamWhen(child.stdout, /done-serve starting on/);
    return server.then(wait);
  });

  guide.test(function(){
    return guide.nodeTest(join(__dirname, "steps", "production", "test.js"));
  });

  guide.step("Stop production mode", function(){
    return guide.kill(guide.doneServe)
      .then(function(){
        guide.doneServe = null;
			}).then(function(){
        return guide.wait(2000);
      })
  });
}

/**
 * Run the test
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
	console.log("Exiting", exitCode);
	process.exit(exitCode);
});
