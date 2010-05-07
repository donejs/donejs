/*
 * @page selenium Selenium Config
 * @tag test
 * <h1 class='addFavorite'>Selenium Config</h1>
 * <p>The generator creates a selenium_config.js file in the application's test folder.  Here are what the
 * options do:</p>
@codestart
SeleniumDefaults = {
 serverHost: "localhost",   //selenium server location
 serverPort : 4444,         //selenium server port
 browserURL : "http://localhost#jmvc[selenium]=true&jmvc[env]=test" 
                            //where your app runs from                
}

SeleniumBrowsers = [        //list of browsers
 "*iexplore",
 "*firefox"
]
@codeend
 */