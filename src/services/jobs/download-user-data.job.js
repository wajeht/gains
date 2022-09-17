// import Queue from 'bull';
// let maxJobsPerWorker = 50;
// const q = new Queue('download-user-data');

import fs from 'fs';
import path, { resolve } from 'path';
import util from 'util';

import Chad from '../../utils/chad.js';
import Logger from '../../utils/logger.js';
import db from '../../database/db.js';
import { sleep } from '../../utils/helpers.js';

import Papa from 'papaparse';
import dayjs from 'dayjs';
import AdmZip from 'adm-zip';

import * as UsersQueries from '../../apps/api/v1/users/users.queries.js';
import * as SessionsQueries from '../../apps/api/v1/sessions/sessions.queries.js';
import * as ExercisesQueries from '../../apps/api/v1/exercises/exercises.queries.js';
import * as ExerciseCategoriesQueries from '../../apps/api/v1/exercise-categories/exercise-categories.queries.js';
import * as BlocksQueries from '../../apps/api/v1/blocks/blocks.queries.js';
import * as VariablesQUeries from '../../apps/api/v1/variables/variables.queries.js';
import * as SetsQueries from '../../apps/api/v1/sets/sets.queries.js';
import * as LogsQueries from '../../apps/api/v1/logs/logs.queries.js';
import EmailService from '../email.service.js';

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const rm = util.promisify(fs.rm);

const DATE_TIME = dayjs().format('YYYY-MM-DD-HH-mm-ss-A');
const TEMP_FOLDER = path.resolve(path.join(process.cwd(), 'src', 'temp'));

/**
 * It returns an object with a bunch of properties that are all related to the user's folder
 * @param user_id - The user id of the user who is currently logged in.
 * @returns An object with the following properties:
 *   tempFolder: The path to the temp folder
 *   rootFolderPath: The path to the root folder
 *   userFolderName: The name of the user folder
 *   userFolderPath: The path to the user folder
 *   filePathWithJSONExtension: A function that returns the path to a file with a .csv extension
 */
function useUserFolder(user_id) {
  const userFolderName = `${DATE_TIME}-user-id-${user_id}`;
  const userFolderPath = `${TEMP_FOLDER}/${userFolderName}`;

  const filePathWithJSONExtension = (name) => {
    return `${userFolderPath}/${userFolderName}-${name}.csv`;
  };

  return {
    tempFolder: TEMP_FOLDER,
    rootFolderPath: path.resolve(path.join(process.cwd(), 'src', 'temp')),
    userFolderName,
    userFolderPath,
    filePathWithJSONExtension,
  };
}

/**
 * It takes in a userId, tableName, and data, and then creates a folder with the userId as the name,
 * and then creates a csv file with the tableName as the name, and then writes the data to the csv file
 * @param userId - The user's id
 * @param tableName - The name of the table you want to export.
 * @param data - The data to be written to the file.
 */
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

/**
 * It gets all the data from the database for a user, and then writes it to a CSV file
 * @param user_id - the user's id
 */
async function generateCSVFiles(user_id) {
  try {
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

    return result;
  } catch (e) {
    Logger.error(e.message);
    throw new Error(e.message);
  }
}

async function zipFiles({ userFolderPath, filePaths }) {
  try {
    const zipName = `${userFolderPath}.zip`;

    const zip = new AdmZip();

    filePaths.forEach((fp) => {
      zip.addLocalFile(fp);
    });

    await zip.writeZipPromise(zipName);

    return zipName;
  } catch (e) {
    Logger.error(e.message);
    throw new Error(e.message);
  }
}

/**
 * It generates CSV files for the user's data, zips them, sends an email to the user with the zipped
 * files, and then deletes the zipped files
 * @param user_id - The user id of the user you want to download the data for.
 */
export async function downloadUserData(user_id) {
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

    await EmailService.send({
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

    process.exit(0);
  } catch (e) {
    Logger.error(e.message);
    throw new Error(e.message);
  }
}
