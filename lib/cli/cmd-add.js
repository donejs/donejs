var runBinary = require('./run-binary');
var types = ['app', 'plugin', 'generator'];

// `donejs add app [folder]`       => `donejs-cli init [folder]`
// `donejs add plugin [folder]`    => `donejs-cli init [folder] --type=plugin`
// `donejs add generator [name]`   => `donejs-cli init [folder] --type=generator`
// `donejs add <name> [params...]` => `donejs-cli add <name> [params...]`
module.exports = function(type, params, options) {

  // handles commands with the following shape `donejs add <type> [folder]`
  if (types.indexOf(type) !== -1) {
    var folder = params[0];

    if (type !== 'app') {
      options.type = type;
    }

    return runBinary(['init', folder], options);

  // handles commands with the following shape `donejs add <name> [params...]`
  } else {
    var args = ['add'].concat(params);
    return runBinary(args, options);
  }
};
