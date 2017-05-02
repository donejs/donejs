var Q = require('q');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var assert = require('assert');
var mockery = require('mockery');
var utils = require('../lib/utils');
var symlink = Q.denodeify(fs.symlink);

describe('donejs-cli init command', function() {
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

  it('creates project {folder} if it does not exist', function(done) {
    init(folder, {})
      .then(function() {
        process.chdir(cwd);
        assert(fs.existsSync(folder), 'should create project {folder}');
        done();
      })
      .catch(done);
  });

  // otherwise npm will walk up the tree until it finds a node_modules folder,
  // that causes issues if there is indeed an existing node_modules in any of
  // the "folder" parent directories.
  it('creates {folder}/node_modules to stop npm from crawling parent dirs', function(done) {
    init(folder, {})
      .then(function() {
        process.chdir(cwd);
        var folderModules = path.join(folder, 'node_modules');
        assert(fs.existsSync(folderModules), 'should create node_modules');
        done();
      })
      .catch(done);
  });

  it('installs donejs-cli and then runs `donejs-cli init`', function(done) {
    init(folder, {})
      .then(function() {
        var installCliCall = spawnCalls[0];
        var folderPath = path.join(cwd, folder);

        assert.equal(installCliCall.binary, 'npm');
        assert.deepEqual(installCliCall.args, [
          'install', 'donejs-cli@latest', '--loglevel', 'error'
        ]);

        assertRunBinaryCallInit(folderPath);

        done();
      })
      .catch(done);
  });

  // if folder exists as symlink, we assume it was put there by npm link, or
  // manually, for debugging purposes
  it('skips install if {folder}/node_modules/donejs-cli exist as symlink, still runs `donejs-cli init`', function(done) {
    var localCli = path.join(folder, 'local-donejs-cli');
    var nodeModules = path.join(folder, 'node_modules');
    utils.mkdirp(localCli).then(function() {
      utils.mkdirp(nodeModules).then(function() {
        symlink('../local-donejs-cli', path.join(nodeModules, 'donejs-cli')).then(function() {
          init(folder, {})
            .then(function() {
              var installCliCall = spawnCalls[0];
              var folderPath = path.join(cwd, folder);

              assert.strictEqual(installCliCall, undefined); 

              assertRunBinaryCallInit(folderPath);

              done();
            })
            .catch(done);
        })
        .catch(done);
      })
      .catch(done);
    })
    .catch(done);
  });

  it('passes options to `donejs-cli init` properly', function(done) {
    init(folder, { skipInstall: true, type: 'foobar' })
      .then(function() {
        assert.deepEqual(runBinaryCall.args, [
          'init', '--skip-install', '--type', 'foobar'
        ]);
        done();
      })
      .catch(done);
  });

  function assertRunBinaryCallInit(folderPath) {
    assert.deepEqual(runBinaryCall.args, ['init']);
    assert.deepEqual(
      runBinaryCall.options,
      { cwd: folderPath },
      'it should set cwd so init puts files in {folder}'
    );
  }

  function deleteFolder() {
    if (fs.existsSync(folder)) {
      rimraf.sync(folder);
    }
  }
});

