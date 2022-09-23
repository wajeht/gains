import fs from 'fs';
import util from 'util';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Logger from './logger.js';

import cp from 'child_process';
const exec = util.promisify(cp.exec);

const absolutePath = (name) => path.resolve(path.join(process.cwd(), 'src', 'database', 'seeds', 'mock-data', name)); // prettier-ignore
const uploadFolderPath = path.resolve(path.join(process.cwd(), 'src', 'public', 'uploads'));

const tempVideos = {
  squat: {
    video: absolutePath('squat.mp4'),
    screenshot: absolutePath('squat.jpeg'),
  },
  bench: {
    video: absolutePath('bench.mp4'),
    screenshot: absolutePath('bench.jpeg'),
  },
  deadlift: {
    video: absolutePath('deadlift.mp4'),
    screenshot: absolutePath('deadlift.jpeg'),
  },
};

export async function mockUploadVideo(user_id) {
  try {
    console.log(uploadFolderPath);

    const { stdout } = await exec('echo test');
    console.log(stdout);
  } catch (e) {
    Logger.error(e.message);
  }
}

await mockUploadVideo(1);
