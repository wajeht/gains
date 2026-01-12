import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as VideosController from './videos.controller.js';
import * as VideosValidation from './videos.validation.js';

import express from 'express';
const videos = express.Router();

videos.get(
  '/:id',
  validator(VideosValidation.getVideo),
  catchAsyncErrors(VideosController.getVideo),
);

export default videos;
