import Logger from '../../../utils/logger.js';
import pkg from '../../../utils/pkg.js';

const HELP = `

Gains v${pkg.version}
  All in one tools to help strength athletes load the right amount of training dosage!

USAGE:
  gains <COMMANDS> [FLAGS] <PARAMS>

EXAMPLES:
  gains -v
  gains --help
  gains users --clear-cache --user-id=1 --prod
  gains users --restore-data --user-id=1

COMMANDS:
  users       list of users actions
  help        how to use gains cli
  version     gains version information

users:
  --enable --user-id=<user id> (optional --prod)
  --disable --user-id=<user id> (optional --prod)
  --clear-cache --user-id=<user id> (optional --prod)
  --restore-data --user-id=<user id> (optional --prod)
  --add --email=<email address> (optional: --verify)
`;

export default function help(args) {
  try {
    console.log(HELP);
    process.exit(0);
  } catch (e) {
    Logger.error(e.message);
    process.exit(1);
  }
}
