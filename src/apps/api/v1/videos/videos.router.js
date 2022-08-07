import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as VideosController from './videos.controller.js';
import * as VideosValidation from './videos.validation.js';

import express from 'express';
const videos = express.Router();

/**
 * GET /api/v1/videos/{vid}
 * @tags videos
 * @summary get details of a video
 * @param {number} vid.form.required - the video id - application/x-www-form-urlencoded
 */
videos.get(
  '/:vid',
  validator(VideosValidation.getVideo),
  catchAsyncErrors(VideosController.getVideo),
);

export default videos;
