import * as UsersQueries from '../../api/v1/users/users.queries.js';
import * as CacheQueries from '../../api/v1/cache/cache.queries.js';
import * as AuthQueries from '../../api/auth/auth.queries.js';
import Logger from '../../../utils/logger.js';
import axios from '../../../utils/axios.cli.js';
import { faker } from '@faker-js/faker';
import Password from '../../../utils/password.js';
import crypto from 'crypto';
import { red } from '../../../utils/rainbow-log.js';
import generateDefaultExercises from '../../../utils/generate-default-exercises.js';

// gains users --restore-data --user-id=1 --prod
// gains users --clear-cache --user-id=1 --prod
// gains users --disable --user-id=1 --prod
// gains users --enable --user-id=1 --prod

async function restoreData({ user_id, prod = false }) {
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

async function clearCache({ user_id, prod = false }) {
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

async function enable({ user_id, prod = false }) {
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

async function disable({ user_id, prod = false }) {
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

async function add({ email, prod = false, verify = false, demo = false }) {
  try {
    // Logger.info(`add(), email: ${email}, prod: ${prod}, verify: ${verify}, demo: ${demo}`);

    const plainPassword = faker.internet.password(12, false);
    const hashedPassword = await Password.hash(plainPassword);
    const verificationToken = crypto.randomBytes(64).toString('hex');

    const newUser = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: plainPassword,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      birth_date: faker.date.birthdate(),
      weight: faker.datatype.number(300),
      profile_picture_url: faker.image.abstract(),
    };

    // ---------- prod ----------

    // gains users --add --email=test@domain.com --prod
    if (prod && email && !verify) {
      const user = await (
        await axios.post(`/api/auth/signup`, {
          email: email,
          username: newUser.username,
          password: plainPassword,
        })
      ).data;
      user.data[0].password = plainPassword;
      Logger.info(
        `A new user has been generated with the following credentials, tell them go go verify the email!\n`,
      );
      console.log(user);
      process.exit(0);
    }

    // gains users --add --email=test@domain.com --verify --prod
    if (prod && email && verify) {
      const user = await (
        await axios.post(`/api/auth/signup?verify=true`, {
          email: email,
          username: newUser.username,
          password: plainPassword,
        })
      ).data;
      user.data[0].password = plainPassword;
      Logger.info(
        `A new user has been generated with given email, auto verified and the following credentials!\n`,
      );
      console.log(user);
      process.exit(0);
    }

    // gains users --add --prod --demo --verify
    if (prod && demo && verify && !email) {
      const user = await (
        await axios.post(`/api/auth/signup?verify=true`, {
          email: newUser.email,
          username: newUser.username,
          password: plainPassword,
        })
      ).data;
      user.data[0].password = plainPassword;
      Logger.info(`A new demo user has been generated!\n`);
      console.log(user);
      process.exit(0);
    }

    // ---------- dev ----------

    // gains users --add --demo
    if (demo && !prod && !verify && !email) {
      const [user] = await UsersQueries.createUser(
        {
          email: newUser.email,
          username: newUser.username,
          password: hashedPassword,
        },
        verificationToken,
      );

      const date = new Date();
      const [verified] = await AuthQueries.verifyUser(user.id, date);

      const { email, username, password, ...rest } = newUser;
      const [updated] = await UsersQueries.updateUserById(verified.id, rest);

      const gde = await generateDefaultExercises(updated.id);

      Logger.info(`Generated default exercises for User id ${updated.id}!`);

      Logger.info(`A new demo user has been generated!\n`);
      updated.password = plainPassword;
      console.log(updated);
      process.exit(0);
    }

    Logger.error(`Use the following proper commands!`);
    console.log(`
      $ gains users --add --email=test@domain.com --prod
      $ gains users --add --email=test@domain.com --verify --prod
      $ gains users --add --demo --verify --prod
      $ gains users --add --demo`);
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

async function mockData({ email, user_id, prod = false }) {
  try {
    // Logger.info(`mockData(), email: ${email}, prod: ${prod}, user_id: ${user_id}`);

    if (email && user_id && prod) throw new Error(`You must chose either email or user_id!`);

    // gains users --mock-data --user-id=1 --prod
    if (user_id && prod) {
      throw new Error(`Have not implemented yet!`);
    }

    // gains users --mock-data --email=test@domain.com --prod
    if (email && prod) {
      const data = await axios.post('/api/admin/seed-mock-training-data', { email });
      Logger.info(`Mock training data was generated for email: ${email}!\n`);
      // process.exit(0);
    }
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

async function validate({ ...args }) {
  try {
    const { prod, user_id, email } = args;

    // ---------- prod ----------

    // check if user exist
    if (prod && user_id && !email) {
      const user = await (await axios.get(`/api/v1/users/${user_id}`)).data.data;
      if (!user.length) throw new Error(`User does not exit with id ${user_id}!`);
    }

    // check if user not exist
    if (prod && !email?.exist && !user_id) {
      const user = await (await axios.get(`/api/v1/users?email=${email.email}`)).data.data;
      if (!user.length) throw new Error(`User does not exist with email ${email.email}!`);
    }

    // check if user exist
    if (prod && email?.exist) {
      const user = await (await axios.get(`/api/v1/users?email=${email.email}`)).data.data;
      if (user.length) throw new Error(`User exit with email ${email.email}!`);
    }

    // ---------- dev ----------

    // check if user exist
    if (!prod && user_id) {
      const user_user_id = await UsersQueries.findUserById(user_id);
      if (user_user_id.length === 0) throw new Error(`User does not exit with user_id ${user_id}!`);
    }

    // check if user not exist
    if (!prod && !email?.exist && !user_id) {
      const user_email = await UsersQueries.findUserByParam({ email: email.email });
      if (user_email.length) throw new Error(`User exit with email ${email.email}!`);
    }
  } catch (e) {
    Logger.error(e?.response?.data ?? e.message);
    process.exit(1);
  }
}

export default async function users({ ...args }) {
  try {
    // example commands ===>    gains users --enable
    // args ===>                { _: [ 'users' ], enable: true }
    // Object.keys(args) ===>   [ '_', 'enable' ]

    const ACTIONS = ['restore-data', 'disable', 'enable', 'clear-cache', 'add', 'mock-data'];
    const action = Object.keys(args)[1];

    // check if the actions include some of the available commands
    const isValidActions = ACTIONS.some((a) => a === Object.keys(args)[1]);
    if (!isValidActions) throw new Error(`Action commands should be any of ${ACTIONS.join(', ')}!`);

    const user_id = args['user-id'];
    const email = args.email;
    const verify = args.verify;
    const prod = args.prod;
    const demo = args.demo;

    if (prod) Logger.warn('--prod was given, Running for production database!');

    switch (action) {
      case 'add':
        await validate({ email: { exist: true, email }, prod });
        await add({ email, verify, prod, demo });
        break;

      case 'mock-data':
        await validate({ email: { exist: false, email }, user_id, prod });
        await mockData({ email, user_id, prod });
        break;

      case 'restore-data':
        await validate({ user_id, prod });
        await restoreData({ user_id, prod });
        break;

      case 'clear-cache':
        await validate({ user_id, prod });
        await clearCache({ user_id, prod });
        break;

      case 'enable':
        await validate({ user_id, prod });
        await enable({ user_id, prod });
        break;

      case 'disable':
        await validate({ user_id, prod });
        await disable({ user_id, prod });
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
