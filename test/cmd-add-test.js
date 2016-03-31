var Q = require('q');
var assert = require('assert');
var mockery = require('mockery');

describe('cmd add test', function() {
  var add;
  var binaryArgs;

  beforeEach(function() {
    var cmdAddPath = '../lib/cli/cmd-add';

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerAllowable(cmdAddPath);

    mockery.registerMock('./run-binary', function() {
      binaryArgs = arguments;
      return Q(true);
    });

    add = require(cmdAddPath);
  });

  afterEach(function() {
    mockery.disable();
    mockery.deregisterAll();
  });

  it('rejects when [type] value is invalid', function(done) {
    var folder;

    add('foo', folder, {})
      .then(function() {
        assert(false, 'should have failed!');
        done();
      })
      .catch(function(err) {
        assert(err.message, 'Invalid [type] value `foo`');
        done();
      });
  });

  it('when type is "app", runs binary with the right args', function() {
    var folder = 'my-awesome-app';

    return add('app', folder, {})
      .then(function() {
        assert.deepEqual(binaryArgs[0], ['init', folder]);
      });
  });

  it('when type is "plugin", runs binary with the right args', function() {
    var folder = 'my-awesome-app';

    return add('plugin', folder, {})
      .then(function() {
        assert.deepEqual(binaryArgs[0], ['init', folder]);
        assert.deepEqual(binaryArgs[1].type, 'plugin');
      });
  });

  it('when type is "generator", runs binary with the right args', function() {
    var name = 'donejs-jshint';

    return add('generator', name, {})
      .then(function() {
        assert.deepEqual(binaryArgs[0], ['init', name]);
        assert.deepEqual(binaryArgs[1].type, 'generator');
      });
  });

});
