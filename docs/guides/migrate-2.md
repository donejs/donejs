@page migrate-2 Migrating to DoneJS 2
@parent Guides
@hide sidebar
@outline 2 ol
@description This guide walks you through the step-by-step process of upgrading a DoneJS 1 app to DoneJS 2.

@body

This guide explains how to upgrade DoneJS 1.0 app to DoneJS 2.

## Pre-migration preparation

Before upgrading to DoneJS 2, it’s a good idea to make sure all of your tests are passing, your project builds successfully, and you can deploy your app. This will give you more assurance as you upgrade individual parts of your project.

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

## Install donejs@2

Once you have completed the prepreation, upgrade to the latest version of the __donejs__ global package.

```shell
npm install --global donejs@2
```

Now any time you create new applications using `donejs add app`, it will scaffold out a DoneJS 2 project.

## Run donejs upgrade

> *Important*: Before running this step make sure your git directory is clean. It's best to create a new branch to do the upgrade, so that you can ensure everything is working before accepting it into master.

DoneJS 2 include a new command `donejs upgrade` which will upgrade all of your dependencies to their latest version and run any codemods that are available. Running the following command:

```shell
donejs upgrade
```

This will:

* Update your package.json with the latest versions of each DoneJS packages.
* Run `npm install`, to give you the latest versions.
* Run `can-migrate` to apply codemods for the changes that happened in CanJS 4.0.

Once this is complete you will see several changed files. It's a good idea to look at these files using your favorite diff tool to see if the changes look correct. can-migrate is conservative about the changes it makes but is not perfect.

If you would prefer *not* to run the CanJS codemods as part of the upgrade, you can skip this part by running the command as `donejs upgrade --no-canmigrate`.

## Go through the CanJS 4 Migration Guide

Although `donejs upgrade` covers a lot of the important parts of the upgrade, especially getting the correct versions of each dependency, it cannot do everything for you.

The [CanJS 4.0 migration guide](https://canjs.com/doc/migrate-4.html) goes over the parts that you might need to change manually. Reviewing this guide will also help familiarize yourself with CanJS 4, so it's a good thing to read even if you are developing a new project.

## Reach out for help

We've taken care to make upgrading DoneJS apps as easy as possible. However, as always, we're available on [Gitter chat](https://gitter.im/donejs/donejs) and [the forums](https://forums.donejs.com/) to try and help!
