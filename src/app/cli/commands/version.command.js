import pkg from '../../../utils/pkg.js';
import Logger from '../../../utils/logger.js';

export default function version(_args) {
  try {
    console.log(`\n Gains v${pkg.version} \n`);
    process.exit(0);
  } catch (e) {
    Logger.error(e.message);
    process.exit(1);
  }
}
