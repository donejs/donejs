var Q = require('q');
var fs = require('fs');
var path = require('path');
var utils = require('../utils');

module.exports = function(args) {
  return utils.projectRoot()
    .then(function(root) {
      var doneScript = process.platform === 'win32' ? 'donejs.cmd' : 'donejs';
      var donejsBinary = path.join(root, 'node_modules', '.bin', doneScript);

      if (!fs.existsSync(donejsBinary)) {
        var msg = 'Could not find local DoneJS binary (' + donejsBinary + ')';
        return Q.reject(new Error(msg));
      }

      return utils.spawn(donejsBinary, args, { cwd: root });
    });
};
