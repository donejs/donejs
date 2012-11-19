var path = require('path');

// A grunt task that strips multiline comments
module.exports = function (grunt) {
	grunt.registerMultiTask('bannerize', 'Adds the banner to a set of files', function () {
		var _ = grunt.utils._;
		var options = grunt.config.process(['bannerize', this.target]);
		var banner = grunt.helper('banner');
		var defaults = _.extend({ exclude : [] }, grunt.config('strip')._options);
		grunt.file.expandFiles(this.file.src).forEach(function (file) {
			for(var i = 0; i < defaults.exclude.length; i++) {
				if(defaults.exclude[i].test(file)) {
					return;
				}
			}
			var outFile = options.out ? path.join(options.out, path.basename(file)) : file;
			grunt.log.writeln('Adding banner to ' + file);

			var code = grunt.helper('file_strip_banner', file, { block : true });
			grunt.file.write(outFile, banner + code);
		});
	});
}
