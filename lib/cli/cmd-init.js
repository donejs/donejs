var fs = require('fs');
var path = require('path');
var utils = require('../utils');
var mypkg = require(path.join(__dirname, '..', '..', 'package.json'));

module.exports = function(folder, opts) {
  return utils.mkdirp(folder)
    .then(function(folderpath) {
      var folderModules = path.join(folderpath, 'node_modules');

      // create an empty node_modules inside the target `folder`, this
      // will prevent npm to install the dependencies in any node_modules
      // folder but the one inside `folder`.
      if (!fs.existsSync(folderModules)) {
        fs.mkdirSync(folderModules);
      }

      console.log('Initializing new DoneJS application at', folderpath);
      console.log('Installing donejs-cli');

      return installCli(mypkg.version, { cwd: folderpath })
        .then(function() {
          return runCliInit(folderpath, opts);
        });
    });
};

// install donejs-cli
function installCli(version, options) {
  var pkg = 'donejs-cli@' + utils.versionRange(version);
  var npmArgs = [ 'install', pkg, '--loglevel', 'error' ];
  return utils.spawn('npm', npmArgs, options);
}

// run donejs-cli init
function runCliInit(folderPath, options) {
  var args = [ folderPath, 'node_modules', 'donejs-cli', 'bin', 'donejs' ];
  var binary = path.join.apply(path, args);
  var initArgs = [binary, 'init'];

  if (options.skipInstall) {
    initArgs.push('--skip-install');
  }

  if (options.type) {
    initArgs.push('--type', options.type);
  }

  return utils.spawn('node', initArgs, options);
}
