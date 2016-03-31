var program = require('commander');
var log = require('../utils').log;
var chalk = require('chalk');

// commands
var add = require('./cmd-add');
var init = require('./cmd-init');
var help = require('./cmd-help');

// donejs add
program.command('add <type> [folder]')
  .option('-S, --skip-install')
  .usage(cmdAddUsage())
  .action(function(type, folder, options) {
    log(add(type, folder, options));
  });

// DEPRECATED: donejs init
program.command('init [folder]')
  .option('-S, --skip-install')
  .option('-T, --type [type]')
  .description('Initialize a new DoneJS application in a new folder or the current one')
  .action(function(folder, options) {
    deprecationNotice('donejs init [folder]', 'donejs add app [folder]');
    log(init(folder, options));
  });

// DEPRECATED: donejs plugin
program.command('plugin [folder]')
  .option('-S, --skip-install')
  .description('Initialize a new DoneJS plugin in a new folder or the current one')
  .action(function(folder, opts) {
    deprecationNotice('donejs plugin [folder]', 'donejs add plugin [folder]');
    opts.type = 'plugin';
    log(init(folder, opts));
  });

program.command('help')
  .description('Show all DoneJS commands available for this application')
  .action(function() {
    log(help());
  });

function deprecationNotice(deprecated, instead) {
  console.log();
  console.log(chalk.yellow('DEPRECATION NOTICE:'));
  console.log();
  console.log('     ' + chalk.gray(deprecated) + ' is deprecated');
  console.log();
  console.log('     Use ' + chalk.inverse(instead) + ' instead');
  console.log();
}

function cmdAddUsage() {
  var usage =
    '[options] <type> [folder] \n\n' +
    '  Types: \n\n' +
    '    app,       Initializes a new app\n' +
    '    plugin,    Initializes a new plugin\n' +
    '    generator, Initializes a basic generator';
  return usage;
}

module.exports = program;
