var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var Q = require('q');

// Recursively make a directory
exports.mkdirp = function(folder) {
  if(!folder) {
    return Q(process.cwd());
  }

  var parts = folder.split(path.sep);
  var dfd = Q();
  var current = '';

  parts.forEach(function(part) {
    var myPath = path.join(current, part);

    current = myPath;

    var resolve = function() {
      return myPath;
    };

    dfd = dfd.then(function() {
      return Q.nfcall(fs.mkdir, myPath).then(resolve, resolve);
    });
  });

  return dfd.then(function(myPath) {
    return path.join(process.cwd(), myPath);
  });
};

// Run a command and pipe the output.
// The returned promise will reject if there is a non-zero exist status
exports.spawn = function(cmd, args, options) {
  options.stdio = 'inherit';

  var child = cp.spawn(cmd, args, options || { cwd: process.cwd() });
  var deferred = Q.defer();

  child.on('exit', function(status) {
    if(status) {
      deferred.reject(new Error('Command `' + cmd +
        '` did not complete successfully'));
    } else {
      deferred.resolve(child);
    }
  });

  return deferred.promise;
};

// Returns the NPM root
exports.projectRoot = function() {
  var deferred = Q.defer(),
    child = cp.exec("npm prefix");

  child.stdout.on("data", function(data) {
    deferred.resolve(data.trim());
  });
  child.on("close", function(code) {
    if (code) { deferred.reject(code); }
  });

  return deferred.promise;
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
