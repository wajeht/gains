import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as VideosController from './videos.controller.js';
import * as VideosValidation from './videos.validation.js';

import express from 'express';
const videos = express.Router();

/**
 * GET /api/v1/videos/{id}/stream
 * @tags videos
 * @summary steam a video to the client
 * @param {number} id.form.required - the video id - application/x-www-form-urlencoded
 */
videos.get(
  '/:id/stream',
  validator(VideosValidation.getStreamVideo),
  catchAsyncErrors(VideosController.getStreamVideo),
);

/**
 * GET /api/v1/videos/{vid}
 * @tags videos
 * @summary get details of a video
 * @param {number} id.form.required - the video id - application/x-www-form-urlencoded
 */
videos.get(
  '/:id',
  validator(VideosValidation.getVideo),
  catchAsyncErrors(VideosController.getVideo),
);

export default videos;
