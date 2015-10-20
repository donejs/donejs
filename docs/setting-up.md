@page SettingUp Setting Up DoneJS
@parent DoneJS
@hide sidebar
@outline 2 ol
@description This page contains information on setting up DoneJS. It will walk you through getting prerequisites needed before you ever install DoneJS and includes platform-specific pieces of information not covered in the Quick Start or In Depth guides.

@body

## Windows

### Prerequisites

This will help you get set up with DoneJS on Windows. To use DoneJS you need a C++ compiler (for native dependencies). First you need a recent version of [Node.js](https://nodejs.org/en/). DoneJS officially supports Node 0.10.x, 0.12.x, and IOjs, but more recent versions will likely work as well.

#### Package Management

In this guide we'll use [chocolatey](https://chocolatey.org/) to install packages needed. You don't have to use chocolatey if you don't want, and can instead search for the dependencies and install them with a Windows installer, but we'll use chocolately because it makes things a bit easier.

After you've installed chocolatey by following the instructions [on the homepage](https://chocolatey.org/) **open an administrative console** and proceed to the next step.

#### Python 2.x

Native dependencies in Node.js are installed with [node-gyp](https://github.com/nodejs/node-gyp) which uses Python as a build tool. It expects Python 2.x:

```shell
choco install python2 -y
```

#### Windows SDK

Next we need the Windows SDK. We're going to assume Windows 7, but adjust this command to the version of Windows you use:

```shell
choco install windows-sdk-7.1 -y
```

#### Visual Studio Express

Installing Visual Studio Express gives us the C++ compiler we need:

```shell
choco install visualstudioexpress2013windowsdesktop -y
```

### Environmental Variables

In order to switch to production mode you need to set the environmental variable `NODE_ENV`. Depending on which console you use this can be done in one of two ways:

**Command Prompt**

```
set NODE_ENV=production
```

**Powershell**

```
$env:NODE_ENV="production"
```

## Mac OS X

### Prerequisites

All that is needed to get DoneJS working on OS X is the Xcode command line tools which you can get by typing:

```shell
xcode-select --install
```

## Debian / Ubuntu

Installing in a Debian / Ubuntu environment takes a little extra work because the version of Node shipped is older than what is supported by DoneJS (and most other Node-based software).

### Prerequisites

Instead of installing Node.js from the repository we recommend using a PPA (a repostiroy maintained by a 3rd party). First get a copy of `curl` if you don't already have it:

```
sudo apt-get install curl
```

Then add the PPA to your source list:

```
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
```

Install Node.js:

```
sudo apt-get install nodejs
```

It's important to also install the `build-essential` package afterwards. This will provide you the C++ compiler needed to build the native dependencies:

```
sudo apt-get install build-essential
```
