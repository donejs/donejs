@page generator Creating a generator
@parent DoneJS
@hide sidebar
@outline 2 ol
@description DoneJS applications can be extended with additional functionality with installable generators. In this guide will create a generator that adds JSHint and an `.editorconfig` file to a DoneJS application.

@body

If you have used `donejs add nw` or `donejs add cordova` to create a [desktop- or mobile version](https://donejs.com/Features.html#section=section_iOS_Android_andDesktopBuilds) of your application you already used a DoneJS generator. Generators are [npm](https://www.npmjs.com/) modules that provide a [Yeoman](http://yeoman.io/) generator that adds functionality to your application.

In this guide we will create [donejs-jshint](https://www.npmjs.com/package/donejs-jshint), a DoneJS generator that adds [JSHint](http://jshint.com/), a JavaScript code quality tool and an [.editorconfig](http://editorconfig.org/) file which helps text editors and IDEs to define and maintain a consistent coding style. It will also update the `npm test` script to run JSHint with our tests. You can find the code in the [donejs-jshint](https://github.com/donejs/donejs-jshint) repository. We can run the generator with:


    $ donejs add jshint


Currently it will only ask if we want to use spaces or tabs and to overwrite the `package.json` to add the npm scripts for JSHint:

<img src="http://blog.bitovi.com/wp-content/uploads/2016/03/Screen-Shot-2016-03-09-at-2.47.43-PM.png" alt="DoneJS generator" style="width: 100%;" class="alignnone size-full wp-image-3023" />

> __Note:__ Since `donejs-jshint` already exists we will use `donejs-<username>-jshint` with `<username>` being your GitHub username for the remainder of this article. Once published it can then be used as `donejs add <username>-jshint`.


## Setting up

### Creating the project on GitHub

We will use [GitHub](https://github.com) to host the code for the project which makes it easy for others to contribute and to automatically run the tests in [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) which we will enable later.

If you don't have an account yet, go to [GitHub](https://github.com/join) to sign up and follow [the help](https://help.github.com/articles/set-up-git/) on how to set it up for the command-line `git`. Once completed, you can create a new repository from your dashboard.

Calling the repository `donejs-<username>-jshint` and initializing it empty (without any of the default files) looks like this:

<a href="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-repository.png"><img src="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-repository.png" alt="generator-repository" style="width: 100%;" class="alignnone size-full wp-image-3052" /></a>

After creating the repository, we can clone it into a new folder:


    $ git clone git@github.com:<username>/donejs-<username>-jshint.git
    $ cd donejs-<username>-jshint


### Initializing the project

To initialize a new generator you will need DoneJS version 0.9.0+ installed globally. To check your DoneJS version run


    $ donejs --version


To install DoneJS or to get the latest version run:


    $ npm install donejs -g    


In the `donejs-<username>-jshint` folder we can now initialize a new generator, very similar to a new DoneJS application, like this:


    $ donejs add generator


The generator will ask several question that should be answered as follows:

*   For the project name you can just confirm the default by pressing enter
*   For the GitHub username or organization enter the GitHub username where the repository has been created
*   All other fields can also be answered with the default or the information you would like to use

Once all done, the final prompt looks similar to this:

<a href="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-init.png"><img src="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-init.png" alt="generator-init" style="width: 100%;" class="alignnone size-full wp-image-3050" /></a>

Now the generator will initialize the default layout and install all its dependencies.

### Setting up Travis CI

When the installation has completed, we can make sure everything got set up properly by running:


    $ npm test


This will run some basic generator tests and output the result on the console.

This command can also be used to automatically run the tests on a [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) server. There are many open source CI servers, the most popular being [Jenkins](https://jenkins-ci.org/), and many hosted solutions like [Travis CI](https://travis-ci.org/).

We will use Travis CI as our hosted solution because it is free for open source projects. It works with your GitHub account which it will use to sign up. Once signed in, go to `Accounts` (in the dropdown under you name) to enable the `donejs-<username>-jshint` repository:

<a href="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-travis.png"><img src="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-travis.png" alt="generator-travis" style="width: 100%;" class="alignnone size-full wp-image-3054" /></a>

You may have to click the *"Sync account"* button for the repository to show up. Now, every time we push to GitHub the tests will run automatically. We can do so with our initial commit:


    $ git add . --all
    $ git commit -am "Initial commit"
    $ git push origin master


If you now go `https://travis-ci.org/<your-username>/donejs-<username>-jshint/builds` you will see the build running and eventually turn green (which will update the badge that got added in the `readme.md` file).


## Adding the configuration files

Now we can add the files that our generator should produce. All file templates will be put in the `default/templates/` folder.

### .jshintrc

First, we will add a `default/templates/.jshintrc` file which contains [options for JSHint](http://jshint.com/docs/options/):


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


### .editorconfig

Next we add a `default/templates/.editorconfig` file like this:


    ; Unix-style newlines
    [*]
    end_of_line = LF
    indent_style = <%= indent_style %>
    trim_trailing_whitespace = true


All files support [EJS](http://www.embeddedjs.com/) placeholders. Here, `<%= indent_style %>` will be used for the user choice of using whitespaces or tabs. Finally, we can also remove `defaults/templates/file.js` since we won't be using it.


## Implementing the generator

For the most part, DoneJS generators are simply [Yeoman](http://yeoman.io/) generators so everything documented for [writing your own Yeoman generator](http://yeoman.io/authoring/) also applies here. For the user choice of tabs vs. spaces also refer to the chapter about [interacting with the user](http://yeoman.io/authoring/user-interactions.html).

### Adding the generator functionality

Our generator needs to ask if we want to use spaces or tabs and then copy the `.jshintrc` and `.editorconfig` files over to the destination. We also want to add an `npm run jshint` script to the `package.json` and make sure that JSHint runs during `npm test`. The complete generator at `default/index.js` looks like this:



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
            _.get(pkg, 'scripts.test',
              'echo "No tests specified"'),
          jshint: 'jshint ' + 
            _.get(pkg, 'system.directories.lib',
              'src') + 
            '/. --config'
        });
        
        // Write to `package.json`
        // This will prompt you to overwrite
        this.fs.writeJSON('package.json', pkg);
        // Install jshint as a development dependency
        this.npmInstall([ 'jshint' ], { saveDev: true});
        
        // Got through every file and copy it
        this.files.forEach(function(file) {
          this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(file),
            this.props
          );
        }.bind(this));
      }
    });


That's it. Now we have a fully functional generator and can give it a try in a DoneJS application.

### Manual testing

When running `donejs add <generatorname>` DoneJS will

- Check if `donejs-<generatorname>` is installed locally
- If not install it from NPM
- Then run the generator at `default/index.js`

If we want to test our generator without publishing it to npm first we can link it instead. In the generator folder run:


    $ npm link


Then go into your test DoneJS application directory:


    $ cd ../place-my-order
    $ npm link donejs-<username>-jshint


Now we can run


    $ donejs add jshint


### Writing a unit test

Yeoman also comes with some tools for [testing generators](http://yeoman.io/authoring/testing.html). The test we initially ran with `npm test` makes sure that `default/templates/file.js` gets written. Since we deleted that file we have to update the test at `test/index.js` to verify that it wrote the files we want with the content we expect:


    var path = require('path');
    var helpers = require('yeoman-test');
    var assert = require('yeoman-assert');

    describe('donejs-<username>-jshint', function() {
      before(function(done) {
        // Run the generator in a temprorary directory
        helpers.run(path.join(__dirname, '../default'))
          .inTmpDir()
          // Mock the user input by setting
          // `indent_style` to `tab`
          .withPrompts({
            'indent_style': 'tab'
          }).on('end', done);
      });

      // Verify that `.jshintrc` got written
      // and has some content
      it('created .jshintrc', function() {
        assert.file(['.jshintrc']);
        assert.fileContent('.jshintrc',
          /"latedef": "nofunc"/);
      });
      
      // Verify that `.editorconfig` got written
      // with `indent_style` set to our selection
      it('.editorconfig with indent_style', function() {
        assert.file(['.editorconfig']);
        assert.fileContent('.editorconfig',
          /indent_style = tab/);
      });
      
      // Make sure that `package.json` got updated
      // with the `jshint` npm script
      it('update package.json', function() {
        assert.jsonFileContent('package.json', {
          scripts: {
            jshint: 'jshint src/. --config'
          }
        });
      });
    });


Now we can see all tests passing when running:


    $ npm test



## Publishing the plugin

### Making a pull request

Although we are working on the generator by ourselves for now, [GitHub pull requests](https://help.github.com/articles/using-pull-requests/) are a great way to keep track of our progress and to make sure that all tests are passing. In the plugin folder we can run:


    $ git checkout -b generator-functionality
    $ git add . --all
    $ git commit -m "Implementing JSHint and editorconfig generator"
    $ git push origin generator-functionality


And then create a new pull request by going to `https://github.com/<username>/donejs-<username>-jshint` which will now show an option like this:

<a href="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-pr.png"><img src="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-pr.png" alt="generator-pr" style="width: 100%;" class="alignnone size-full wp-image-3055" /></a>

Once you created the pull request, you will see a `Some checks haven’t completed yet` message that will eventually turn green:

<a href="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-pull-request.png"><img src="http://blog.bitovi.com/wp-content/uploads/2016/04/generator-pull-request.png" alt="generator-pull-request" style="width: 100%;" class="alignnone size-full wp-image-3056" /></a>

Now you can click the "Merge pull request" button. Then in the console, checkout the *master* branch and pull down the latest changes with:


    $ git checkout master
    $ git pull origin master



### Publishing to npm

For others to be able to use your generator via `donejs add <generatorname>` have to pulish it to [npm](http://npmjs.org). [Create a new account](https://www.npmjs.com/signup) and then log in via


    $ npm login


[Semantic versioning](http://semver.org/) is a great way to communicate new features and breaking changes. The generated plugin already comes with the release scripts to publish new versions according to the `major.minor.patch` schema. In our case to publish an initial version `0.1.0` we can run


    $ donejs release:minor


Now version `0.1.0` of the generator is available and everybody can use it through


    donejs add <username>-jshint


## Show it off

Once you published your generator, let the world know about it. [Tweet @donejs](https://twitter.com/donejs) and post it in the [DoneJS forums](http://forums.donejs.com/) and the [DoneJS chat](https://gitter.im/donejs/donejs). Those are also great places to get quick help with any questions.
