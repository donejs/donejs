/*
 * @page generators Generators API
 * @tag app, controller, engine, fixture, functional_test, model, page, scaffold, unit_test
 * <h1 class='addFavorite'>Generators API</h1>
 * Use generators to easily create files and functionality.  All generators are in the 
 * <i>jmvc\generate</i> folder.
 * <h2>app</h2>
 * Creates a new application, complete with the files you need to test, compress, and document
 * your application.
@codestart text
./js jmvc/generate/app APPNAME
Generating...

             apps/APPNAME 
             apps/APPNAME/init.js                     <i class='comment'>loads app's files</i>
             apps/APPNAME/compress.js                 <i class='comment'>compresses your app</i>
             apps/APPNAME/index.html                  <i class='comment'>page used for compression</i>
             apps/APPNAME/test
             apps/APPNAME/test/unit.js                <i class='comment'>loads unit tests</i>
             apps/APPNAME/test/run_unit.js            <i class='comment'>runs unit tests</i>
             apps/APPNAME/test/functional.js          <i class='comment'>loads functional tests</i>
             apps/APPNAME/test/run_functional.js      <i class='comment'>runs functional tests</i>
             apps/APPNAME/test/selenium_config.js     <i class='comment'>config for selenium</i>
             apps/APPNAME/docs                        <i class='comment'>folder for docs</i>
             test/unit/truth_test.js                  <i class='comment'>basic test</i>
             test/functional/truth_functional_test.js <i class='comment'>basic test</i>
             APPNAME.html

             Make sure to add new files to your application and test file! 
@codeend
<h2>controller</h2>
Creates a controller, with a basic test file.
@codestart text
js jmvc/generate/controller YourController
Generating...

             controllers
             controllers/your_controller.js
             test/functional/your_test.js
             views/your
@codeend
<h2>engine</h2>
Creates an engine directory and files.
<h2>fixture</h2>
Creates a simulated fixture response.
@codestart text
js jmvc/generate/fixture get /tasks/5.xml
@codeend
<h2>functional_test</h2>
Creates a functional tests
<h2>model</h2>
Creates a basic model, with scaffolding, and a function.
<h2>page</h2>
Creates a page that loads your application.
<h2>scaffold</h2>
Creates Create/Read/Update/Delete (CRUD) functionality for a type of data.  It also creates tests.
@codestart text
js jmvc/generate/scaffold ClassName
@codeend
<h2>unit_test</h2>
Creates a unit test
 */