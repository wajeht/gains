#! /usr/bin/env node

import pkg from '../../utils/pkg.js';
import minimist from 'minimist';

const cli = minimist(process.argv.slice(2));

console.log(cli._);

export default cli;
