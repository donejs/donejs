@page srchr Srchr
@parent examples 0

Srchr searches several data sources for content and 
displays it to the user.  See it in 
action [here](http://javascriptmvc.com/srchr/srchr.html). This article
covers how to install Srchr. To understand how Srchr works and many
of the core concepts behind JavaScriptMVC, please watch:

  - [Part 1 - MVC architecture and the observer pattern](http://www.youtube.com/watch?v=NZi5Ru4KVug)
  - [Part 2 - Development process](http://www.youtube.com/watch?v=yFxDY5SQQp4)


## Installing Srchr


Install the Srchr app by cloning the git repo:

    > git clone git://github.com/bitovi/srchr srchr
    > cd srchr
    > git submodule update --init --recursive
    
Once you get the application you should have a structure similar to below

    /srchr [top-level directory]
        /can
        /documentjs
        /steal
        /funcunit
        /srchr
            /history
            /models
            /scripts
            /search
            /search_result
            /tabs
            /templates
            /test
            test.html
            srchr.less
            srchr.js
            srchr.html
            ...
            
Srchr is now ready to be used. To run the Srchr application simply open _srchr/index.html_ in your browser. 

