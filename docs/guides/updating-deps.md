@page updating-deps Updating Dependencies
@parent Guides
@hide sidebar
@outline 2 ol
@description How to update dependencies in DoneJS applications.

@body

Avoiding duplicate versions of dependencies is a necessary evil in front-end applications. When using the `package-lock.json` file, dependencies versions are ___locked___ on each of your dependencies. If you update one dependency, but not another, it is possible for you to encounter version conflicts.

We recommend one of two solutions for this.

## Encountering conflicts

As part of your normal development flow you might update dependencies when you see there is a new version via `npm outdated`. We recommend always creating a new branch to do updates:

```shell
git checkout -b updates

npm update can
```

Which will update to the latest version of `can`. Then continue with your normal development:

```shell
donejs develop
```

If you encounter errors or bugs (often you will get a `you cannot have multiple versions of...` error). then you can fix these by doing:

```shell
rm -rf node_modules package-lock.json
npm install
```

Deleting the `package-lock.json` file forces a new version to be generated. This new version will have dependencies ordered correctly. Then retest and most likely the problem will be resolved.

If you encounter an error you cannot resolve then rollback the change by removing the branch:

```shell
git checkout master
git branch -D updates
```

A future release of `can` will likely fix this problem.

## Turning off package-lock

Another option is to remove the `package-lock.json` file. This prevents you from having __locked__ dependencies but also ensures that you always have the latest version of every package.

You can disable package-lock in your repo by adding a `.npmrc` file in your root project folder with the following:

```
package-lock=false
```

If you have an existing `package-lock.json` file you'll need to remove it (including from git) and then reinstall:

```shell
rm -rf node_modules package-lock.json
npm install
```
