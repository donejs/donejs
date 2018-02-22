var Q = require('q');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var assert = require('assert');
var mockery = require('mockery');
var utils = require('../lib/utils');

describe('cli init cmd', function() {
  var cwd;
  var init;
  var spawnCalls;
  var runBinaryCall;
  var folder = 'test-project';
  var cmdInitPath = '../lib/cli/cmd-init';

  beforeEach(function() {
    spawnCalls = [];
    runBinaryCall = {};
    cwd = process.cwd();

    deleteFolder();

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerAllowable(cmdInitPath);

    mockery.registerMock('./run-binary', function() {
      runBinaryCall.args = arguments[0];
      runBinaryCall.options = arguments[1];
    });

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
        process.chdir(cwd);
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
        process.chdir(cwd);
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
        var folderPath = path.join(cwd, folder);

        assert.equal(installCliCall.binary, 'npm');
        assert.deepEqual(installCliCall.args, [
          'install', 'donejs-cli@latest', '--no-shrinkwrap', '--loglevel', 'error'
        ]);

        assert.deepEqual(runBinaryCall.args, ['init']);
        assert.deepEqual(
          runBinaryCall.options,
          { cwd: folderPath },
          'it should set cwd to folderPath so init puts files in {folder}'
        );

        done();
      })
      .catch(done);
  });

  it('passes options to donejs-init properly', function(done) {
    init(folder, { skipInstall: true, yes: true, type: 'foobar' })
      .then(function() {
        var args = runBinaryCall.args;

        assert(includes(args, '--skip-install'));
        assert(includes(args, '--yes'));
        assert(includes(args, '--type'));
        assert(includes(args, 'foobar'));

        done();
      })
      .catch(done);
  });

  function deleteFolder() {
    if (fs.existsSync(folder)) {
      rimraf.sync(folder);
    }
  }

  function includes(collection, value) {
    return (collection || []).indexOf(value) !== -1;
  }
});
