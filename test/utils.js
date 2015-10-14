var assert = require('assert');
var fs = require('fs');
var path = require('path');
var Q = require('q');
var npm = require('npm');
var utils = require('../lib/utils');

function fail(error) {
  console.error(error.stack);
  throw error;
}

describe('DoneJS CLI tests', function() {
  describe('utils', function() {
    before(function () {
      delete global.donejsTestPluginLoaded;
    });

    it('installIfMissing', function(done) {
      Q.ninvoke(npm, 'load', { loaded: false })
        .then(utils.installIfMissing('day-seconds'))
        .then(function() {
          var daySeconds = require('day-seconds');
          assert.equal(daySeconds(true), 86400, 'day-second module installed and loaded');
          done();
        })
        .fail(fail);
    });

    it('add', function (done) {
      utils.add(path.join(process.cwd(), 'node_modules'), 'test-plugin')
       .then(function () {
         assert.equal(global.donejsTestPluginLoaded, true, 'donejs-test-plugin module is installed and executed');
         done();
       })
       .fail(fail);
    });

    it('runScript and runCommand', function(done) {
      utils.runScript('verify', ['testing', 'args']).then(function(child) {
          assert.equal(child.exitCode, 0, 'Exited successfully');
          done();
        })
        .fail(fail);
    });

    it('generate .component', function(done) {
      var moduleName = 'dummy/component.component';
      var root = path.join(__dirname, '..', 'node_modules');
      utils.generate(root, [
          ['component', moduleName, 'dummy-component']
        ])
        .then(function() {
          var generatedPath = path.join(process.cwd(), 'test', moduleName);
          fs.exists(generatedPath, function(exists) {
            assert.ok(exists, 'Component file generate');
            done();
          });
        })
        .fail(fail);
    });

    it("get project root", function(done) {
        var pathFromTest = path.join(process.cwd(), "node_modules");
        utils.projectRoot().then(function(p) {
            assert.equal(path.join(p, "node_modules"), pathFromTest);
            done();
        })
        .fail(fail);
    });
  });
});
