var program = require('commander');
var Q = require('q');
var log = require('../utils').log;
var runBinary = require('./run-binary');

// commands
var add = require('./cmd-add');
var help = require('./cmd-help');
var upgrade = require('./cmd-upgrade');

program.version(require('../../package.json').version);

// donejs add
program.command('add <type> [params...]')
  .option('-S, --skip-install')
  .option('-Y, --yes', 'Use only defaults and not prompt for any option')
  .usage(cmdAddUsage())
  .action(function(type, params, options) {
    log(add(type, params, options));
  });

program.command('upgrade [version]')
  .description('Upgrade the current project to the latest DoneJS version')
  .option('--no-canmigrate', 'Skip running can-migrate')
  .action(function(version, options) {
    log(upgrade(version, options));
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

function cmdAddUsage() {
  var usage =
    '[options] app [folder] \n' +
    '\t add [options] plugin [folder] \n' +
    '\t add [options] generator [name] \n' +
    '\t add [options] <name> [params...] \n\n' +
    '  Types: \n\n' +
    '    app,       Initializes a new app\n' +
    '    plugin,    Initializes a new plugin\n' +
    '    generator, Initializes a basic generator\n' +
    '    <name>,    Runs built-in or third party donejs generators';
  return usage;
}

module.exports = program;
