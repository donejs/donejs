@page migrate-1 Migrating to DoneJS 1
@parent DoneJS
@hide sidebar
@outline 2 ol
@description This guide walks you through the step-by-step process of upgrading a DoneJS 0.9 app to DoneJS 1.

@body

DoneJS 1.0 brings together the latest changes introduced in [CanJS 3.0](https://www.bitovi.com/blog/canjs-3-0-release) and [StealJS 1.0](https://www.bitovi.com/blog/stealjs-1.0-release). This guide explains how to upgrade your DoneJS 0.9 app (which uses CanJS 2.3 and StealJS 0.16) to 1.0.

## Preparation

Before trying to upgrade to DoneJS 1.0 it's a good idea to make sure all of your tests are passing. This will give you more assurance as you upgrade individual parts of the project. To make sure tests are passing, run:

```shell
donejs test
```

### Install donejs@1

Next, upgrade to the latest version of the **donejs** package on npm:

```shell
npm install --global donejs@1
```

Now any time you create new applications using `donejs add app`, it will scaffold out a DoneJS 1.0 project.

### Use done-serve in static mode

As you do the upgrade you'll want to disable SSR so that you can focus on changes to your code. Once all dependencies are up to date you can switch back and everything should work. To disable SSR open up your package.json and change your **develop** script. It will look something like:

```shell
done-serve --develop ...
```

Update it to remove the `--develop` flag and add the `--static` flag instead:

```shell
done-serve --static ...
```

> *Note*: removing the `--develop` flag will disable live-reload. As we upgrade our application it will be in a broken state most of the time, so live-reload will not work anyways. When we've completed the upgrade we can switch back on `--develop`.

## Front-end

### Upgrade to CanJS 3.0

See the [CanJS 3 migration guide](http://canjs.com/doc/migrate-3.html) for instructions on how to migrate CanJS. Once you've made all necessary changes it is likely that your tests will still not pass. *Don't worry*! Some of the DoneJS dependencies you have installed still expect to use CanJS 2.3, once we've upgraded all of those the tests should pass again.

### Upgrade other DoneJS libraries

The following packages should be updated to reflect the following semver ranges:

```json
"dependencies": {
  ...

  "can-connect": "^1.0.0",
  "can-zone": "^0.6.0",
  "done-autorender": "^1.0.0",
  "done-component": "^1.0.0",
},

"devDependencies": {
  ...

  "can-fixture": "^1.0.0"
}
```

Then run `npm install` to have these packages be upgraded.

Once you've upgraded CanJS and these ancillary packages your app should generally work. SSR is still disabled, but the front-end should be okay.

## Upgrade StealJS

Refer to the [StealJS 1.0](http://stealjs.com/docs/StealJS.topics.migrating-one.html) guide to upgrade StealJS. In addition make sure to have the latest versions of these packages:

```json
"dependencies": {
  ...

  "done-css": "^3.0.0",
  "steal-less": "^1.2.0",
  "steal-stache": "^3.0.5"
}
```

Then run `npm install` to have these packages be upgraded.

Your package.json's **steal** section (which used to be called **system**) should have this configuration:

```json
"steal": {
  ...

  "plugins": [
    "done-css",
    "done-component",
    "steal-less",
    "steal-stache"
  ]
}
```

This configures Steal to be able to load file types other than JavaScript.

## Utilities

The last thing is to upgrade *everything else* that you haven't already changed. This should include the following:

```json
"dependencies": {
  ...

  "done-serve": "^1.0.0",
  "generator-donejs": "^1.0.0"
},
"devDependencies": {
  ...

  "donejs-cli": "^1.0.0",
  "funcunit": "^3.2.0",
  "testee": "^0.3.0"
}
```

Then run `npm install` to have these packages be upgraded.

Once this is done you should be able to start up a server using `donejs start`. If that works then re-enable SSR and live-reload in your **develop** script (remove the `--static` flag we added earlier):

```
done-serve --develop ...
```

If everything seems to work and your tests pass when running `donejs test`, congratulations! Your project is now on DoneJS 1.0. If you run into problems, please refer to the [dependency list here](https://github.com/donejs/cli/blob/v1.0.1/package.json#L59) and make sure that your version numbers match.

As always, we're available [on the forums](http://forums.donejs.com/) to try and help!
