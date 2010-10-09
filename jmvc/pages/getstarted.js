/*
 * @page getstarted 2. Get Started
 * @tag home, get started
 * <h1 class='addFavorite'>Get Started</h1>
 * This guide introduces the most important aspects of JavaScriptMVC (JMVC) by 
 * creating a simple cookbook application.
 * <h2>The Video</h2>
 * <a href='http://cdn.javascriptmvc.com/videos/2_0/2_0_demo.htm' id='video' class='big_button floatLeft'>
     <span>Watch</span>
     <span class='label'>2.0 Video</span>
 </a>  Check out the <a href='http://javascriptmvc.s3.amazonaws.com/videos/2_0/2_0_demo.htm'>
 JavaScriptMVC 2.0</a> video that walks you through much of the getting started guide.  
 It's an older treatment, but still touches on JMVC's strong points.
 * <h2 class='spaced'>Basics</h2>
 * Before jumping in, there are some things you should know:
 * <h3>Folder Structure</h3>
 * JMVC logically separates your files with the following folder structure:
@codestart
documentjs         -documentation engine
funcunit           -testing tool
appname            -your applicatoin
    \controllers   -organized event handlers
    \models        -manage data
    \resources     -helper scripts
    \test          -test files
        \funcunit  -funcunit tests
        \qunit     -qunit tests
    \views         -html templates
jquery             -jquery and jQuery plugins (like $.Controller)
steal              -compression and build
@codeend
<div class='whisper'>P.S. Don't worry about creating an 'appname' folder yet.  We'll do that
in a second.</div>
 * <h3>Plugins</h3>
 * Everything is a plugin.  Just [steal.static.plugins steal] the ones you need. Plugins load their
 * own dependencies and won't load duplicate files.  
 * @codestart
 * steal.plugins('jquery/model',
 *   'jquery/view',
 *   'jquery/controller');
 * @codeend
<div class='whisper'>
  P.S. <code>steal.plugins('a/b')</code> adds <code>a/b/b.js</code>
 to your project. 
  </div>
 * <h3>Environments</h3>
 * There are different environments for each phase of development:
 * <ul>
 *     <li><span class='gray'>Development</span> - optimized for debugging and rapid development</li>
 *     <li><span class='gray'>Production</span> - loads compressed application file </li>
 * </ul>
<div class='whisper'>
  P.S. The 'test' environment has been replaced by [FuncUnit]
  awesomeness. 
</div>
 * <h2>Making a Cookbook</h2>
 * Lets get started by [install installing JavaScriptMVC].
 */
//break