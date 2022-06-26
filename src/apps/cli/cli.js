import cac from 'cac';
import fs from 'fs';
import { exec } from 'child_process';
import shell from 'shelljs';
import cp from 'child_process';
import path from 'path';

let pkg = fs.readFileSync(path.resolve(path.join(process.cwd(), 'package.json')), 'utf-8');
pkg = JSON.parse(pkg);

const cli = cac();

cli.command('run', 'dev').action((options) => {
  const p = path.resolve(path.join(process.cwd(), 'src', 'bin', 'run-dev.sh'));
  shell.chmod('+x', p);
  shell.exec(`${p}`);
});

cli.help();

cli.version(pkg.version);

export default cli;
