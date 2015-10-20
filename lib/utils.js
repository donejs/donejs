var Q = require('q');
var path = require('path');
var npm = require('npm');
var exec = require('child_process').exec;
var spawn = require('cross-spawn-async');
var yeoman = require('yeoman-environment');

exports.projectRoot = function() {
    var deferred = Q.defer(),
        child = exec("npm prefix");

    child.stdout.on("data", function(data) {
        deferred.resolve(data.trim());
    });
    child.on("close", function(code) {
        if (code) { deferred.reject(code); }
    });

    return deferred.promise;
};

// Returns a .then-able function that installs a single module
// if it is not available in the current path
var installIfMissing = exports.installIfMissing = function(root, module) {
  var location = module ? path.join(root, module) : root;
  if(!module) {
    module = root;
  }

  return function (previous) {
    try {
      require.resolve(location);
    } catch (e) {
      console.log('Installing ' + module);
      return Q.ninvoke(npm.commands, 'install', [module]).then(function () {
        return previous;
      });
    }

    return previous;
  };
};

// Run a command and pipe the output.
// The returned promise will reject if there is a non-zero exist status
var runCommand = exports.runCommand = function(cmd, args) {
  var child = spawn(cmd, args, {
    cwd: process.cwd(),
    stdio: "inherit"
  });

  var deferred = Q.defer();

  child.on('exit', function(status) {
    if(status) {
      deferred.reject(new Error('Command `' + cmd + '` did not complete successfully'));
    } else {
      deferred.resolve(child);
    }
  });

  return deferred.promise;
};

// Run any of the Yeoman generators from the current generator-donejs
var generate = exports.generate = function(root, generator, args) {
  return Q.ninvoke(npm, 'load', { loaded: false })
    .then(installIfMissing(root, generator))
    .then(function () {
      var generators = require(path.join(root, generator));
      var env = yeoman.createEnv();

      Object.keys(generators).forEach(function(name) {
          var fullName = path.join(root, generator, name);
          env.register(require.resolve(fullName), name);
      });

      return Q.npost(env, 'run', args);
    });
};

// Add a module from npm and run its default export
exports.add = function(root, name, params) {
  var generatorName = 'donejs-' + name;
  params = (params && params.length) ? params : ['default'];

  return generate(root, generatorName, params);
};

exports.runScript = function(name, args) {
  return runCommand("npm", ['run', name].concat(args));
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
