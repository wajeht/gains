import * as TagsValidations from './tags.validations.js';
import * as TagsControllers from './tags.controllers.js';

import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import express from 'express';
const tags = express.Router();

tags.post('/', validator(TagsValidations.postTag), catchAsyncErrors(TagsControllers.postTag));

export default tags;
