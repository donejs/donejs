var Q = require('q');
var npm = require('npm');
var spawn = require('child_process').spawn;

// Returns a .then-able function that installs a single module
// if it is not available in the current path
var installIfMissing = exports.installIfMissing = function(module) {
  return function (previous) {
    try {
      require.resolve(module);
    } catch (e) {
      console.log('Installing ' + module);
      return Q.ninvoke(npm.commands, 'install', [module]).then(function () {
        return previous;
      });
    }

    return previous;
  }
};

// Run a command and pipe the output.
// The returned promise will reject if there is a non-zero exist status
var runCommand = exports.runCommand = function(cmd, args) {
  var child = spawn(cmd, args, {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  var deferred = Q.defer();

  child.on('exit', function(status) {
    if(status !== 0) {
      deferred.reject(new Error('Command `' + cmd + ' '
        + (args || []).join(' ') + '` did not complete successfully'));
    } else {
      deferred.resolve(child);
    }
  });

  return deferred.promise;
};

// Run any of the Yeoman generators from the current generator-donejs
exports.generate = function(args) {
  return Q.ninvoke(npm, 'load', { loaded: false })
    .then(installIfMissing('yeoman-environment'))
    .then(installIfMissing('generator-donejs'))
    .then(function () {
      var yeoman = require('yeoman-environment');
      var env = yeoman.createEnv();
      var generators = require('generator-donejs');

      Object.keys(generators).forEach(function(name) {
        env.register(require.resolve('generator-donejs/' + name), name);
      });

      return Q.npost(env, 'run', args);
    });
};

exports.runScript = function(name) {
  return runCommand('npm', ['run', name]);
};

// Log error messages and exit application
exports.log = function(promise) {
  return promise.then(function() {
    process.exit(0);
  }, function(error) {
    console.error(error.stack || error.message || error);
    process.exit(1);
  });
};
