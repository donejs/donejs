@page organizing Organizing Your App
@parent tutorials 7

@body

The secret to building large apps is to NEVER build
large apps.  Break up your applications into small 
pieces.  Then assemble those testable, bite-sized pieces 
into your big application.

JavaScriptMVC 3.X is built with this pattern in 
mind. As opposed to a single flat 'scripts' folder, 
JavaScriptMVC breaks up your app into
manageable, isolated modules. This tutorial discusses
the reasons for doing this and patterns for doing it.

## Why

Traditionally JavaScript, CSS and static resources were seen as second-class
citizens when compared to server code.  JavaScript was put in a single
flat 'scripts' folder that looked like:

    button.js
    jquery.ui.calendar.js
    contactmanager.js
    tabs.js
    jquery.js
    nav.js
    resizer.js
    \test
      button_test.js
      contactmanager.js
      tabs_test.js
      nav_test.js

This was OK for a limited amount of JavaScript; however; client code
increasingly represents a larger percentage of an 
app's codebase.  What works for 10 files does not work for 100.

Complicating matters, an individual JavaScript file might have dependencies on
non-JavaScript resources.  A menu might need
a specific stylesheet, images, or [can.view client side template].  

Spreading these dependencies across images, styles, and template folders
makes it more difficult to know what depends on what. Over the lifetime
of an an application, it makes it more likely you'll be loading 
resources that are not needed.

### The Fix

JavaScriptMVC gives each resource you author it's own folder.  Typically,
the folder will hold the resource, its demo page, test page,
test script, and any other files specific to that resource.

For example, a tabs folder might look like:

    \tabs
      tabs.js        - the code for a tabs widget 
      tabs.html      - a demo page
      funcunit.html  - a test page
      tabs_test.js   - test code
      tabs.css       - css for the tab

The idea is that we can work on <code>tabs.js</code> in complete isolation.

## How 

Before we discuss best practices for organizing your application, a little
throat clearing ...

> Every app is different. Providing a single folder structure for
all applications is impossible. However, there are several useful 
patterns that when understood can keep your
application under control. JavaScriptMVC is extremely flexible so use your best judgement!

This guide walks you through starting with a small-ish example app and where you would add
features over time.  Before the example, it's good to know some JavaScript terminology:


### App and Library Folders

In general, a JavaScriptMVC application is divided into two root folders: an app folder and
library folder. The app folder code typically 'steals' and configures 'library' code.  

#### Application Folder 

The application (or app) folder houses code specific to a particular 
application.  The code in this folder is very unlikely to be
used in other places.  The folder name reflects the name of the application 
being built.  

Create an application folder structure with:

    js jmvc\generate\app cms


#### Library Folders 

A library folder is for general code that 
can be reused across several applications.  It is the perfect place for 
reusable controls like a tabs widget.  Typically folder names reflect
the name of the organization building the controls.  

### Module Types

An application is comprised of various modules.  JavaScriptMVC's code generators can 
be used to create .

__Model__ - A model represents a set of services. Typically, models exist within 
an application folder's `models` directory and are used to request 
data.

Generate a model like:

    js jmvc\generate\model cms\models\image

__Control__ - A [can.Control] can be a traditional view (a tabs widget) or
a traditional controller (coordinates model and view). Reusable controls are 
added to library folders.  Controls specific
to an application should be put in a folder within an application folder.

Generate a controller like:

    js jmvc\generate\control bitovi\tabs


__Plugin__ - A plugin is a low-level reusable module such as a special event or dom extension.
It does not typically have a visible component.  These should be added to library folders.

    js jmvc\generate\plugin bitovi\range


## Example Application

The example is a content management system that organizes 'videos', 'images', and 
'articles' under a tabbed layout.  For each content type, the user needs
to be able to edit a selected item of that type.

@image tutorials/cms.png



If the application's name is __cms__ and it is built by __Bitovi__, a basic version's
folder structure might look like:


    \cms
      \models    - models for the CMS
      \views     - views to configure the grid
      cms.js
    \bitovi
      \tabs      - a basic tabs widget
      \edit      - binds a form to edit a model instance
      \grid      - a configurable grid
        \views


This basic version assumes that we can configure the grid and edit widget
enough to produces the desired functionality. In this case,
<code>cms/cms.js</code> might look like:

    // load dependencies
    steal('bitovi/tabs',
          'bitovi/grid',
          'bitovi/create',
          './models/image.js',
          './models/video.js',
          './models/article.js',
          function(
          	Tabs, Grid, Create, 
          	Image, Video, Article
          ){
      
      // add tabs to the page
      var tabs = new Tabs('#tabs');
      
      // Configure the video grid
      var videos = new Grid($videos, {
        model: Cms.Models.Video,
        view: "//cms/views/videos.ejs"
      }),
      	videoEdit = new Edit('#videoEdit')
      
      // listen for when a video is selected
      videos.element.on('selected','li', 
        function(ev, video){
          // update the edit form with the selected 
          // video's attributes
          videoEdit.update(video);
        }
      );
  
      // Do the same for images and articles
      var images = new Bitovi.Grid('#images', {
        model: Cms.Models.Image,
        view: "//cms/views/images.ejs"
      }),
      	imageEdit = new Edit('#imageEdit');

      images.element.on('selected','li', 
        function(ev, image){
          imageEdit.update(video);
        }
      );
      
      var articles = new Grid('#articles', {
        model: Article,
        view: "//cms/views/article.ejs"
      }),
      	articleEdit = new Edit('#articleEdit');
      
      articles.element.on('selected','li', 
        function(ev, article){
          articleEdit.update(video);
        }
      );

    })

