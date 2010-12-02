load('steal/rhino/steal.js')

runCommand("cmd", "/C", "js scripts/pull_all.js")

runCommand("cmd", "/C", "js scripts/docs.js")

runCommand("cmd", "/C", "js jquery/build.js")
runCommand("cmd", "/C", "js jquery/buildAll.js")

steal.File(".").zipDir("javascriptmvc.zip", ".\\")