@page funcunit.getstarted Get Started with FuncUnit
@parent tutorials 5

In this guide, we'll use [FuncUnit] to write functional tests for the jQuery UI 
autocomplete widget. We'll go over:

* Running a test in browser
* Writing a test
* Debugging a broken test
* Running tests via Selenium
* Running tests via PhantomJS

## Running Autocomplete Tests

Open _funcunit/test/autosuggest/autosuggest.html_ in a browser.  Type "J" in the input.  You'll see the following:

@image funcunit/pages/images/autosuggest.png


This page is a simple demo app, using jQueryUI [http://jqueryui.com/demos/autocomplete/ autocomplete]. It 
shows results when you start typing, then you can click a result (or use mouse navigation) to populate the input.

There is a test already written.  Open <i>funcunit/test/autosuggest/autosuggest_test.js</i> in your IDE:

@codestart
module("autosuggest",{
  setup: function() {
    S.open('autosuggest.html')
  }
});

test("results appear",function(){
  S('input').visible().click().type("Java")

  // wait until we have some results
  S('.ui-menu-item').visible(function(){
    equal( S('.ui-menu-item').size(), 2, "there are 2 results")
  })
});
@codeend

As you can probably tell, the [s S method] is an alias for jQuery (*).  This test:

1. Opens autosuggest.html
1. Grabs the input element, clicks it, and types "Java"
1. Grabs the element that is populated with results, waits for it to be visible
1. Asserts that there are 2 results shown

(*) Actually its a [http://api.jquery.com/jQuery.sub/ copy] of jQuery that performs queries in 
the application window by default, and sometimes caches its selector to run asynchronously.

To run this test, open <i>funcunit/test/autosuggest/funcunit.html</i> in any browser (turn off your popup blocker).  The test will open and run.  The results are shown in the QUnit page:

@image funcunit/pages/images/qunit.png


## Writing an Autocomplete Test

Next we'll add a test for selecting a result with the keyboard.  FuncUnit's [apifuncunit API] consists of:

* [funcunit.finding The S Method] - Perform a query in the application window
* [funcunit.actions Actions] - Simulate user actions like [FuncUnit.prototype.click click],  [FuncUnit.prototype.type type],  [FuncUnit.prototype.drag drag]
* [funcunit.waits Waits] - Wait for a condition in your page to be met.  Fail the test if the condition isn't met before a timeout.
* [funcunit.getters Assertions & getters] - Synchronously check a condition in your page.

The setup and assertion methods are part of the [http://docs.jquery.com/Qunit QUnit] API.

Our test should do the following:

1. Type "JavaS" in the input.
1. Wait for a result to be visible.
1. Select the input and press the down and enter keys to select the first item.
1. Wait for the input to show "JavaScript".

Add the following under the first test:

@codestart
test("keyboard navigation",function(){
  S('input').visible().click().type("JavaS")

  S('.ui-menu-item').visible()
  S('input').type('[down][enter]')
    .val("JavaScript")
});
@codeend

A few important notes about this test:

1. We have no assertions. This is ok. Most FuncUnit tests don't need them. If the wait conditions aren't met before a timeout, the test will fail.  If the test completes, this feature is working.
1. The click, visible, and val methods are actually doing asynchronous things. FuncUnit lets you write tests with this linear syntax by queueing the actual methods and running them one by one. This is to prevent your tests from being an unreadable mess of nested functions like:

@codestart
S('.input').visible(function(){
  S('.input').click(function(){
    S('input').type("JavaS")
  })
})
@codeend

Reload the funcunit.html page and see your new test run and pass.

## Debugging tests

Now change .val("JavaScript") to .text("C#").  Reload the page and watch it timeout and fail.

@image funcunit/pages/images/broken.png


In this case, the error message shown is a good indication for why the test is broken. But often we need 
more visibility to debug a test.

Your first debugging instinct might be "Let's add a breakpoint!".  But, as noted, this 
code is running asynchronously.  When .val() runs, its adding a method to 
FuncUnit.queue, not actually doing the check.  When its this wait condition's turn to 
run, $("input").val() === "JavaScript" is checked repeatedly until its true or a timeout is reached.  

We can replace the string value with a checker function and use console.log to see what's going on. When 
previous queued methods finish, this function will run on repeat. Change that line to:

@codestart
  .val(function(val){
    console.log(val, this)
    if(val === "C#") return true;
  });
@codeend

"this" in your wait method is the element that .text is being run against. The console will show the following:

@image funcunit/pages/images/console.png


Using this technique, you can inspect the state of your app at various points throughout the test. Undo 
this breaking change before moving on to the next part.

## Running in Selenium

Next we'll run this same test via the browser automation tool Selenium. Open a 
command prompt to the JMVC directory and run the following:

@codestart
./js funcunit/run selenium funcunit/test/autosuggest/funcunit.html
@codeend

On windows, just use "js" instead of ./js. This will open the test page in 
Firefox, run the same test, and report the results on the command line:

@image funcunit/pages/images/commandline.png


You can configure this step to run in any browser via the [integrations settings.js file].

## Running in PhantomJS

Running in Selenium is great, but physically opening a browser can be too slow for quick 
regression testing.  [http://www.phantomjs.org/ PhantomJS] is a headless version of WebKit, which can run the same 
tests from the commandline much faster without opening any visual browser windows. To run 
this step, first you must [funcunit.phantomjs PhantomJS]. Then run:

@codestart
./js funcunit/run phantomjs funcunit/test/autosuggest/funcunit.html
@codeend

Phantom opens your page, runs the same test, and reports results on the commandline. 
This step can be easily integrated in your build process via [funcunit.jenkins Jenkins] or [funcunit.maven Maven].

## Conclusion

Hopefully, this guide illustrates how FuncUnit provides the holy grail of testing: easy, familiar syntax, in browser running for 
easy debugging, and simple automation.  

FuncUnit will transform your development lifecycle, give your developers confidence, and improve quality.


That's it! If you want to learn more, read about FuncUnit's [FuncUnit API] and [funcunit.integrations integrations] 
or check out some [funcunit.demos demos].