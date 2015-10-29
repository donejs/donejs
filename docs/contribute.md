@page contribute Contribue to DoneJS
@parent DoneJS
@hide sidebar
@outline 2 ol

@body
Thank you for contributing to DoneJS!  If you need any help setting up a DoneJS development environment and fixing DoneJS bugs, please reach out to us on [gitter](https://gitter.im/donejs/donejs) or email [contact@bitovi.com](mailto:contact@bitovi.com).  We will happily walk you through setting up a the environment, creating a test, and submitting a pull request.

## Reporting Bugs

To report a bug, please visit [GitHub Issues](https://github.com/donejs/donejs/issues).

When filing a bug, it is helpful to include:

- Small examples using tools like [JSFiddle](http://jsfiddle.com/). You can fork the following DoneJS fiddles:
  - [jQuery](http://jsfiddle.net/donejs/qYdwR/)
  - [Zepto](http://jsfiddle.net/donejs/7Yaxk/)
  - [Dojo](http://jsfiddle.net/donejs/9x96n/)
  - [YUI](http://jsfiddle.net/donejs/w6m73/)
  - [Mootools](http://jsfiddle.net/donejs/mnNJX/)
- Breaking unit tests (optional)
- Proposed fix solutions (optional)

Search for previous tickets, if there is one add to that one rather than creating another. You can also post on the [Forums](https://forums.donejs.com) or talk to us in [gitter](https://gitter.im/donejs/donejs).

## Installing 

1. <a href="https://github.com/donejs/donejs/fork" target="_blank">Fork DoneJS on GitHub.</a>
2. Clone it with: `git clone git@github.com:<your username>/donejs`

## Structure

TODO: Explain stack or link to api section.

## Contributing

When contributing, please include tests with new features or bug fixes in a feature branch until you're ready to submit the code for consideration; then push to the fork, and submit a pull request. More detailed steps are as follows:

1. Navigate to your clone of the DoneJS repository - `cd /path/to/donejs`
2. Create a new feature branch - `git checkout -b html5-fix`
3. Make some changes
4. Update tests to accomodate your changes
5. Run tests and make sure they pass in all browsers
6. Update documentation if necessary
7. Push your changes to your remote branch - `git push origin html5-fix`
8. Submit a pull request! Navigate to [Pull Requests](https://github.com/donejs/donejs/pulls) and click the 'New Pull Request' button. Fill in some details about your potential patch including a meaningful title. When finished, press "Send pull request". The core team will be notified about your submission and let you know of any problems or targeted release date.

## Documentation

If your changes affect the public API, please make relevant changes to the documentation. Documentation is found either inline or in markdown files in the respective directory. In order to view your changes in documentation you will need to run the DoneJS.com site locally and regenerate the docs.

To run the docs and watch the files for changes run the command:
```
./node_modules/.bin/documentjs -d -f --watch
```

Finally, serve the site locally using a tool like [http-server](https://www.npmjs.com/package/http-server).

## Making a build

To make a build (standalone and AMD version) you will also need to have [[NodeJS](http://nodejs.org/), [npm](http://npmjs.org/), [Grunt](http://gruntjs.com/) and all of the DoneJS dev dependencies installed.

### Getting Set Up

1. Install NodeJS & npm - [NodeJS](http://nodejs.org/) or use `brew install nodejs`
2. Install Grunt - `npm install grunt-cli -g`
3. Navigate to your local clone of DoneJS - `cd /path/to/canjs`
4. Install dependencies - `npm install`

After you have completed those steps simply run `grunt build` and it will put the built files in the `can/dist` directory, making them ready for download.

## Style Guide

### Linting
Grunt provides a `quality` task to verify some basic, practical soundness of the codebase. The options are preset.

### Spacing
Indentation with tabs, not spaces.

`if/else/for/while/try` always have braces, with the first brace on the same line.  For example:

    if(foo){

    }
  
Spaces after commas.  For example:

    myfn = function(foo, bar, moo){ ... }

### Assignments

Assignments should always have a semicolon after them.

Assignments in a declaration should always be on their own line. Declarations that don't have an assignment should be listed together at the start of the declaration. For example:

    // Bad
    var foo = true;
    var bar = false;
    var a;
    var b;

    // Good
    var a, b,
      foo = true,
      bar = false;

### Equality

Strict equality checks `===` should be used in favor of `==`. The only exception is when checking for undefined and null by way of null.

    // Bad
    if(bar == "can"){ ... }

    // Good
    if(bar === "can"){ ... }

If the statement is a truthey or falsey, use implied operators.  Falseys are when variables return `false`, `undefined`, `null`, or `0`.  Trutheys are when variables return `true`, `1`, or anything defined.

For example:

    // Bad
    if(bar === false){ ... }

    // Good 
    if(bar){ ... }

    // Good
    var foo = [];
    if(!foo.length){ ... }

###  Quotes

Use double quotes.

    var double = "I am wrapped in double quotes";

Strings that require inner quoting must use double outside and single inside.

    var html = "<div id='my-id'></div>";

### Comments

Single line comments go OVER the line they refer to:

    // We need an explicit "bar", because later in the code foo is checked.
    var foo = "bar";

For long comments, use:
    
    /* myFn
     * Four score and seven—pause—minutes ago...
     */
    
### Documentation

The documentation for the different modules should be clear and consistent. Explanations should be concise, and examples of code should be included where appropriate. In terms of format and style, here are a few suggestions to keep the documentation consistent within a module and across all parts of DoneJS:

#### When referencing another part of DoneJS, make sure to link the first reference in a section.

For instance, when documenting `can.Component.scope`, the first reference to `can.Component`, `can.route`, or any other part of DoneJS should be enclosed in square brackets, so that links to those docs are generated. Linking each occurrence isn't necessary, but all the other references should at least be surrounded by "grave accents" or tickmarks.

	This is an example of linking to [can.Component] from another page. If you reference
	`can.Component` later in this section, you don't have to link to it. All subsequent
	references to `can.Component` have grave accents or tickmarks surrounding them.
	
	### New Section
	
	Another section referencing [can.Component] starts this trend again...

**Note**: The one exception to this is on the module page. When documenting `can.Component` itself, only use the tickmarks, as linking to `can.Component` would just link to the page you are currently modifying.

#### Enclose string literals in tickmarks as they should appear in code

If the developer should type `"@"`, use the tickmarks to make this clear. This avoids the ambiguity of whether the apostrophes or quote marks are part of the text that should be typed. This also applies to any references to variable/key names (e.g., `scope` versus "scope" or **scope**).

#### Include a clear description of your example code

For a developer that's new to DoneJS, the description of the example is likely more important than the example itself. Make sure there is a clear description of what the code should accomplish. This includes using all the techniques above. A good description should answer the question, "could you explain what this example code is doing?"
