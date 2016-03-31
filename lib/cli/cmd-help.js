var runBinary = require('./run-binary');

module.exports = function() {
  return runBinary(['--help']);
};
