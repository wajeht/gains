import { copyFile } from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import logger from './logger.js';

const buildAbsolutePath = (name) => path.resolve(path.join(process.cwd(), 'src', 'database', 'seeds', 'mock-data', name)); // prettier-ignore
const UPLOAD_FOLDER_PATH = path.resolve(path.join(process.cwd(), 'src', 'public', 'uploads'));

const tempVideos = {
  squat: {
    video: buildAbsolutePath('squat.mp4'),
    screenshot: buildAbsolutePath('squat.jpeg'),
  },
  bench: {
    video: buildAbsolutePath('bench.mp4'),
    screenshot: buildAbsolutePath('bench.jpeg'),
  },
  deadlift: {
    video: buildAbsolutePath('deadlift.mp4'),
    screenshot: buildAbsolutePath('deadlift.jpeg'),
  },
};

export default async function copyMockVideos() {
  try {
    const results = {};

    for (const video in tempVideos) {
      const currentVideo = tempVideos[video];
      const uuid = uuidv4();
      const ext = (type) => currentVideo[type].split('.')[1];

      // build map of files to copy
      results[video] = {
        video: `${UPLOAD_FOLDER_PATH}/${uuid}-${video}.${ext('video')}`,
        screenshot: `${UPLOAD_FOLDER_PATH}/${uuid}-${video}.${ext('screenshot')}`,
      };

      // console.log(video); // squat, bench , deadlift
      // console.log(currentVideo); // { video: ...., screenshot: ....} { video: ...., screenshot: ....}

      for (const file in currentVideo) {
        const from = currentVideo[file];
        // console.log(from); // /Users/jaw/dev/gains/src/database/....
        // console.log(file); // video, screenshot, video, screenshot

        const to = results[video][file];

        await copyFile(from, to);
        logger.info(
          `Copied ${from.split('/').slice(-1)} as ${to
            .split('/')
            .slice(-1)} to ${UPLOAD_FOLDER_PATH}`,
        );
      }
    }

    return results;
  } catch (e) {
    logger.error(e.message);
  }
}
