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

var isCI = require('is-ci');
var isWindows = require('os').platform() === 'win32';

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

    describe('add', function() {
      it('default generator', function(done) {
        utils.add(path.join(process.cwd(), 'node_modules'), 'test-plugin', [])
         .then(function () {
           assert.equal(global.donejsTestPluginLoaded, 'default', 'donejs-test-plugin other generator is executed');
           done();
         })
         .fail(fail);
      });

      it('non-default generator', function(done) {
        utils.add(path.join(process.cwd(), 'node_modules'), 'test-plugin', [['other']])
         .then(function () {
           assert.equal(global.donejsTestPluginLoaded, 'other', 'donejs-test-plugin default generator is executed');
           done();
         })
         .fail(fail);
      });

      it('non-default generator with params', function(done) {
        utils.add(path.join(process.cwd(), 'node_modules'), 'test-plugin', [['other', 'foo']])
         .then(function () {
           assert.equal(global.donejsTestPluginLoaded, 'foo', 'donejs-test-plugin other generator is executed with correct params');
           done();
         })
         .fail(fail);
      });
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
      utils.generate(root, 'generator-donejs', [
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

		var runCommandPassesStdio = function(done){
			var script = __dirname + "/tests/needstty.js";
			var makeAssert = function(val, msg){
				return function(err){
          if(!val && err) {
            console.error(err);
          }
					assert(val, msg);
				};
			};
			utils.runCommand("node", [script])
				.then(makeAssert(true, "Script was ran as a tty"),
							makeAssert(false, "Script not run as a tty"))
				.then(done, done);
		};

		// This test doesn't pass in AppVeyor but does pass when ran locally on Windows
		// Giving up on CI for this for right now.
		if(isWindows && isCI) {
			it.skip("runCommand passes stdio for scripts that need a tty", runCommandPassesStdio);
		} else {
			it("runCommand passes stdio for scripts that need a tty", runCommandPassesStdio);
		}

  });
});
