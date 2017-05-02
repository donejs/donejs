var fs = require('fs');
var path = require('path');
var utils = require('../utils');
var runBinary = require('./run-binary');
var mypkg = require(path.join(__dirname, '..', '..', 'package.json'));

module.exports = function(folder, opts) {
  return utils.mkdirp(folder)
    .then(function(folderPath) {
      var linkedCli = false,
        folderModules = path.join(folderPath, 'node_modules'),
        folderCli = path.join(folderModules, 'donejs-cli');

      // create an empty node_modules inside the target `folder`, this
      // will prevent npm to install the dependencies in any node_modules
      // folder but the one inside `folder`.
      if (!fs.existsSync(folderModules)) {
        fs.mkdirSync(folderModules);
      }

      console.log('Initializing new DoneJS application at', folderPath);

      if (fs.existsSync(folderCli)) {
        linkedCli = fs.lstatSync(folderCli).isSymbolicLink();
      }

      if (!linkedCli) {
        console.log('Installing donejs-cli');
        return installCli(mypkg.version, { cwd: folderPath })
          .then(function() {
            return runCliInit(folderPath, opts);
          });
      } else {
        // skip installing CLI when it exists as a symlink (it was probably put
        // there by `npm link donejs-cli` for debug or development purposes)
        // and npm@3 would wrongly "flatten" dependencies in the linked CLI.
        console.log('Skip installing donejs-cli (already exists as symlink)');
        return runCliInit(folderPath, opts);
      }
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
  var initArgs = ['init'];

  // cd into the newly created folder, this way runBinary
  // gets the root folder correctly.
  process.chdir(folderPath);

  if (options.skipInstall) {
    initArgs.push('--skip-install');
  }

  if (options.type) {
    initArgs.push('--type', options.type);
  }

  options.cwd = folderPath;
  return runBinary(initArgs, options);
}
