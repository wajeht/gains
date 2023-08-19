import ffmpeg from 'fluent-ffmpeg';
import logger from './logger.js';

export function capture(video_path) {
  const folderPath = video_path.slice(0, video_path.lastIndexOf('/'));
  const videoFileName = video_path.split('/').pop().split('.')[0];
  const screenshotName = `thumbnail-${videoFileName}.webp`;
  return new Promise((resolve, reject) => {
    ffmpeg(video_path)
      .noAudio()
      .noVideo()
      .screenshot({
        timestamps: ['00:00:00.000'],
        folder: folderPath,
        filename: screenshotName,
      })
      .on('error', (err) => {
        logger.info(`An error occurred while generating screenshot! ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        logger.info(`Screenshot generation finished!!`);
        const screenshotPath = `${folderPath}/${screenshotName}`;
        resolve({
          screenshot_url: screenshotPath.split('public')[1],
          screenshot_path: screenshotPath,
        });
      });
  });
}
