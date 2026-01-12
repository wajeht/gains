import { param } from 'express-validator';
import * as VideosQueries from './videos.queries.js';

export const getVideo = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('The video id must not be empty!')
    .isInt()
    .withMessage('The video id must be an ID!')
    .custom(async (value) => {
      const video = await VideosQueries.findVideoById(value);
      if (video.length === 0) throw new Error('Video does not exist!');
    })
    .toInt(),
];
