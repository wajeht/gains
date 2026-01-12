import { validator, catchAsyncErrors } from '../../api.middlewares.js';
import { uploadVideo } from '../../../utils/multer.js';

import * as LogsValidation from './logs.validation.js';
import * as LogsController from './logs.controller.js';

import express from 'express';
const logs = express.Router();

logs.post('/', validator(LogsValidation.createLogs), catchAsyncErrors(LogsController.createLogs));

logs.post(
  '/multiple',
  validator(LogsValidation.postMultipleLogs),
  catchAsyncErrors(LogsController.postMultipleLogs),
);

logs.post(
  '/:log_id/upload-a-video',
  uploadVideo,
  validator(LogsValidation.uploadAVideo),
  catchAsyncErrors(LogsController.uploadAVideo),
);

logs.patch(
  '/:log_id/update-private-state',
  validator(LogsValidation.updatePrivateState),
  catchAsyncErrors(LogsController.updatePrivateState),
);

logs.delete(
  '/:id',
  validator(LogsValidation.deleteALog),
  catchAsyncErrors(LogsController.deleteALog),
);

export default logs;
