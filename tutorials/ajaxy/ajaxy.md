@page ajaxy Searchable Ajax Apps
@parent tutorials 6

This tutorial walks you through building a simple widget
that listens for changes in the browser location hash
and updates the content of the page.  It demonstrates how to make
a site Google crawlable and searchable.

## The App

We'll make a mini app that updates the contents of page with an
Ajax request when a user clicks on a navigation link. Then, we'll make this searchable
with the <code>ajaxy/scripts/crawl.js</code> script.

@demo tutorials/ajaxy/ajaxy.html 500

The crawl script generates html pages that Google can use as a representation
of the content of an Ajax application.  Read Google's documentation on its
[http://code.google.com/web/ajaxcrawling/docs/getting-started.html Ajax crawling API]
 before continuing this tutorial.

## Setup

[installing Download and install] the latest version of JavaScriptMVC.

After installing JavaScriptMVC, open a command line to 
the [steal.static.root steal.root] folder (where you unzipped 
JavaScriptMVC).  


We'll use the application generator to generate an application
skeleton folder.  Run:

    js jquery/generate/app ajaxy

## The Code

In the generated ajaxy folder, you'll find <code>ajaxy.html</code>
and <code>ajaxy.js</code>.  We'll add a content area
and few links to 
<code>ajaxy.html</code>.  When we click on  links,
we'll make <code>ajaxy.js</code> load content into
the content area.

Change <code>ajaxy.html</code> so it looks like:

@codestart xml
&lt;!DOCTYPE HTML>
&lt;html lang="en">
    &lt;head>
        &lt;title>Ajaxy&lt;/title>
        &lt;meta name="fragment" content="!">
    &lt;/head>
    &lt;body>
        &lt;a href='#!videos'>Videos&lt;/a>
        &lt;a href='#!articles'>Articles&lt;/a>
        &lt;a href='#!images'>Images&lt;/a>
        &lt;div id='content'>&lt;/div>
        &lt;script type='text/javascript' 
            src='../steal/steal.js?ajaxy,development'>	 
        &lt;/script>
    &lt;/body>
&lt;/html>
@codeend

Notice that the page includes a <code>&lt;meta name="fragment" content="!"&gt;</code>
tag.  This tells to Google to process <code>ajaxy.html</code> as having Ajax content.

Next, add some content to show when these links are clicked.  Put the following content
in each file:

__ajaxy/fixtures/articles.html__

@codestart xml
&lt;h1>Articles&lt;/h1>
&lt;p>Some articles.&lt;/p>
@codeend

__ajaxy/fixtures/images.html__

@codestart xml
&lt;h1>Images&lt;/h1>
&lt;p>Some images.&lt;/p>
@codeend

__ajaxy/fixtures/videos.html__

@codestart xml
&lt;h1>Videos&lt;/h1>
&lt;p>Some videos.&lt;/p>
@codeend

Finally, change <code>ajaxy.js</code> to look like:


    steal('jquery/controller',
          'jquery/event/hashchange', 
          'steal/html',function(){
          
    $.Controller('Ajaxy',{
        init : function(){
            this.updateContent()
        },
        "{window} hashchange" : function(){
            this.updateContent();
        },
        updateContent : function(){
            var hash = window.location.hash.substr(2),
                url = "fixtures/"+(hash || "videos")+".html";
            
            // postpone reading the html 
            steal.html.wait();
            
            $.get(url, {}, this.callback('replaceContent'),"text" )
        },
        replaceContent : function(html){
            this.element.html(html);
            
            // indicate the html is ready to be crawled
            steal.html.ready();
        }
    })
    
    $('#content').ajaxy();
    
    });

When a hashchange (<code>"{window} hashchange"</code>) event occurs, Ajaxy
uses the <code>window.location.hash</code> value to make a 
request (<code>$.get</code>)
for content in the<code>fixtures</code> folder.  

When the content is retrieved, it replaces the element's 
html (<code>this.element.html(...)</code>).

Ajaxy also calls <code>updateContent</code> to load content when
the page loads initially. 

## Crawling and scraping

To crawl your site and generate google-searchable html, run:

@codestart none
js ajaxy/scripts/crawl.js
@codeend

This script peforms the following actions:

  1. Opens a page in a headless browser.
  2. Waits until its content is ready.
  3. Scrapes its contents.
  4. Writes the contents to a file.
  5. Adds any links in the page that start with #! to be indexed
  6. Changes <code>window.location.hash</code> to the next index-able page
  7. Goto #2 and repeats until all pages have been loaded


## Pausing the html scraping.

By default, the contents are scraped immediately after the page's scripts have loaded or
the window.location.hash has changed.  The Ajax request for content
happens asynchronously so we have to tell [steal.html] to wait to scrape the content.

To do this, Ajaxy calls:

    steal.html.wait();
    
before the Ajax request.  And when the page is ready, Ajaxy calls:

    steal.html.ready();
    
## Getting Google To Crawl Your Site

If you haven't already, read up on 
Google's [http://code.google.com/web/ajaxcrawling/docs/getting-started.html Ajax crawling API].

When google wants to crawl your site, it will send a 
request to your page with <code>\_escaped\_fragment=</code>.  
	
When your server sees this param, redirect google to the generated html page.  For example, when the Google Spider requests <code>http://mysite.com?\_escaped\_fragment=val</code>, this is its attempt to crawl <code>http://mysite.com#!val</code>.  You should redirect this request to <code>http://mysite.com/html/val.html</code>.

Yes, it's that easy!

## Phantom for Advanced Pages

By default the crawl script uses EnvJS to open your page and build a static snapshot.  For some pages, EnvJS won't be powerful enough to accurately simulate everything.  If your page experiences errors, you can use PhantomJS (headless Webkit) to generate snapshots instead, which may work better.

To turn on Phantom:

1. Install it using the install instructions [funcunit.phantomjs here]
1. Open scripts/crawl.js and change the second parameter of steal.html.crawl to an options object with a browser option, like this:

    steal('steal/html/crawl', function(){
		steal.html.crawl("ajaxy/ajaxy.html", 
		{
			out: 'ajaxy/out',
			browser: 'phantomjs'
		})
	})