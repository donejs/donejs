var Q = require('q');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var utils = require('../lib/utils');

describe('utils tests', function() {
  it('mkdir recursively', function(done) {
    var myPath = path.join('test', 'recursive', 'path');

    utils.mkdirp(myPath).then(function(name) {
      assert.equal(path.join(process.cwd(), myPath), name);
      fs.exists(name, function(exists) {
        assert.ok(exists);
        done();
      });
    });
  });

  it('mkdirp returns cwd if folder is not provided', function() {
    return utils.mkdirp()
      .then(function(folderPath) {
        assert.equal(folderPath, process.cwd());
      });
  });
  
  it('mkdirp ignores scoped project name', function() {
    // windows path.sep is '\'
    // *nix systems path.sep is '/'
    return utils.mkdirp(path.join('@bitovi', 'test'))
      .then(function(folderPath) {
        assert.equal(folderPath, path.join(process.cwd(), 'test'));
      });
  });

  it('spawns successfully', function(done) {
    var cwd = path.join(__dirname, '..');

    utils.spawn('npm', ['run', 'verify'], { cwd: cwd })
      .then(function(child) {
        assert.equal(child.exitCode, 0);
        done();
      })
      .catch(done);
  });

  it('spawns rejects if cannot execute command', function(done) {
    var cwd = path.join(__dirname, '..');

    utils.spawn('npm', ['run', 'invalid-script'], { cwd: cwd })
      .then(function() {
        assert(false, 'should reject promise');
        done();
      })
      .catch(function(err) {
        assert.equal(err.message, 'Command `npm` did not complete successfully');
        done();
      });
  });

  describe('utils.log', function() {
    var _exit;
    var exitCode;

    beforeEach(function() {
      _exit = process.exit;

      Object.defineProperty(process, 'exit', {
        value: function(code) {
          exitCode = code;
        }
      });
    });

    afterEach(function() {
      Object.defineProperty(process, 'exit', { value: _exit });
    });

    it('ends process successfully if promise resolves', function() {
      return utils.log(Q(true))
        .then(function() {
          assert.equal(exitCode, 0);
        });
    });

    it('ends process with error if promise rejects', function(done) {
      utils.log(Q.reject(new Error('foobar')))
        .finally(function() {
          assert.equal(exitCode, 1);
          done();
        });
    });
  });

  describe('project root', function() {
    it('get project root when it is current folder', function(done) {
        var pathFromTest = process.cwd();
        utils.projectRoot().then(function(p) {
            assert.equal(p, pathFromTest);
            done();
        })
        .fail(done);
    });

    it('return cwd when there is no package.json anywhere', function(done) {
        var oldCwd = process.cwd();
        var newCwd = path.join(process.cwd(), '..');

        process.chdir(newCwd);

        utils.projectRoot().then(function(p) {
            assert.equal(p, newCwd);
            process.chdir(oldCwd);
            done();
        })
        .fail(done);
    });
  });

  describe('versionRange', function() {
    it('gives a semver range compatible with given version', function(){
      assert.equal(utils.versionRange("0.5"), "0.x");
      assert.equal(utils.versionRange("0.5.1"), "0.5.x");
      assert.equal(utils.versionRange("0.5.1-beta.1"), "0.5.1-beta.x");
      assert.equal(utils.versionRange("0.5.0-pre.0"), "^0.5.0-pre.0");
      assert.equal(utils.versionRange("1.0.0-alpha.0"), "^1.0.0-alpha.0");
    });
  });
});
