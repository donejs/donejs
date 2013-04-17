var ejs = require('ejs');
var beautify = require('js-beautify');

module.exports = function(grunt) {
	var _ = grunt.util._;

	grunt.registerMultiTask('testify', 'Generates test runners', function() {
		var done = this.async();
		var data = this.data;
		var template = grunt.file.read(this.data.template);
		var transform = this.data.transform;
		var modules = this.data.builder.modules;
		var configurations = this.data.builder.configurations;

		if(transform && transform.modules) {
			modules = transform.modules(modules);
		}

		_.each(configurations, function(config, configurationName) {
			var options = {
				configuration: config,
				modules: [],
				tests: [],
				root: data.root
			};

			_.each(modules, function(definition, key) {
				if(!definition.configurations || definition.configurations.indexOf(configurationName) !== -1) {
					var name = key.substr(key.lastIndexOf('/') + 1);
					options.modules.push(key);
					options.tests.push(key + '/' + name + '_test.js');
				}
			});

			_.extend(config.steal, {
				root: '../..'
			});

			if(transform && transform.options) {
				_.extend(options, transform.options.call(config, configurationName));
			}

			var lib = beautify.html(ejs.render(template, options), {
				"wrap_line_length": 70
			});

			grunt.log.writeln('Generating ' + data.out + configurationName + '.html');
			grunt.file.write(data.out + configurationName + '.html', lib);
		});

		done();
	});
};