import ExerciseCategoriesRouter from './exercise-categories/exercise-categories.router.js';
import SessionsRouter from './sessions/sessions.router.js';
import GainsMetaRouter from './gains-meta/gains-meta.router.js';
import ExercisesRouter from './exercises/exercises.router.js';
import BlocksRouter from './blocks/blocks.router.js';
import UsersRouter from './users/users.router.js';
import VideosRouter from './videos/videos.router.js';
import VariablesRouter from './variables/variables.router.js';
import SetsRouter from './sets/sets.router.js';
import LogsRouter from './logs/logs.router.js';

import express from 'express';
const v1 = express.Router();

v1.use('/exercise-categories', ExerciseCategoriesRouter);
v1.use('/gains-meta', GainsMetaRouter);
v1.use('/sessions', SessionsRouter);
v1.use('/exercises', ExercisesRouter);
v1.use('/variables', VariablesRouter);
v1.use('/blocks', BlocksRouter);
v1.use('/videos', VideosRouter);
v1.use('/users', UsersRouter);
v1.use('/sets', SetsRouter);
v1.use('/logs', LogsRouter);

export default v1;