@page plugin Creating a plugin
@parent DoneJS
@hide sidebar
@outline 2 ol
@description DoneJS doesn't just make it easy to build high performance, real-time web and mobile applications. It can also be used to create reusable plugins that can be shared across different applications. In this guide we will create a reusable number input widget using [Bootstrap](http://getbootstrap.com) styles.

@body

We will create the project on [GitHub](https://github.com), initialize the repository as a new DoneJS plugin and then set up continuous integration with Travis CI. After running development mode we will implement the component functionality and tests and submit it as a pull request to the repository. Finally we will make a build and publish the plugin to [npm](http://npmjs.org) as well as look how to use the published module in other projects.

You can find the code in the [donejs-number-input](https://github.com/donejs/donejs-number-input) repository. The final result looks like this:

<a class="jsbin-embed" href="http://jsbin.com/cihawi/embed?output">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.35.9"></script>

## Setting up

### Creating the project on GitHub

We will use [GitHub][3] to host the code for the project which makes it easy for others to contribute and to automatically run the tests in [continuous integration][5] which we will enable later.

If you don't have an account yet, go to [GitHub][6] to sign up and follow [the help][7] on how to set it up for the command-line `git`. Once completed, you can create a new repository from your dashboard.

> **Important:** In the remainder of the article the plugin name will be `<username>-number-input`. You will have to replace `<username>` with your GitHub username to get a unique module name that can be published to npm.

Calling the repository `<username>-number-input` and initializing it empty (without any of the default files) looks like this:

[<img src="http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-1.53.10-PM.png" alt="Screen Shot 2016-02-16 at 1.53.10 PM" style="width: 100%;" class="alignnone size-full wp-image-2665" />][8]

After creating the repository, we can clone it into a new folder:

```
$ git clone git@github.com:<username>/<username>-number-input.git
$ cd <username>-number-input
```  

### Initializing the plugin

To initialize a new plugin you will need DoneJS version 0.7.0+ installed globally. To check your DoneJS version run

```
$ donejs --version
```

To install DoneJS or to get the latest version run:

```
$ npm install donejs -g    
```

In the `<username>-number-input` folder we can now initialize a new plugin like this:

```
$ donejs add plugin
```

The plugin generator will ask several question that should be answered as follows:

*   For the project name you can just confirm the default by pressing enter
*   For the GitHub username or organization enter the GitHub username where the repository has been created
*   All other fields can also be answered with the default

Once all done, the final prompt looks similar to this:

[<img src="http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-7.55.03-AM.png" alt="DoneJS adding a new plugin" style="width: 100%;" class="alignnone size-full wp-image-2666" />][9]

Now the generator will initialize the default plugin layout and install all its dependencies.

### Setting up Travis CI

When the installation has completed, we can make sure everything got set up properly by running:

```
$ npm test
```

This will open a Firefox browser, run two tests and output the result on the console.

This command can also be used to automatically run the tests on a [continuous integration][5] server. There are many open source CI servers, the most popular being [Jenkins][10], and many hosted solutions like [Travis CI][11].

We will use Travis CI as our hosted solution because it is free for open source projects. It works with your GitHub account which it will use to sign up. Once signed in, go to `Accounts` (in the dropdown under you name) to enable the `<username>-number-input` repository:

[<img src="http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-2.03.56-PM.png" alt="Enabling on Travis CI" style="width: 100%;" class="alignnone size-full wp-image-2669" />][12]

You may have to click the *"Sync account"* button for the repository to show up. Now, every time we push to GitHub the tests will run automatically. We can do so with our initial commit:

```
$ git add . --all
$ git commit -am "Initial commit"
$ git push origin master
```

If you now go `https://travis-ci.org/<your-username>/<username>-number-input/builds` you will see the build running and eventually turn green (which will update the badge that got added in the `readme.md` file).

## Implementing functionality

### Development mode

Like a DoneJS application, a DoneJS plugin provides a development mode that starts a server and enables live-reload by running:

```
$ donejs develop
```

The server will run at `http://localhost:8080`. You can view the main test page at [localhost:8080/src/test/test.html][13]. Any changes to the test file or module will re-run the tests right away thanks to hot-module-swapping.

### Creating the component

A plugin can contain anything from shared utility functions to model- or component collections. Just like in a DoneJS application it is possible to add components and models. In our case we want to create a new component which we can do like this:

```
$ donejs add component <username>-number-input
```

This creates a complete component using the `<username>-number-input` tag with tests and documentation. Because the module name is the same as the plugin name (`<username>-number-input`), the generator will put the component files directly in the `src/` folder (instead of a subfolder). Confirm the default tag name and and the prompts to overwrite the existing files by pressing enter. The initialized component can now be viewed at `http://localhost:8080/src/<username>-number-input.html`. The component tests are available at [localhost:8080/src/test.html][15].

### Creating and testing the view-model

Our number input view-model should provide the following functionality:

*   Update its value either through a number input field or +/- buttons
*   Have a maximum and minimum value (which will also disable the proper button)

We can use the [define plugin][16] to define a `min` and `max` value and [a setter][17] for the `value` to make sure that it always is within those constraints. We will also add an `increment` and `decrement` method that will modify the value by 1. The component view-model (in `src/<username>-number-input.js`) then looks like this:

```js
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './<username>-number-input.less!';
import template from './<username>-number-input.stache!';

export const ViewModel = Map.extend({
  define: {
    value: {
      value: 0,
      type: 'number',
      set(value) {
        if(value > this.attr('max')) {
          return this.attr('max');
        }

        if(value < this.attr('min')) {
          return this.attr('min');
        }

        return value;
      }
    },
    max: {
      value: Infinity,
      type: 'number'
    },
    min: {
      value: 0,
      type: 'number'
    }
  },

  increment() {
    this.attr('value', this.attr('value') + 1);
  },

  decrement() {
    this.attr('value', this.attr('value') - 1);
  }
});

export default Component.extend({
  tag: '<username>-number-input',
  viewModel: ViewModel,
  template
});
```

To test this functionality we can change the tests in `src/<username>-number-input_test.js` to look like this:

```html
import QUnit from 'steal-qunit';
import { ViewModel } from './<username>-number-input.js';

// ViewModel unit tests
QUnit.module('<username>-number-input/component');

QUnit.test('Initializes the ViewModel', function(){
  var vm = new ViewModel();
  
  QUnit.equal(vm.attr('value'), 0,
    'Default value is 0');
  QUnit.equal(vm.attr('max'), Infinity,
    'Max value is infinity');
  QUnit.equal(vm.attr('min'), 0,
    'Max value is number max value');
});

QUnit.test('.increment', function(){
  var vm = new ViewModel();

  vm.increment();
  QUnit.equal(vm.attr('value'), 1, 'Value incremented');
});

QUnit.test('.decrement', function(){
  var vm = new ViewModel();

  vm.increment();
  vm.increment();
  vm.decrement();
  QUnit.equal(vm.attr('value'), 1, 'Value updated');
});
```

You can run all tests either by going to [localhost:8080/src/test/test.html](http://localhost:8080/src/test/test.html) in the browser or via

```
$ npm test
```

### Adding the template

In the template we will use [Bootstrap][2] which we first have to install as a dependency of the plugin:

```
$ npm install bootstrap --save
```

Then we can update `src/<username>-number-input.stache` to look like this:

```html
<can-import from="bootstrap/less/bootstrap.less!" />
<form class="form-inline">
  <div class="form-group">
    <div class="input-group">
      <div class="input-group-btn">
        <button class="btn btn-primary" type="button"
          {{#eq value min}}disabled{{/eq}}
          ($click)="decrement">
            -
          </button>
      </div>
      <input type="number" class="form-control"
        {($value)}="value">
      <div class="input-group-btn">
        <button class="btn btn-primary" type="button"
          {{#eq value max}}disabled{{/eq}}
          ($click)="increment">
            +
        </button>
      </div>
    </div>
  </div>
</form>
```

This template first imports the Bootstrap LESS. Then we create a button group with a `-` button on the left, a number input in the middle and a `+` button on the right. When the buttons are clicked the `increment` or `decrement` view-model methods are being called. The value of the input field is two-way bound with the `value` property of the view-model. When the value is either `min` or `max`, the `-` or `+` buttons will be disabled.

## Publishing the plugin

### Making a pull request

Although we are working on the plugin by ourselves for now, [GitHub pull requests][18] are a great way to keep track of our progress and to make sure that all tests are passing. In the plugin folder we can run:

```
$ git checkout -b number-input-component
$ git add . --all
$ git commit -m "Implementing number-input component functionality, template and tests"
$ git push origin number-input-component
```

And then create a new pull request by going to `https://github.com/<your-username>/<username>-number-input` which will now show an option like this:

[<img src="http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-8.17.50-AM.png" alt="Screen Shot 2016-02-16 at 8.17.50 AM" class="alignnone size-full wp-image-2658" />][19]

Once you created the pull request, you will see a `Some checks haven’t completed yet` message that will eventually turn green:

[<img src="http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-8.30.41-AM.png" alt="Screen Shot 2016-02-16 at 8.30.41 AM" style="width: 100%;" class="alignnone size-full wp-image-2662" />][20]

Now you can click the "Merge pull request" button. Then in the console, checkout the *master* branch and pull down the latest changes with:

```
$ git checkout master
$ git pull origin master
```

### Making a build

Now that we implemented the number input functionality and have all tests passing we can make a build of our plugin that is usable standalone in the Browser, with an AMD module loader like [RequireJS](http://requirejs.org/) or as a CommonJS module which works e.g. with [Browserify](http://browserify.org/).

```
$ donejs build
```

Will create a `dist/` folder with the `global`, `amd` and `commonjs` version of our plugin.

### Publishing to npm

[npm][4] is the best way to share modules and make them easily installable without having to manage dependencies manually. To be able to publish your own modules, [create a new account][21] and then run

```
$ npm login
```

[Semantic versioning][22] is a great way to communicate new features and breaking changes. The generated plugin already comes with the release scripts to publish new versions according to the `major.minor.patch` schema. In our case to publish an initial version `0.1.0` we can run

```
$ donejs release:minor
```

Now version `0.1.0` of our plugin is available on npm.

### Usage in other projects

In another DoneJS application we can now install the plugin with

```
$ npm install donejs-number-input --save
```

> For your own published plugin you would use `<username>-number-import` of course.

Then import it in a template and load it with:

```html
<can-import from="<username>-number-input" />
<donejs-number-input></donejs-number-input>
```

## Show it off

Once you published your plugin, let the world know about it. [Tweet @donejs](https://twitter.com/donejs) and post it in the [DoneJS forums](http://forums.donejs.com/) and the [DoneJS chat](https://gitter.im/donejs/donejs). Those are also great places to get quick help with any questions.

 [1]: https://donejs.com/
 [2]: http://getbootstrap.com/
 [3]: https://github.com
 [4]: https://www.npmjs.com/
 [5]: https://en.wikipedia.org/wiki/Continuous_integration
 [6]: https://github.com/join?source=header-home
 [7]: https://help.github.com/articles/set-up-git/
 [8]: http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-1.53.10-PM.png
 [9]: http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-7.55.03-AM.png
 [10]: https://jenkins-ci.org/
 [11]: https://travis-ci.org/
 [12]: http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-2.03.56-PM.png
 [13]: http://localhost:8080/src/test/test.html
 [14]: http://localhost:8080/src/donejs-number-input.html
 [15]: http://localhost:8080/src/test.html
 [16]: https://canjs.com/docs/can.Map.prototype.define.html
 [17]: https://canjs.com/docs/can.Map.prototype.define.set.html
 [18]: https://help.github.com/articles/using-pull-requests/
 [19]: http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-8.17.50-AM.png
 [20]: http://blog.bitovi.com/wp-content/uploads/2016/02/Screen-Shot-2016-02-16-at-8.30.41-AM.png
 [21]: https://www.npmjs.com/signup
 [22]: http://semver.org/
