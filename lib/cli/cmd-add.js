var Q = require('q');
var runBinary = require('./run-binary');

// `donejs add app [folder]`     => `donejs-cli init [folder]`
// `donejs add plugin [folder]`  => `donejs-cli init [folder] --type=plugin`
// `donejs add generator [name]` => `donejs-cli init [folder] --type=generator`
module.exports = function(type, folder, options) {
  if (!isValidType(type)) {
    var msg = 'Invalid [type] value `' + type + '`';
    return Q.reject(new Error(msg));
  }

  if (type !== 'app') {
    options.type = type;
  }

  return runBinary(['init', folder], options);
};

function isValidType(type) {
  var types = ['app', 'plugin', 'generator'];
  return types.indexOf(type) !== -1;
}
