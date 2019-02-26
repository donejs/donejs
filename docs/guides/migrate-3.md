@page migrate-3 Migrating to DoneJS 3
@parent Guides
@hide sidebar
@outline 2 ol
@description This guide walks you through the step-by-step process of upgrading a DoneJS 2 app to DoneJS 3.

@body

This guide explains how to upgrade DoneJS 2 app to DoneJS 3.

## Pre-migration preparation

Before upgrading to DoneJS 3, it’s a good idea to make sure all of your tests are passing, your project builds successfully, and you can deploy your app. This will give you more assurance as you upgrade individual parts of your project.

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

Once you are confident that you are ready to upgrade, create a new branch from which to work. Assuming you are using git run this command:

```js
git checkout -b upgrade-donejs
```

If you are using a different version control system, substitute above for the relevant commands. The idea is the same; create a new branch from which to make the DoneJS upgrade changes.

## Install donejs@3

Once you have completed the preprepation, upgrade to the latest version of the __donejs__ global package.

```shell
npm install --global donejs@3
```

Now any time you create new applications using `donejs add app`, it will scaffold out a DoneJS 3 project.

## Run donejs upgrade

Running `donejs upgrade` will upgrade all of your dependencies to their latest version and run any codemods that are available. Running the following command:

```shell
donejs upgrade
```

This will:

* Update your package.json with the latest versions of each DoneJS packages.
* Run `npm install`, to give you the latest versions.
* Run `can-migrate` to apply codemods for the changes that happened in CanJS 5.0.

Once this is complete you will see several changed files. It's a good idea to look at these files using your favorite diff tool to see if the changes look correct. can-migrate is conservative about the changes it makes but is not perfect.

If you would prefer *not* to run the CanJS codemods as part of the upgrade, you can skip this part by running the command as `donejs upgrade --no-canmigrate`.

## Go through the StealJS 2 Migration Guide

StealJS 2 only has a few, small, breaking changes, so it's easiest to upgrade it first. The [StealJS 2.0 migration guide](https://stealjs.com/docs/StealJS.topics.migrating-two.html) goes over the few things you might need to change in your code.

## Go through the CanJS 5 Migration Guide

Although `donejs upgrade` covers a lot of the important parts of the upgrade, especially getting the correct versions of each dependency, it cannot do everything for you.

The [CanJS 5.0 migration guide](https://canjs.com/doc/migrate-5.html) goes over the parts that you might need to change manually. Reviewing this guide will also help familiarize yourself with CanJS 5, so it's a good thing to read even if you are developing a new project.

## Getting help

We've taken care to make upgrading DoneJS apps as easy as possible. However, as always, we're available on [Slack](https://www.bitovi.com/community/slack) ([#donejs channel](https://bitovi-community.slack.com/messages/CFC80DU5B)) and [the forums](https://forums.bitovi.com/) to try and help!
