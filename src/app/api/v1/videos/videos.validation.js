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
      const user = await VideosQueries.findVideoById(value);
      if (user.length === 0) throw new Error('Video does not exist!');
    })
    .toInt(),
];

export const getStreamVideo = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('The video id must not be empty!')
    .isInt()
    .withMessage('The video id must be an ID!')
    .custom(async (value) => {
      const user = await VideosQueries.findVideoById(value);
      if (user.length === 0) throw new Error('Video does not exist!');
    })
    .toInt(),
];

export const getDownloadVideo = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('The video id must not be empty!')
    .isInt()
    .withMessage('The video id must be an ID!')
    .custom(async (value) => {
      const user = await VideosQueries.findVideoById(value);
      if (user.length === 0) throw new Error('Video does not exist!');
    })
    .toInt(),
];
