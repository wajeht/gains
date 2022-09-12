import * as UsersQueries from '../../api/v1/users/users.queries.js';
import * as CacheQueries from '../../api/v1/cache/cache.queries.js';
import Logger from '../../../utils/logger.js';
import axios from '../../../utils/axios.cli.js';

// gains users --restore-data --user-id=1 --prod
// gains users --clear-cache --user-id=1 --prod
// gains users --disable --user-id=1 --prod
// gains users --enable --user-id=1 --prod

async function restoreData(user_id, prod = false) {
  try {
    // Logger.info(`restoreData(), user_id: ${user_id}, prod: ${prod}`);

    if (prod) {
      const data = await (await axios.post(`/api/v1/users/${user_id}/restore-data`)).data;
      // console.log(data.data);
      Logger.info(`All training data of User ID: ${user_id} has been restore!`);
      process.exit(0);
    }

    const data = await UsersQueries.restoreUserData(user_id);
    Logger.info(`All training data of User ID: ${user_id} has been restore!`);

    process.exit(0);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

async function clearCache(user_id, prod = false) {
  try {
    // Logger.info(`clearCache(), user_id: ${user_id}, prod: ${prod}`);
    if (prod) {
      const cache = await (await axios.post(`/api/v1/cache//user/${user_id}`)).data;
      // console.log(cache.data);
      Logger.info(`All cache data of User ID: ${user_id} was cleared!`);
      process.exit(0);
    }

    const cache = await UsersQueries.restoreUserData(user_id);
    Logger.info(`All cache data of User ID: ${user_id} was cleared!`);

    process.exit(0);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

async function enable(user_id, prod = false) {
  try {
    // Logger.info(`enable(), user_id: ${user_id}, prod: ${prod}`);
    if (prod) {
      const user = await (await axios.post(`/api/v1/users/${user_id}/restore-user`)).data;
      // console.log(user.data);
      Logger.info(`User ID: ${user_id}, user has been restore!`);
      process.exit(0);
    }

    const user = await UsersQueries.postRestoreUser(user_id);
    Logger.info(`User ID: ${user_id}, user has been restore!`);

    process.exit(0);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

async function disable(user_id, prod = false) {
  try {
    // Logger.info(`enable(), user_id: ${user_id}, prod: ${prod}`);
    if (prod) {
      const user = await (await axios.delete(`/api/v1/users/${user_id}`)).data;
      // console.log(user.data);
      Logger.info(`User ID: ${user_id}, user has been deleted!`);
      process.exit(0);
    }

    const user = await UsersQueries.deleteUser(user_id);
    Logger.info(`User ID: ${user_id}, user has been deleted!`);

    process.exit(0);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

export default async function users(args) {
  try {
    // example commands ===>    gains users --enable
    // args ===>                { _: [ 'users' ], enable: true }
    // Object.keys(args) ===>   [ '_', 'enable' ]

    const ACTIONS = ['restore-data', 'disable', 'enable', 'clear-cache'];
    const action = Object.keys(args)[1];

    // check if the actions include some of the available commands
    const isValidActions = ACTIONS.some((a) => a === Object.keys(args)[1]);
    if (!isValidActions) throw new Error(`Action commands should be any of ${ACTIONS.join(', ')}!`);

    const user_id = args['user-id'];
    const prod = args.prod;
    let user;

    // check for null and valid type
    if (user_id === null) throw new Error('user-id must not be null!');
    if (typeof user_id !== 'number') throw new Error('user-id must be a number!');

    // check if it was validity of user_id
    // prod
    if (prod) {
      Logger.warn('--prod was given, Running for production database!');
      [user] = await (await axios.get(`/api/v1/users/${user_id}`)).data.data;
      // Logger.info(`User ID: ${user_id} is a valid user!`);
    }
    // dev
    else {
      [user] = await UsersQueries.findUserById(user_id);
      if (user === null || user === undefined) throw new Error(`user-id ${user_id} does not exit!`);
    }

    switch (action) {
      case 'restore-data':
        await restoreData(user_id, prod);
        break;

      case 'clear-cache':
        await clearCache(user_id, prod);
        break;

      case 'enable':
        await enable(user_id, prod);
        break;

      case 'disable':
        await disable(user_id, prod);
        break;

      default:
        throw new Error(`Action commands should be any of ${ACTIONS.join(', ')}!`);
        break;
    }

    // success code
    process.exit(0);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}
