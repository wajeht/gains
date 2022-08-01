import ffmpeg from 'fluent-ffmpeg';
import db from '../database/db.js';
import logger from './logger.js';

export function capture(video_path) {
  const folderPath = video_path.slice(0, video_path.lastIndexOf('/'));
  const screenshotName = 'thumbnail-' + video_path.slice(video_path.lastIndexOf('/') + 1).split('.')[0] + '.jpeg'; // prettier-ignore
  return new Promise((resolve, reject) => {
    ffmpeg(video_path)
      .noAudio()
      .noVideo()
      .screenshot({
        timestamps: ['00:00:00.000'], // hh:mm:ss.xxx
        folder: folderPath,
        filename: screenshotName,
        // filename: 'thumbnail-%f.jpeg',
      })
      .on('error', (err) => {
        logger.info(`An error occurred while generating screenshot! ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        logger.info(`Screenshot generation finished!!`);
        resolve({
          screenshot_url: (folderPath + '/' + screenshotName).split('public')[1],
          screenshot_path: folderPath + '/' + screenshotName,
        });
      });
  });
}
