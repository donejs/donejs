load('steal/rhino/steal.js')

runCommand("cmd", "/C", "js scripts/pull_all.js")

runCommand("cmd", "/C", "js scripts/docs.js")

steal.File(".").zipDir("javascriptmvc.zip", ".\\")

//runCommand("sh", "-c", 'zip -r javascriptmvc.zip * -x "*/.git/*"');
