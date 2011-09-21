## Introduction

This article provides a walkthrough and insight into a simple video player application. Utilizing Popcorn.js and built on JMVC 3.2, we'll cover installing and running the application locally, as well as touching some architecture and code design points.  

Download/Install
Architecture
Running the app

## Download/Install

The app is hosted by GitHub at: [https://github.com/jupiterjs/playermx/tree/master/player.](https://github.com/jupiterjs/playermx/tree/master/player) You can [download the application directly from GitHub](https://github.com/jupiterjs/playermx/archives/master) or run the following git commands.

From a directory of your choice:

_Clone files to your local drive_  
`$ git clone https://github.com/jupiterjs/playermx.git`  

_Navigate to application directory and initialize submodules_  
`$ cd playermx  
$ git submodule init  
$ git submodule update  `

## Architecture

Once you've downloaded the application, you'll notice 3 folders within your playermx directory. The 'jquery' folder refers to jquerymx. This is the JMVC core and what we'll be building our application on. The 'steal' folder is our dependency management system. This is how we include other resources such as scripts, stylesheets, templates or other JMVC resources and apps altogether. The 'player' folder is where we'll place our focus as this is the main directory for our application.  

The application is broken up into one main application page, 'player.html', with a corresponding script, 'player.js' and two corresponding widgets. We'll touch player.js first.  

### player.js

Player.js is our main application script. We'll load any widgets we want to use and initialize them from this file. Steal allows each resource to have resources of its own, allowing for a clean separation of the code base.

    steal('./play.js',
      './position.js',

      function() {
        var video = Popcorn("#trailer");

        $('#play').play({ video: video });
        $('#position').player_position({ video: video });
    });

The first line of player.js is our call to steal. This is going to load all our dependencies for this, asynchronously. In this case, we load play.js and position.js, then execute a function.  

_Tip: ./play.js is a relative path._  

It sometimes is necessary to load resources synchronously, such as when one resource depends on another. To specify and enforce the load order, steal exposes the 'then' method. If we wanted to load play.js and position.js in this fashion, the syntax would change to:  

`steal('./play.js').then('./position.js', function() {});`  

Our app is loading and playing a video clip, so we're going to utilize Popcorn.js to give us some control over our presentation. Play and Position are widgets we have created to isolate functionality within this app. We'll touch these widgets individually in just a moment. JMVC is deeply integrated with jQuery and as such, we can instantiate our widgets with syntax similar to what you would expect in most jQuery plugins. We'll pass the video object returned from Popcorn.js to each widget respectively.  

### play.js

    steal('player/popcorn',
      'jquery/controller',

      function() {

It's time to utilize a bit of what JMVC is capable of. We'll make use of [$.Controller](http://javascriptmvc.com/docs.html#&who=jQuery.Controller), which will allow us to create our widget at the target element outlined above.

The purpose of this widget is to control the video playback. Lets setup some event listeners to handle the playing and pausing of our video. We'll call our controller 'Play' which will allow this to be accessed via $('selector').play({}). Our init method will check the initial state of our video and set the text accordingly.

        $.Controller('Play', {
          init : function(){
            if( this.options.video.video.paused ) {
              this.element.text("play")
            } else {
              this.element.text("stop")
            }
          },

JMVC has a powerful event system which we can take advantage of. Within player.js, we've passed a video object to our controller. We can now listen to events directly on the passed object using JMVC's string interpolation syntax. In the below code, "{video}" refers to our model and "play" is the event we'll listen for.

          "{video} play" : function() {
            this.element.text("stop").addClass('stop')
          },

          "{video} pause" : function() {
            this.element.text("play").removeClass('stop')
          },

We can also listen to general events within our widget. In this case, we'll listen to any clicks within 'Play' and in turn toggle the play/pause events respectively. The separation of the click handler and the play/pause handlers is for extensibility. We may have multiple widgets that control the playback of our video and each widget should be able to respond accordingly.

          click : function() {
            if( this.options.video.video.paused ) {
              this.options.video.play()
            } else {
              this.options.video.pause()
            }
          }
      });
    });

### position.js

    steal('player/popcorn',
      'jquery/controller',
      'jquery/dom/dimensions',
      'jquery/event/resize',
      'jquery/event/drag/limit',

Similar to the creation of our 'Play' widget, let's make a widget to show a progression bar for our video. We want this to not only display playback position, but be interactive in what the user might expect. We'll utilize a few more of JMVC's built in events to handle this.  

The init method is what we'll use to setup a few basic properties for our widget. 'this' in the following context, refers to our widget instance. We'll add a 'moving' property, which is our progress indicator. A simple div will suffice for this example and we'll set some basic css properties such as position and dimensions.

      function() {
        $.Controller('PlayerPosition', {
          init : function(){
            this.moving = $("<div>").css({
              position: 'absolute',
              left: "0px"
            })

            this.element.css("position","relative")
              .append(this.moving);

            this.moving.outerWidth( this.element.height() );
            this.moving.outerHeight( this.element.height() );

          },

We'll listen to the timeupdate event on our video model to recalculate our indicator position. We've separated the event listener from the resize method to allow for any other widgets that may be listening to timeupdate.

          "{video} timeupdate" : function(video){
            this.resize()
          },
          resize : function(){
            var video = this.options.video,
              percent = video.currentTime() / video.duration(),
              width = this.element.width() - this.moving.outerWidth();

            this.moving.css("left", percent*width+"px")
          },

_Note: 'draginit' and 'dragend' are just a couple of events provided by the JMVC framework. Other special events can be found [here](http://javascriptmvc.com/docs.html#&who=jQuery.event.special)._  

We won't listen globally for our drag events, but rather scope them to our indicator div element. We can now fire our pause/play events, trusting other widgets to respond as needed. In this app, these events will get picked up by our 'Play' widget to start/stop the playback.

          "div draginit" : function(el, ev, drag){
            this.options.video.pause()
            drag.limit(this.element)
          },
          "div dragend" : function(el, ev, drag){
            var video = this.options.video,
              width = this.element.width() - this.moving.outerWidth()
              percent = parseInt(this.moving.css("left"), 10) / width;

            video.currentTime(  percent * video.duration()  );
            video.play()
          }
        });
    });

## Running

As we are only dealing with local js/html resources, it is completely possible to run this application from the file system. I recommend [Safari](http://www.apple.com/safari) or [Firefox](http://www.mozilla.org/firefox) for file system testing as they allow the browser to make XHRs locally. Safari will do this by default, but for Firefox you need to do the following:  

Navigate to about:config  
Set security.fireuri.strict to false  

You should be able to open playermx/player.html in your browser and see the application run.  

_Note: Running from the file system has pros and cons in local development. Being able to run an application locally allows for convenience and provides an avenues for automated testing. For local debugging, however, sometimes it is easier with the help of a local server. Browsers do not track file system XHRs, so you may have a few silent errors when developing. I use and recommend [MAMP](http://www.mamp.info) if you are a Mac developer, but you can use any localhost setup you feel comfortable with._