/*global load: false */
/*
clean script to (check sanity and) normalize
	syn
	syn/drag
 */
(function () {
	"use strict";
	var settings = {
		indent_size: 1,
		indent_char: '\t',
		space_after_anon_function: true,
		space_statement_expression: false,	// for (i... / for ( i...
		jslint: true,
		ignore: /jmvc\/pages\/*|steal\/*|jquery\/*|funcunit\/*|documentjs\/*/,
		predefined: {
			steal: true,
			Syn: true,
			jQuery: true,
			$: true,
			window: true
		}
	};
	load("steal/rhino/steal.js");
	steal.plugins('steal/clean', function () {
//		steal.clean('jmvc/scripts/clean.js', settings);
		steal.clean('jmvc/jmvc.html', settings);
	});

}());