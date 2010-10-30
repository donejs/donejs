load('steal/rhino/steal.js')

steal.File("../jmvcdownload").removeDir()
steal.File("jmvcdownload.zip").remove()
steal.File("../jmvcdownload").mkdir()

var ignore = [".git", ".gitignore", "dist"]

steal.File("../jmvcdownload/documentjs").mkdir()
steal.File("documentjs").copyTo("../jmvcdownload/documentjs/", ignore)

steal.File("../jmvcdownload/funcunit").mkdir()
steal.File("funcunit").copyTo("../jmvcdownload/funcunit/", ignore)

steal.File("../jmvcdownload/jquery").mkdir()
steal.File("jquery").copyTo("../jmvcdownload/jquery/", ignore)

steal.File("../jmvcdownload/steal").mkdir()
steal.File("steal").copyTo("../jmvcdownload/steal/", ignore)

steal.File("js").copyTo("../jmvcdownload/js", [])
steal.File("js.bat").copyTo("../jmvcdownload/js.bat", [])

//steal.File("../jmvcdownload").zipDir("javascriptmvc-3.0.0.zip", "../jmvcdownload/")
runCommand("sh", "-c", 'zip -r javascriptmvc-3.0.0.zip documentjs jquery funcunit steal js js.bat -x "*/.git/*" -x "*/dist/*"');
