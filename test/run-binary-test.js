var Q = require('q');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var mockery = require('mockery');
var utils = require('../lib/utils');

describe('runBinary', function() {
  var runBinary;
  var spawnCalls;
  var root = 'foobar';
  var runBinaryPath = '../lib/cli/run-binary';

  beforeEach(function() {
    spawnCalls = [];
    deleteFolder();

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerAllowable(runBinaryPath);

    mockery.registerMock('../utils', {
      projectRoot: function() {
        return Q(root);
      },
      spawn: function() {
        spawnCalls.push({
          binary: arguments[0],
          args: arguments[1],
          options: arguments[2]
        });
        return Q(true);
      }
    });

    runBinary = require(runBinaryPath);
  });

  afterEach(function() {
    deleteFolder();
    mockery.disable();
    mockery.deregisterAll();
  });

  it('rejects if binary does not exist and adds additional info if the command is `donejs add`', function(done) {
    runBinary(['add'])
      .then(function() {
        assert(false, 'should have failed');
        done();
      })
      .catch(function(err) {
        assert(
          /Could not find local DoneJS CLI binary/.test(err.message),
          'it should reject with error'
        );

        assert(
          /Allowed types for a new project are/.test(err.message),
          'it should reject with error'
        );
        
        done();
      });
  });

  describe('spawns a process with provided arguments', function() {
    it('when the binary file is named `donejs`', function(done) {
      spawnCreatedBinary('donejs', done);
    });
    it('when the binary file is named `donejs-cli`', function(done) {
      spawnCreatedBinary('donejs-cli', done);
    });
  });

  function spawnCreatedBinary(binFile, done) {
    var binPath;

    createBinary(binFile)
      .then(function(returnedPath) {
        binPath = returnedPath;
        return runBinary(['--help']);
      })
      .then(function() {
        assert.equal(spawnCalls.length, 1, 'should spawn process');
        var call = spawnCalls[0];

        assert.equal(call.binary, binPath);
        assert.deepEqual(call.args, ['--help']);
        assert.deepEqual(call.options, { cwd: root });

        done();
      })
      .catch(done);
  }

  function deleteFolder() {
    if (fs.existsSync(root)) {
      rimraf.sync(root);
    }
  }

  function createBinary(binFile) {
    var binDir = path.join(root, 'node_modules', '.bin');
    binFile = process.platform === 'win32' ? binFile+'.cmd' : binFile;
    var binPath = path.join(binDir, binFile);

    return utils.mkdirp(binDir)
      .then(function() {
        var writeFile = Q.denodeify(fs.writeFile);
        return writeFile(binPath);
      })
      .then(function() {
        return binPath;
      });
  }
});
