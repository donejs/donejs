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

  it('when type is "app", runs binary with the right args', function() {
    var folder = 'my-awesome-app';

    return add('app', [folder], {})
      .then(function() {
        assert.deepEqual(binaryArgs[0], ['init', folder]);
      });
  });

  it('when type is "plugin", runs binary with the right args', function() {
    var folder = 'my-awesome-app';

    return add('plugin', [folder], {})
      .then(function() {
        assert.deepEqual(binaryArgs[0], ['init', folder]);
        assert.deepEqual(binaryArgs[1].type, 'plugin');
      });
  });

  it('when type is "generator", runs binary with the right args', function() {
    var name = 'donejs-jshint';

    return add('generator', [name], {})
      .then(function() {
        assert.deepEqual(binaryArgs[0], ['init', name]);
        assert.deepEqual(binaryArgs[1].type, 'generator');
      });
  });

  it('calls the "donejs-cli add" for other [type] values', function() {
    return add('component', ['my-component', '0.0.1'], {})
      .then(function() {
        assert.deepEqual(binaryArgs[0], ['add', 'my-component', '0.0.1']);
      });
  });
});
