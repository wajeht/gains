import { validator, catchAsyncErrors } from '../../api.middlewares.js';
import * as SessionsController from './sessions.controller.js';
import * as SessionsValidation from './sessions.validation.js';

import express from 'express';
const sessions = express.Router();

sessions.get(
  '/community-sessions',
  validator(SessionsValidation.getAllSessions),
  catchAsyncErrors(SessionsController.getAllSessions),
);

sessions.post(
  '/',
  validator(SessionsValidation.postCreateSession),
  catchAsyncErrors(SessionsController.postCreateSession),
);

sessions.get(
  '/:sid',
  validator(SessionsValidation.getSession),
  catchAsyncErrors(SessionsController.getSession),
);

sessions.patch(
  '/:sid',
  validator(SessionsValidation.patchSession),
  catchAsyncErrors(SessionsController.patchSession),
);

sessions.get(
  '/',
  validator(SessionsValidation.getUserSessions),
  catchAsyncErrors(SessionsController.getUserSessions),
);

sessions.delete(
  '/:sid',
  validator(SessionsValidation.deleteSession),
  catchAsyncErrors(SessionsController.deleteSession),
);

sessions.get(
  '/sessions-with-videos/:user_id',
  validator(SessionsValidation.getSessionsWithVideos),
  catchAsyncErrors(SessionsController.getSessionsWithVideos),
);

export default sessions;
