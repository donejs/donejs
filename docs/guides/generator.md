@page generator DoneJS generators
@parent DoneJS
@hide sidebar
@outline 2 ol
@description DoneJS applications can be extended with additional functionality with installable generators. In this guide will create a generator that adds JSHint and an `.editorconfig` file to our application.

@body

If you have used `donejs add nw` or `donejs add cordova` to create a [desktop- or mobile version](https://donejs.com/Features.html#section=section_iOS_Android_andDesktopBuilds) of your application you already used a DoneJS generator. Generators are [npm](https://www.npmjs.com/) modules with a name starting with `donejs-` (e.g. [donejs-cordova](https://www.npmjs.com/package/donejs-cordova) for `donejs add cordova`) that provide a [Yeoman](http://yeoman.io/) generator.

In this guide we will create [donejs-jshint](https://www.npmjs.com/package/donejs-jshint), a DoneJS generator that adds [JSHint](http://jshint.com/), a JavaScript code quality tool and an [.editorconfig](http://editorconfig.org/) file which helps text editors and IDEs to define and maintain a consistent coding style. Once published to NPM we will be able to run:

```
$ donejs add jshint
```

Currently it will only ask if we want to use spaces or tabs:


## Initializing a new generator

Generators can be initialized similar to a new application with `donejs init` and specifying the `type` as `generator`:

```
$ donejs init donejs-jshint --type generator
```

This will create a `donejs-jshint` folder with a basic generator, tests and everything else you need.

> __Note:__ If you want to make your plugin usable via `donejs add <generatorname>` the name has to be prefixed with `donejs-` so the full name will be `donejs-<generatorname>`.

We can run the basic generator and its tests already via

```
$ npm test
```

## Adding the configuration files

Now we can add the files that our generator should produce. All file templates will be put in the `default/templates/` folder.

### .jshintrc

First, we will add a `default/templates/.jshintrc` file which contains [options for JSHint](http://jshint.com/docs/options/):

```json
{
  "node": true,
  "esnext": true,
  "bitwise": true,
  "camelcase": true,
  "curly": true,
  "eqeqeq": true,
  "immed": true,
  "indent": 2,
  "latedef": "nofunc",
  "newcap": false,
  "noarg": true,
  "regexp": true,
  "undef": true,
  "unused": true,
  "strict": false,
  "trailing": true,
  "smarttabs": true,
  "white": false
}
```

### .editorconfig

Next we add `default/templates/.editorconfig` file like this:

```
; Unix-style newlines
[*]
end_of_line = LF
indent_style = <%= indent_style %>
trim_trailing_whitespace = true
```

All files support [EJS](http://www.embeddedjs.com/) placeholders. `<%= indent_style %>` will be used for the user choice whether to use whitespaces or tabs. Finally, we can also remove `defaults/templates/file.js` since we won't be using it.


## Implementing the generator

For the most part, DoneJS generators are simply [Yeoman](http://yeoman.io/) generators so everything documented there for [writing your own Yeoman generator](http://yeoman.io/authoring/) also applies here. For the user choice of tabs vs. spaces also refer to the chapter about [interacting with the user](http://yeoman.io/authoring/user-interactions.html).

### Adding the generator functionality

Our generator needs ask if we want to use spaces or tabs and then copy the `.jshintrc` and `.editorconfig` files over to the destination. We also want to add an `npm run jshint` script to the `package.json` and also make sure that JSHint is run during `npm test`. The complete generator at `default/index.js` looks like this:


```js
var generator = require('yeoman-generator');
var _ = require('lodash');

module.exports = generator.Base.extend({
  initializing: function () {
    // Read the original package.json
    this.pkg = this.fs.readJSON(
      this.destinationPath('package.json'), {}
    );
    
    // Maintain a list of all files we want to copy over
    this.files = [
      '.editorconfig',
      '.jshintrc'
    ];
  },
  
  prompting: function () {
    var done = this.async();

    // Create a prompt setting the `indent_style` property
    // to `tab` or `space`
    this.prompt([{
      type: 'list',
      name: 'indent_style',
      message: 'What indentation style do you want to use?',
      default: 'tab',
      choices: [
        {
          name: 'Tabs',
          value: 'tab'
        },
        {
          name: 'Spaces',
          value: 'space'
        }
      ]
    }], function (answers) {
      this.props = answers;
      done();
    }.bind(this));
  },
  
  writing: function () {
    var pkg = this.pkg;
    
    // Update `package.json` with the `jshint` command
    // and update the `test` script
    pkg.scripts = _.extend(pkg.scripts, {
      test: 'npm run jshint && ' + 
        _.get(pkg, 'scripts.test', 'echo "No tests specified"'),
      jshint: 'jshint ' + 
        _.get(pkg, 'system.directories.lib', 'src') + 
        '/. --config'
    });
    
    // Write to `package.json`. This will prompt you to overwrite
    this.fs.writeJSON('package.json', pkg);
    // Install jshint as a development dependency
    this.npmInstall([ 'jshint' ], { saveDev: true});
    
    // Got through every file and copy it to the destination
    this.files.forEach(function(file) {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    }.bind(this));
  }
});
```

That's it. Now we have a fully functional generator and can give it a try in a DoneJS application.

### Manual testing

When running `donejs add <generatorname>` DoneJS will

- Check if `donejs-<generatorname>` is installed locally
- If not install it from NPM
- Then run the generator at `default/index.js`

If we want to test our generator without publishing it to first NPM we can link it instead. In the generator folder run:

```
$ npm link
```

Then go into your test DoneJS application directory:

```
$ cd ../place-my-order
$ npm link donejs-jshint
```

Now we can run

```
$ donejs add jshint
```

### Writing a unit test

Yeoman also comes with some tools for [testing generators](http://yeoman.io/authoring/testing.html). The test we initially ran with `npm test` makes sure that `default/templates/file.js` gets written Since we deleted that file we have to update our test to test that it wrote the files we want with the content we expect:

```js
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('donejs-jshint', function() {
  before(function(done) {
    // Run the generator in a temprorary directory
    helpers.run(path.join(__dirname, '../default'))
      .inTmpDir()
      // Mock the user input by setting `indent_style` to `tab`
      .withPrompts({
        'indent_style': 'tab'
      }).on('end', done);
  });

  // Verify that `.jshintrc` got written and has some content
  it('created .jshintrc', function() {
    assert.file(['.jshintrc']);
    assert.fileContent('.jshintrc', /"latedef": "nofunc"/);
  });
  
  // Verify that `.editorconfig` got written with `indent_style` set to our selection
  it('created .editorconfig with indent_style setting', function() {
    assert.file(['.editorconfig']);
    assert.fileContent('.editorconfig', /indent_style = tab/);
  });
  
  // Make sure that `package.json` got update with the `jshint` npm script
  it('update package.json', function() {
    assert.jsonFileContent('package.json', {
      scripts: {
        jshint: 'jshint src/. --config'
      }
    });
  });
});
```

Now we will see all tests passing when running:

```
$ npm test
```

## Publishing to npm

[npm](http://npmjs.org) is the best way to share modules and make them easily installable without having to manage dependencies manually. To be able to publish your own modules, [create a new account](https://www.npmjs.com/signup) and then run

```
$ npm login
```

[Semantic versioning](http://semver.org/) is a great way to communicate new features and breaking changes. The generated plugin already comes with the release scripts to publish new versions according to the `major.minor.patch` schema. In our case to publish an initial version `0.1.0` we can run

```
$ donejs release:minor
```

Now version `0.1.0` of the generator is available and everybody can use it through

```
donejs add jshint
```

