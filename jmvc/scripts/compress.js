//js jmvc/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['jmvc/jmvc.html',
                                   'jmvc']);
compress.init();