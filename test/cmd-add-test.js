var Q = require('q');
var assert = require('assert');
var mockery = require('mockery');

describe('cmd add test', function() {
  var add;
  var binaryArgs;
  var cmdInitArgs;

  beforeEach(function() {
    cmdInitArgs = {};
    var cmdAddPath = '../lib/cli/cmd-add';

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerAllowable(cmdAddPath);

    mockery.registerMock('./cmd-init', function() {
      cmdInitArgs.folder = arguments[0];
      cmdInitArgs.options = arguments[1];
      return Q(true);
    });

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

  it('when type is "app", runs init command with the right args', function() {
    var folder = 'my-awesome-app';

    return add('app', [folder], {})
      .then(function() {
        assert.equal(cmdInitArgs.folder, folder);
        assert.deepEqual(cmdInitArgs.options, {});
      });
  });

  it('when type is "plugin", runs init command with the right args', function() {
    var folder = 'my-awesome-app';

    return add('plugin', [folder], {})
      .then(function() {
        assert.equal(cmdInitArgs.folder, folder);
        assert.equal(cmdInitArgs.options.type, 'plugin');
      });
  });

  it('when type is "generator", runs binary with the right args', function() {
    var name = 'donejs-jshint';

    return add('generator', [name], {})
      .then(function() {
        assert.equal(cmdInitArgs.folder, name);
        assert.equal(cmdInitArgs.options.type, 'generator');
      });
  });

  it('calls the "donejs-cli add" for other [type] values', function() {
    return add('component', ['my-component', '0.0.1'], {})
      .then(function() {
        assert.deepEqual(
          binaryArgs[0],
          ['add', 'component', 'my-component', '0.0.1']
        );
      });
  });
});
