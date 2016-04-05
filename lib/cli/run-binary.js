var Q = require('q');
var fs = require('fs');
var path = require('path');
var utils = require('../utils');

module.exports = function(args, options, types) {
  options = options || {};

  return utils.projectRoot()
    .then(function(root) {
      var doneScript = process.platform === 'win32' ? 'donejs.cmd' : 'donejs';
      var donejsBinary = path.join(root, 'node_modules', '.bin', doneScript);

      if (!fs.existsSync(donejsBinary)) {
        var msg = 'Could not find local DoneJS binary (' + donejsBinary + ')';

        if(args[0] === 'add') {
          msg += '\nAllowed types for a new project are: ' + (types || []).join(', ');
        }

        return Q.reject(new Error(msg));
      }

      if (!options.cwd) {
        options.cwd = root;
      }

      return utils.spawn(donejsBinary, args, options);
    });
};
