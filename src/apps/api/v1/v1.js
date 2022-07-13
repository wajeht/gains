import ExerciseCategoriesRouter from './exercise-categories/exercise-categories.router.js';
import SessionsRouter from './sessions/sessions.router.js';
import ExercisesRouter from './exercises/exercises.router.js';
import BlocksRouter from './blocks/blocks.router.js';
import UsersRouter from './users/users.router.js';

import express from 'express';
const v1 = express.Router();

v1.use('/exercise-categories', ExerciseCategoriesRouter);
v1.use('/sessions', SessionsRouter);
v1.use('/exercises', ExercisesRouter);
v1.use('/blocks', BlocksRouter);
v1.use('/users', UsersRouter);

export default v1;