Notice that the <code>cms.js</code> configures the grid and edit widgets with
the cms folder's models and views.  This represents an ideal separation between
app specific code and reusable widgets.  However, it's extremely rare that 
widgets are able to provide all the functionality an app needs to meet its
requirements.

### More complexity

Eventually, you won't be able to configure abstract widgets to satisfy
the requirements of your application.  For example, you might need to 
add specific functionality around listing and editing videos (such as a thumbnail editor).

This is application specific functionality and belongs 
in the application folder.  We'll encapsulate it in a controller [can.Control] for each type:

    \cms
      \articles - the articles tab
      \images   - the images tab
      \videos   - the videos tab
      \models  
      \views     
      cms.js
    \bitovi
      \thumbnail
      \tabs     
      \edit      
      \grid      
        \views

<code>cms/cms.js</code> now looks like:

    steal('cms/articles',
          'cms/images',
          'cms/videos',
          'bitovi/tabs',
          function(
            Articles, Images, Videos, Tabs
          ){
      
      new Tabs('#tabs');
      
      // add the video grid
      new Videos('#videos');
      
      // Do the same for images and articles
      new Images('#images');
      new Articles('#articles');

    })

<code>cms/articles/articles.js</code> might look like:

    steal('can', 
          'bitovi/grid',
          'bitovi/edit',
          './init.ejs',
          './article.ejs',
          'bitovi/models/article.js',
          function(can, 
                   Grid, Edit, 
                   initEJS, articleEJS, 
                   Article){
      
      return can.Control({
      
        init : function(){
          // draw the html for the tab
          this.element.html(initEJS({}));

          // configure the grid
          new Grid(this.find('.grid'), {
            model: Article,
            view: articleEJS
          })
          
          this.editor = new Edit(".edit")
        },

        // when the grid triggers a select event
        "li select" : function(el, ev, article){
          this.editor.update(article)
        }
      });
      
    });

### Adding leaves to the tree

In the previous example, we moved most of the code in <code>cms/cms.js</code> into
an articles, images, and videos plugin.  Each of these plugins should
work independently from each other, have it's own tests and demo page.

Communication between these high-level
controls should be configured in <code>cms/cms.js</code>.

Essentially, as your needs become more specific, you are encouraged to 
nest plugins within each other.

In this example, after separating out each type into it's own plugin, you might
want to split the type into edit and grid controls.  The resulting 
folder structure would look like:

    \cms
      \articles
        \grid
        \edit
      \images
        \grid
        \edit   
      \videos
        \grid
        \edit   
      \models  
      \views     
      cms.js
    \bitovi
      \thumbnail
      \tabs     
      \edit      
      \grid      


`cms/articles/articles.js` would look the same, except it would
change __Grid__ and __Edit__ to point to `cms/articles/grid` and
`cms/articles/edit`:


    steal('can', 
          'cms/articles/grid',
          'cms/articles/edit',
          './init.ejs',
          './article.ejs',
          'bitovi/models/article.js',
          function(can, 
                   Grid, Edit, 
                   initEJS, articleEJS, 
                   Article){
       ...
    })

JavaScriptMVC encourages you to organize your application folder as a tree.
The leaves of the tree are micro-controls that perform a specific task (such as
allowing the editing of videos).  

Higher-order controls (`cms/articles/articles.js`) combine leaves and other nodes 
into more complex functionality.  The root of the application is the application file 
(`cms/cms.js`).  It combines and configures all high-level widgets.

Communication between modules is done with the observer 
pattern ([can.compute] or [can.Observe]) or with events.

With events, low-level controls use `$.fn.trigger` to send messages 'up' to higher-order
controls.  Higher-order controls typically call methods on lower-level controls

The Articles control listening to a 'select' event produced by
Grid and creating (or updating) the Edit control
is a great example of this.

The situation where this breaks down is usually when a 'state' needs to be shared and communicated
across several controls.  [can.compute] and  [can.Observe] are useful 
for this situation.

## Conclusion

This is an extremely abstract article, but hopefully illustrates a few
important trends of JavaScriptMVC organization:

  - Put code specific to an app in the application folder.
  - Put reusable plugins, widgets, and other code into library folders.
  - Fill out the tree.
