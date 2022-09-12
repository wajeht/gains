import * as UsersQueries from '../../api/v1/users/users.queries.js';
import Logger from '../../../utils/logger.js';
import axios from '../../../utils/axios.cli.js';

// gains users --restore-data --user-id=1 --prod
// gains users --disable --user-id=1 --prod
// gains users --enable --user-id=1 --prod
// gains users --clear-cache --user-id=1 --prod

async function restoreData(args) {
  const user_id = args['user-id'];
  const prod = args.prod;
  Logger.info('restoreData()');
  process.exit(0);
}

async function clearCache(args) {
  const user_id = args['user-id'];
  const prod = args.prod;
  Logger.info('clearCache()');
  process.exit(0);
}

async function enable(args) {
  const user_id = args['user-id'];
  const prod = args.prod;
  Logger.info('enable()');
  process.exit(0);
}

async function disable(args) {
  const user_id = args['user-id'];
  const prod = args.prod;
  Logger.info('disable()');
  process.exit(0);
}

const ACTIONS = ['restore-data', 'disable', 'enable', 'clear-cache'];

export default async function users(args) {
  try {
    const action = args._[1];

    if (!ACTIONS.includes(action)) {
      throw new Error(`Action commands should be any of ${ACTIONS.join(', ')}!`);
    }

    switch (action) {
      case 'restore-data':
        restoreData(args);
        break;

      case 'clear-cache':
        clearCache(args);
        break;

      case 'enable':
        enable(args);
        break;

      case 'disable':
        disable(args);
        break;

      default:
        throw new Error(`Action commands should be any of ${ACTIONS.join(', ')}!`);
        break;
    }

    // success code
    process.exit(0);
  } catch (e) {
    Logger.error(e.message);
    process.exit(1);
  }
}
