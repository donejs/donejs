@page playermx PlayerMX
@parent examples 1

This article walks through a simple video player application utilizing Popcorn.js. We'll cover:

 - Setting up the application
 - Templated events with [mvc.controller $.Controller]
 - How PlayerMX is built

## Setup

There's two options to install PlayerMX: getjs or using git.

### Download with getjs

After downloading and [installing installing JMVC], run the following command:

`./js steal/getjs player`

_Note: When running the getjs command, be sure to navigate to your [rootfolder JMVC root folder]._

### Github

From a directory of your choice:

_Clone files to your local drive_  
`$ git clone https://github.com/jupiterjs/playermx.git`  

_Navigate to application directory and initialize submodules_  
`$ cd playermx  
$ git submodule update  --init`

### Running

Open player/player.html in your browser and see the application run:

@image tutorials/images/playermx.png


_Note: Safari and Chrome currently support the mp4 codec, however Firefox requires the h.264 Flash player to process mp4's._

You can see our version running here: [http://javascriptmvc.com/player/player.html](http://javascriptmvc.com/player/player.html)

Repo: [https://github.com/jupiterjs/playermx](https://github.com/jupiterjs/playermx)

## PopcornJS Overview

Repo: [https://github.com/cadecairos/popcorn-js](https://github.com/cadecairos/popcorn-js)

> _Popcorn.js is an event framework for HTML5 media. Popcorn.js utilizes the native HTMLMediaElement properties, methods and events, normalizes them into an easy to learn API and provides a plugin system for community contributed interactions._  

> _[Source: http://popcornjs.org/documentation](http://popcornjs.org/documentation)_

Popcorn.js wraps up our mp4 file into a `video` object which we can pass to our widgets. Our widgets can then play and pause the video based on user interaction. The Popcorn.js API we'll be using is:

* Events:
	* play - triggered when video plays
	* pause - triggered when a video is paused
	* timeupdate - triggered continuously during video playback
* Properties:
	* paused - boolean, true if the video is paused
* Methods:
	* play() - begins playing video, triggers "play" event
	* pause() - pauses video, triggers "pause" event
	* currentTime() - gets the current playback position in milliseconds
	* duration() - gets length of the video in milliseconds

## Templated Events Overview

PlayerMX introduces the concept of binding events to JavaScript objects other than DOM elements. This application uses the event syntax: `{myObject} click`, where `myObject` is the object and `click` is the event we're listening to. This is what we call templated events.

Templated events create a simple way to bind events without concern for cleanup. For example, binding an event to a DOM element with $.bind(), will be removed when you call $.remove() on that element. However, if you want to listen to events on a model, templated events handle the unbinding for you. In essence, memory concerns are reduced with templated events.

Specifically with PlayerMX, our widgets listen to events produced by our Popcorn video element. If that element is removed from our page, by using templated events, we don't need to worry about cleaning up bound methods.

## PlayerMX Architecture

Once you've downloaded the application, you'll notice 3 folders within your `playermx` directory. A few notes on the directory structure of this application:

* The `jquery` folder refers to [jquerymx](https://github.com/jupiterjs/jquerymx). This is the JMVC core and what we'll be building our application on.
* The [steal](https://github.com/jupiterjs/steal) folder is our dependency management system. This is how we include other resources such as scripts, stylesheets, templates or other JMVC resources and apps altogether.
* The `player` folder is where we'll place our focus as this is the main directory for our application.  

The application is broken up into one main application page, `player.html`, with a corresponding script, `player.js` and two corresponding widgets.

@image tutorials/images/playermx_overview.png

### player.js

`Player.js` is our main application script. `Steal` loads the widgets we want, and then we initialize them. This loosely couples our widgets from our application. The variable `video` is our reference to the Popcorn.js wrapped object.  `play` and `player_position` accept this object as a parameter.

    steal('./play.js',
      './position.js',

      function() {
        var video = Popcorn("#trailer");

        $('#play').play({ video: video });
        $('#position').player_position({ video: video });
    });

The first line of `player.js` is our call to `steal`. This is going to load all our dependencies. In this case, we load `play.js` and `position.js`, then execute a function.  

### play.js

@image tutorials/images/playermx_play.png


    steal('player/popcorn',
      'jquery/controller',

      function() {

The purpose of this widget is to control the video playback. Listening to the `play` and `pause` events on the Popcorn.js object, we'll add a CSS class designating playback state.

Our widget will be created using `$.Controller`. By naming our controller "play", we have now have a `jQuery.fn.play()` method. `init` is the constructor method for our controller. Any passed parameters are accessible via `options` on the controller.

        $.Controller('Play', {
          init : function(){
            if( this.options.video.video.paused ) {
              this.element.text("play")
            } else {
              this.element.text("stop")
            }
          },

Within player.js, we've passed a video object to our controller. Using templated events, we can listen to the events directly on this object. Templated events allow listening to events on any object, not just DOM events. In the code below, "{video}" refers to our object and "play" is the event we'll listen for.

          "{video} play" : function() {
            this.element.text("stop").addClass('stop')
          },

          "{video} pause" : function() {
            this.element.text("play").removeClass('stop')
          },

We'll listen to clicks within the parent element and call the play/pause methods, depending on current state. The separation of the click handler and the play/pause handlers is for extensibility. We may have multiple widgets that control the playback of our video and each widget should be able to respond accordingly.

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

@image tutorials/images/playermx_position.png


    steal('player/popcorn',
      'jquery/controller',
      'jquery/dom/dimensions',
      'jquery/event/resize',
      'jquery/event/drag/limit',

The PlayerPosition widget shows a progression bar for our video. This should not only display playback position, but be draggable as well. `this` in the following context refers to our widget instance. Our progress indicator will be accessible via the `moving` property. A simple div will suffice for this example and we'll set some basic css properties such as position and dimensions.

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

The widget listens to the Popcorn.js `timeupdate` event on our video model to recalculate our indicator position. We've separated the event listener from the resize method to allow for any other widgets that may be listening to `timeupdate`.

          "{video} timeupdate" : function(video){
            this.resize()
          },
          resize : function(){
            var video = this.options.video,
              percent = video.currentTime() / video.duration(),
              width = this.element.width() - this.moving.outerWidth();

            this.moving.css("left", percent*width+"px")
          },

_Note: `draginit` and `dragend` are a couple of events provided by the JMVC framework. [jQuery.Drag jQuery.Drag]_  

The drag events are scoped to the indicator div element. We can now call the Popcorn.js `play` and `pause` methods, trusting other widgets to respond as needed. In this app, these events will get picked up by our 'Play' widget to start/stop the playback.

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

## Conclusion

The secret to building large applications is to never build large applications.

Applications can quickly become overwhelming, complex and difficult to maintain. The takeaway from the PlayerMX architecture is to create isolated, dumb widgets that can be tied together with events. This article is an example of how to loosely couple your widgets, use templated events and integrate with an API (Popcorn.js).