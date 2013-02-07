@page rootfolder Root Folder

The root folder is the folder where JavaScriptMVC is installed. This is the parent
folder of the `steal`, `can`, etc folder.  For example:

    ROOT/
      can/
      jquery/
      steal/
      documentjs/
      
Typically, the root folder should be a public folder that serves static content. It's often named something 
like `static` or `public` depending on what server and system setup you have.

By default, `steal(moduleId)`, references files from the root folder. The following loads
`ROOT/foo/bar.js`:

    steal('foo/bar.js')
    
Paths that begin with `"//"` also reference the root folder.  The following 
loads `ROOT/views/bar.ejs

    $('#foo').html('//views/bar.ejs',{})
