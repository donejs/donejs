var Q = require('q');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var assert = require('assert');
var mockery = require('mockery');
var utils = require('../lib/utils');

describe('cli upgrade cmd', function() {
  var cwd;
  var upgrade;
  var spawnCalls;
  var runBinaryCall;
  var folder = 'test-project';
  var cmdUpgradePath = '../lib/cli/cmd-upgrade';
  var pkgJsonPath = __dirname + '/../test-project/package.json';

  beforeEach(function() {
    spawnCalls = [];
    writeCalls = [];
    runBinaryCall = {};
    cwd = process.cwd();

    deleteFolder();

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerAllowable(cmdUpgradePath);

    mockery.registerMock('./run-binary', function() {
      runBinaryCall.args = arguments[0];
      runBinaryCall.options = arguments[1];
    });

    mockery.registerMock('../utils', {
      mkdirp: utils.mkdirp,
      versionRange: function() { return 'latest'; },
      projectRoot: function(){
        return Promise.resolve(__dirname + '/../' + folder);
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

    mockery.registerMock(pkgJsonPath, {
      dependencies: {
        foo: "1.0.0"
      },
      devDependencies: {
        bar: "1.0.0"
      }
    });

    mockery.registerMock('fs', {
      writeFileSync: function(path, data, enc){
        writeCalls.push({ path, data, enc });
      }
    });

    mockery.registerMock('cross-spawn-async', function(){
      spawnCalls.push({
        binary: arguments[0],
        args: arguments[1],
        options: arguments[2]
      });
      var makeOn = function() {
        var fn = function(ev, cb) {
          fn.cb = cb;
        };
        return fn;
      };
      var onData = makeOn();
      var onExit = makeOn();
      var mock = {stdout: { on: onData }, on: onExit};

      setTimeout(function(){
        var pkg = {donejs: {dependencies: {foo: "2.0.0"}, devDependencies: {bar: "2.0.0"}}};
        onData.cb(JSON.stringify(pkg));
        setTimeout(function() { onExit.cb(0); }, 20);
      }, 20);

      return mock;
    });

    upgrade = require(cmdUpgradePath);
  });

  afterEach(function() {
    deleteFolder();
    mockery.disable();
    mockery.deregisterAll();
  });

  it('updates the package.json', function(done){
    upgrade(null, {canmigrate: false})
      .then(function(){
        assert.equal(writeCalls.length, 1);
        assert.equal(writeCalls[0].path, pkgJsonPath);

        var json = JSON.parse(writeCalls[0].data);
        assert.equal(json.dependencies.foo, "2.0.0", "dependency is upgraded");
        assert.equal(json.devDependencies.bar, "2.0.0", "devDependency is upgraded");

        done();
      })
      .catch(done);
  });

  it('runs can-migrate', function(done){
    upgrade(null, {canmigrate: true})
      .then(function(){
        assert.equal(runBinaryCall.args[0], "can-migrate", "ran can-migrate");
        done();
      })
      .catch(done);
  });

  it('Does not run can-migrate when --no-canmigrate flag is passed', function(done){
    upgrade(null, {canmigrate: false})
      .then(function(){
        assert.equal(runBinaryCall.args, undefined, "did not run can-migrate");
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
