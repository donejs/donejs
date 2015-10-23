var assert = require('assert');
var path = require('path');
var fs = require('fs');
var utils = require('../lib/utils');

function fail(error) {
  console.error(error.stack);
  throw error;
}

describe('DoneJS CLI tests', function() {
  describe('utils', function() {
    it('mkdir recursively', function(done) {
      var myPath = 'test/recursive/path';

      utils.mkdirp(myPath).then(function(name) {
        assert.equal(path.join(process.cwd(), myPath), name);
        fs.exists(name, function(exists) {
          assert.ok(exists);
          done();
        });
      });
    });

    it('get project root', function(done) {
        var pathFromTest = path.join(process.cwd(), 'node_modules');
        utils.projectRoot().then(function(p) {
            assert.equal(path.join(p, 'node_modules'), pathFromTest);
            done();
        })
        .fail(fail);
    });
  });
});
