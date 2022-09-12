import * as UsersQueries from '../../api/v1/users/users.queries.js';
import Logger from '../../../utils/logger.js';
import axios from '../../../utils/axios.cli.js';

// usage: gains restore-data --user-id=1 --prod
// notes: --prod is optional, without --prod, we will
//        operate local dev environment
export default async function restoreData(args) {
  try {
    const user_id = args['user-id'];
    const prod = args.prod;

    // check for null
    if (user_id === null) throw new Error('user-id must not be null!');

    // check type
    if (typeof user_id !== 'number') throw new Error('user-id must be a number!');

    // prod command
    // -------------------------- prod ---------------------------------
    if (prod === true) {
      const restore = await axios.post(`/api/v1/users/${user_id}/restore-data`);
      console.log(restore.data);
      process.exit(0);
    }

    // -------------------------- dev ---------------------------------

    // check if it was valid user
    const [user] = await UsersQueries.findUserById(user_id);
    if (user === null || user === undefined) throw new Error(`user-id ${user_id} does not exit!`);

    const restore = await UsersQueries.restoreUserData(user_id);

    Logger.info(`User id ${user_id} has restore all of their data!`);

    // success code
    process.exit(0);
  } catch (e) {
    Logger.error(e.message);
    process.exit(1);
  }
}
