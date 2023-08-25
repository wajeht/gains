import fs from 'fs';
import path from 'path';
import util from 'util';

import Logger from '../../utils/logger.js';
import { sleep } from '../../utils/helpers.js';
import { REDIS } from '../../config/env.js';

import Bull, { Job } from 'bull';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import AdmZip from 'adm-zip';

import * as UsersQueries from '../../app/api/v1/users/users.queries.js';
import * as SessionsQueries from '../../app/api/v1/sessions/sessions.queries.js';
import * as ExercisesQueries from '../../app/api/v1/exercises/exercises.queries.js';
import * as ExerciseCategoriesQueries from '../../app/api/v1/exercise-categories/exercise-categories.queries.js';
import * as BlocksQueries from '../../app/api/v1/blocks/blocks.queries.js';
import * as VariablesQUeries from '../../app/api/v1/variables/variables.queries.js';
import * as SetsQueries from '../../app/api/v1/sets/sets.queries.js';
import * as LogsQueries from '../../app/api/v1/logs/logs.queries.js';
import EmailService from '../email.service.js';

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const rm = util.promisify(fs.rm);

const DATE_TIME = dayjs().format('YYYY-MM-DD-HH-mm-ss-A');
const TEMP_FOLDER = path.resolve(path.join(process.cwd(), 'src', 'storage', 'temp'));

function useUserFolder(user_id) {
  const userFolderName = `${DATE_TIME}-user-id-${user_id}`;
  const userFolderPath = `${TEMP_FOLDER}/${userFolderName}`;

  const filePathWithJSONExtension = (name) => {
    return `${userFolderPath}/${userFolderName}-${name}.csv`;
  };

  return {
    tempFolder: TEMP_FOLDER,
    rootFolderPath: path.resolve(path.join(process.cwd(), 'src', 'storage', 'temp')),
    userFolderName,
    userFolderPath,
    filePathWithJSONExtension,
  };
}

async function writeToFile(userId, tableName, data) {
  try {
    const { filePathWithJSONExtension, userFolderPath, userFolderName } = useUserFolder(userId);

    const createFolder = await mkdir(userFolderPath, { recursive: true });
    Logger.info(`Generated '${userFolderName}' folder user id: ${userId}!`);

    const file = await writeFile(filePathWithJSONExtension(tableName), Papa.unparse(data));
    const temp = filePathWithJSONExtension(tableName).split('/').splice(-1).toString();
    Logger.info(`Generated csv from user's '${tableName}' data to '${temp}'!`);

    return filePathWithJSONExtension(tableName);
  } catch (e) {
    Logger.error(e.message);
    throw new Error(e.message);
  }
}

async function generateCSVFiles(user_id) {
  try {
    Logger.info(`Generating CSV process started!`);

    const { userFolderPath } = useUserFolder(user_id);
    const result = {
      userFolderPath,
      filePaths: [],
    };

    // user's sessions
    const usersSessions = await SessionsQueries.getSessionsByUserId(user_id);
    result.filePaths.push(await writeToFile(user_id, 'sessions', usersSessions.data));

    // user's exercise categories
    const userExerciseCategories = await ExerciseCategoriesQueries.getAllExerciseCategoriesByUserId(user_id); // prettier-ignore
    result.filePaths.push(await writeToFile(user_id, 'exercise-categories', userExerciseCategories)) // prettier-ignore

    // user's exercises
    const userExercises = await ExercisesQueries.getExerciseByUserId(user_id);
    result.filePaths.push(await writeToFile(user_id, 'exercises', userExercises));

    // user's blocks
    const userBlocks = await BlocksQueries.getBlocksByUserId(user_id);
    result.filePaths.push(await writeToFile(user_id, 'blocks', userBlocks));

    // user's calories
    const userCalories = await VariablesQUeries.getAllCaloriesOfAUser(user_id);
    result.filePaths.push(await writeToFile(user_id, 'calories', userCalories.data));

    // user's recovery
    const userRecovery = await VariablesQUeries.getRecovery(user_id);
    result.filePaths.push(await writeToFile(user_id, 'recovery', userRecovery.data));

    // user's bodyweight
    const userBodyweight = await VariablesQUeries.getAllBodyweightOfAUser(user_id);
    result.filePaths.push(await writeToFile(user_id, 'bodyweight', userBodyweight.data));

    // user's sets
    const userSets = await SetsQueries.getAllSetsByUserId(user_id);
    result.filePaths.push(await writeToFile(user_id, 'sets', userSets));

    // user's logs
    const userLogs = await LogsQueries.getAllLogsByUserId(user_id);
    result.filePaths.push(await writeToFile(user_id, 'logs', userLogs));

    Logger.info(`Generating CSV process done!`);
    return result;
  } catch (e) {
    Logger.error(e.message);
    throw new Error(e.message);
  }
}

async function zipFiles({ userFolderPath, filePaths }) {
  try {
    Logger.info(`Zipping process started!`);

    const zipName = `${userFolderPath}.zip`;

    const zip = new AdmZip();

    filePaths.forEach((fp) => {
      zip.addLocalFile(fp);
    });

    await zip.writeZipPromise(zipName);

    Logger.info(`Zipping process done!`);
    return zipName;
  } catch (e) {
    Logger.error(e.message);
    throw new Error(e.message);
  }
}

async function downloadUserDataProcess(user_id) {
  try {
    const { filePaths, userFolderPath } = await generateCSVFiles(user_id);
    const zippedPath = await zipFiles({ userFolderPath, filePaths });

    const zippedName = zippedPath.split('/').splice(-1).toString();

    await sleep(500);
    if (fs.existsSync(zippedPath)) {
      await rm(userFolderPath, { recursive: true });
      Logger.info(`Done deleting .csv files after zipping them!`);
    }

    const [user] = await UsersQueries.findUserById(user_id);

    EmailService.send({
      to: user.email,
      subject: 'Your Gains data is ready to download',
      template: 'download-user-data',
      data: {
        username: user.username,
      },
      files: [
        {
          filename: zippedName,
          path: zippedPath,
        },
      ],
    });

    Logger.info(`Download your data email was successfully sent to user id: ${user_id}`);

    await sleep(500);
    if (fs.existsSync(zippedPath)) {
      await rm(zippedPath, { recursive: true });
      Logger.info(`Done deleting .zip files after sending the email!`);
    }
  } catch (e) {
    Logger.error(e.message);
    throw new Error(e.message);
  }
}

// -------------------- que --------------------

const downloadUserDataQue = new Bull('download-user-data', REDIS.url, {
  redis: {
    tls: false,
    enableTLSForSentinelMode: false,
  },
});

downloadUserDataQue.process(async (job) => {
  return await downloadUserDataProcess(job.data.user_id);
});

export default async function InitiateDownloadUserDataJob(user_id) {
  downloadUserDataQue.add({ user_id });
}

// -------------------- que --------------------
