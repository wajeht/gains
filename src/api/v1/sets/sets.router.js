import * as SetsValidation from './sets.validation.js';
import * as SetsController from './sets.controller.js';

import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import express from 'express';
const sets = express.Router();

sets.post('/', validator(SetsValidation.postSet), catchAsyncErrors(SetsController.postSet));

sets.patch('/:id', validator(SetsValidation.patchSet), catchAsyncErrors(SetsController.patchSet));

sets.delete(
  '/:id',
  validator(SetsValidation.deleteSet),
  catchAsyncErrors(SetsController.deleteSet),
);

export default sets;
