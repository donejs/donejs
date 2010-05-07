/*
 * @page learn 3. Learn
 * @tag home, learn
 * <h1 class='addFavorite'>Learning</h1>
 * <p>JavaScriptMVC contains pretty much everything you need to develop, test, and maintain a 
 * JavaScript application.  Instead of learning an API, learning JavaScriptMVC is more about learning
 * <b>HOW</b> to build an application.</p>
 * 
 * <h2>The Basics</h2>
 * <a href='http://cdn.javascriptmvc.com/videos/2_0/2_0_demo.htm' id='video' class='big_button floatLeft'>
     <span>Watch</span>
     <span class='label'>2.0 Video</span>
 * </a>  Before you do anything, watch the <a href='http://javascriptmvc.s3.amazonaws.com/videos/2_0/2_0_demo.htm'>2.0 Video</a>.  
 * It's a 12 min brain dump that will highlight most of JMVC's features.
 * <div style='clear:left; margin-top: 5px;'></div>
 * You might be asking yourself a fequently asked question:
 * <ul id='faq'>
 *     <li>
 *       <label>Who should use JMVC?</label>
 *       <div style='display:none' class='myblock'>
 *         <p>JMVC is designed for large, single-page JavaScript applications
 *            that require lots of custom code (something like [http://gmail.com GMail]).
 *            It fits between low-level libraries like jQuery and widget libraries like
 *            jQueryUI. </p>
 *         <p>If you need to organize, test, maintain, or compress a JavaScript application, 
 *            JavaScriptMVC will help.</p>
 *       </div>
 *     </li>
 *     <li><label>How does JMVC fit into my project?</label>
 *         <div style='display:none' class='myblock'>
 *          <p>JMVC is based around the principles of Service Oriented Architecture (SOA) and
 *          Thin Servier Architecture (TSA).  This means your server 
 *          produces raw (preferably REST) services and never sends data in HTML.</p>
 *          Read a [http://blog.javascriptmvc.com/?p=68 1.5 article]  how it looks from within a rails application:<br/>
 *          <a href='http://blog.javascriptmvc.com/?p=68'><img src='http://wiki.javascriptmvc.com/wiki/images/d/db/Tsa.png' style="border: solid 1px gray"/></a>
 *          <p>For information on the benefits of TSA, watch [http://www.youtube.com/watch?v=XMkIZZ7dBng Practical Thin Server Architecture]. </p>
 *         </div>
 *     </li>
 *     <li><label>Does JMVC work with a Java/PHP/Rails/etc backend?</label>
 *         <div style='display:none'  class='myblock'>
 *              <p>Yes, JMVC will will work with any backend service.  It prefers to consume JSON Rest services, but it's flexible 
 *              enough to work from
 *              anything</p>
 *         </div>
 *     </li>
 *     <li><label>Do you have any example code?</label>
 *         <div style='display:none' class='myblock'>
 *             <p>We are trying to get move public source available, but for now check out: 
 *             <a href='http://code.google.com/p/jabbify/source/browse/#svn/trunk/jabbify'>Jabbify's source</a>.</p>
 *         </div>
 *     </li>
 *     <li><label>How does JMVC compare to other JS Frameworks?</label>
 *         <div style='display:none' class='myblock'>
 *             <p>JMVC has the gamut of features to support the most complex JS applications.  
 *             But it's most important feature, and its most unique, is its event delegation support organized
 *             via [jQuery.Controller controllers].  If you haven't used controllers to organize event handling in
 *             JavaScript, you haven't really programmed JavaScript.</p>
 *         </div>
 *     </li>
 * </ul>
 * 
 * 
 * <h2>Model View Controller</h2>
 * <p>There are only 4 things you will ever do with JavaScript!  JMVC breaks these down into the
 * Model-View-Controller architecture</p>
 * <ol>
 *   <li>Respond to events -> [jQuery.Controller Controller]
 *   <li>Get data and manipulate services (Ajax) ->  [jQuery.Model Model] Static functions
 *   <li>Wrap service data with domain specific information -> [jQuery.Model Model] Prototype functions
 *   <li>Update the page -> [jQuery.Controller Controller] and [jQuery.Controller View]
 * </ol>
 * <p>Here's how that flow looks:</p>
 * <img src='http://wiki.javascriptmvc.com/wiki/images/3/3f/MVCMVC.png'/>
 * <p>Think how this would work with the google auto-suggest.</p>
 * <img src='http://wiki.javascriptmvc.com/wiki/images/c/cc/Autosuggest.png'/>
 * <ol>
 *   <li>Respond to typing "JavaScriptMVC" -> [jQuery.Controller Controller].
 *   <li>Get search suggestions ->  [jQuery.Model Model] Static functions.
 *   <li>Wrap search data -> [jQuery.Model Model] Prototype functions. <span style='color: gray'>Not really important here!</span>
 *   <li>Draw suggestions -> [jQuery.Controller Controller] and [jQuery.Controller View].
 * </ol>
 * <h2>Development Tools?</h2>
 * JavaScriptMVC supplies a host of JS tools including:
 * <ul>
 *     <li>[generators Code generators]</li>
 *     <li>[include Dependancy and update management]</li>
 *     <li>[jQuery.Test Testing]</li>
 *     <li>[include Compression]</li>
 *     <li>[include.Doc Documentation]</li>
 * </ul>
 * <h2>How do I get help?</h2>
 * Write on our forum.
 * <h2>How do I report errors, or contribute code?</h2>
 * Submit patches or errors in google code.
 * <script type='text/javascript'>
 * $("#faq > li").each(function(){
 *    $(this).children('label').click(function(){$(this).next().toggle()})
 * })
 * </script>
 * <style>
 * #faq li {padding: 3px;}
 * #faq label { border-bottom: dashed 1px #9C6854; font-size: 1.05em; cursor: pointer}
 * #faq label:hover {border-bottom: solid 1px #9C6854}
 * .myblock {padding: 5px;}
 * </style>
 */

//break