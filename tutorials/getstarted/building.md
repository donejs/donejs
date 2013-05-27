@page building.cookbook Building Cookbook
@parent getstarted 2

There is a large overhead associated with 
downloading many JavaScript and CSS files. [stealjs StealJS]
can build your app into a single minified JS and CSS file
for faster download.

<div class='whisper'>
	It can also break your app into cache-able minified parts
	for more advanced performance techniques.
</div>

## Build Script

To build your application, run the following command from a console:

     > ./js cookbook/scripts/build.js
       Building to cookbook/
       ...
       Building cookbook/production.js
                cookbook/production.css

Verify that production.js was created by checking your `cookbook` folder.

## Switch to Production Mode

Switch to production mode by changing the script tag to include steal.production.js:

    <script type='text/javascript'
           src='../steal/steal.production.js?cookbook'>
    </script>

## Reload and verify

Reload your page. Only two JavaScript files will load: steal.production.js and production.js.
Not bad considering 28 files are loaded in development mode.

When you're ready, learn how to [cookbook.documenting Document Cookbook]