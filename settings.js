path = new java.io.File(".").getCanonicalPath();
browserURL = "file:///"+path.replace("\\", "/")+"/";

SeleniumDefaults = {
	// the domain where selenium will run
    serverHost: "localhost",
	// the port where selenium will run
    serverPort: 4444//,
	// the domain/url where your page will run from (change if not filesystem)
    //browserURL: "http://localhost/"
}

// the list of browsers that selenium runs tests on
SeleniumBrowsers = ["*iexplore"]

EmailerDefaults = {
    host: "smtp.gmail.com",
    port: 587,
	auth: true,
	tls: true,
	username: "@gmail.com",
	password: "",
    from: "@gmail.com",
    to: ["@gmail.com"],
    subject: "Test Logs"
}
/**
* Example 2: SMTP Server without authentication 
EmailerDefaults = {
    host: "smtp.myserver.com",
    port: 25,
    from: "myemail@myserver.com",
    to: ["yourname@myserver.com", "anotherdev@myserver.com"],
    subject: "Test Logs"
}
*/