var Q = require('q');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var assert = require('assert');
var mockery = require('mockery');
var utils = require('../lib/utils');

describe('cli init cmd', function() {
  var init;
  var spawnCalls;
  var folder = 'test-project';
  var cmdInitPath = '../lib/cli/cmd-init';

  beforeEach(function() {
    spawnCalls = [];
    deleteFolder();

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerAllowable(cmdInitPath);

    mockery.registerMock('../utils', {
      mkdirp: utils.mkdirp,
      versionRange: function() { return 'latest'; },
      spawn: function() {
        spawnCalls.push({
          binary: arguments[0],
          args: arguments[1],
          options: arguments[2]
        });
        return Q(true);
      }
    });

    init = require(cmdInitPath);
  });

  afterEach(function() {
    deleteFolder();
    mockery.disable();
    mockery.deregisterAll();
  });

  it('creates folder if it does not exist', function(done) {
    var folder = 'test-project';

    init(folder, {})
      .then(function() {
        assert(fs.existsSync(folder), 'should create folder');
        done();
      })
      .catch(done);
  });

  // otherwise npm will walk up the tree until it finds a node_modules folder,
  // that causes issues if there is indeed an existing node_modules in any of
  // the "folder" parent directories.
  it('creates {folder}/node_modules for deps to be installed', function(done) {
    init(folder, {})
      .then(function() {
        var folderModules = path.join(folder, 'node_modules');
        assert(fs.existsSync(folderModules), 'should create node_modules');
        done();
      })
      .catch(done);
  });

  it('installs the donejs-cli and then runs done-js init', function(done) {
    init(folder, {})
      .then(function() {
        var installCliCall = spawnCalls[0];
        var cliInitCall = spawnCalls[1];

        assert.equal(installCliCall.binary, 'npm');
        assert.deepEqual(installCliCall.args, [
          'install', 'donejs-cli@latest', '--loglevel', 'error'
        ]);

        assert.equal(cliInitCall.binary, 'node');
        assert(cliInitCall.args[0].indexOf('donejs-cli/') !== -1);
        assert.equal(cliInitCall.args[1], 'init');

        done();
      })
      .catch(done);
  });

  function deleteFolder() {
    if (fs.existsSync(folder)) {
      rimraf.sync(folder);
    }
  }
});

