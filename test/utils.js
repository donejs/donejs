var assert = require('assert');
var path = require('path');
var fs = require('fs');
var utils = require('../lib/utils');

describe('DoneJS CLI tests', function() {
  describe('utils', function() {
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

    it('spawns successfully', function(done) {
      utils.spawn('npm', ['run', 'verify'], {}).then(function(child) {
        assert.equal(child.exitCode, 0);
        done();
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
  });
});
