# Contributing to DoneJS

Check out the [contribution guide on DoneJS.com](https://donejs.com/contributing.html) for information on:

- [Code of Conduct](https://donejs.com/contributing.html#code-of-conduct)
- [Getting Help](https://donejs.com/contributing.html#getting-help)
- [Project Organization](https://donejs.com/contributing.html#project-organization)
- [Reporting Bugs](https://donejs.com/contributing.html#reporting-bugs)
- [Suggesting Features](https://donejs.com/contributing.html#suggesting-features)
- [Finding Ways to Contribute](https://donejs.com/contributing.html#finding-ways-to-contribute)
	- [Finding open issues](https://donejs.com/contributing.html#finding-open-issues)
	- [Getting involved in the community](https://donejs.com/contributing.html#getting-involved-in-the-community)
	- [Spreading the word](https://donejs.com/contributing.html#spreading-the-word)
- [Developing Locally](https://donejs.com/contributing.html#developing-locally)
	- [Signing up for GitHub](https://donejs.com/contributing.html#signing-up-for-github)
	- [Forking & cloning the repository](https://donejs.com/contributing.html#forking-and-cloning-the-repository)
	- [Installing the dependencies](https://donejs.com/contributing.html#installing-the-dependencies)
	- [Running the tests](https://donejs.com/contributing.html#running-the-tests)
	- [Building the documentation](https://donejs.com/contributing.html#building-the-documentation)
	- [Viewing the site](https://donejs.com/contributing.html#viewing-the-site)
- [Changing the Code](https://donejs.com/contributing.html#changing-the-code)
	- [Creating a new branch](https://donejs.com/contributing.html#creating-a-new-branch)
	- [Style guide](https://donejs.com/contributing.html#style-guide)
	- [Updating the tests](https://donejs.com/contributing.html#updating-tests)
	- [Updating the documentation](https://donejs.com/contributing.html#updating-the-documentation)
	- [Submitting a pull request](https://donejs.com/contributing.html#submitting-a-pull-request)
- [Updating DoneJS.com](https://donejs.com/contributing.html#updating-donejscom)
- [Evangelism](https://donejs.com/contributing.html#evangelism)
	- [Writing a blog article](https://donejs.com/contributing.html#writing-a-blog-article)
	- [Speaking at a conference or meetup](https://donejs.com/contributing.html#speaking-at-a-conference-or-meetup)
	- [Organizing a DoneJS meetup](https://donejs.com/contributing.html#organizing-a-donejs-meetup)

## Usage with `donejs/cli`

If you wish to develop both this project (`donejs/donejs`) and the CLI part (`donejs/cli`) in tandem, you may do so using `npm link`.

First, clone `donejs/donejs`:

```shell
git clone https://github.com/donejs/donejs.git
```

Next, clone `donejs/cli`:

```shell
https://github.com/donejs/cli.git
```

Now, in the cloned `donejs`, install the npm dependencies, and link it into npm:

```shell
cd donejs && npm install && npm link
```

Do the same in the cloned `cli`:

```shell
cd cli && npm install && npm link
```

Finally, you may now generate a DoneJS app that will use your locally linked `cli` and `donejs` like so:

```shell
npm link donejs-cli && donejs add app
```

In this way you, you can test your changes to the `donejs` and `donesj-cli` packages simultaneously.
