#! /usr/bin/env node

import minimist from 'minimist';
import commands from './commands/commands.js';

const args = minimist(process.argv.slice(2));
let cmd = args._[0];

// -v or --version
// example: gains -v
// example: gains --version
if (args.v || args.version) cmd = 'version';

// -h or --help
// example: gains -h
// example: gains --help
if (args.h || args.help) cmd = 'help';

switch (cmd) {
  case 'restore-data':
    commands.restoreData(args);
    break;

  case 'version':
    commands.version(args);
    break;

  case 'users':
    commands.users(args);
    break;

  case 'help':
    commands.help(args);
    break;

  default:
    commands.help(args);
    break;
}
