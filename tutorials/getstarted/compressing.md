@page compressing Compressing Cookbook
@parent getstarted 2

There is a large overhead associated with downloading many JavaScript files.
Server side compression makes it simple to concatenate and compress your code into one file.

## Compress Script

To compress your application, run the following command from a console:

    C:\workspace\Cookbook>js cookbook\scripts\build.js
       steal/steal.js
       ...
       ignore ../steal/dev/dev.js
       ...
    Package #0: 'cookbook/production.js'.

Verify that production.js was created by checking your `cookbook` folder.

## Switch to Production Mode

Switch to production mode by changing the script tag to include steal.production.js:

    <script type='text/javascript'
           src='../steal/steal.<span style="text-decoration:underline;"><b>production</b></span>.js?cookbook'>
    </script>

## Reload and verify

Reload your page. Only two JavaScript files will load: steal.production.js and production.js.
Not bad considering 28 files are loaded in development mode.

When you're ready, learn how to [documenting Document Cookbook]