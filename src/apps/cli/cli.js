import cac from 'cac';
import path from 'path';
import pkg from '../../utils/pkg.js';

const cli = cac();

cli.command('run', 'dev').action((options) => {
  const p = path.resolve(path.join(process.cwd(), 'src', 'bin', 'run-dev.sh'));
  shell.chmod('+x', p);
  shell.exec(`${p}`);
});

cli.help();

cli.version(pkg.version);

export default cli;
