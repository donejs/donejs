/*
@page developwithgit Developing With Git

Thank you so much for developing with git.  You're making 
the world better for yourself and others.  With GIT we can see any change
you make to JavaScriptMVC and share them with other people.

Before we get started, we're assuming you:

 - know git
 - have a github account setup
 - have a project that is already using git

If you don't, you might find the following resources helpful:

 - [http://git.or.cz/course/svn.html Git - SVN Crash Course]
 - [http://github.com/ Github] - create an account here
 - [http://help.github.com/msysgit-key-setup/ SSH Key Setup]

## Git -ing JavaScriptMVC

JavaScriptMVC is comprised of five sub projects:

 - [http://github.com/jupiterjs/steal]
 - [http://github.com/jupiterjs/jquerymx]
 - [http://github.com/jupiterjs/documentjs]
 - [http://github.com/jupiterjs/funcunit]
 - [http://github.com/jupiterjs/syn]

We're going to fork each of these projects and add them as submodules to your
master git project.

#### Forking

Assuming you have a github account set up, and are signed in,
click each of the github links and click 
the <img src='jmvc\images\fork.png' alt='fork'/> button (in the upper right of the page).

<div class='whisper'>PRO TIP: 
  If you're working for a company, you should create company forks and give 
  employees access to the company forks.  This will keep everyone using the 
  same version.
</div>

#### Adding a submodule

Now add the first four forked repositories as submodules 
to your project like:

@codestart text
git submodule add git@github.com:<b>_YOU_</b>/steal.git <b>public</b>/steal
git submodule add git@github.com:_YOU_/jquerymx.git public/<b>jquery</b>
git submodule add git@github.com:_YOU_/documentjs.git public/documentjs
git submodule add git@github.com:_YOU_/funcunit.git public/funcunit
@codeend

_Note_: Learn a little more about submodules [here](http://johnleach.co.uk/words/archives/2008/10/12/323/git-submodules-in-n-easy-steps Submodules). 

There are 3 important things to notice:

 1. Change <b>_YOU_</b> with your github username.

 2. Add the submodules in a <b>public</b> folder, where the server hosts static content.
 
 3. Copy the javascriptmvc repository into a <b>jquery</b> folder.

Next, you have to install and update the submodules.  Run:

@codestart
git submodule init
git submodule update
@codeend

You may also have to change to each directory and checkout the master branch:

@codestart
cd steal
git checkout master
@codeend

#### Installing Syn

Syn is a submodule of the funcunit project.  To add your fork to funcunit, 
first you have to change the submodule to point to your fork 
(because it points to the jupiterjs fork).  To do this, open funcunit/.gitmodules.  You'll see:

@codestart text
[submodule "syn"]
	path = syn
	url = git@github.com:jupiterjs/syn.git
	update = merge
@codeend

Change the URL to your own fork, like:

@codestart text
url = git@github.com:_YOU_/syn.git
@codeend

Now install syn, like the other submodules:

@codestart
cd funcunit
git submodule init
git submodule update
cd syn
git checkout master
@codeend

Finally, you just have to move the 'js' commands out of steal for convienence:

@codestart text
[WINDOWS] > steal\js steal\make.js

[Lin/Mac] > ./steal/js steal/make.js
@codeend

Yes, that was more annoying then just downloading it, but you're making the 
world a better place for yourself and for others.



 */
//break