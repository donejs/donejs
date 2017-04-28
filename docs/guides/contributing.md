@page contributing Contributing
@parent DoneJS
@hide sidebar
@outline 2 ol

@body
Thank you for your interest in contributing to DoneJS! DoneJS is maintained by [the core team](./About.html#section=section_Team) but depends on contributors like you! Whether you’re interested in [fixing issues](#finding-open-issues), [answering questions](#getting-involved-in-the-community), or [spreading the word](#evangelism), we welcome you to our community!

Contributing to an open source project can be an intimidating experience. We’re committed to making it as pleasant and rewarding as possible. Please always feel free to [reach out to us on Gitter](https://gitter.im/donejs/donejs).

<a id="section=section_CodeofConduct"></a>
## Code of Conduct

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to make participation in our project and community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

[Please read our Code of Conduct in its entirety before participating in our community.](https://github.com/donejs/donejs/blob/master/CODE_OF_CONDUCT.md)

<a id="section=section_GettingHelp"></a>
## Getting Help

[Our forums](http://forums.donejs.com/) and [Gitter chat](https://gitter.im/donejs/donejs) are the best places to ask questions. The core team regularly checks both and there are other users who generously help others.

If you’re interested in contributing to DoneJS, the core team is happy to pair with you to fix a bug or write a new feature! Please either message us on Gitter or the forums, or leave a comment on the GitHub issue you’re interested in helping with. We will happily walk you through setting up your development environment, creating a test and/or writing documentation, and submitting a pull request.

<a id="section=section_ProjectOrganization"></a>
## Project Organization

At its core, DoneJS is a CLI tool that generates an application structure with a number of projects that are built to work together.

The following projects are a core part of DoneJS:

- [CanJS](https://canjs.com/)
- [DocumentJS](https://documentjs.com/)
- [FuncUnit](https://funcunit.com/)
- [jQuery++](http://jquerypp.com/)
- [StealJS](https://stealjs.com/)
- [Syn](https://github.com/bitovi/syn)
- [Testee](https://github.com/bitovi/testee)

Here are the DoneJS projects that glue things together and add additional functionality:

- [autorender](https://github.com/donejs/autorender)
- [cli](https://github.com/donejs/cli)
- [css](https://github.com/donejs/css)
- [deploy](https://github.com/donejs/deploy)
- [component](https://github.com/donejs/done-component)
- [done-serve](https://github.com/donejs/done-serve)
- [done-ssr](https://github.com/donejs/done-ssr)
- [done-ssr-middleware](https://github.com/donejs/done-ssr-middleware)
- [donejs](https://github.com/donejs/donejs)
- [donejs-connect-model](https://github.com/donejs/donejs-connect-model)
- [donejs-cordova](https://github.com/donejs/donejs-cordova)
- [donejs-documentjs](https://github.com/donejs/donejs-documentjs)
- [donejs-electron](https://github.com/donejs/donejs-electron)
- [donejs-feathers](https://github.com/donejs/donejs-feathers)
- [donejs-firebase](https://github.com/donejs/donejs-firebase)
- [donejs-jasmine](https://github.com/donejs/donejs-jasmine)
- [donejs-jshint](https://github.com/donejs/donejs-jshint)
- [donejs-mocha](https://github.com/donejs/donejs-mocha)
- [donejs-nw](https://github.com/donejs/donejs-nw)
- [donejs-react](https://github.com/donejs/donejs-react)
- [donejs-vagrant](https://github.com/donejs/donejs-vagrant)
- [generator-donejs](https://github.com/donejs/generator-donejs)
- [worker-autorender](https://github.com/donejs/worker-autorender)

<a id="section=section_ReportingBugs"></a>
## Reporting Bugs

DoneJS uses [GitHub Issues](https://github.com/donejs/donejs/issues) to track bugs. As noted [above](#project-organization), DoneJS is made up of many individual GitHub repositories. Ideally, bugs are created within the
repository whose code is causing the issue.  For example, if you’re having issues with the development server, you can create an issue at [donejs/done-serve/issues/new](https://github.com/donejs/done-serve/issues/new?labels=bug).

If you do not know which repository your issue belongs to, that’s okay!  Please
create your issue in
[the main DoneJS repo](https://github.com/donejs/donejs/issues/new?labels=bug).  The core team will
move the issue to the correct repository (if necessary).

When creating an issue, it’s helpful to include:

- How often you can reproduce it.
- A detailed description of the issue with specific details to help us understand the problem.
- A list of the steps to reproduce the issue.
- What actually happened versus what you expected to have happen.
- Details about your environment, including the version of DoneJS, Node.js, and npm you’re using.

Before filing a new issue, please search for previous tickets.  If there’s something similar, add to that, or
give it a 👍. If you can provide additional information that’s not already in the issue, please add a comment to it.

If you are unsure about any of this or have any other questions, please reach out to
us on the [DoneJS forums](http://forums.donejs.com/c/donejs) or talk to us on
the [Gitter donejs/donejs channel](https://gitter.im/donejs/donejs). We’re happy to discuss any bugs and help you file a bug report.

<a id="section=section_SuggestingFeatures"></a>
## Suggesting Features

DoneJS uses [GitHub Issues](https://github.com/donejs/donejs/issues) to track feature suggestions. As noted [above](#project-organization), DoneJS is made up of many individual GitHub repositories. Ideally, feature suggestions are created within the
repository whose code could be improved.  For example, if you have a suggestion related to the development server, you can create an issue at [donejs/done-serve/issues/new](https://github.com/donejs/done-serve/issues/new?labels=enhancement).

If you do not know which repository your issue belongs to, that’s okay!  Please
create your issue in
[the main DoneJS repo](https://github.com/donejs/donejs/issues/new?labels=enhancement).  The core team will
move the issue to the correct repository (if necessary).

When filing a feature suggestion, it’s very helpful to include:

- Examples of what using the feature will look like.
- Benefits and drawbacks of the feature.
- Why the feature is important.
- Any implementation details around the feature.

Before filing a new suggestion, please search for previous feature requests.  If there’s something similar, add to that, or
give it a 👍. If you have additional ideas that are not already in the issue, please add a comment to it.

If you are unsure about any of this or have any other questions, please reach out to
us on the [DoneJS forums](http://forums.donejs.com/c/donejs) or talk to us on
the [Gitter donejs/donejs channel](https://gitter.im/donejs/donejs). We’re happy to discuss any ideas and help you file a feature suggestion.

<a id="section=section_FindingWaystoContribute"></a>
## Finding Ways to Contribute

There are many ways to contribute to DoneJS, whether you’re a developer who wants to code, a designer who can help improve the design and usability of our projects, or someone who’s interested in helping other members of the community.

<a id="section=section_Findingopenissues"></a>
### Finding open issues

DoneJS uses [GitHub Issues](https://github.com/donejs/donejs/issues) to track improvements we want to make to the project, whether that’s bug fixes, new features, design improvements, etc.

We use a few labels to organize issues across all of the repositories:

- “help wanted” for any issues with which the core team would like help
- “easy” for issues the core team thinks are good for someone who’s new to contributing
- “documentation” for issues related to documenting the APIs
- “design” for issues that could use a designer’s expertise

Here are links to GitHub searches for those terms:

- DoneJS
	- [design](https://github.com/search?q=org%3Adonejs+label%3Adesign&state=open)
	- [documentation](https://github.com/search?q=org%3Adonejs+label%3Adocumentation&state=open)
	- [easy](https://github.com/search?q=org%3Adonejs+label%3Aeasy&state=open)
	- [help wanted](https://github.com/search?q=org%3Adonejs+label%3A%22help+wanted%22&state=open)
- CanJS
	- [design](https://github.com/search?q=org%3Acanjs+label%3Adesign&state=open)
	- [documentation](https://github.com/search?q=org%3Acanjs+label%3Adesign&state=open)
	- [easy](https://github.com/search?q=org%3Acanjs+label%3Aeasy&state=open)
	- [help wanted](https://github.com/search?q=org%3Acanjs+label%3A%22help+wanted%22&state=open)
- DocumentJS
	- [design](https://github.com/bitovi/documentjs/labels/design)
	- [documentation](https://github.com/bitovi/documentjs/labels/documentation)
	- [easy](https://github.com/bitovi/documentjs/labels/easy)
	- [help wanted](https://github.com/bitovi/documentjs/labels/help%20wanted)
- FuncUnit
	- [design](https://github.com/bitovi/funcunit/labels/design)
	- [documentation](https://github.com/bitovi/funcunit/labels/documentation)
	- [easy](https://github.com/bitovi/funcunit/labels/easy)
	- [help wanted](https://github.com/bitovi/funcunit/labels/help%20wanted)
- jQuery++
	- [design](https://github.com/bitovi/jquerypp/labels/design)
	- [documentation](https://github.com/bitovi/jquerypp/labels/documentation)
	- [easy](https://github.com/bitovi/jquerypp/labels/easy)
	- [help wanted](https://github.com/bitovi/jquerypp/labels/help%20wanted)
- StealJS
	- [design](https://github.com/search?q=org%3Astealjs+label%3Adesign&state=open)
	- [documentation](https://github.com/search?q=org%3Astealjs+label%3Adocumentation&state=open)
	- [easy](https://github.com/search?q=org%3Astealjs+label%3Aeasy&state=open)
	- [help wanted](https://github.com/search?q=org%3Astealjs+label%3A%22help+wanted%22&state=open)
- Syn
	- [design](https://github.com/bitovi/syn/labels/design)
	- [documentation](https://github.com/bitovi/syn/labels/documentation)
	- [easy](https://github.com/bitovi/syn/labels/easy)
	- [help wanted](https://github.com/bitovi/syn/labels/help%20wanted)
- Testee
	- [design](https://github.com/bitovi/testee/labels/design)
	- [documentation](https://github.com/bitovi/testee/labels/documentation)
	- [easy](https://github.com/bitovi/testee/labels/easy)
	- [help wanted](https://github.com/bitovi/testee/labels/help%20wanted)

Triaging issues that have no labels is also really helpful! Here are some searches you can use to find unlabeled issues:

- [DoneJS](https://github.com/search?q=org%3Adonejs+is%3Aissue+no%3Alabel&state=open)
- [CanJS](https://github.com/search?q=org%3Acanjs+is%3Aissue+no%3Alabel&state=open)
- [DocumentJS](https://github.com/bitovi/documentjs/issues?q=is%3Aopen+is%3Aissue+no%3Alabel)
- [FuncUnit](https://github.com/bitovi/funcunit/issues?q=is%3Aopen+is%3Aissue+no%3Alabel)
- [jQuery++](https://github.com/bitovi/jquerypp/issues?q=is%3Aopen+is%3Aissue+no%3Alabel)
- [StealJS](https://github.com/search?q=org%3Astealjs+is%3Aissue+no%3Alabel&state=open)
- [Syn](https://github.com/bitovi/syn/issues?q=is%3Aopen+is%3Aissue+no%3Alabel)
- [Testee](https://github.com/bitovi/testee/issues?q=is%3Aopen+is%3Aissue+no%3Alabel)

<a id="section=section_Gettinginvolvedinthecommunity"></a>
### Getting involved in the community

You can also get involved in our community by posting in our forums, chatting with us on Gitter, and answering questions on Stack Overflow.

- DoneJS
	- [Forums](http://forums.donejs.com/c/donejs)
	- [Gitter](https://gitter.im/donejs/donejs)
	- [Stack Overflow](http://stackoverflow.com/search?tab=newest&q=donejs+answers:0)
- CanJS
	- [Forums](http://forums.donejs.com/c/canjs)
	- [Gitter](https://gitter.im/canjs/canjs)
	- [Stack Overflow](http://stackoverflow.com/search?tab=newest&q=canjs+answers:0)
- DocumentJS
	- [Forums](http://forums.donejs.com/c/documentjs)
	- [Gitter](https://gitter.im/bitovi/documentjs)
	- [Stack Overflow](http://stackoverflow.com/search?tab=newest&q=documentjs+answers:0)
- FuncUnit
	- [Gitter](https://gitter.im/bitovi/funcunit)
	- [Stack Overflow](http://stackoverflow.com/search?tab=newest&q=funcunit+answers:0)
- jQuery++
	- [Stack Overflow](http://stackoverflow.com/search?tab=newest&q=jquerypp+answers:0)
- StealJS
	- [Forums](http://forums.donejs.com/c/stealjs)
	- [Gitter](https://gitter.im/stealjs/steal)
	- [Stack Overflow](http://stackoverflow.com/search?tab=newest&q=stealjs+answers:0)
- Syn
	- [Gitter](https://gitter.im/bitovi/syn)
- Testee
	- [Gitter](https://gitter.im/bitovi/testee)

<a id="section=section_Spreadingtheword"></a>
### Spreading the word

We also always need help spreading the word about the DoneJS projects. Check out the [evangelism section](#evangelism) on how you can [write a blog post](#writing-a-blog-article), [speak at a conference](#speaking-at-a-conference-or-meetup), or [organize a meetup](#organizing-a-donejs-meetup).

<a id="section=section_DevelopingLocally"></a>
## Developing Locally

This section will walk you through setting up the [main DoneJS repository](https://github.com/donejs/donejs) on your computer. Remember that DoneJS is [split into multiple repositories](#project-organization), but you can apply the same general steps to set up any of the other repos.

<a id="section=section_SigningupforGitHub"></a>
### Signing up for GitHub

If you don’t already have a GitHub account, you’ll need to [create a new one](https://help.github.com/articles/signing-up-for-a-new-github-account/).

<a id="section=section_Forking_cloningtherepository"></a>
### Forking and cloning the repository

A “fork” is a copy of a repository in your personal GitHub account. “Cloning” is the process of getting the repository’s source code on your computer.

GitHub has a guide for [forking a repo](https://help.github.com/articles/fork-a-repo/). To fork DoneJS, you can start by going to its [fork page](https://github.com/donejs/donejs/fork).

Next, you’ll want to clone the repo. [GitHub’s cloning guide](https://help.github.com/articles/cloning-a-repository/) explains how to do this on Linux, Mac, or Windows.

GitHub’s guide will [instruct you](https://help.github.com/articles/fork-a-repo/#step-2-create-a-local-clone-of-your-fork) to clone it with a command like:

```shell
git clone https://github.com/YOUR-USERNAME/donejs
```

Make sure you replace `YOUR-USERNAME` with your GitHub username.

<a id="section=section_Installingthedependencies"></a>
### Installing the dependencies

After you’ve [forked & cloned the repository](#forking-and-cloning-the-repository), you’ll need to install the project’s dependencies.

First, make sure you’ve [installed Node.js and npm](https://docs.npmjs.com/getting-started/installing-node).

If you just cloned the repo from the command line, you’ll want to switch to the folder with your clone:

```shell
cd donejs
```

Next, install the project’s dependencies with npm:

```shell
npm install
```

<a id="section=section_Runningthetests"></a>
### Running the tests

Firefox is used to run the repository’s tests. If you don’t already have it, [download Firefox](https://www.mozilla.org/en-US/firefox/new/). Mozilla has guides for installing it on [Linux](https://support.mozilla.org/t5/Install-and-Update/Install-Firefox-on-Linux/ta-p/2516), [Mac](https://support.mozilla.org/t5/Install-and-Update/How-to-download-and-install-Firefox-on-Mac/ta-p/3453), and [Windows](https://support.mozilla.org/t5/Install-and-Update/How-to-download-and-install-Firefox-on-Windows/ta-p/2210).

After Firefox is installed, you can run:

```shell
npm test
```

If every test passed, congratulations! You have everything you need to change the code and have the core team review it.

<a id="section=section_Buildingthedocumentation"></a>
### Building the documentation

The [main DoneJS repo](https://github.com/donejs/donejs) contains [DoneJS.com](https://donejs.com/).

To build the site, run:

```shell
npm run document
```

[`npm run`](https://docs.npmjs.com/cli/run-script) will look for the `document` script in the repository’s [`package.json`](https://github.com/donejs/donejs/blob/master/package.json) and run it.

<a id="section=section_Viewingthesite"></a>
### Viewing the site

After you [build the docs](#building-the-documentation), your `donejs` repository will contain a `site` folder with the website.

To view the site, we recommend you install [http-server](https://www.npmjs.com/package/http-server).

```shell
npm install http-server -g
```

After it’s installed, you can start a server for the `site` directory:

```shell
http-server site
```

`http-server` will tell you where you can go in your browser to see the site. It will be something like [http://127.0.0.1:8080].

<a id="section=section_ChangingtheCode"></a>
## Changing the Code

Now that your computer is set up to [develop DoneJS locally](#developing-locally), you can make changes in your local repository.

The DoneJS projects generally follow the [GitHub flow](https://help.github.com/articles/github-flow/). This section will briefly explain how you can make changes on your computer and submit a pull request to have those changes merged into the main project.

<a id="section=section_Creatinganewbranch"></a>
### Creating a new branch

Starting in the DoneJS repository you have cloned to your computer, you can create a new branch:

```shell
git checkout -b your-branch-name
```

Replace `your-branch-name` with the name of your feature branch. You can name the feature branch whatever you’d like. We recommend starting the name with the issue number and a few words related to the issue. For example, for [#295 “Make a contribution guide”](https://github.com/donejs/donejs/issues/295), `295-contribution-guide` is an appropriate branch name.

<a id="section=section_Styleguide"></a>
### Style guide

Where possible, our code generally follows [jQuery’s coding conventions](https://contribute.jquery.org/style-guide/js/).

<a id="section=section_Updatingtests"></a>
### Updating tests

The [`test` directory](https://github.com/donejs/donejs/tree/master/test) contains files related to testing the code in the repository. When fixing bugs or writing new features, you should update the existing tests or create new tests to cover your changes.

After updating the tests, make sure you [run the tests](#running-the-tests).

<a id="section=section_Updatingthedocumentation"></a>
### Updating the documentation

The [`docs`](https://github.com/donejs/donejs/tree/master/docs) and [`guides`](https://github.com/donejs/donejs/tree/master/guides) directories contain the files used to generate [DoneJS.com](https://donejs.com/).

After making changes, make sure you [build the documentation](#building-the-documentation).

<a id="section=section_Submittingapullrequest"></a>
### Submitting a pull request

Once you’ve made your changes and [run the tests](#running-the-tests), you can push your branch to GitHub:

```shell
git push origin your-branch-name
```

Make sure you replace `your-branch-name` with the name of your branch.

Next, go to the DoneJS repository’s [compare changes](https://github.com/donejs/donejs/compare) page and click on “compare across forks.” You’ll need to change the “head fork” to your repository and select your branch name.

After you’ve selected your forked repository and branch, you can click on “Create pull request”. Give your PR a meaningful title and provide details about the change in the description, including a link to the issue(s) your PR addresses. If applicable, please include a screenshot or gif to demonstrate your change. This makes it easier for reviewers to verify that it works for them. [LICEcap](http://www.cockos.com/licecap/) is a great tool for making gifs.

Once you’ve filled out your pull request’s details, click on “Create pull request”. The core team will receive a notification about your pull request and will provide feedback.

GitHub has additional documentation on [creating a pull request from a fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) that you might find useful.

<a id="section=section_UpdatingDoneJS_com"></a>
## Updating DoneJS.com

[DoneJS.com](https://donejs.com/) is hosted on [GitHub pages](https://pages.github.com/) from the [`gh-pages`](https://github.com/donejs/donejs/tree/gh-pages) branch.

First, from within your local DoneJS repository, create a new clone in the `site` folder:

```shell
git clone git@github.com:donejs/donejs.git -b gh-pages site/
```

If you get an error saying `Permission denied (publickey)` then you should follow GitHub’s instructions on
[generating an SSH key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).

Install the dependencies, build the site, and push a new commit to the `gh-pages` branch with:

```shell
make
```

That’s it! [DoneJS.com](https://donejs.com/) should now have your changes.

<a id="section=section_Evangelism"></a>
## Evangelism

Hopefully you love DoneJS as much as we do and you want to share your
knowledge about it. Fantastic! We want to help you.

There are lots of ways to spread the word about DoneJS, including:

 - Writing a blog article
 - Speaking at a conference or meetup
 - Organizing a DoneJS meetup

No matter what you’re interested in, please [email Chasen Le Hara](mailto:chasen@bitovi.com) so he can help promote you and what you’re doing.

<a id="section=section_Writingablogarticle"></a>
### Writing a blog article

If you’re writing something about DoneJS and would like the core team to review it,
we’re happy to help.  Once it’s published, let us know so we can promote it.

<a id="section=section_Speakingataconferenceormeetup"></a>
### Speaking at a conference or meetup

The [presentations list](./presentations.html) contains a variety of talks related to the DoneJS projects.

<a id="section=section_OrganizingaDoneJSmeetup"></a>
### Organizing a DoneJS meetup

There are several local DoneJS groups:

 - [Boston](https://www.meetup.com/DoneJS-Boston/)
 - [Chicago](https://www.meetup.com/DoneJS-Chicago/)
 - [Ft. Lauderdale](https://www.meetup.com/DoneJS-Fort-Lauderdale/)
 - [Los Angeles](https://www.meetup.com/DoneJS-LA/)
 - [New York](https://www.meetup.com/DoneJS-NYC/)
 - [Phoenix](https://www.meetup.com/DoneJS-Phoenix/)
 - [Raleigh-Durham](https://www.meetup.com/DoneJS-raleigh-durham/)
 - [San Francisco](https://www.meetup.com/DoneJS-San-Francisco/)
 - [Seattle](https://www.meetup.com/DoneJS-Seattle/)
 - [Silicon Valley](https://www.meetup.com/DoneJS-Silicon-Valley/)

We’re always looking for people to speak at one of these groups, become an organizer,
or start their own group. If you are interested in any of these things,
please let us know!
