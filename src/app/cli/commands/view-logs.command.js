import Logger from '../../../utils/logger.js';
import dayjs from 'dayjs';
import axios from '../../../utils/axios.cli.js';

function transformData(logs) {
  if (logs.length === 0) {
    return [];
  }

  const data = [];

  for (const l of logs) {
    if (l.length) {
      const obj = JSON.parse(l);
      delete obj.hostname;
      obj.time = dayjs(obj.time).format('YYYY/DD/MM hh:MM:ss a');
      delete obj.pid;
      delete obj.length;

      if (Object.keys(obj).length != 3) {
        const e = [];
        for (const o in obj) {
          if (o !== 'level' && o !== 'time' && !o !== 'msg') {
            e.push(obj[o]);
            delete obj[o];
          }
        }
        obj['msg'] = e.toString();
        data.push(obj);
      } else {
        data.push(obj);
      }
    }
  }

  return data;
}

async function grabOldest({ listOf, prod }) {
  try {
    if (prod) {
      let logs = await (await axios.get(`/api/admin/view-logs?latest=${listOf}`)).data.data;
      logs = transformData(logs);
      console.table(logs);
      process.exit(0);
    }

    console.log('grabOldest() function has not implemented for dev yet!');

    process.exit(0);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

async function grabLatest({ listOf, prod }) {
  try {
    if (prod) {
      let logs = await (await axios.get(`/api/admin/view-logs?latest=-${listOf}`)).data.data;
      logs = transformData(logs);
      console.table(logs);
      process.exit(0);
    }

    console.log('grabLatest() function has not implemented for dev yet!');
    process.exit(0);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

async function validate({ ...args }) {
  try {
    const { listOf } = args;

    if (typeof listOf !== 'number') {
      throw new Error('List of must be a number!');
    }
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

// gains view-logs --latest --list-of=4
// gains view-logs --oldest --list-of=4
export default async function viewLogs({ ...args }) {
  try {
    const ACTIONS = ['oldest', 'latest', 'list-of', 'prod'];
    const action = Object.keys(args)[1];

    // check if the actions include some of the available commands
    const isValidActions = ACTIONS.some((a) => a === Object.keys(args)[1]);
    if (!isValidActions) throw new Error(`Action commands should be any of ${ACTIONS.join(', ')}!`);

    const listOf = args['list-of'];
    // const oldest = args.oldest;
    // const latest = args.latest;
    const prod = args.prod;

    if (prod) Logger.warn('--prod was given, Running for production database!');

    switch (action) {
      case 'oldest':
        await validate({ listOf });
        await grabOldest({ listOf, prod });
        break;

      case 'latest':
        await validate({ listOf });
        await grabLatest({ listOf, prod });
        break;

      default:
        throw new Error(`Action commands should be any of ${ACTIONS.join(', ')}!`);
    }

    // success code
    process.exit(0);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}
