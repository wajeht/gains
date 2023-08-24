import Logger from '../../../utils/logger.js';
import axios from '../../../utils/axios.cli.js';

export default async function checkProd() {
  try {
    const auth = await axios.get('/api/v1/users/check-authentication');
    Logger.info(`Authentication valid!`);
    console.log(auth.data);

    process.exit(0);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}
