var Q = require('q');
var assert = require('assert');
var mockery = require('mockery');

describe('cli help cmd', function() {
  var help;
  var binaryArgs;
  var cmdHelpPath = '../lib/cli/cmd-help';

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerAllowable(cmdHelpPath);

    mockery.registerMock('./run-binary', function(args) {
      binaryArgs = args;
      return Q(true);
    });

    help = require(cmdHelpPath);
  });

  afterEach(function() {
    mockery.disable();
    mockery.deregisterAll();
  });

  it('runs binary with --help', function(done) {
    help()
      .then(function() {
        assert.deepEqual(binaryArgs, ['--help']);
        done();
      })
      .catch(done);
  });
});
