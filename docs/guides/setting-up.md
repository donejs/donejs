@page SettingUp Setting Up DoneJS
@parent DoneJS
@hide sidebar
@outline 2 ol
@description This page contains information on setting up DoneJS. It will walk you through getting prerequisites needed before you ever 
install DoneJS and includes platform-specific pieces of information not covered in the Quick Start or In Depth guides.

DoneJS officially supports:

 - [Node](https://nodejs.org) 0.10.x, 0.12.x, and Node 4/5
 - [npm](https://www.npmjs.com/) 2.x, 3.x

@body

## Windows

### Prerequisites

This will help you get set up with DoneJS on Windows. To use DoneJS you need a C++ compiler (for native dependencies). First you need a recent version of [Node.js](https://nodejs.org/en/).

#### Package Management

In this guide we'll use [chocolatey](https://chocolatey.org/) to install packages needed. You don't have to use chocolatey if you don't want, and can instead search for the dependencies and install them with a Windows installer, but we'll use chocolately because it makes things a bit easier.

After you've installed chocolatey by following the instructions [on the homepage](https://chocolatey.org/) **open an administrative console** and proceed to the next step.

#### Python 2.x

Native dependencies in Node.js are installed with [node-gyp](https://github.com/nodejs/node-gyp) which uses Python as a build tool. It expects Python 2.x:

```shell
choco install python2 -y
```

#### Windows SDK

Next we need the Windows SDK. We're going to assume Windows 7, but adjust this command to the version of Windows you use (for Windows 10 it is windows-sdk-10.0):

```shell
choco install windows-sdk-7.1 -y
```

#### Visual Studio Express

Installing Visual Studio Express gives us the C++ compiler we need. If you are using Windows 10 or get an error with this command you can also download Visual Studio Express [here](https://www.visualstudio.com/en-us/products/visual-studio-express-vs.aspx):

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

To later remove these environment variables:

**Command Prompt**

```
set NODE_ENV=
```

**Powershell**

```
$env:NODE_ENV=""
```


### Android Development

In order to develop an Android application you need to install the [Android Studio](https://developer.android.com/sdk/index.html). The installer will prompt you to also install Java if you don't already have it.

#### Platform and Build Tools

Once you've installed Android Studio you still have a few things to do. You need to install the Android SDK Platform and Build tools. From the command-line run:

```
C:\Users\YOURNAME\AppData\Local\Android\sdk\tools\android.bat
```

This starts the Android SDK Manager. From this screen you can select:

* Android 6.0
* Android SDK Build-tools (23+)
* Intel x86 Emulator Accelerator (this will improve the emulator start time)

Click all of these and anything else you need and click Install packages.

#### Virtual Device Manager

From the command-line run:

```
C:\Users\YOURNAME\AppData\Local\Android\sdk\tools\android.bat avd
```

This starts the Android Virtual Device (AVD) Manager. This is used to manager virtual devices that will run in the emulator.

Click **Create** and make sure to fill out:

* AVD Name (this can be whatever you want)
* Device
* Target (the API level you installed)
* CPU (try an Intel CPU if possible)

Then click **OK** to create the device.

Close the AVD Manager and you should have everything you need for Android development.

## Mac OS X

### Prerequisites

To get DoneJS working on OS X you need Xcode command line tools which you can get by typing:

```shell
xcode-select --install
```

And to build iOS apps, after installing Node, install the `ios-sim` package with:

```
npm install -g ios-sim
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

### Android Development

In order to develop an Android application you need to install the [Android Studio](https://developer.android.com/sdk/index.html). Once download untar/gzip it:

```
tar xvf android-sdk.X-linux.tgz
```

This will create an `android-sdk-linux` folder. At this point you might want to move it somewhere else, `$HOME/lib/android-sdk-linux` is a good place.

Add the android-sdk-linux/tools folder to your `PATH` with: `export PATH="path/to/android-sdk-linux/tools`. Add this to your `~/.bashrc` or `~/.zshrc` config so it will persist.

Additionally the `ANDROID_HOME` environmental variable needs to be set. Set it with:

```
export ANDROID_HOME="/home/name/lib/android-sdk-linux"
```

This too should be added to your `~/.bashrc` or `~/.zshrc`.

#### Java

If you don't already have a Java JDK installed you can do so with:

```
sudo apt-get install default-jdk
```

#### Platform and Build Tools

Once you've installed Android Studio you still have a few things to do. You need to install the Android SDK Platform and Build tools. From the command-line run:

```
$ANDROID_HOME/tools/android
```

This starts the Android SDK Manager. From this screen you can select:

* Android 6.0
* Android SDK Build-tools (23+)
* Intel x86 Emulator Accelerator (this will improve the emulator start time)

Click all of these and anything else you need and click Install packages.

#### Virtual Device Manager

From the command-line run:

```
$ANDROID_HOME/tools/android avd
```

This starts the Android Virtual Device (AVD) Manager. This is used to manager virtual devices that will run in the emulator.

Click **Create** and make sure to fill out:

* AVD Name (this can be whatever you want)
* Device
* Target (the API level you installed)
* CPU (try an Intel CPU if possible)

Then click **OK** to create the device.

Close the AVD Manager and you should have everything you need for Android development.


## Vagrant & VritualBox 

### Prerequisites

First at all, download and install [**VirtualBox**](https://www.virtualbox.org/) and [**Vagrant**](https://www.vagrantup.com/). Once VirtualBox and Vagrant have been installed, you should add the DoneJS box to your Vagrant installation.

### Installing the DoneJS Vagrant Box
Open your command prompt and type
```
vagrant --version
```
to see if Vagrant is available in your terminal.

Within your terminal change to the folder you would like to install the Vagrant Box. Using the following command for adding the box:
```
vagrant box add Juke/DoneJS
```

Vagrant will ask you for which provider you will adding the box. Choose: **Virtualbox**
Vagrant will now downloading the latest version of the DoneJS development environment. It will take a few minutes, depending on your Internet connection speed.

Once Vagrant has successfully finished downloading all the file, you can now initialize the DoneJS Box by typing
```
vagrant init Juke/DoneJS
```

Vagrant is creating a **Vagrantfile** in your folder. Your custom configuration for the machine can be done in this file.
For more information check out https://www.vagrantup.com/docs/vagrantfile/


### Configure your shared folders
Before you start the Vagrant Box, you have to specified which folder you would like to sync from your local machine to the virtual machine.
For that, open the **Vagrantfile** in that folder you initialized Vagrant. Scroll down to:
```
# Share an additional folder to the guest VM. The first argument is
# the path on the host to the actual folder. The second argument is
# the path on the guest to mount the folder. And the optional third
# argument is a set of non-required options.
# config.vm.synced_folder "../data", "/vagrant_data"
```
add a new Synced Folder configuration below that may look like this
```
config.vm.synced_folder "C:/www/donejs", "/home/vagrant/donejs"
```

Make sure that `C:/www/donejs` is a valid directory.

For more information check the documentation on https://www.vagrantup.com/docs/synced-folders/basic_usage.html

### Launching the Vagrant Box
Once you have done all the configuration run 
```
vagrant up
```
command from your DoneJS Vagrant Box directory

### Connecting via SSH
To connect to your DoneJS environment via SSH, enter the
```
vagrant ssh
```
command in your terminal.

### Further information
For further information what is pre-installed on the Vagrant Box and which ports are forwarding to your host please check out the Github repository [DoneJS Vagrant](https://github.com/donejs/donejs-vagrant)
