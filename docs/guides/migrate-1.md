@page migrate-1 Migrating to DoneJS 1
@parent Guides
@hide sidebar
@outline 2 ol
@description This guide walks you through the step-by-step process of upgrading a DoneJS 0.9 app to DoneJS 1.

@body

DoneJS 1.0 brings together the latest changes introduced in [CanJS 3.0](https://www.bitovi.com/blog/canjs-3-0-release) and [StealJS 1.0](https://www.bitovi.com/blog/stealjs-1.0-release). This guide explains how to upgrade your DoneJS 0.9 app (which uses CanJS 2.3 and StealJS 0.16) to 1.0.

## Pre-migration preparation

Before upgrading to DoneJS 1.0, it’s a good idea to make sure all of your tests are passing, your project builds successfully, and you can deploy your app. This will give you more assurance as you upgrade individual parts of your project.

To make sure tests are passing, run:

```shell
donejs test
```

To confirm that your build is working correctly, run:

```shell
donejs build
NODE_ENV=production donejs start
```

This will create your production build and then start a local server in production mode. If you open [localhost:8080](http://localhost:8080/) in your browser, you should see the production bundles being loaded in the Network tab of your developer tools.

If you are using `donejs deploy` to deploy your site to a service like Firebase, make sure it’s working before proceeding.

Additionally, if you are using either `donejs build cordova` or `donejs build nw` to create desktop or mobile apps, make sure both of those are working correctly.

There are a few more pages you might use in your normal development workflow that will be helpful during the migration process:

- `development.html`: [http://localhost:8080/development.html]
- `production.html`: [http://localhost:8080/production.html]
- `src/test.html`: [http://localhost:8080/src/test.html]

We recommend taking a “bottom up” approach to upgrading your application by focusing on getting each of your components’ test and demo pages working first.

For example, if you have a `messages` component in `src/messages/`, the following pages should work correctly:

- demo page: [http://localhost:8080/src/messages/messages.html]
- test page: [http://localhost:8080/src/messages/test.html]

You should also follow the [CanJS 3 pre-migration preparation](https://canjs.com/doc/migrate-3.html#Pre_migrationpreparation) steps _before_ going through the rest of this guide. The pre-migration section of the [CanJS 3 migration guide](https://canjs.com/doc/migrate-3.html) includes changes you can make to your existing CanJS 2.3 app that will make migrating to CanJS 3 easier.

If you have any questions about any of the steps in this guide, please join us on [Gitter chat](https://gitter.im/donejs/donejs) and [the forums](https://forums.donejs.com/).

## Install donejs@1

First, upgrade to the latest version of the **donejs** package on npm:

```shell
npm install --global donejs@1
```

Now any time you create new applications using `donejs add app`, it will scaffold out a DoneJS 1.0 project.

## Use done-serve in static mode

As you do the upgrade, you’ll want to disable SSR so that you can focus on changes to your code. Once all dependencies are up to date you can switch back and everything should work.

To disable SSR, open up your `package.json` and change your **develop** script. It will look something like:

```shell
done-serve --develop ...
```

Update it to remove the `--develop` flag and add the `--static` flag instead:

```shell
done-serve --static ...
```

> *Note*: removing the `--develop` flag will disable live-reload. As we upgrade our application, it will be in a broken state most of the time, so live-reload will not work anyway. When we’ve completed the upgrade, we can switch `--develop` back on.

## Upgrade to CanJS 3

See the [CanJS 3 migration guide](https://canjs.com/doc/migrate-3.html) for instructions on how to migrate CanJS. If you followed the advice above, you will have already gone through the [pre-migration](https://canjs.com/doc/migrate-3.html#Pre_migrationpreparation) steps, so you will only need to follow the [minimal migration path](https://canjs.com/doc/migrate-3.html#Minimalmigrationpath) steps. We recommend that you also follow the [modernized migration path](https://canjs.com/doc/migrate-3.html#Modernizedmigrationpath) steps as well.

Now is a good time to install the latest versions of any other CanJS packages, including the following:

```shell
npm install can-connect@1 --save
npm install can-fixture@1 --save-dev
npm install can-zone@0.6 --save
```

This will update your `package.json` to look something like this:

```json
"dependencies": {
  ...

  "can-connect": "^1.0.0",
  "can-zone": "^0.6.0"
},

"devDependencies": {
  ...

  "can-fixture": "^1.0.0"
}
```

Once you’ve made these changes, the demo and test pages for your individual components should start to work but your entire test suite may not work quite yet. *Don’t worry*! Some of the DoneJS dependencies you have installed still expect to use CanJS 2.3; once we’ve upgraded all of those, we’ll start to get the other pages working again.

> *Note*: if you receive an error such as `Uncaught Error: You can't have two versions of can-event/batch/batch`, you maybe be able to fix the issue by deleting your `node_modules` folder and running `npm install` to re-install all of the packages.

## Upgrade other DoneJS libraries

Use npm to install the latest versions of the following packages:

```shell
npm install done-autorender@1 --save
npm install done-component@1 --save
```

This will update your `package.json` to look something like this:

```json
"dependencies": {
  ...

  "done-autorender": "^1.0.0",
  "done-component": "^1.0.0",
}
```

At this point, your [development.html](http://localhost:8080/development.html) and [src/test.html](http://localhost:8080/src/test.html) files should start working. Not all of your tests may pass, but you should be able to load the test page and see results.

## Upgrade other dependencies

You may be using other packages that are specifically made to work with CanJS 2.x, like `bit-tabs@0`.

At this point, you should look for those other dependencies in your `package.json` and upgrade them, like so:

```shell
npm install bit-tabs@1 --save
```

Once you’ve upgraded CanJS and these ancillary packages, your app should generally work. SSR is still disabled, but the front-end should be okay.

## Upgrade to StealJS 1

Refer to the [StealJS 1 guide](https://stealjs.com/docs/StealJS.topics.migrating-one.html) to upgrade StealJS.

Additionally, upgrade to the latest versions of these packages:

```shell
npm install done-css@3 --save
npm install steal-less@1 --save
npm install steal-qunit@1 --save-dev
npm install steal-stache@3 --save
```

This will update your `package.json` to look something like this:

```json
"dependencies": {
  ...

  "done-css": "^3.0.0",
  "steal-less": "^1.2.0",
  "steal-stache": "^3.0.5"
},

"devDependencies": {
  ...

  "steal-qunit": "^1.0.0"
}
```

Your package.json’s **steal** section (which used to be called **system**) should have this configuration:

```json
"steal": {
  ...

  "plugins": [
    "done-component",
    "done-css",
    "steal-less",
    "steal-stache"
  ]
}
```

This configures Steal to be able to load file types other than JavaScript.

## Upgrade other utilities

The last thing is to upgrade *everything else* that you haven’t already changed. This should include the following:

```shell
npm install done-serve@1 --save
npm install donejs-cli@1 --save-dev
npm install funcunit@3 --save-dev
npm install generator-donejs@1 --save
npm install testee@0.4 --save-dev
```

This will update your `package.json` to look something like this:

```json
"dependencies": {
  ...

  "done-serve": "^1.0.0",
  "generator-donejs": "^1.0.0"
},
"devDependencies": {
  ...

  "donejs-cli": "^1.0.0",
  "funcunit": "^3.3.0",
  "testee": "^0.4.0"
}
```

Once this is done, you should be able to start up a server using `donejs start`. If that works, then re-enable SSR and live-reload in your **develop** script (remove the `--static` flag we added earlier):

```shell
done-serve --develop ...
```

If everything seems to work and your tests pass when running `donejs test`, congratulations! Your project is now on DoneJS 1.0. 🎉

If you run into problems, please refer to the [dependency list here](https://github.com/donejs/cli/blob/v1.0.1/package.json#L59) and make sure that your version numbers match.

As always, we’re available on [Gitter chat](https://gitter.im/donejs/donejs) and [the forums](https://forums.donejs.com/) to try and help!
