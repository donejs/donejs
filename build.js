load('steal/rhino/steal.js')

new steal.File("../jmvcdownload").removeDir()
new steal.File("jmvcdownload.zip").remove()
new steal.File("../jmvcdownload").mkdir()

var ignore = [".git", ".gitignore", "dist"]

new steal.File("../jmvcdownload/documentjs").mkdir()
new steal.File("documentjs").copyTo("../jmvcdownload/documentjs/", ignore)

new steal.File("../jmvcdownload/funcunit").mkdir()
new steal.File("funcunit").copyTo("../jmvcdownload/funcunit/", ignore)

new steal.File("../jmvcdownload/jquery").mkdir()
new steal.File("jquery").copyTo("../jmvcdownload/jquery/", ignore)

new steal.File("../jmvcdownload/steal").mkdir()
new steal.File("steal").copyTo("../jmvcdownload/steal/", ignore)

new steal.File("js").copyTo("../jmvcdownload/js", [])
new steal.File("js.bat").copyTo("../jmvcdownload/js.bat", [])

new steal.File("../jmvcdownload").zipDir("javascriptmvc-3.0.0.zip", "..\\jmvcdownload\\")