var program = require('commander');
var Q = require('q');
var log = require('../utils').log;
var runBinary = require('./run-binary');

// commands
var add = require('./cmd-add');
var help = require('./cmd-help');

program.version(require('../../package.json').version);

// donejs new
program.command('new <type> [params...]')
  .option('-S, --skip-install')
  .usage(cmdAddNewUsage('new'))
  .action(function(type, params, options) {
    log(add(type, params, options));
  });

// donejs add
program.command('add <type> [params...]')
  .option('-S, --skip-install')
  .usage(cmdAddNewUsage('add'))
  .action(function(type, params, options) {
    log(add(type, params, options));
  });

program.command('help')
  .description('Show all DoneJS commands available for this application')
  .action(function() {
    log(help().catch(function(e) {
      var msg = e.message + '\n' + program.helpInformation();
      return Q.reject(new Error(msg));
    }));
  });

// donejs <anything else>
program.command('*')
  .description('Run DoneJS commands using the current DoneJS application')
  .action(function() {
    runBinary(program.rawArgs.slice(2));
  });

function cmdAddNewUsage(cmd) {
  var usage =
    '[options] app [folder] \n' +
    '\t ' + cmd + ' [options] plugin [folder] \n' +
    '\t ' + cmd + ' [options] generator [name] \n' +
    '\t ' + cmd + ' [options] <name> [params...] \n\n' +
    '  Types: \n\n' +
    '    app,       Initializes a new app\n' +
    '    plugin,    Initializes a new plugin\n' +
    '    generator, Initializes a basic generator\n' +
    '    <name>,    Runs built-in or third party donejs generators';
  return usage;
}

module.exports = program;
