var program = require('commander');
var log = require('../utils').log;

// commands
var init = require('./cmd-init');
var help = require('./cmd-help');

// donejs init
program.command('init [folder]')
  .option('-S, --skip-install')
  .option('-T, --type [type]')
  .description('Initialize a new DoneJS application in a new folder or the current one')
  .action(function(folder, options) {
    log(init(folder, options));
  });

// DoneJS plugin
program.command('plugin [folder]')
  .option('-S, --skip-install')
  .description('Initialize a new DoneJS plugin in a new folder or the current one')
  .action(function(folder, opts) {
    opts.type = 'plugin';
    log(init(folder, opts));
  });

program.command('help')
  .description('Show all DoneJS commands available for this application')
  .action(function() {
    log(help());
  });

module.exports = program;
